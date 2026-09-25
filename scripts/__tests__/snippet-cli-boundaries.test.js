import { afterEach, beforeEach, expect, it } from 'vitest';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const root = path.resolve(import.meta.dirname, '../..');
let fixture;
const previous = '{"fixture":"previous-report"}\n';

beforeEach(() => {
  const parent = process.env.SNIPPET_E2E_ARTIFACT_DIR || os.tmpdir();
  fs.mkdirSync(parent, { recursive: true });
  fixture = fs.mkdtempSync(path.join(parent, 'snippet-cli-'));
  fs.mkdirSync(path.join(fixture, 'scripts/lib'), { recursive: true });
  for (const name of ['run-snippet-runtime.js', 'lib/snippet-runtime.js']) {
    fs.copyFileSync(path.join(root, 'scripts', name), path.join(fixture, 'scripts', name));
  }
  fs.symlinkSync(path.join(root, 'node_modules'), path.join(fixture, 'node_modules'), 'dir');
  fs.mkdirSync(path.join(fixture, 'docs'));
  fs.writeFileSync(path.join(fixture, 'docs/01-topic.md'), '# Fixture\n\n```javascript\nconst value = 1;\n```\n');
  fs.mkdirSync(path.join(fixture, 'audit-reports'));
  fs.writeFileSync(path.join(fixture, 'audit-reports/snippet-runtime-latest.json'), previous);
});

afterEach(() => {
  if (!process.env.SNIPPET_E2E_ARTIFACT_DIR) fs.rmSync(fixture, { recursive: true, force: true });
});

function run(args) {
  const command = [path.join(fixture, 'scripts/run-snippet-runtime.js'), ...args];
  const result = spawnSync(process.execPath, command, { encoding: 'utf8', timeout: 10000 });
  fs.writeFileSync(path.join(fixture, 'result.json'), JSON.stringify({ command, node: process.version, code: result.status, stdout: result.stdout, stderr: result.stderr }, null, 2));
  return result;
}

it.each([
  { args: ['--strict', '--file', 'docs/absent.md'] },
  { args: ['--strict', '--file', '../outside.md'] },
  { args: ['--strict', '--file'] },
])('rejects an invalid selection without replacing the report: $args', ({ args }) => {
  expect(run(args).status).toBe(1);
  expect(fs.readFileSync(path.join(fixture, 'audit-reports/snippet-runtime-latest.json'), 'utf8')).toBe(previous);
});

it('checks a valid target and records its syntax result', () => {
  expect(run(['--strict', '--file', 'docs/01-topic.md']).status).toBe(0);
  const report = JSON.parse(fs.readFileSync(path.join(fixture, 'audit-reports/snippet-runtime-latest.json'), 'utf8'));
  expect(report.results).toHaveLength(1);
  expect(report.results[0].status).toBe('pass');
});
