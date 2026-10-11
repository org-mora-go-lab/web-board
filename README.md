# Board

카카오·Google(Gmail)·이메일로 가입해 글을 쓰고 읽는 기본 게시판입니다. 상세 요구사항은 [PRD.md](PRD.md)를 참고하세요.

- 게시글 목록(페이지네이션)·검색·작성·상세·수정·삭제
- 카카오 / Google 소셜 로그인, 이메일 회원가입·로그인
- 작성자만 수정·삭제 가능, HttpOnly 세션 쿠키 인증

## 기술 스택

| 영역 | 사용 기술 |
| --- | --- |
| 프론트엔드 | Next.js 16 App Router, React 19, Zustand, SCSS, lucide-react |
| 백엔드 | Next.js Route Handler(`/api/**`), 비동기 [libSQL 클라이언트](https://docs.turso.tech/sdk/ts/reference), 로컬 SQLite / 원격 Turso |
| 테스트 | Playwright (`PRD.md` 요구사항별 화면·API E2E), 카카오·Google 모의 OAuth 서버 |

## 시작하기

```bash
npm install
cp .env.example .env.local   # 소셜 로그인 키 입력 (아래 참고)
npm run dev                  # http://localhost:3000
```

`TURSO_DATABASE_URL`을 설정하지 않은 로컬 환경에서는 데이터가 `data/board.db`(`DATABASE_PATH`로 변경 가능)에 자동으로 생성·저장됩니다. 기존 SQLite 파일도 그대로 사용할 수 있습니다. 소셜 로그인 키가 없어도 이메일 가입으로 바로 사용할 수 있습니다.

### Vercel 배포

Vercel Functions의 배포 경로(`/var/task`)에는 DB 파일을 저장할 수 없습니다. `/tmp`도 인스턴스 간 공유되지 않는 임시 저장소이므로 운영 DB로 사용하지 않습니다. Vercel에서는 외부 Turso DB를 사용합니다.

1. [Turso](https://turso.tech)에서 DB를 생성하고 연결 URL과 인증 토큰을 발급합니다.
2. Vercel 프로젝트의 Settings > Environment Variables에서 다음 값을 설정합니다. Production과 사용하는 Preview 환경 모두에 적용하세요.

| 변수 | 값 |
| --- | --- |
| `TURSO_DATABASE_URL` | 발급받은 `libsql://...turso.io` URL (`https://`도 지원) |
| `TURSO_AUTH_TOKEN` | 발급받은 DB 인증 토큰, 서버 전용 비밀 값 |
| `APP_URL` | `https://web-board-alpha.vercel.app` 등 실제 앱 주소 |

3. 소셜 로그인 키와 각 공급자의 Redirect URI도 배포 도메인으로 설정합니다.
4. 변경 코드를 배포하고 환경변수 적용 후 재배포합니다. `/api/posts`가 200으로 응답하고 회원가입·로그인·게시글 저장이 정상인지 확인합니다.

원격 설정이 있으면 `DATABASE_PATH`는 사용하지 않고 로컬 파일 쓰기도 실행하지 않습니다. Vercel에서 URL 또는 토큰이 누락되면 로컬 DB로 대체하지 않으며 Functions 로그에 설정 오류를 기록합니다. URL이 있는 로컬 환경에서도 토큰은 필수입니다. `NEXT_PUBLIC_` 접두사를 붙이거나 인증 토큰을 커밋하지 마세요.

빈 Turso DB에는 최초 API 연결 시 테이블과 인덱스가 자동 생성됩니다. 로컬 파일의 기존 데이터가 원격 DB로 자동 복사되지는 않습니다. 기존 데이터를 유지하려면 파일을 백업하고 Turso의 DB import 절차로 별도 이전한 뒤 연결하세요.

### Mock 환경

Mock 실행은 Turso 및 Vercel 환경변수를 무시하고 분리된 로컬 DB만 사용합니다.

```bash
npm run mock                 # http://localhost:3200
```

실제 소셜 로그인 키나 `.env.local` 설정 없이 사용할 수 있습니다. 로그인 화면에서 `카카오로 시작하기` 또는 `Google로 시작하기`를 누른 뒤, 기본값이 채워진 mock 인가 화면에서 `동의하고 계속하기`를 선택하면 `Mock User`로 로그인합니다. 계정 ID는 `mock-kakao-user` / `mock-google-user`이며 서로 다른 계정입니다. 인가 화면의 값을 변경하면 다른 mock 사용자로 로그인할 수도 있습니다.

게시글 작성·조회·수정·삭제는 실제 API와 세션 인증으로 동작합니다. 데이터는 개발 DB와 분리된 `data/mock.db`에 저장되고 재실행해도 유지됩니다. 빌드 폴더는 `.next-mock`, OAuth 서버 포트는 4200이며 Ctrl+C로 두 서버를 함께 종료합니다. 포트가 사용 중이면 오류를 표시하며, `MOCK_APP_PORT`, `MOCK_OAUTH_PORT`, `MOCK_DATABASE_PATH`, `MOCK_DIST_DIR`로 기본값을 변경할 수 있습니다.

### 소셜 로그인 설정

| 변수 | 발급 위치 |
| --- | --- |
| `KAKAO_CLIENT_ID`, `KAKAO_CLIENT_SECRET` | [Kakao Developers](https://developers.kakao.com) → 내 애플리케이션 → 앱 키(REST API 키) / 보안(Client Secret) |
| `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` | [Google Cloud Console](https://console.cloud.google.com/apis/credentials) → OAuth 클라이언트 ID(웹 애플리케이션) |

각 콘솔에 아래 Redirect URI를 등록합니다. 배포 환경에서는 도메인을 바꿔 등록하고, 프록시 뒤에서 실행하면 `APP_URL`(예: `https://board.example.com`)을 설정하세요.

- 카카오: `http://localhost:3000/api/auth/oauth/kakao/callback`
  - 카카오 로그인 활성화, 동의항목에서 `닉네임`(필수)과 `카카오계정(이메일)`(선택)을 설정합니다.
- Google: `http://localhost:3000/api/auth/oauth/google/callback`

## 스크립트

| 명령 | 설명 |
| --- | --- |
| `npm run dev` | 개발 서버 |
| `npm run mock` | 기본 mock 사용자로 로그인 가능한 별도 개발 환경 |
| `npm run build` / `npm start` | 프로덕션 빌드 / 실행 |
| `npm run lint` | ESLint |
| `npm run test:e2e` | Playwright E2E 전체 실행 |

`npm run test:e2e`는 개발 서버와 겹치지 않도록 별도 포트(3100), 빌드 폴더(`.next-e2e`), 데이터베이스(`data/e2e.db`)로 앱을 띄우고, 실제 카카오·Google 대신 `tests/__mock__/oauth-server.mjs`(포트 4100)를 사용합니다. 처음 실행할 때는 `npx playwright install chromium`으로 브라우저를 설치하세요.

mock 실행 요구사항은 `npm run mock`으로 별도 앱(3300), OAuth 서버(4300), DB(`data/e2e-mock.db`), 빌드 폴더(`.next-e2e-mock`)를 실행해 검증하므로 사용자용 mock 데이터와도 분리됩니다.

원격 DB 요구사항은 별도 앱(3400, `.next-e2e-turso`)을 Vercel 환경변수와 쓰기 불가능한 로컬 DB 경로로 실행합니다. `tests/__mock__/libsql-server.mjs`(4400)는 인증 토큰을 검증하는 Hrana HTTP v2 모의 서버이며 공식 libSQL 클라이언트로 `data/e2e-turso.db`에 저장합니다. 실제 Turso에 접근하지 않고 회원·세션·게시글 저장을 검증합니다. 로컬 E2E와 Mock은 개발용 Turso 환경변수를 상속하지 않습니다.

## API

| 메서드 | 경로 | 설명 |
| --- | --- | --- |
| `POST` | `/api/auth/signup` | 이메일 회원가입 (자동 로그인) |
| `POST` | `/api/auth/login` | 이메일 로그인 |
| `POST` | `/api/auth/logout` | 로그아웃 |
| `GET` | `/api/auth/me` | 현재 사용자 (`{ user: null }`이면 비로그인) |
| `GET` | `/api/auth/oauth/{kakao\|google}?next=/path` | 소셜 로그인 시작 |
| `GET` | `/api/auth/oauth/{kakao\|google}/callback` | 소셜 로그인 콜백 |
| `GET` | `/api/posts?page=1&size=10&q=검색어` | 게시글 목록 |
| `POST` | `/api/posts` | 게시글 작성 (로그인 필요) |
| `GET` | `/api/posts/{id}` | 게시글 상세 |
| `PATCH` | `/api/posts/{id}` | 게시글 수정 (작성자만) |
| `DELETE` | `/api/posts/{id}` | 게시글 삭제 (작성자만) |

오류는 `{ "error": { "code": "VALIDATION_ERROR", "message": "...", "fields": { "title": "..." } } }` 형식으로 응답합니다.

## 폴더 구조

```
app/                    # 라우트 진입점 (src를 re-export만 함)
  api/**/route.ts       #   → src/server
  **/page.tsx           #   → src/page
src/
  page/                 # 화면 단위 모듈 (home, login, signup, post-detail, post-write, post-edit)
  widget/               # 여러 화면에서 쓰는 큰 단위 UI (header, post-table, post-article)
  feature/              # 사용자 동작 단위 UI (social-login, email-*-form, post-form, post-search)
  entity/               # 공통 타입·API 클라이언트·스토어·검증·UI·스타일
  server/               # 백엔드 (db, http, user, auth, post)
tests/
  NN. 섹션명/NN.e2e.spec.ts   # PRD.md 요구사항과 1:1 대응
  __mock__/ __util__/ __constant__/
```
