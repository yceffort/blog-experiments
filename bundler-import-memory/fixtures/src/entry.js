import {esmDep} from './esm-dep.js'
import cjsDefault from './cjs-default.js'
import './side-effect.js'
import {unusedDep} from './unused-dep.js'
const {cjsDep} = require('./cjs-dep.js')
const {esmRequired} = require('./esm-required.js')

export function run() {
  return [esmDep(), cjsDefault(), cjsDep(), esmRequired(), globalThis.M_SIDE_EFFECT, () => import('./lazy-dep.js').then((m) => m.lazyDep())]
}
