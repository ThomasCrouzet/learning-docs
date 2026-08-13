import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '../..');
const DOCS = path.join(ROOT, 'docs');

function walk(dir) {
  const out = [];
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    if (fs.statSync(p).isDirectory()) out.push(...walk(p));
    else if (name.endsWith('.md')) out.push(p);
  }
  return out;
}

describe('content guards (shipped docs)', () => {
  const files = walk(DOCS);

  it('does not pin PHPUnit verbose="true" (removed in PHPUnit 10+)', () => {
    const hits = [];
    for (const f of files) {
      const t = fs.readFileSync(f, 'utf8');
      if (t.includes('verbose="true"')) hits.push(path.relative(ROOT, f));
    }
    expect(hits).toEqual([]);
  });

  it('does not document messenger:failed:retry --all (option does not exist)', () => {
    const hits = [];
    for (const f of files) {
      const t = fs.readFileSync(f, 'utf8');
      if (t.includes('failed:retry --all')) hits.push(path.relative(ROOT, f));
    }
    expect(hits).toEqual([]);
  });
});
