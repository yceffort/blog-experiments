import { execFileSync, spawnSync } from 'node:child_process';

/**
 * 이 실행이 쓸 컨테이너 이름을 차지한다. 같은 이름이 이미 있으면 다른 실행이 쓰는 중으로 보고 멈춘다.
 * 이름만 보고 지우면 동시에 돌던 실행의 컨테이너를 지운다. 끝날 때(오류, Ctrl+C 포함) 자기 컨테이너만 지운다.
 */
export function claimContainers(names) {
  const existing = execFileSync('docker', ['ps', '-a', '--format', '{{.Names}}'], { encoding: 'utf8' }).split('\n');
  const busy = names.filter((name) => existing.includes(name));
  if (busy.length) {
    throw new Error(`컨테이너가 이미 있다: ${busy.join(', ')}. 다른 실행이 쓰는 중이 아니면 docker rm -f ${busy.join(' ')}`);
  }
  process.on('exit', () => spawnSync('docker', ['rm', '-f', ...names], { stdio: 'ignore' }));
  for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => process.exit(130));
}
