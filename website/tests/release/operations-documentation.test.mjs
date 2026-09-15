import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import test from "node:test";

const WEBSITE_ROOT = resolve(import.meta.dirname, "../..");

async function operationsDocument(name) {
  return readFile(resolve(WEBSITE_ROOT, "docs", "operations", name), "utf8");
}

test("maintenance runbook covers the complete release, recovery, ownership, backup, and upgrade lifecycle", async () => {
  const runbook = await operationsDocument("maintenance.md");
  for (const required of [
    "內容更新",
    "Catalog 更新",
    "驗證",
    "Preview",
    "JP PUMP 核准",
    "Promotion",
    "Rollback",
    "網域與 DNS",
    "帳號所有權、MFA 與復原",
    "環境隔離",
    "原始媒體與權利備份",
    "升級流程",
    "升級與事件通報",
    "維護服務協議",
  ]) {
    assert.match(runbook, new RegExp(required, "i"), `missing runbook section: ${required}`);
  }
  assert.match(runbook, /release:rollback/);
  assert.match(runbook, /不得.*(?:reset --hard|破壞性 Git)/i);
  assert.match(runbook, /indeterminate/i);
});

test("recovery readiness record distinguishes verified observations from blocking external evidence", async () => {
  const readiness = await operationsDocument("recovery-readiness.md");
  for (const required of [
    "843dd1b51cee8757d282b9f42f7a9abb9197215e",
    "prj_i5wRQZCh0hmNqt8Pxks1no8t7reh",
    "Root Directory",
    "商用 Vercel 方案",
    "billing owner",
    "MFA",
    "正式網域",
    "Preview/Production",
    "離機",
    "第二位合格維護者",
  ]) {
    assert.match(readiness, new RegExp(required, "i"), `missing readiness evidence item: ${required}`);
  }
  assert.match(readiness, /`\.`.*`website`/i);
  assert.match(readiness, /0.*(?:custom )?domains|0 個.*網域/i);
  assert.match(readiness, /BLOCKED/g);
  assert.doesNotMatch(readiness, /MFA.*(?:已確認|CONFIRMED)/i);
});

test("handoff exercise requires an independent qualified maintainer and commit-bound Preview evidence", async () => {
  const exercise = await operationsDocument("handoff-exercise.md");
  for (const required of [
    "第二位合格維護者",
    "資格",
    "非產品內容",
    "source commit",
    "immutable Preview",
    "noindex",
    "Production promotion",
    "rollback",
    "restored deployment",
    "superseded deployment",
    "獨立觀察",
    "BLOCKED",
  ]) {
    assert.match(exercise, new RegExp(required, "i"), `missing handoff evidence field: ${required}`);
  }
  assert.match(exercise, /不得.*(?:作者自演|私人關係|未記錄本機知識)/i);
  assert.doesNotMatch(exercise, /第二位合格維護者.*(?:Fred|已完成|PASS)/i);
});
