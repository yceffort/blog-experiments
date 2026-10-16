import { resolve } from 'node:path';

import { defineConfig, type Plugin } from 'vite';

/**
 * 응답을 일부러 늦춘다. 지표에 분포를 만들기 위해서다.
 * - HTML 의 `?ttfb=600`: 문서 응답을 600ms 늦춘다(TTFB)
 * - 이미지의 `?delay=900`: 이미지 응답을 900ms 늦춘다(LCP 의 리소스 다운로드)
 */
function slowResponses(): Plugin {
  return {
    name: 'slow-responses',
    configureServer(server) {
      server.middlewares.use((req, _res, next) => {
        const url = new URL(req.url ?? '/', 'http://localhost');
        const isDocument = url.pathname === '/' || url.pathname.endsWith('.html');
        const delay = Number(url.searchParams.get(isDocument ? 'ttfb' : 'delay') ?? 0);
        if (delay > 0) {
          setTimeout(next, delay);
        } else {
          next();
        }
      });
    },
  };
}

export default defineConfig({
  plugins: [slowResponses()],
  build: {
    rollupOptions: {
      input: {
        home: resolve(import.meta.dirname, 'index.html'),
        product: resolve(import.meta.dirname, 'product.html'),
      },
    },
  },
});
