import { execFileSync, spawnSync } from 'node:child_process';

const created = [];
process.on('exit', () => created.length && spawnSync('docker', ['rm', '-f', ...created], { stdio: 'ignore' }));
for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => process.exit(130));

/**
 * `docker run -d` 의 인자로 컨테이너를 띄운다. 끝날 때(오류, Ctrl+C 포함) 이 실행이 만든 컨테이너만 ID 로 지운다.
 * 같은 이름이 이미 있으면 docker 가 이름 충돌로 만들지 않으므로, 동시에 돌던 실행의 컨테이너를 지우지 않는다.
 * 만든 뒤 시작에 실패해도(포트 충돌 등) 지울 수 있게 create 와 start 를 나눈다.
 */
export function runContainer(...args) {
  const id = execFileSync('docker', ['create', ...args], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'inherit'] }).trim();
  created.push(id);
  execFileSync('docker', ['start', id], { stdio: ['ignore', 'ignore', 'inherit'] });
}
