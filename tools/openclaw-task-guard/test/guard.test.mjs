import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawn, spawnSync, execFileSync } from 'node:child_process';
import { once } from 'node:events';
import { fileURLToPath } from 'node:url';
import { execute, redact } from '../bin/openclaw-task-guard.mjs';

const bin = fileURLToPath(new URL('../bin/openclaw-task-guard.mjs', import.meta.url));
const time = Date.UTC(2026, 10, 22, 12);
const limits = { tokens: 100, wallMs: 1000, toolCalls: 10, usd: 1 };
const rate = { version: 'v2026-11', effectiveDate: '2026-11-01', inputPerMillion: 10000, outputPerMillion: 20000 };
const cloud = { mode: 'cloud', cloudOptIn: true, provider: 'example' };

async function fixture(t, config = {}) {
  const dir = fs.mkdtempSync(path.join(fs.existsSync('/tmp/opencode') ? '/tmp/opencode' : os.tmpdir(), 'task-guard-'));
  const root = path.join(dir, 'approved');
  fs.mkdirSync(root);
  const statePath = path.join(dir, 'state.json');
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  const call = (command, input = {}, now = time) => execute(command, input, { statePath, now });
  assert.equal((await call('init', { approvedRoot: root, caps: limits, dailyCloudUsd: 1, pricing: { example: rate }, ...config })).ok, true);
  const read = () => JSON.parse(fs.readFileSync(statePath, 'utf8'));
  const write = state => fs.writeFileSync(statePath, JSON.stringify(state), { mode: 0o600 });
  return { dir, root, statePath, call, read, write };
}
function git(repo, ...args) {
  return execFileSync('git', args, { cwd: repo, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
}
function repository(root, name = 'controlled', branch = 'task/runaway') {
  const repo = path.join(root, name);
  fs.mkdirSync(repo);
  git(repo, 'init', '-b', branch);
  fs.writeFileSync(path.join(repo, 'payload.txt'), 'controlled task data\n');
  return repo;
}
async function childFor(t, task, extraEnv = {}) {
  const child = spawn(process.execPath, ['-e', "process.on('SIGTERM', () => {}); console.log('ready'); setInterval(() => { for(let i=0;i<10000;i++); }, 1)"], {
    env: { ...process.env, OPENCLAW_TASK_ID: task.taskId, OPENCLAW_TASK_RUN_ID: task.runId, ...extraEnv },
    stdio: ['ignore', 'pipe', 'pipe']
  });
  await once(child.stdout, 'data');
  t.after(async () => {
    if (child.exitCode === null && child.signalCode === null) {
      child.kill('SIGKILL');
      await once(child, 'exit');
    }
  });
  return child;
}

test('initializes versioned mode-0600 state and atomic updates leave no temporary files', async t => {
  const f = await fixture(t);
  assert.equal(f.read().version, 1);
  assert.deepEqual(f.read().config.taskBranchPolicy, { version: 1, prefixes: ['nad/', 'task/'] });
  assert.equal(fs.statSync(f.statePath).mode & 0o777, 0o600);
  const oldInode = fs.statSync(f.statePath).ino;
  await f.call('admit', { taskId: 'local' });
  assert.notEqual(fs.statSync(f.statePath).ino, oldInode);
  assert.deepEqual(fs.readdirSync(f.dir).sort(), ['approved', 'state.json']);
  assert.equal((await f.call('init')).error, 'STATE_ALREADY_EXISTS');
});

test('local-first admission and explicit per-task cloud opt-in', async t => {
  const f = await fixture(t);
  assert.equal((await f.call('admit', { taskId: 'local', provider: 'missing' })).mode, 'local');
  for (const cloudOptIn of [undefined, false, 'true', 1]) {
    assert.equal((await f.call('admit', { taskId: 'denied', mode: 'cloud', provider: 'example', cloudOptIn })).error, 'CLOUD_OPT_IN_REQUIRED');
  }
  assert.equal((await f.call('admit', { taskId: 'cloud', ...cloud })).decision, 'admit');
  assert.equal((await f.call('admit', { taskId: 'other', ...cloud, provider: 'missing' })).error, 'PRICING_REQUIRED');
});

test('rejects duplicate tasks, prototype names behave as own keys, caps cannot be raised', async t => {
  const f = await fixture(t);
  assert.equal((await f.call('heartbeat', { taskId: 'constructor' })).error, 'TASK_NOT_FOUND');
  assert.equal((await f.call('admit', { taskId: 'constructor' })).ok, true);
  assert.equal((await f.call('admit', { taskId: 'constructor' })).error, 'TASK_ALREADY_EXISTS');
  assert.equal((await f.call('admit', { taskId: 'higher', caps: { ...limits, tokens: 101 } })).error, 'CAP_EXCEEDS_CONFIG');
  assert.equal((await f.call('admit', { taskId: 'lower', caps: { ...limits, tokens: 50 } })).ok, true);
});

for (const [metric, alertInput, capInput, elapsed] of [
  ['tokens', { inputTokens: 80 }, { inputTokens: 100 }, 0],
  ['toolCalls', { toolCalls: 8 }, { toolCalls: 10 }, 0],
  ['usd', { usd: 0.8 }, { usd: 1 }, 0],
  ['wallMs', {}, {}, 800]
]) {
  test(`${metric}: alerts precede hard cap and hard-cap decision is sticky`, async t => {
    const f = await fixture(t);
    await f.call('admit', { taskId: 'task' });
    const alert = await f.call('heartbeat', { taskId: 'task', ...alertInput }, time + elapsed);
    assert.equal(alert.decision, 'continue');
    assert.ok(alert.alerts.includes(metric));
    assert.deepEqual(alert.breaches, []);
    const cap = await f.call('heartbeat', { taskId: 'task', ...capInput }, time + (metric === 'wallMs' ? 1000 : 0));
    assert.equal(cap.decision, 'terminate');
    assert.ok(cap.breaches.includes(metric));
    assert.equal(f.read().tasks.task.terminationReason.code, 'HARD_CAP');
    assert.equal((await f.call('heartbeat', { taskId: 'task' }, time)).decision, 'terminate');
  });
}

test('a single heartbeat reports all simultaneous cap breaches', async t => {
  const f = await fixture(t);
  await f.call('admit', { taskId: 'task' });
  const result = await f.call('heartbeat', { taskId: 'task', inputTokens: 51, outputTokens: 50, toolCalls: 11, usd: 2 }, time + 1001);
  assert.equal(result.decision, 'terminate');
  assert.deepEqual(result.breaches.sort(), ['tokens', 'toolCalls', 'usd', 'wallMs'].sort());
});

test('pricing is snapshotted and computes input and output costs without trusting lower USD claims', async t => {
  const f = await fixture(t, { caps: { ...limits, tokens: 1000, usd: 10 } });
  await f.call('admit', { taskId: 'priced', ...cloud });
  const result = await f.call('heartbeat', { taskId: 'priced', inputTokens: 10, outputTokens: 20, usd: 0 });
  assert.equal(result.usage.usd, 0.5);
  assert.deepEqual(f.read().tasks.priced.pricing, rate);
  assert.equal(f.read().dailySpend['2026-11-22'], 0.5);
  await f.call('heartbeat', { taskId: 'priced' });
  assert.equal(f.read().dailySpend['2026-11-22'], 0.5);
});

test('daily spend cap blocks new cloud tasks but local tasks continue', async t => {
  const f = await fixture(t, { caps: { ...limits, usd: 10 } });
  await f.call('admit', { taskId: 'payer', ...cloud });
  assert.equal((await f.call('heartbeat', { taskId: 'payer', usd: 1.01 })).decision, 'continue');
  assert.equal((await f.call('admit', { taskId: 'blocked', ...cloud })).error, 'DAILY_CLOUD_CAP');
  assert.equal((await f.call('admit', { taskId: 'offline' })).decision, 'admit');
  assert.equal((await f.call('admit', { taskId: 'tomorrow', ...cloud }, time + 86400000)).decision, 'admit');
});

test('incremental spend is booked once on each UTC reporting day and retained on finish', async t => {
  const f = await fixture(t, { caps: { ...limits, usd: 10 } });
  await f.call('admit', { taskId: 'payer', ...cloud });
  await f.call('heartbeat', { taskId: 'payer', usd: 0.25 });
  await f.call('finish', { taskId: 'payer', usd: 0.75 }, time + 86400000);
  assert.deepEqual(f.read().dailySpend, { '2026-11-22': 0.25, '2026-11-23': 0.5 });
  assert.equal(f.read().tasks.payer.usage.usd, 0.75);
});

test('consecutive failures open provider circuit and block admission during cooldown', async t => {
  const f = await fixture(t);
  await f.call('admit', { taskId: 'cloud', ...cloud });
  assert.equal((await f.call('provider-result', { taskId: 'cloud', success: false })).circuit, 'closed');
  await f.call('provider-result', { taskId: 'cloud', success: true });
  assert.equal(f.read().providers.example.failures, 0);
  for (let i = 0; i < 3; i++) await f.call('provider-result', { taskId: 'cloud', success: false });
  assert.equal(f.read().providers.example.state, 'open');
  assert.equal((await f.call('admit', { taskId: 'blocked', ...cloud }, time + 59999)).error, 'CIRCUIT_OPEN');
  assert.equal((await f.call('admit', { taskId: 'local' })).ok, true);
  // A stale success cannot short-circuit the cooldown.
  await f.call('provider-result', { taskId: 'cloud', success: true });
  assert.equal(f.read().providers.example.state, 'open');
});

test('cooldown admits one half-open probe; successful probe closes and resets breaker', async t => {
  const f = await fixture(t, { failureThreshold: 1 });
  await f.call('admit', { taskId: 'original', ...cloud });
  await f.call('provider-result', { taskId: 'original', success: false });
  assert.equal((await f.call('admit', { taskId: 'probe', ...cloud }, time + 60000)).circuit, 'half-open');
  assert.equal((await f.call('admit', { taskId: 'racing-probe', ...cloud }, time + 60000)).error, 'CIRCUIT_PROBE_IN_PROGRESS');
  assert.equal((await f.call('provider-result', { taskId: 'original', success: true }, time + 60000)).ignored, true);
  assert.equal((await f.call('provider-result', { taskId: 'probe', success: true }, time + 60001)).circuit, 'closed');
  assert.equal(f.read().providers.example.failures, 0);
  assert.equal((await f.call('admit', { taskId: 'recovered', ...cloud }, time + 60002)).circuit, 'closed');
});

test('failed half-open probe reopens circuit with a fresh cooldown', async t => {
  const f = await fixture(t, { failureThreshold: 1 });
  await f.call('admit', { taskId: 'original', ...cloud });
  await f.call('provider-result', { taskId: 'original', success: false });
  await f.call('admit', { taskId: 'probe', ...cloud }, time + 60000);
  assert.equal((await f.call('provider-result', { taskId: 'probe', success: false }, time + 60010)).circuit, 'open');
  assert.equal((await f.call('admit', { taskId: 'blocked', ...cloud }, time + 120009)).error, 'CIRCUIT_OPEN');
  assert.equal((await f.call('admit', { taskId: 'probe2', ...cloud }, time + 120010)).circuit, 'half-open');
});

test('provider circuits are isolated and local tasks cannot submit provider outcomes', async t => {
  const f = await fixture(t, { failureThreshold: 1, pricing: { example: rate, second: rate } });
  await f.call('admit', { taskId: 'a', ...cloud });
  await f.call('provider-result', { taskId: 'a', success: false });
  assert.equal((await f.call('admit', { taskId: 'b', ...cloud, provider: 'second' })).ok, true);
  await f.call('admit', { taskId: 'c' });
  assert.equal((await f.call('provider-result', { taskId: 'c', success: false })).error, 'INVALID_PROVIDER_RESULT');
});

test('runaway child is killed, only its controlled repo is cleaned, and failure accounting survives', async t => {
  const f = await fixture(t);
  const repo = repository(f.root);
  const untouched = repository(f.root, 'untouched');
  const admitted = await f.call('admit', { taskId: 'runaway', ...cloud, repoPath: repo });
  assert.equal(admitted.ok, true);
  const child = await childFor(t, admitted);
  const exit = once(child, 'exit');
  const decision = await f.call('heartbeat', { taskId: 'runaway', pid: child.pid, inputTokens: 100 });
  assert.equal(decision.decision, 'terminate');
  const result = await f.call('terminate', { taskId: 'runaway' });
  assert.equal(result.decision, 'terminated');
  assert.equal(result.cleanup.status, 'cleaned');
  assert.equal((await exit)[1], 'SIGKILL');
  assert.equal(fs.existsSync(repo), false);
  assert.equal(fs.existsSync(untouched), true);
  const state = f.read();
  assert.equal(state.tasks.runaway.terminationReason.code, 'HARD_CAP');
  assert.equal(state.tasks.runaway.usage.usd, 1);
  assert.equal(state.dailySpend['2026-11-22'], 1);
  assert.equal((await f.call('terminate', { taskId: 'runaway' })).ok, true);
});

test('unrecorded and mismatched processes are never killed and repo remains', async t => {
  const f = await fixture(t);
  const repo = repository(f.root);
  const task = await f.call('admit', { taskId: 'task', repoPath: repo });
  const child = await childFor(t, task, { OPENCLAW_TASK_RUN_ID: 'wrong-run' });
  assert.equal((await f.call('heartbeat', { taskId: 'task', pid: child.pid })).error, 'PROCESS_IDENTITY_MISMATCH');
  const result = await f.call('terminate', { taskId: 'task', pid: child.pid, repoPath: repo });
  assert.equal(result.cleanup.reason, 'PROCESS_NOT_RECORDED');
  assert.equal(child.signalCode, null);
  assert.equal(fs.existsSync(repo), true);
  assert.equal(f.read().tasks.task.cleanup.reason, 'PROCESS_NOT_RECORDED');
});

test('nad/NAD-015 standalone repo is admitted and only its recorded repo is safely cleaned', async t => {
  const f = await fixture(t);
  const repo = repository(f.root, 'nad-task', 'nad/NAD-015-task-guard');
  const untouched = repository(f.root, 'untouched', 'nad/NAD-015-other');
  const task = await f.call('admit', { taskId: 'NAD-015', repoPath: repo });
  assert.equal(task.ok, true);
  assert.equal(f.read().tasks['NAD-015'].repo.branch, 'nad/NAD-015-task-guard');
  const child = await childFor(t, task);
  const exit = once(child, 'exit');
  assert.equal((await f.call('heartbeat', { taskId: 'NAD-015', pid: child.pid })).ok, true);
  assert.equal((await f.call('terminate', { taskId: 'NAD-015' })).cleanup.status, 'cleaned');
  assert.equal((await exit)[1], 'SIGKILL');
  assert.equal(fs.existsSync(repo), false);
  assert.equal(fs.existsSync(untouched), true);
});

test('changing a recorded nad branch to another allowed branch still rejects cleanup', async t => {
  const f = await fixture(t);
  const repo = repository(f.root, 'nad-task', 'nad/NAD-015-task-guard');
  const task = await f.call('admit', { taskId: 'NAD-015', repoPath: repo });
  assert.equal(task.ok, true);
  const child = await childFor(t, task);
  await f.call('heartbeat', { taskId: 'NAD-015', pid: child.pid });
  git(repo, 'symbolic-ref', 'HEAD', 'refs/heads/nad/NAD-015-other');
  assert.equal((await f.call('terminate', { taskId: 'NAD-015' })).cleanup.reason, 'REPOSITORY_IDENTITY_MISMATCH');
  assert.equal(fs.existsSync(repo), true);
});

test('versioned custom prefixes are explicit and do not bypass protected branches', async t => {
  const f = await fixture(t, {
    taskBranchPolicy: { version: 1, prefixes: ['work/', 'main/', 'release/'] },
    defaultBranches: ['release/stable']
  });
  for (const [name, branch, error] of [
    ['main', 'main', 'DEFAULT_BRANCH_REJECTED'],
    ['master', 'master', 'DEFAULT_BRANCH_REJECTED'],
    ['release', 'release/stable', 'DEFAULT_BRANCH_REJECTED'],
    ['nad', 'nad/NAD-015-task-guard', 'TASK_BRANCH_REQUIRED'],
    ['task', 'task/runaway', 'TASK_BRANCH_REQUIRED']
  ]) {
    const repo = repository(f.root, name, branch);
    assert.equal((await f.call('admit', { taskId: name, repoPath: repo })).error, error);
    assert.equal(fs.existsSync(path.join(repo, '.openclaw-task-guard.json')), false);
  }
  const repo = repository(f.root, 'custom', 'work/NAD-015');
  assert.equal((await f.call('admit', { taskId: 'custom', repoPath: repo })).ok, true);
});

test('nad configured, release, remote and init default branches remain protected', async t => {
  const f = await fixture(t, { defaultBranches: ['nad/protected', 'nad/release'] });
  for (const [name, branch] of [['configured', 'nad/protected'], ['release', 'nad/release'], ['remote', 'nad/remote'], ['init', 'nad/init']]) {
    const repo = repository(f.root, name, branch);
    if (name === 'remote') git(repo, 'symbolic-ref', 'refs/remotes/origin/HEAD', `refs/remotes/origin/${branch}`);
    if (name === 'init') git(repo, 'config', 'init.defaultBranch', branch);
    assert.equal((await f.call('admit', { taskId: name, repoPath: repo })).error, 'DEFAULT_BRANCH_REJECTED');
    assert.equal(fs.existsSync(path.join(repo, '.openclaw-task-guard.json')), false);
  }
});

test('empty, broad and malformed task prefixes fail closed at init and state load', async t => {
  const f = await fixture(t);
  const original = f.read();
  for (const prefixes of [[], [''], ['/'], ['*'], ['*/'], ['nad'], ['n'], ['refs/heads/'], ['nad/*'], ['nad/../'], ['nad//'], ['nad/', ''], [null], 'nad/']) {
    const policy = { version: 1, prefixes };
    const statePath = path.join(f.dir, 'invalid.json');
    assert.equal((await execute('init', { taskBranchPolicy: policy }, { statePath, now: time })).error, 'INVALID_TASK_BRANCH_PREFIXES');
    assert.equal(fs.existsSync(statePath), false);
    f.write({ ...original, config: { ...original.config, taskBranchPolicy: policy } });
    const result = await f.call('heartbeat', { taskId: 'missing' });
    assert.equal(result.error, 'INVALID_TASK_BRANCH_PREFIXES');
    assert.equal(result.decision, 'terminate');
  }
});

test('missing or unsupported branch policy versions fail closed', async t => {
  const f = await fixture(t);
  const original = f.read();
  for (const policy of [null, {}, { version: 2, prefixes: ['nad/'] }]) {
    const statePath = path.join(f.dir, 'invalid.json');
    assert.equal((await execute('init', { taskBranchPolicy: policy }, { statePath, now: time })).error, 'UNSUPPORTED_TASK_BRANCH_POLICY_VERSION');
    assert.equal(fs.existsSync(statePath), false);
  }
  for (const policy of [undefined, { version: 2, prefixes: ['nad/'] }]) {
    f.write({ ...original, config: { ...original.config, taskBranchPolicy: policy } });
    assert.equal((await f.call('admit', { taskId: 'blocked' })).error, 'UNSUPPORTED_TASK_BRANCH_POLICY_VERSION');
  }
});

test('recorded process start identity cannot be replaced with another PID lifetime', async t => {
  const f = await fixture(t);
  const task = await f.call('admit', { taskId: 'task' });
  const child = await childFor(t, task);
  await f.call('heartbeat', { taskId: 'task', pid: child.pid });
  const state = f.read();
  state.tasks.task.process.startTime = '0';
  f.write(state);
  assert.equal((await f.call('terminate', { taskId: 'task' })).cleanup.reason, 'PROCESS_IDENTITY_MISMATCH');
  assert.equal(child.signalCode, null);
});

for (const scenario of ['default-branch', 'changed-branch', 'sentinel', 'sentinel-symlink', 'sentinel-hardlink', 'symlink-content', 'gitdir-file', 'outside-root', 'root-symlink', 'repo-symlink', 'replaced-repo']) {
  test(`unsafe cleanup rejected: ${scenario}`, async t => {
    const f = await fixture(t);
    const repo = repository(f.root);
    const task = await f.call('admit', { taskId: 'task', ...cloud, repoPath: repo });
    const child = await childFor(t, task);
    await f.call('heartbeat', { taskId: 'task', pid: child.pid, usd: 0.5 });
    if (scenario === 'default-branch') git(repo, 'symbolic-ref', 'HEAD', 'refs/heads/main');
    if (scenario === 'changed-branch') git(repo, 'symbolic-ref', 'HEAD', 'refs/heads/task/other');
    if (scenario === 'sentinel') fs.writeFileSync(path.join(repo, '.openclaw-task-guard.json'), '{}');
    if (scenario === 'sentinel-symlink') {
      const sentinel = path.join(repo, '.openclaw-task-guard.json');
      fs.renameSync(sentinel, path.join(f.dir, 'saved-sentinel'));
      fs.symlinkSync(path.join(f.dir, 'saved-sentinel'), sentinel);
    }
    if (scenario === 'sentinel-hardlink') fs.linkSync(path.join(repo, '.openclaw-task-guard.json'), path.join(f.dir, 'linked-sentinel'));
    if (scenario === 'symlink-content') fs.symlinkSync(f.statePath, path.join(repo, 'link'));
    if (scenario === 'gitdir-file') {
      fs.renameSync(path.join(repo, '.git'), path.join(repo, 'old-git'));
      fs.writeFileSync(path.join(repo, '.git'), 'gitdir: old-git\n');
    }
    if (scenario === 'outside-root') {
      const state = f.read();
      state.config.approvedRoot = path.join(f.dir, 'elsewhere');
      fs.mkdirSync(state.config.approvedRoot);
      f.write(state);
    }
    if (scenario === 'root-symlink') {
      fs.renameSync(f.root, f.root + '-moved');
      fs.symlinkSync(f.root + '-moved', f.root);
    }
    if (scenario === 'repo-symlink') {
      fs.renameSync(repo, repo + '-moved');
      fs.symlinkSync(repo + '-moved', repo);
    }
    if (scenario === 'replaced-repo') {
      fs.renameSync(repo, repo + '-moved');
      fs.cpSync(repo + '-moved', repo, { recursive: true });
    }
    const result = await f.call('terminate', { taskId: 'task' });
    assert.equal(result.ok, false);
    assert.equal(result.cleanup.status, 'rejected');
    assert.equal(fs.existsSync(repo), true);
    const state = f.read();
    assert.equal(state.tasks.task.usage.usd, 0.5);
    assert.equal(state.dailySpend['2026-11-22'], 0.5);
    assert.equal(state.tasks.task.terminationReason.code, 'REQUESTED');
    assert.ok(state.tasks.task.cleanup.reason);
    assert.equal(state.tasks.task.processStopped, true);
  });
}

test('admission refuses outside-root, default branch, non-task branch, root itself, and symlink repos', async t => {
  const f = await fixture(t);
  const outside = repository(f.dir, 'outside');
  const main = repository(f.root, 'main', 'main');
  const trunk = repository(f.root, 'trunk', 'trunk');
  const good = repository(f.root, 'good');
  const link = path.join(f.root, 'link');
  fs.symlinkSync(good, link);
  for (const [repoPath, error] of [[outside, 'REPOSITORY_OUTSIDE_ROOT'], [main, 'DEFAULT_BRANCH_REJECTED'], [trunk, 'TASK_BRANCH_REQUIRED'], [f.root, 'REPOSITORY_OUTSIDE_ROOT'], [link, 'SYMLINK_REJECTED']]) {
    assert.equal((await f.call('admit', { taskId: 'rejected', repoPath })).error, error);
  }
});

test('configured and remote default task branches are protected', async t => {
  const f = await fixture(t, { defaultBranches: ['task/protected'] });
  const repo = repository(f.root, 'default', 'task/protected');
  assert.equal((await f.call('admit', { taskId: 'rejected', repoPath: repo })).error, 'DEFAULT_BRANCH_REJECTED');
  git(repo, 'symbolic-ref', 'HEAD', 'refs/heads/task/remote-default');
  git(repo, 'symbolic-ref', 'refs/remotes/origin/HEAD', 'refs/remotes/origin/task/remote-default');
  assert.equal((await f.call('admit', { taskId: 'rejected', repoPath: repo })).error, 'DEFAULT_BRANCH_REJECTED');
});

test('standalone validation rejects linked worktrees and detached HEAD', async t => {
  const f = await fixture(t);
  const repo = repository(f.root);
  git(repo, 'add', '.');
  git(repo, '-c', 'user.name=Test', '-c', 'user.email=test@example.invalid', 'commit', '-m', 'initial');
  const worktree = path.join(f.root, 'worktree');
  git(repo, 'worktree', 'add', '-b', 'task/linked', worktree);
  assert.equal((await f.call('admit', { taskId: 'linked', repoPath: worktree })).error, 'NOT_STANDALONE_REPOSITORY');
  git(repo, 'checkout', '--detach');
  assert.equal((await f.call('admit', { taskId: 'detached', repoPath: repo })).error, 'INVALID_REPOSITORY');
});

test('cleanup cannot run without an explicitly configured root or recorded repository', async t => {
  const f = await fixture(t);
  const state = f.read();
  state.config.approvedRoot = null;
  f.write(state);
  const repo = repository(f.root);
  assert.equal((await f.call('admit', { taskId: 'repo', repoPath: repo })).error, 'CLEANUP_ROOT_NOT_CONFIGURED');
  const task = await f.call('admit', { taskId: 'task' });
  const child = await childFor(t, task);
  await f.call('heartbeat', { taskId: 'task', pid: child.pid });
  assert.equal((await f.call('terminate', { taskId: 'task', repoPath: repo })).cleanup.status, 'not-recorded');
  assert.equal(fs.existsSync(repo), true);
});

test('redaction removes sensitive fields and token-like values recursively', () => {
  const raw = 'sk-abcdefghijklmnopqrstuvwxyz123456';
  const result = redact({ apiKey: raw, password: 123, token: 'plain', providerToken: 'plain', privateKey: 'plain', headers: { Authorization: 'Bearer abc' }, response: [raw, 'ghp_abcdefghijklmnopqrstuvwxyz123456', 'eyJabc.abc.def', 'a'.repeat(40)], tokens: 20, inputTokens: 10 });
  assert.equal(result.apiKey, '[REDACTED]');
  assert.equal(result.password, '[REDACTED]');
  assert.equal(result.token, '[REDACTED]');
  assert.equal(result.providerToken, '[REDACTED]');
  assert.equal(result.privateKey, '[REDACTED]');
  assert.equal(result.headers.Authorization, '[REDACTED]');
  assert.ok(result.response.every(value => value === '[REDACTED]'));
  assert.equal(result.tokens, 20);
  assert.equal(result.inputTokens, 10);
});

test('raw secrets in unknown input, provider errors, IDs and CLI parse errors are never stored or printed', async t => {
  const f = await fixture(t);
  const raw = 'sk-abcdefghijklmnopqrstuvwxyz123456';
  await f.call('admit', { taskId: 'safe', ...cloud, apiKey: raw, metadata: { token: raw } });
  await f.call('provider-result', { taskId: 'safe', success: false, error: raw, response: raw });
  for (const input of [{ taskId: raw }, { taskId: 'safe', pid: raw }, { taskId: 'safe', inputTokens: raw }]) {
    assert.equal(JSON.stringify(await f.call('heartbeat', input)).includes(raw), false);
  }
  assert.equal(fs.readFileSync(f.statePath, 'utf8').includes(raw), false);
  for (const text of [JSON.stringify({ taskId: raw }), `{"token":"${raw}"`, JSON.stringify({ taskId: 'safe', apiKey: raw })]) {
    const result = spawnSync(process.execPath, [bin, 'heartbeat', '--state', f.statePath], { input: text, encoding: 'utf8' });
    assert.equal((result.stdout + result.stderr).includes(raw), false);
    assert.equal(result.stderr, '');
    assert.doesNotThrow(() => JSON.parse(result.stdout));
  }
});

test('invalid usage cannot roll back accounting and heartbeat errors fail closed', async t => {
  const f = await fixture(t);
  await f.call('admit', { taskId: 'task', ...cloud });
  await f.call('heartbeat', { taskId: 'task', inputTokens: 10, toolCalls: 2 });
  for (const usage of [{ inputTokens: 9 }, { toolCalls: 1 }, { usd: 0.01 }, { outputTokens: -1 }, { toolCalls: 0.5 }, { inputTokens: Number.MAX_SAFE_INTEGER + 1 }]) {
    const before = fs.readFileSync(f.statePath, 'utf8');
    const result = await f.call('heartbeat', { taskId: 'task', ...usage });
    assert.equal(result.ok, false);
    assert.equal(result.decision, 'terminate');
    assert.equal(fs.readFileSync(f.statePath, 'utf8'), before);
  }
});

test('finish retains accounting, terminal tasks reject further usage and IDs cannot be reused', async t => {
  const f = await fixture(t);
  await f.call('admit', { taskId: 'task', ...cloud });
  assert.equal((await f.call('finish', { taskId: 'task', inputTokens: 10 })).decision, 'continue');
  assert.equal(f.read().tasks.task.status, 'finished');
  assert.equal(f.read().tasks.task.usage.usd, 0.1);
  assert.equal((await f.call('heartbeat', { taskId: 'task' })).error, 'TASK_NOT_ACTIVE');
  assert.equal((await f.call('admit', { taskId: 'task' })).error, 'TASK_ALREADY_EXISTS');
});

test('state lock fails closed and is not stolen or deleted', async t => {
  const f = await fixture(t);
  fs.writeFileSync(f.statePath + '.lock', 'operator-owned', { mode: 0o600 });
  const result = await f.call('heartbeat', { taskId: 'task' });
  assert.equal(result.error, 'STATE_LOCKED');
  assert.equal(result.decision, 'terminate');
  assert.equal(fs.readFileSync(f.statePath + '.lock', 'utf8'), 'operator-owned');
});

for (const scenario of ['version', 'malformed', 'permissions', 'symlink', 'hardlink']) {
  test(`unsafe state rejected: ${scenario}`, async t => {
    const f = await fixture(t);
    if (scenario === 'version') { const state = f.read(); state.version = 99; f.write(state); }
    if (scenario === 'malformed') fs.writeFileSync(f.statePath, '{');
    if (scenario === 'permissions') fs.chmodSync(f.statePath, 0o644);
    if (scenario === 'symlink') { fs.renameSync(f.statePath, f.statePath + '.real'); fs.symlinkSync(f.statePath + '.real', f.statePath); }
    if (scenario === 'hardlink') fs.linkSync(f.statePath, f.statePath + '.link');
    const result = await f.call('heartbeat', { taskId: 'task' });
    assert.equal(result.ok, false);
    assert.equal(result.decision, 'terminate');
  });
}

test('invalid config is rejected without creating state', async t => {
  const f = await fixture(t);
  for (const config of [
    { alertRatio: 1 }, { cooldownMs: 0 }, { failureThreshold: 0 }, { dailyCloudUsd: -1 },
    { caps: { ...limits, tokens: 0 } }, { pricing: { example: { ...rate, effectiveDate: '2026-02-30' } } },
    { pricing: { example: { ...rate, version: undefined } } }, { pricing: { example: { ...rate, inputPerMillion: -1 } } }
  ]) {
    const statePath = path.join(f.dir, 'invalid.json');
    assert.equal((await execute('init', config, { statePath, now: time })).ok, false);
    assert.equal(fs.existsSync(statePath), false);
  }
});

test('CLI emits one JSON result with meaningful exit codes and no stderr', async t => {
  const f = await fixture(t);
  const invoke = (command, input) => spawnSync(process.execPath, [bin, command, '--state', f.statePath], { input: JSON.stringify(input), encoding: 'utf8' });
  const admitted = invoke('admit', { taskId: 'cli' });
  assert.equal(admitted.status, 0);
  assert.equal(JSON.parse(admitted.stdout).mode, 'local');
  const breached = invoke('heartbeat', { taskId: 'cli', inputTokens: 100 });
  assert.equal(breached.status, 0);
  assert.equal(JSON.parse(breached.stdout).decision, 'terminate');
  const denied = invoke('admit', { taskId: 'cloud', mode: 'cloud' });
  assert.equal(denied.status, 1);
  assert.equal(JSON.parse(denied.stdout).error, 'CLOUD_OPT_IN_REQUIRED');
  assert.equal(admitted.stderr + breached.stderr + denied.stderr, '');
});

test('cleanup retry revalidates repo after verified process stop without signaling another process', async t => {
  const f = await fixture(t);
  const repo = repository(f.root);
  const task = await f.call('admit', { taskId: 'retry', repoPath: repo });
  const child = await childFor(t, task);
  await f.call('heartbeat', { taskId: 'retry', pid: child.pid });
  const file = path.join(repo, '.openclaw-task-guard.json');
  const saved = fs.readFileSync(file);
  fs.writeFileSync(file, '{}');
  assert.equal((await f.call('terminate', { taskId: 'retry' })).cleanup.reason, 'SENTINEL_MISMATCH');
  fs.writeFileSync(file, saved);
  assert.equal((await f.call('terminate', { taskId: 'retry' })).cleanup.status, 'cleaned');
  assert.equal(fs.existsSync(repo), false);
});

test('finishing an unresolved half-open probe reopens with a new cooldown', async t => {
  const f = await fixture(t, { failureThreshold: 1 });
  await f.call('admit', { taskId: 'initial', ...cloud });
  await f.call('provider-result', { taskId: 'initial', success: false });
  await f.call('admit', { taskId: 'probe', ...cloud }, time + 60000);
  await f.call('finish', { taskId: 'probe' }, time + 60001);
  assert.equal(f.read().providers.example.state, 'open');
  assert.equal((await f.call('admit', { taskId: 'blocked', ...cloud }, time + 60002)).error, 'CIRCUIT_OPEN');
  assert.equal((await f.call('admit', { taskId: 'new-probe', ...cloud }, time + 120001)).circuit, 'half-open');
});

test('final usage cannot hide a cap violation and failure details survive finish', async t => {
  const f = await fixture(t);
  await f.call('admit', { taskId: 'task' });
  assert.equal((await f.call('finish', { taskId: 'task', toolCalls: 10 })).decision, 'terminate');
  assert.equal(f.read().tasks.task.status, 'failed');
  assert.deepEqual(f.read().tasks.task.terminationReason.breaches, ['toolCalls']);
});

test('corrupt budget state fails closed rather than silently disabling enforcement', async t => {
  const f = await fixture(t);
  await f.call('admit', { taskId: 'task' });
  const state = f.read();
  state.tasks.task.caps.tokens = null;
  f.write(state);
  const result = await f.call('heartbeat', { taskId: 'task' });
  assert.equal(result.ok, false);
  assert.equal(result.decision, 'terminate');
});

test('concurrent mutations fail closed under the lock and retry preserves accounting', async t => {
  const f = await fixture(t);
  const results = await Promise.all([
    f.call('admit', { taskId: 'a', ...cloud }),
    f.call('admit', { taskId: 'b', ...cloud })
  ]);
  assert.equal(results.filter(result => result.ok).length, 1);
  assert.equal(results[1].error, 'STATE_LOCKED');
  assert.equal((await f.call('admit', { taskId: 'b', ...cloud })).ok, true);
  const accounted = await Promise.all([
    f.call('heartbeat', { taskId: 'a', usd: 0.2 }),
    f.call('heartbeat', { taskId: 'b', usd: 0.3 })
  ]);
  assert.equal(accounted[1].error, 'STATE_LOCKED');
  await f.call('heartbeat', { taskId: 'b', usd: 0.3 });
  assert.equal(f.read().dailySpend['2026-11-22'], 0.5);
});

test('noncanonical paths, dangling state symlinks, and state inside cleanup root are rejected', async t => {
  const f = await fixture(t);
  assert.equal((await execute('init', {}, { statePath: `${f.dir}/../bad-state.json` })).error, 'NONCANONICAL_PATH');
  const link = path.join(f.dir, 'dangling.json');
  fs.symlinkSync(path.join(f.dir, 'absent'), link);
  assert.equal((await execute('init', {}, { statePath: link })).error, 'STATE_ALREADY_EXISTS');
  assert.equal(fs.lstatSync(link).isSymbolicLink(), true);
  assert.equal((await execute('init', { approvedRoot: f.root }, { statePath: path.join(f.root, 'state.json') })).error, 'STATE_INSIDE_CLEANUP_ROOT');
});

test('executable bin works through a package-manager-style symlink', async t => {
  const f = await fixture(t);
  const link = path.join(f.dir, 'openclaw-task-guard');
  fs.symlinkSync(bin, link);
  const result = spawnSync(link, ['admit', '--state', f.statePath], { input: '{"taskId":"symlink-cli"}', encoding: 'utf8' });
  assert.equal(result.status, 0);
  assert.equal(JSON.parse(result.stdout).decision, 'admit');
  assert.equal(result.stderr, '');
});
