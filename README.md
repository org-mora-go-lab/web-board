# Board

카카오·Google(Gmail)·이메일로 가입해 글을 쓰고 읽는 기본 게시판입니다. 상세 요구사항은 [PRD.md](PRD.md)를 참고하세요.

- 게시글 목록(페이지네이션)·검색·작성·상세·수정·삭제
- 카카오 / Google 소셜 로그인, 이메일 회원가입·로그인
- 작성자만 수정·삭제 가능, HttpOnly 세션 쿠키 인증

## 기술 스택

| 영역 | 사용 기술 |
| --- | --- |
| 프론트엔드 | Next.js 16 App Router, React 19, Zustand, SCSS, lucide-react |
| 백엔드 | Next.js Route Handler(`/api/**`), SQLite([sql.js](https://sql.js.org) WASM, 네이티브 빌드 불필요) |
| 테스트 | Playwright (`PRD.md` 요구사항별 화면·API E2E), 카카오·Google 모의 OAuth 서버 |

## 시작하기

```bash
npm install
cp .env.example .env.local   # 소셜 로그인 키 입력 (아래 참고)
npm run dev                  # http://localhost:3000
```

데이터는 `data/board.db`(`DATABASE_PATH`로 변경 가능)에 자동으로 생성·저장됩니다. 소셜 로그인 키가 없어도 이메일 가입으로 바로 사용할 수 있습니다.

### Mock 환경

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
