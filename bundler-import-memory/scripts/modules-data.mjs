// modules.data: u32 BE 헤더 길이 + JSON 헤더 + 이진 인접 리스트
export function decodeModulesData(bytes) {
  const length = bytes.readUInt32BE(0)
  const header = JSON.parse(bytes.subarray(4, 4 + length).toString('utf8'))
  const binary = bytes.subarray(4 + length)
  const lists = {}
  for (const [key, ref] of Object.entries(header)) {
    if (key === 'modules' || !ref || typeof ref.offset !== 'number') continue
    const block = binary.subarray(ref.offset, ref.offset + ref.length)
    const count = block.readUInt32BE(0)
    const edges = []
    let previous = 0
    for (let from = 0; from < count; from++) {
      const end = block.readUInt32BE(4 + from * 4)
      for (let j = previous; j < end; j++) edges.push([from, block.readUInt32BE(4 + count * 4 + j * 4)])
      previous = end
    }
    lists[key] = edges
  }
  return {header, lists}
}
