# 배포: 실제 블로그 페이지에서 받기

lab 의 `compose.yaml` 을 그대로 쓰고, 그 위에 이 디렉터리의 `compose.yaml` 을 겹쳐 인터넷에서 받을 수 있게 바꾼다. 수집 경로(collector 프로세서, Tempo, Mimir, 대시보드)와 버전은 lab 과 같다. 바뀌는 것은 아래뿐이다.

| 항목 | lab | 배포 |
|---|---|---|
| 입구 | collector 4318 을 그대로 연다 | Caddy 가 TLS 를 붙이고 `/v1/traces`, `/v1/metrics` 만 넘긴다 |
| CORS | `http://localhost:5173` | `ALLOWED_ORIGIN` |
| 열린 포트 | 4318, 8888, 3200, 9009, 3000 | 80, 443 |
| Grafana | 익명 Admin | 로그인, `127.0.0.1:3000` 에만 붙는다 |
| 보존 기간 | 설정 없음(Tempo 14일, Mimir 지우지 않음) | Tempo `TEMPO_RETENTION`(기본 1년), Mimir `MIMIR_RETENTION`(기본 0, 지우지 않음) |
| Tempo 조회 범위 | trace 검색 7일, TraceQL metrics 24시간 | `TEMPO_QUERY_RANGE`(기본 1년) |
| 재시작 | 없음 | `unless-stopped` |

Mimir 와 Tempo 는 lab 과 같은 단일 프로세스, 로컬 디스크 설정이다. 작은 블로그 하나를 받는 데 맞춘 구성이고, 여러 대로 늘리거나 장애에 견디는 구성은 아니다. Tempo 설정은 lab 의 `tempo/tempo.yaml` 에 위 두 값을 더한 `deploy/tempo.yaml` 로 바꿔 끼운다. 보존 기간과 조회 범위를 늘릴수록 디스크 사용량과 긴 조회의 부하가 커진다.

## 준비

- Docker Compose 2.24.4 이상(`!override` 가 이 버전부터 된다)이 깔린 Linux 서버. 메모리는 2GB 이상. 트래픽이 적을 때 컨테이너 넷이 약 530MiB 를 쓴다.
- 방화벽: 80, 443 을 열고 22 는 내 IP 로만 연다.
- DNS: `OTEL_DOMAIN` 의 A 레코드를 서버 IP 로. Caddy 가 인증서를 받으려면 80 이 열려 있어야 한다.

## 실행

```bash
git clone https://github.com/yceffort/blog-experiments.git
cd blog-experiments/cwv-otel-grafana
cp deploy/env.example .env          # 값을 채운다
docker compose -f compose.yaml -f deploy/compose.yaml up -d
```

Grafana 는 SSH 터널로 연다.

```bash
ssh -L 3000:127.0.0.1:3000 <서버>    # 그 뒤 http://localhost:3000, 사용자 admin
```

## 확인

```bash
# CORS 사전 요청에 허용 origin 이 돌아오는지
curl -si -X OPTIONS "https://$OTEL_DOMAIN/v1/traces" \
  -H "Origin: $ALLOWED_ORIGIN" -H 'Access-Control-Request-Method: POST' | grep -i access-control-allow-origin
# 다른 경로는 404
curl -s -o /dev/null -w '%{http_code}\n' "https://$OTEL_DOMAIN/"
```
