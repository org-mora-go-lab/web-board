import { readFileSync } from "node:fs";

import { expect, test } from "@playwright/test";

test("6. main PR 병합 시 patch 버전을 올린 새 버전 브랜치를 자동 생성한다", async () => {
  const workflow = readFileSync(
    ".github/workflows/create-next-version-branch.yml",
    "utf8",
  );

  expect(workflow).toContain("pull_request:");
  expect(workflow).toContain("branches: [main]");
  expect(workflow).toContain("github.event.pull_request.merged == true");
  expect(workflow).toContain(
    "const nextVersion = `${match[1]}.${match[2]}.${Number(match[3]) + 1}`;",
  );
  expect(workflow).toContain(
    'git ls-remote --exit-code --heads origin "$NEXT_VERSION"',
  );
  expect(workflow).toContain('git switch -c "$NEXT_VERSION"');
  expect(workflow).toContain('git commit -m "feat: $NEXT_VERSION"');
  expect(workflow).toContain('git push origin "$NEXT_VERSION"');
});
