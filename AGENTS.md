<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Commit Messages

After completing code changes, suggest a Korean commit message that matches the change. Keep one of the prefixes `test:`, `feat:`, `refactor:`, `doc`, `style:`, or `fix:`.

## Specification Synchronization

`PRD.md` is the source of truth for both the frontend and the backend (`## NN. API - …` sections). When functionality is added, removed, or improved, update `PRD.md` to match the current implementation in the same change, and add, update, or remove the corresponding tests under `tests/` so they fully reflect the current requirements.

Keep the numbered structure in `PRD.md` and `tests/` in exact sync. Each `## NN. Title` section must have a matching `tests/NN. Title/` directory, and each numbered requirement `NN.` under that section must have exactly one corresponding `NN.e2e.spec.ts` file in that directory. The test file numbers and total count must match the PRD requirement numbers and count, with no missing or extra requirement tests.

Do not consider the work complete until all E2E tests pass. Run `npm run test:e2e` and require a 100% pass rate; fix implementation, test, fixture, mock, or utility issues before reporting completion.

## E2E Test Structure

- Every E2E test file (`*.e2e.spec.ts`) must contain exactly one top-level `test(...)` declaration whose title starts with the requirement number (`"3. …"`). Do not generate multiple tests from loops or parameterized declarations in one file; split separate scenarios into their own numbered PRD requirements.
- UI requirements drive the browser through `page`. Backend (`API - …`) requirements call the HTTP API directly through Playwright's `request` fixture or `request.newContext()`.
- Tests run in parallel against one shared database, so never assume global state: create data with unique values (`uniqueId()`), scope list assertions with a unique search term, and use `page.route` mocks for states that depend on the whole table (for example an empty board).
- Social login never calls the real Kakao server. `tests/__mock__/oauth-server.mjs` implements its authorize/token/userinfo endpoints and `playwright.config.ts` points the app at it via `*_AUTHORIZE_URL`, `*_TOKEN_URL`, and `*_USERINFO_URL`.
- Create `__mock__/`, `__fixture__/`, `__util__/`, or `__constant__/` folders when shared test doubles, fixtures, helpers, or constants are needed. Put broadly reusable resources under `tests/`; put resources used only by one requirement title under that title's folder. Every such folder must include a barrel `index.ts` (standalone server scripts such as `oauth-server.mjs` are the only non-TS exception), and tests should import from the barrel. Shared resource files must not declare tests.

## Backend Module Structure

- Route files under `app/api/**/route.ts` only re-export handlers from `src/server/<domain>` (for example `export { getPosts as GET } from "@/src/server/post";`). Keep logic out of `app/`.
- `src/server/<domain>/` holds one domain each (`auth`, `post`, `user`) plus shared `db` and `http` modules. Handlers live in `handler/` and are wrapped with `handle()` so thrown `HttpError`s become `{ error: { code, message, fields? } }` responses.
- Database access goes through `getDb()` from `src/server/db`; write SQL with `?` placeholders only, and use `db.transaction()` for multi-statement writes.
- Validation rules shared with the UI live in `src/entity/<domain>/util` (for example `validatePostInput`) and constants in `src/entity/<domain>/constant`; the server imports those files directly so the client and API always report the same messages.

## Feature and Widget Module Structure

- Each feature or widget module directly under `src/feature/` or `src/widget/` must implement its main module in its own `index.tsx`.
- `src/feature/index.ts` and `src/widget/index.ts` must export the public modules for their respective directories, and may export only each module's main implementation from `./<module>`; do not export subcomponents from them.
- Export subcomponents from the module's `component/index.ts` barrel, and import and use those subcomponents from the module's `index.tsx`.
- Pages and other consumers must import feature and widget modules through the public `feature/index.ts` and `widget/index.ts` barrels.

## Page Module Structure

- Each route has a page module under `src/page/<page>/` with `page.tsx` (server component that awaits `params`/`searchParams` and exports `metadata`), `index.tsx` (client component), `index.scss`, and optional `hook/`, `component/`, `style/` directories. `app/**/page.tsx` only re-exports from `src/page/index.ts`.
- The root layout lives in `src/page/home/layout.tsx` and is re-exported by `app/layout.tsx`.

## Entity UI Components

- Put common UI components shared by feature, widget, or page modules under `src/entity/ui/`, structured like other modules: `src/entity/ui/<component>/index.tsx` and `index.scss`, with the top-level class selector matching the directory name.
- `src/entity/ui/index.ts` may export only each UI component's main implementation. Consumers import these components through `@/src/entity/ui` and load the stylesheet from their page stylesheet with `@use "../../entity/ui/<component>"`.

## Feature, Widget, and Page Stylesheets

- Each feature, widget, or page module must keep its main stylesheet in `index.scss` next to its `index.tsx`. Put optional SCSS files for subcomponents under that module's `style/` directory.
- The top-level class selector in a module's `index.scss` must match the module directory name (for example, `.header` in `header/index.scss`).
- Whenever a module adds `component/<sub-comp>.tsx`, it must add the matching `style/<sub-comp>.scss` in the same change, even if the stylesheet is initially empty.
- Page stylesheets `@use` every widget, feature, and entity UI stylesheet the page renders.
