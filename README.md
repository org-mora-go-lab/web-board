# Mora Board

회원 인증과 게시글 관리를 제공하는 Next.js 기반 게시판 애플리케이션입니다.

## 구현 내용

- 게시글 목록, 검색, 상세 조회, 작성, 수정 및 삭제
- 이메일 회원가입·로그인과 카카오 소셜 로그인
- HttpOnly 세션 쿠키 인증과 작성자 권한 확인
- 로컬 SQLite 및 원격 Turso 데이터베이스 지원
- 실제 API 흐름을 재현하는 독립 Mock 실행 환경
- 화면과 API 요구사항을 검증하는 Playwright E2E 테스트

## 기술 구성

- Next.js 16, React 19, TypeScript
- Zustand, SCSS, Lucide React
- libSQL, SQLite, Turso
- Playwright

## 실행 방법

```bash
npm install
cp .env.example .env.local
npm run dev
```

개발 서버는 `http://localhost:3200`에서 실행됩니다. 소셜 로그인 키 없이 확인하려면 `npm run mock`을 사용합니다. 상세 요구사항은 `PRD.md`를 참고합니다.
