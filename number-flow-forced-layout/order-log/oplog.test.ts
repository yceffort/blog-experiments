// 갱신 한 번 동안 라이브러리가 DOM을 읽고 쓰는 순서를 기록한다.
// 쓰기는 MutationObserver 기록(takeRecords)으로, 읽기는 레이아웃 API 가로채기로 잡는다.
// 읽기 직전에 쓰기 기록이 있으면 그 읽기는 강제 레이아웃이다(lite.test.ts의 forcedLayouts와 같은 규칙).
import {writeFileSync} from 'node:fs'

import {afterAll, afterEach, beforeEach, describe, it, vi} from 'vitest'

import {setEngineMode} from '../src/engine'
import {formatToData} from '../src/formatter'
import NumberFlowLite from '../src/lite'

const OUT = process.env.OPLOG_OUT!
const VERSION = process.env.OPLOG_VERSION!

class TestFlow extends NumberFlowLite {
  override attachInternals(): never {
    throw new Error('unsupported')
  }
}
let defined = 0
const create = () => {
  const name = `nf-op-${defined++}`
  customElements.define(name, class extends TestFlow {})
  const el = document.createElement(name) as TestFlow
  document.body.appendChild(el)
  return el
}
const fmt = new Intl.NumberFormat('en-US')
const pct = new Intl.NumberFormat('en-US', {
  style: 'percent',
  signDisplay: 'always',
  maximumFractionDigits: 0,
})

type Op =
  | {kind: 'R'; target: string; api: string; by: string; forced: boolean}
  | {kind: 'W'; target: string; what: string}

const label = (node: Node | null): string => {
  if (!(node instanceof Element)) return node?.nodeName ?? '?'
  if (node instanceof TestFlow) return 'number-flow'
  const cls = (node.getAttribute('class') ?? '').split(/\s+/).filter(Boolean)
  const main =
    cls.find((c) => !c.includes('--') && c !== 'animate-presence') ??
    cls[0] ??
    node.tagName.toLowerCase()
  if (main === 'section') {
    const parent = node.parentElement
    if (parent?.classList.contains('number__inner'))
      return node.previousElementSibling ? 'section(fraction)' : 'section(integer)'
    return node.previousElementSibling?.classList.contains('number') ? 'section(post)' : 'section(pre)'
  }
  if (main === 'digit' || main === 'symbol') {
    const siblings = Array.from(node.parentElement?.children ?? []).filter(
      (c) => c.classList.contains(main),
    )
    return `${main}#${siblings.indexOf(node)}`
  }
  if (main === 'digit__num') return `${label(node.parentElement)}>num(${node.textContent})`
  if (main === 'symbol__value') return `${label(node.parentElement)}>value(${node.textContent})`
  return main
}

const decls = (s: string | null) =>
  Object.fromEntries(
    (s ?? '')
      .split(';')
      .map((d) => d.trim())
      .filter(Boolean)
      .map((d) => {
        const i = d.indexOf(':')
        return [d.slice(0, i).trim(), d.slice(i + 1).trim()]
      }),
  )

const describeRecord = (r: MutationRecord): string[] => {
  const t = label(r.target)
  if (r.type === 'childList') {
    const out: string[] = []
    r.removedNodes.forEach((n) => out.push(`${t}: -${label(n)}`))
    r.addedNodes.forEach((n) => out.push(`${t}: +${label(n)}`))
    return out
  }
  const el = r.target as Element
  const name = r.attributeName!
  const now = el.getAttribute(name)
  if (name === 'style') {
    const before = decls(r.oldValue)
    const after = decls(now)
    const changed = new Set([...Object.keys(before), ...Object.keys(after)]).values()
    return Array.from(changed)
      .filter((k) => before[k] !== after[k])
      .map((k) => `${t}: ${k}${after[k] == null ? ' 제거' : ` = ${after[k]}`}`)
  }
  if (name === 'class') {
    const before = new Set((r.oldValue ?? '').split(/\s+/).filter(Boolean))
    const after = new Set((now ?? '').split(/\s+/).filter(Boolean))
    return [
      ...Array.from(after).filter((c) => !before.has(c)).map((c) => `${t}: class +${c}`),
      ...Array.from(before).filter((c) => !after.has(c)).map((c) => `${t}: class -${c}`),
    ]
  }
  return [`${t}: ${name}${now == null ? ' 제거' : now === '' ? '' : ` = ${now}`}`]
}

const callerOf = () => {
  const frames = (new Error().stack ?? '')
    .split('\n')
    .slice(1)
    .map((l) => l.trim())
    .filter((l) => !l.includes('oplog.test'))
    .map((l) => (l.match(/^at (?:async )?(.+?) \(/) ?? l.match(/^at (?:async )?(\S+)/) ?? [])[1])
    .filter((f): f is string => Boolean(f))
  const skip = /getBoundingClientRect|getComputedStyle|\.forEach$|^forEach$|^read$|^counting|^get offset|spy|mock|Proxy|^Object\./
  const own = frames.filter((f) => !skip.test(f))
  const cls = own.find((f) => /^[A-Z]\w*\.\w+$/.test(f) || /^(set|get) \w+$/.test(f))
  const engine = own.find((f) => /^(prepare|flush)$/.test(f))
  const inner = own.find((f) => /^(visible|authorStyled|overridden|readInputs|offset)$/.test(f))
  const by = [cls, engine, inner].filter((f, i, all) => f && all.indexOf(f) === i).join(' → ')
  return (by || own[0] || '?').replace(/TestFlow\./g, 'NumberFlowLite.')
}

type LayoutGetter = (el: HTMLElement, original: () => unknown) => unknown
const withLayout = (getters: Record<string, LayoutGetter>, fn: () => void) => {
  const saved = Object.entries(getters).map(([prop, get]) => {
    const descriptor = Object.getOwnPropertyDescriptor(HTMLElement.prototype, prop)!
    Object.defineProperty(HTMLElement.prototype, prop, {
      configurable: true,
      get() {
        return get(this, () => descriptor.get!.call(this))
      },
    })
    return [prop, descriptor] as const
  })
  try {
    fn()
  } finally {
    saved.forEach(([prop, descriptor]) => Object.defineProperty(HTMLElement.prototype, prop, descriptor))
  }
}

const record = (el: TestFlow, fn: () => void): Op[] => {
  const ops: Op[] = []
  const observer = new MutationObserver(() => {})
  observer.observe(el, {attributes: true, attributeOldValue: true})
  observer.observe(el.shadowRoot!, {
    subtree: true,
    childList: true,
    attributes: true,
    attributeOldValue: true,
  })
  const read = (target: Node, api: string) => {
    const records = observer.takeRecords()
    records.forEach((r) => describeRecord(r).forEach((what) => ops.push({kind: 'W', target: label(r.target), what})))
    ops.push({kind: 'R', target: label(target), api, by: callerOf(), forced: records.length > 0})
  }
  const rect = Element.prototype.getBoundingClientRect
  vi.spyOn(Element.prototype, 'getBoundingClientRect').mockImplementation(function (this: Element) {
    read(this, 'getBoundingClientRect')
    return rect.call(this)
  })
  // 라이브러리는 전역 getComputedStyle을 부르고, vitest의 jsdom 환경에서 그 전역은 window와 다를 수 있다:
  const computed = window.getComputedStyle
  const computedGlobal = globalThis.getComputedStyle
  const wrapped = (...args: Parameters<typeof getComputedStyle>) => {
    read(args[0], 'getComputedStyle')
    return computed.apply(window, args)
  }
  window.getComputedStyle = wrapped
  vi.stubGlobal('getComputedStyle', wrapped)
  const counting =
    (api: string): LayoutGetter =>
    (target, original) => {
      read(target, api)
      return original()
    }
  observer.takeRecords()
  try {
    withLayout(
      {
        offsetWidth: counting('offsetWidth'),
        offsetHeight: counting('offsetHeight'),
        offsetTop: counting('offsetTop'),
        offsetLeft: counting('offsetLeft'),
      },
      fn,
    )
  } finally {
    window.getComputedStyle = computed
    vi.stubGlobal('getComputedStyle', computedGlobal)
    observer.takeRecords().forEach((r) => describeRecord(r).forEach((what) => ops.push({kind: 'W', target: label(r.target), what})))
    observer.disconnect()
  }
  return ops
}

const result: Record<string, unknown> = {version: VERSION}
afterAll(() => {
  writeFileSync(OUT, JSON.stringify(result, null, 1))
})

const scenarios = [
  {name: 'same', from: formatToData(1234567.89, pct), to: formatToData(9876543.21, pct)},
  {name: 'grows', from: formatToData(0.05, pct), to: formatToData(1234567.89, pct)},
  {name: 'shrinks', from: formatToData(1234567.89, pct), to: formatToData(0.05, pct)},
  {name: 'symbols', from: formatToData(0.05, pct), to: formatToData(5, fmt)},
]

describe('rAF engine', () => {
  let now = 0
  let frames: FrameRequestCallback[] = []
  const step = (ms: number) => {
    now += ms
    const cbs = frames
    frames = []
    cbs.forEach((cb) => cb(now))
  }
  const settle = async (ms = 2000) => {
    step(0)
    step(ms)
    await new Promise((resolve) => setTimeout(resolve, 0))
  }
  beforeEach(() => {
    setEngineMode('raf')
    now = 0
    frames = []
    vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => {
      frames.push(cb)
      return frames.length
    })
    vi.spyOn(performance, 'now').mockImplementation(() => now)
    Object.defineProperty(HTMLElement.prototype, 'offsetWidth', {configurable: true, get: () => 10})
    Object.defineProperty(HTMLElement.prototype, 'offsetHeight', {configurable: true, get: () => 10})
  })
  afterEach(() => {
    document.body.innerHTML = ''
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
    setEngineMode('auto')
  })
  for (const s of scenarios)
    it(s.name, async () => {
      const el = create()
      el.data = s.from
      await settle()
      const ops = record(el, () => {
        el.data = s.to
      })
      result[s.name] = {
        engine: 'raf',
        from: s.from.valueAsString,
        to: s.to.valueAsString,
        forced: ops.filter((o) => o.kind === 'R' && o.forced).length,
        ops,
      }
    })
})

describe('native engine', () => {
  type Fake = {el: HTMLElement; startTime: number | null; playState: string; currentTime: number; finished: Promise<void>; finish: () => void}
  let now = 0
  let anims: Fake[] = []
  beforeEach(() => {
    setEngineMode('native')
    now = 1000
    anims = []
    vi.stubGlobal('requestAnimationFrame', () => 0)
    Object.defineProperty(document, 'timeline', {configurable: true, get: () => ({currentTime: now})})
    HTMLElement.prototype.animate = function (this: HTMLElement) {
      let resolve!: () => void
      const a: Fake = {
        el: this,
        startTime: null,
        playState: 'running',
        get currentTime() {
          return this.startTime == null ? 0 : now - this.startTime
        },
        finished: new Promise<void>((r) => (resolve = r)),
        finish() {
          this.playState = 'finished'
          resolve()
        },
      }
      anims.push(a)
      return a as unknown as Animation
    }
    ShadowRoot.prototype.getAnimations = function (this: ShadowRoot) {
      // 실제 브라우저의 getAnimations()는 스타일을 갱신한다. 그 읽기를 기록에 남긴다:
      window.getComputedStyle(this.host as HTMLElement)
      return anims.filter((a) => a.playState !== 'finished' && this.contains(a.el)) as unknown as Animation[]
    }
    vi.spyOn(window, 'getComputedStyle').mockImplementation(
      (el) =>
        ({
          transform: (el as HTMLElement).classList.contains('number') ? 'matrix(1, 0, 0, 1, 0, 0)' : 'none',
          opacity: '1',
        }) as CSSStyleDeclaration,
    )
    Object.defineProperty(HTMLElement.prototype, 'offsetWidth', {configurable: true, get: () => 10})
    Object.defineProperty(HTMLElement.prototype, 'offsetHeight', {configurable: true, get: () => 10})
  })
  afterEach(() => {
    document.body.innerHTML = ''
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
    setEngineMode('auto')
    delete (HTMLElement.prototype as Partial<HTMLElement>).animate
    delete (ShadowRoot.prototype as Partial<ShadowRoot>).getAnimations
  })
  it('same', () => {
    const el = create()
    el.data = formatToData(1234567.89, pct)
    el.data = formatToData(9876543.21, pct)
    anims.forEach((a) => a.finish())
    const ops = record(el, () => {
      el.data = formatToData(1234567.89, pct)
    })
    result['native-same'] = {
      engine: 'native',
      from: '+987,654,321%',
      to: '+123,456,789%',
      forced: ops.filter((o) => o.kind === 'R' && o.forced).length,
      ops,
    }
  })
})
