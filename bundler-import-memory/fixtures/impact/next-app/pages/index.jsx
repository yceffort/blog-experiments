import {useState} from 'react'
import {esmHeavy} from '../../src/heavy-esm.js'
const cjsHeavy = require('../../src/heavy-cjs.js')

export default function Page() {
  const [text, setText] = useState('ready')
  return (
    <main>
      <button id="esm" onClick={() => setText(esmHeavy())}>esm</button>
      <button id="cjs" onClick={() => setText(cjsHeavy.compute())}>cjs</button>
      <p id="out">{text}</p>
    </main>
  )
}
