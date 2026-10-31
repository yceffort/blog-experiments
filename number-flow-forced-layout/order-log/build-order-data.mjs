// oplog-*.json을 데모에 넣을 압축 형태로 바꾼다. 연속된 같은 글자의 값 쓰기와
// append 쌍(제거 뒤 추가 = DOM 이동)을 한 작업으로 합친다.
import {readFileSync, writeFileSync} from 'node:fs'

const HERE = new URL('.', import.meta.url).pathname
const versions = ['v0.2.0', 'v0.2.1']
const scenarios = ['same', 'grows', 'shrinks', 'symbols', 'native-same']

const root = (target) => target.replace(/>.*$/, '')

const merge = (ops) => {
  const out = []
  let i = 0
  while (i < ops.length) {
    const op = ops[i]
    if (op.kind === 'R') {
      // 네이티브 장면의 getAnimations() 모의 구현은 호스트의 getComputedStyle로 기록된다
      const isGetAnimations = op.api === 'getComputedStyle' && op.target === 'number-flow'
      out.push({
        k: 'R',
        t: op.target,
        a: isGetAnimations ? 'getAnimations' : op.api,
        b: isGetAnimations ? `${op.by} (브라우저에서는 스타일 갱신)` : op.by,
        f: op.forced ? 1 : 0,
      })
      i++
      continue
    }
    // 제거 + 추가 = 이동
    // 자식 제거/삽입의 대상은 요소 이름이다. "--current"처럼 둘째 글자가 '-'인 선언은 제외한다
    let m = op.what.match(/^(.+): -(?!-)(.+)$/)
    if (m && ops[i + 1]?.kind === 'W' && ops[i + 1].what === `${m[1]}: +${m[2]}`) {
      out.push({k: 'W', t: m[1], w: `${m[2]}을(를) 다시 append (DOM 이동)`})
      i += 2
      continue
    }
    m = op.what.match(/^(.+): \+(.+)$/)
    if (m) {
      out.push({k: 'W', t: m[1], w: `${m[2]} 삽입`})
      i++
      continue
    }
    m = op.what.match(/^(.+): -(?!-)(.+)$/)
    if (m) {
      out.push({k: 'W', t: m[1], w: `${m[2]} 제거`})
      i++
      continue
    }
    // 같은 글자의 값 쓰기(--current, 숫자 요소 inert)를 하나로
    m = op.what.match(/^(digit#\d+)(?:>num\(\d\))?: (--current = (\d+)|inert( 제거)?)$/)
    if (m) {
      const target = m[1]
      let value = m[3]
      let j = i
      while (j < ops.length && ops[j].kind === 'W') {
        const mm = ops[j].what.match(/^(digit#\d+)(?:>num\(\d\))?: (--current = (\d+)|inert( 제거)?)$/)
        if (!mm || mm[1] !== target) break
        if (mm[3]) value = mm[3]
        j++
      }
      out.push({k: 'W', t: target, w: value != null ? `--current = ${value}, 숫자 요소 inert 갱신` : '숫자 요소 inert 갱신'})
      i = j
      continue
    }
    m = op.what.match(/^(.+): class \+is-spinning$/)
    if (m) {
      out.push({k: 'W', t: m[1], w: 'is-spinning 클래스 추가'})
      i++
      continue
    }
    m = op.what.match(/^(.+): --width = .+$/)
    if (m) {
      out.push({k: 'W', t: m[1], w: '--width 기록'})
      i++
      continue
    }
    m = op.what.match(/^(.+): (top|left|right)( = .+| 제거)$/)
    if (m) {
      out.push({k: 'W', t: m[1], w: m[3] === ' 제거' ? `${m[2]} 해제` : `${m[2]} 고정`})
      i++
      continue
    }
    m = op.what.match(/^(.+): --_number-flow-d-opacity = .+$/)
    if (m) {
      out.push({k: 'W', t: m[1], w: '투명도 델타 기록'})
      i++
      continue
    }
    m = op.what.match(/^(.+): inert( 제거)?$/)
    if (m) {
      out.push({k: 'W', t: m[1], w: m[2] ? 'inert 제거 (흐름에 되돌림)' : 'inert 설정 (흐름에서 뺌)'})
      i++
      continue
    }
    m = op.what.match(/^number-flow: (role|aria-label).*$/)
    if (m) {
      if (out.at(-1)?.w !== 'role, aria-label 갱신') out.push({k: 'W', t: 'number-flow', w: 'role, aria-label 갱신'})
      i++
      continue
    }
    m = op.what.match(/^(.+?): (.+)$/)
    out.push({k: 'W', t: m ? m[1] : '?', w: m ? m[2] : op.what})
    i++
  }
  return out
}

const data = {}
for (const v of versions) {
  const raw = JSON.parse(readFileSync(`${HERE}/oplog-${v}.json`, 'utf8'))
  data[v] = {}
  for (const s of scenarios) {
    const {from, to, forced, ops} = raw[s]
    const merged = merge(ops)
    const check = merged.filter((o) => o.k === 'R' && o.f).length
    if (check !== forced) throw new Error(`${v} ${s}: forced ${forced} != ${check}`)
    data[v][s] = {from, to, forced, ops: merged}
    console.log(v, s, 'ops', ops.length, '->', merged.length, 'forced', forced)
  }
}
writeFileSync(`${HERE}/layout-order-data.json`, JSON.stringify(data))
console.log('bytes', JSON.stringify(data).length)
