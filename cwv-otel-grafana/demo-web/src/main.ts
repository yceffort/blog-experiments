import { startTelemetry } from './telemetry/setup';

/**
 * 쿼리 파라미터로 지표를 조절한다.
 * - `lcp=1800`: 1.8초 뒤에 큰 본문을 그린다(LCP 후보가 바뀐다)
 * - `img=900`: 큰 본문 대신 이미지를 넣고, 서버가 그 이미지 응답을 0.9초 늦춘다(LCP 의 리소스 단계)
 * - `shift=600`: 0.6초 뒤에 위쪽에 배너를 끼워 아래 내용을 민다(CLS)
 * - `slow=300`: 버튼 클릭 처리에 300ms 를 쓴다(INP)
 * - `pagehideFlush`: pagehide 에서도 flush 한다(experiments/e7 재현용)
 */
const params = new URLSearchParams(location.search);
const num = (key: string) => Number(params.get(key) ?? 0);

const route = document.body.dataset.route ?? 'unknown';
startTelemetry({
  collectorUrl: import.meta.env.VITE_COLLECTOR_URL ?? 'http://localhost:4318',
  route,
  flushOnPagehide: params.has('pagehideFlush'),
});

const app = document.querySelector<HTMLElement>('#app')!;

setTimeout(() => {
  if (params.has('img')) {
    const hero = document.createElement('img');
    hero.className = 'hero-image';
    hero.alt = '';
    hero.src = `/hero.png?delay=${num('img')}&v=${Math.random()}`;
    app.append(hero);
    return;
  }
  const hero = document.createElement('p');
  hero.className = 'hero';
  hero.textContent = '이 문단이 이 페이지의 LCP 요소입니다. '.repeat(12);
  app.append(hero);
}, num('lcp'));

if (params.has('shift')) {
  setTimeout(() => {
    const banner = document.createElement('div');
    banner.className = 'banner';
    banner.textContent = '늦게 끼어든 배너';
    app.prepend(banner);
  }, num('shift'));
}

document.querySelector('#buy')!.addEventListener('click', (event) => {
  const until = performance.now() + num('slow');
  while (performance.now() < until) {
    // 메인 스레드를 붙잡아 INP 의 processing duration 을 만든다.
  }
  (event.target as HTMLButtonElement).textContent = '담았습니다';
});
