// coldpath modules --graph가 산출물에서 복원한 간선을 픽스처 모듈 이름으로 바꿔 보여준다
import {readFile} from 'node:fs/promises'
import {join} from 'node:path'

const markers = {
  M_ESM_DEP: 'esm-dep', M_CJS_DEFAULT: 'cjs-default', M_SIDE_EFFECT: 'side-effect', M_CJS_DEP: 'cjs-dep',
  M_ESM_REQUIRED: 'esm-required', M_LAZY_DEP: 'lazy-dep', M_UNUSED_DEP: 'unused-dep', 'String(run()': 'page/entry',
}
for (const build of process.argv.slice(2)) {
  const graph = JSON.parse(await readFile(`results/recovered/${build}.graph.json`, 'utf8'))
  const maps = JSON.parse(await readFile(`results/recovered/${build}/maps.json`, 'utf8'))
  const label = new Map()
  for (const binding of Object.values(maps)) {
    const map = JSON.parse(await readFile(join('results/recovered', build, binding), 'utf8').catch(() => '{}'))
    ;(map.sources || []).forEach((source, i) => {
      const text = map.sourcesContent?.[i] || ''
      const hits = Object.entries(markers).filter(([m]) => text.includes(m)).map(([, n]) => n)
      if (hits.length) label.set(source.replace('webpack://inferred/', ''), hits.join('+'))
    })
  }
  const name = (id) => label.get(graph.modules.find((m) => m.id === id)?.source) || null
  const edges = graph.edges.map((e) => [name(e.from), e.kind, name(e.to)]).filter(([a, , b]) => a && b)
  console.log(`== ${build}: modules ${graph.modules.length}, edges ${graph.edges.length}, kinds ${JSON.stringify(graph.edges.reduce((c, e) => ((c[e.kind] = (c[e.kind] || 0) + 1), c), {}))}`)
  for (const e of edges) console.log('   ', e.join('  '))
}
