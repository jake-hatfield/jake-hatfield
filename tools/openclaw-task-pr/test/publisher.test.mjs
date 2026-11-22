import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { publish } from '../bin/openclaw-task-pr.mjs';

const sh = (args, cwd) => execFileSync('git', args, { cwd, encoding: 'utf8' }).trim();
const digest = p => createHash('sha256').update(readFileSync(p)).digest('hex');
function setup(mode = 'none') {
  const dir = mkdtempSync(join(tmpdir(), 'task-pr-')), remote = join(dir, 'remote.git'), repo = join(dir, 'repo'), bin = join(dir, 'bin'), log = join(dir, 'gh.log'), body = join(dir, 'body.md');
  mkdirSync(bin); sh(['init', '--bare', remote], dir); sh(['init', '-b', 'main', repo], dir); sh(['config', 'user.email', 'test@example.com'], repo); sh(['config', 'user.name', 'Test'], repo);
  writeFileSync(join(repo, 'base.txt'), 'base\n'); sh(['add', '.'], repo); sh(['commit', '-m', 'base'], repo); sh(['remote', 'add', 'github', remote], repo); sh(['push', 'github', 'main'], repo);
  sh(['checkout', '-b', 'task/TASK-1'], repo); writeFileSync(join(repo, 'change.txt'), 'change\n'); sh(['add', '.'], repo); sh(['commit', '-m', 'task'], repo);
  const base = sh(['rev-parse', 'main'], repo), output = sh(['rev-parse', 'HEAD'], repo), art = join(dir, 'artifacts'); mkdirSync(art);
  sh(['bundle', 'create', join(art, 'TASK-1.bundle'), 'task/TASK-1'], repo); writeFileSync(join(art, 'TASK-1.patch'), sh(['format-patch', '--stdout', 'main..HEAD'], repo)); writeFileSync(join(art, 'TASK-1.test.log'), 'all tests passed\n');
  const e = {
    version: 1, taskId: 'TASK-1', repository: repo, defaultBranch: 'main', taskBranch: 'task/TASK-1', baseCommit: base, outputCommit: output,
    outputTree: sh(['show', '-s', '--format=%T', output], repo), commitCount: 1, changedFiles: ['change.txt'],
    test: { argv: ['node', '--test'], exitCode: 0, log: 'TASK-1.test.log', sha256: digest(join(art, 'TASK-1.test.log')) },
    artifacts: {
      bundle: { file: 'TASK-1.bundle', sha256: digest(join(art, 'TASK-1.bundle')) },
      patch: { file: 'TASK-1.patch', sha256: digest(join(art, 'TASK-1.patch')) }
    }
  };
  const evidence = join(art, 'TASK-1.json'); writeFileSync(evidence, JSON.stringify(e));
  const mock = [
    '#!/usr/bin/env node', "import { appendFileSync, copyFileSync } from 'node:fs';",
    "const a=process.argv.slice(2); appendFileSync(process.env.GH_LOG,a.join(' ')+'\\n');",
    "if(a[0]==='auth') process.exit(0);", "if(a[0]==='repo') { console.log('main'); process.exit(0); }",
    "if(a[0]==='pr'&&a[1]==='list') { console.log(process.env.GH_MODE==='existing' ? JSON.stringify([{number:7,url:'https://example.test/pr/7',headRefName:'task/TASK-1'}]) : '[]'); process.exit(0); }",
    "if(a[0]==='pr'&&a[1]==='create') { copyFileSync(a[a.indexOf('--body-file')+1],process.env.GH_BODY); console.log('https://example.test/pr/8'); process.exit(0); }", 'process.exit(2);'
  ].join('\n');
  writeFileSync(join(bin, 'gh'), mock, { mode: 0o755 });
  return { dir, repo, remote, evidence, log, body, env: { ...process.env, PATH: bin + ':' + process.env.PATH, GH_LOG: log, GH_BODY: body, GH_MODE: mode } };
}
function call(x) { const old = process.env; process.env = x.env; try { return publish(['publish', '--evidence', x.evidence, '--repo', 'owner/repo', '--title', 'Test PR', '--summary', 'Implemented safely', '--task-url', 'https://tasks/TASK-1', '--model', 'test-model'], x.repo); } finally { process.env = old; } }

test('creates PR only after verified evidence and pushes the exact branch', () => {
  const x = setup(); const r = call(x); assert.equal(r.status, 'created'); assert.equal(sh(['rev-parse', 'refs/heads/task/TASK-1'], x.remote), sh(['rev-parse', 'HEAD'], x.repo));
  const calls = readFileSync(x.log, 'utf8'); assert.match(calls, /auth status/); assert.match(calls, /repo view owner\/repo/); assert.match(calls, /pr list/); assert.match(calls, /pr create/);
});
test('rejection from bad hash occurs before gh or push mutation', () => {
  const x = setup(); const e = JSON.parse(readFileSync(x.evidence)); e.artifacts.patch.sha256 = '0'.repeat(64); writeFileSync(x.evidence, JSON.stringify(e)); assert.throws(() => call(x), /hash mismatch/); assert.equal(existsSync(x.log), false); assert.throws(() => sh(['rev-parse', 'refs/heads/task/TASK-1'], x.remote));
});
test('failed test evidence is rejected before gh or push mutation', () => {
  const x = setup(); const e = JSON.parse(readFileSync(x.evidence)); e.test.exitCode = 1; writeFileSync(x.evidence, JSON.stringify(e)); assert.throws(() => call(x), /test argv.*result/); assert.equal(existsSync(x.log), false); assert.throws(() => sh(['rev-parse', 'refs/heads/task/TASK-1'], x.remote));
});
test('created body contains task implementation validation hashes and model', () => {
  const x = setup(); call(x); const b = readFileSync(x.body, 'utf8'), e = JSON.parse(readFileSync(x.evidence)); for (const s of ['## Task', 'TASK-1', 'https://tasks/TASK-1', '## Implementation', 'Implemented safely', e.outputCommit, 'change.txt', '## Validation', 'node --test', e.artifacts.bundle.sha256, e.artifacts.patch.sha256, e.test.sha256, '## Model details', 'test-model']) assert.match(b, new RegExp(s));
});
test('returns an existing exact-head PR without push or creation', () => {
  const x = setup('existing'); const r = call(x); assert.deepEqual(r, { status: 'existing', number: 7, url: 'https://example.test/pr/7' }); const calls = readFileSync(x.log, 'utf8'); assert.match(calls, /pr list/); assert.doesNotMatch(calls, /pr create/); assert.throws(() => sh(['rev-parse', 'refs/heads/task/TASK-1'], x.remote));
});
