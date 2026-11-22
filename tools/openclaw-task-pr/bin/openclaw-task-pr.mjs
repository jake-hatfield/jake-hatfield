#!/usr/bin/env node
import { createHash, randomUUID } from 'node:crypto';
import { existsSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, isAbsolute, join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

function fail(message) { throw new Error(message); }
function run(file, args, options = {}) {
  const r = spawnSync(file, args, { cwd: options.cwd, encoding: 'utf8', env: options.env || process.env, stdio: ['ignore', 'pipe', 'pipe'] });
  if (r.error) fail(file + ': ' + r.error.message);
  if (r.status !== 0) fail(file + ' ' + args.join(' ') + ' failed: ' + (r.stderr || r.stdout).trim());
  return r.stdout.trim();
}
function result(file, args, cwd) { return spawnSync(file, args, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }); }
function hash(path) { return createHash('sha256').update(readFileSync(path)).digest('hex'); }
function artifactPath(value, base) { return isAbsolute(value) ? value : resolve(base, value); }
function usage() { return 'Usage: openclaw-task-pr publish --evidence PATH --repo REPO --title TITLE --summary TEXT --task-url URL --model TEXT [--remote github]'; }
function parse(argv) {
  if (argv[0] !== 'publish') fail(usage());
  const o = { remote: 'github' }, allowed = new Set(['evidence', 'repo', 'title', 'summary', 'task-url', 'model', 'remote']);
  for (let i = 1; i < argv.length; i += 2) { const k = argv[i] && argv[i].replace(/^--/, ''); if (!allowed.has(k) || !argv[i + 1]) fail(usage()); o[k] = argv[i + 1]; }
  for (const k of ['evidence', 'repo', 'title', 'summary', 'task-url', 'model']) if (!o[k]) fail(usage());
  return o;
}
function string(value, name) { if (typeof value !== 'string' || !value) fail('invalid evidence: ' + name); return value; }
function evidence(path) {
  let e; try { e = JSON.parse(readFileSync(path, 'utf8')); } catch { fail('invalid evidence JSON'); }
  if (!e || e.version !== 1 || !e.artifacts || !e.test) fail('invalid evidence schema/version');
  for (const k of ['taskId', 'repository', 'defaultBranch', 'taskBranch', 'baseCommit', 'outputCommit', 'outputTree']) string(e[k], k);
  if (!Number.isInteger(e.commitCount) || e.commitCount < 1) fail('invalid evidence: commitCount');
  if (!Array.isArray(e.changedFiles) || e.changedFiles.some(x => typeof x !== 'string')) fail('invalid evidence: changedFiles');
  for (const k of ['bundle', 'patch']) {
    if (!e.artifacts[k] || typeof e.artifacts[k] !== 'object') fail('invalid evidence: artifacts.' + k);
    string(e.artifacts[k].file, 'artifacts.' + k + '.file');
    if (!/^[a-f0-9]{64}$/.test(string(e.artifacts[k].sha256, 'artifacts.' + k + '.sha256'))) fail('invalid evidence: artifacts.' + k + '.sha256');
  }
  if (!Array.isArray(e.test.argv) || !e.test.argv.length || e.test.argv.some(x => typeof x !== 'string') || e.test.exitCode !== 0) fail('invalid evidence: test argv/result');
  string(e.test.log, 'test.log');
  if (!/^[a-f0-9]{64}$/.test(string(e.test.sha256, 'test.sha256'))) fail('invalid evidence: test.sha256');
  return e;
}
function validate(e, ep, cwd) {
  const dir = dirname(ep);
  for (const k of ['bundle', 'patch']) { const p = artifactPath(e.artifacts[k].file, dir); if (!existsSync(p)) fail('missing evidence artifact: ' + k); if (hash(p) !== e.artifacts[k].sha256) fail('evidence hash mismatch: ' + k); }
  const logPath = artifactPath(e.test.log, dir);
  if (!existsSync(logPath)) fail('missing evidence artifact: test log');
  if (hash(logPath) !== e.test.sha256) fail('evidence hash mismatch: test log');
  const root = run('git', ['rev-parse', '--show-toplevel'], { cwd });
  if (resolve(cwd) !== resolve(root)) fail('repository must be invoked from its exact top-level directory');
  if (resolve(root) !== resolve(e.repository)) fail('repository does not match evidence');
  if (run('git', ['status', '--porcelain=v1', '--untracked-files=all'], { cwd }) !== '') fail('repository is not clean');
  if (run('git', ['branch', '--show-current'], { cwd }) !== e.taskBranch) fail('task branch does not match evidence');
  const base = run('git', ['rev-parse', '--verify', 'refs/heads/' + e.defaultBranch + '^{commit}'], { cwd });
  if (base !== e.baseCommit) fail('default branch does not match evidence base commit');
  const head = run('git', ['rev-parse', 'HEAD'], { cwd });
  const output = run('git', ['rev-parse', '--verify', e.outputCommit + '^{commit}'], { cwd });
  if (head !== output) fail('HEAD does not match evidence output commit');
  const outputTree = run('git', ['rev-parse', '--verify', output + '^{tree}'], { cwd });
  if (outputTree !== e.outputTree) fail('output tree does not match evidence');
  if (result('git', ['merge-base', '--is-ancestor', base, output], cwd).status !== 0) fail('base is not an ancestor of output');
  if (Number(run('git', ['rev-list', '--count', base + '..' + output], { cwd })) !== e.commitCount) fail('descendant commit count does not match evidence');
  const changed = run('git', ['diff', '--name-only', base + '..' + output], { cwd }).split('\n').filter(Boolean).sort();
  const expected = [...e.changedFiles].sort();
  if (changed.length !== expected.length || changed.some((v, i) => v !== expected[i])) fail('changed files do not match evidence');
  if (result('git', ['diff', '--check', base + '..' + output], cwd).status !== 0) fail('git diff --check failed');
  run('git', ['bundle', 'verify', artifactPath(e.artifacts.bundle.file, dir)], { cwd });
  return { output, outputTree, changed, gitDir: run('git', ['rev-parse', '--git-dir'], { cwd }) };
}
function body(e, o, s) {
  return ['## Task', '- ID: ' + e.taskId, '- URL: ' + o['task-url'], '', '## Implementation', o.summary, '- Output commit: ' + s.output, '- Output tree: ' + s.outputTree, '- Changed files:', ...s.changed.map(f => '  - ' + f), '', '## Validation', '- Test command: ' + e.test.argv.join(' '), '- Test result: exit ' + e.test.exitCode, '- Evidence hashes:', '  - bundle: ' + e.artifacts.bundle.sha256, '  - patch: ' + e.artifacts.patch.sha256, '  - test log: ' + e.test.sha256, '', '## Model details', o.model, ''].join('\n');
}
function existing(o, branch, cwd) {
  let rows; try { rows = JSON.parse(run('gh', ['pr', 'list', '--repo', o.repo, '--head', branch, '--state', 'open', '--json', 'number,url,headRefName'], { cwd }) || '[]'); } catch { fail('gh pr list returned invalid JSON'); }
  return rows.find(p => p && p.headRefName === branch && p.url) || null;
}
export function publish(argv = process.argv.slice(2), cwd = process.cwd()) {
  const o = parse(argv), ep = resolve(cwd, o.evidence), e = evidence(ep);
  const s = validate(e, ep, cwd); // no network-capable command runs before this line
  run('gh', ['auth', 'status'], { cwd });
  const defaultBranch = run('gh', ['repo', 'view', o.repo, '--json', 'defaultBranchRef', '--jq', '.defaultBranchRef.name'], { cwd });
  if (defaultBranch !== e.defaultBranch) fail('recorded base ref is not the repository default branch');
  const prior = existing(o, e.taskBranch, cwd);
  if (prior) return { status: 'existing', number: prior.number, url: prior.url };
  run('git', ['push', o.remote, e.taskBranch + ':refs/heads/' + e.taskBranch], { cwd });
  const p = join(resolve(cwd, s.gitDir), 'openclaw-task-pr-' + randomUUID() + '.md');
  try { writeFileSync(p, body(e, o, s), { mode: 0o600 }); return { status: 'created', url: run('gh', ['pr', 'create', '--repo', o.repo, '--base', defaultBranch, '--head', e.taskBranch, '--title', o.title, '--body-file', p], { cwd }) }; } finally { rmSync(p, { force: true }); }
}
if (import.meta.url === 'file://' + process.argv[1]) { try { const r = publish(); process.stdout.write(r.status + ': ' + r.url + '\n'); } catch (e) { process.stderr.write('openclaw-task-pr: ' + e.message + '\n'); process.exitCode = 1; } }
