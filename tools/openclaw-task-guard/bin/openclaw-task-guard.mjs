#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const VERSION = 1;
const MAX_INPUT = 64 * 1024;
const commands = new Set(['init', 'admit', 'heartbeat', 'provider-result', 'finish', 'terminate']);
const secret = /(?:bearer\s+\S+|\b(?:sk|pk|ghp|gho|github_pat|xox[baprs])[-_][a-z0-9_-]{8,}|\beyJ[a-z0-9_-]+\.[a-z0-9_-]+\.[a-z0-9_-]+|[a-z0-9_]{32,}|(?:api[_-]?key|password|secret|token)\s*[:=]\s*\S+)/i;
const sensitiveKey = /secret|password|authorization|cookie|credential|(?:api|private).?key|session.?id|token/i;

class GuardError extends Error {
  constructor(code) { super(code); this.code = code; }
}
function fail(code) { throw new GuardError(code); }
function requireThat(test, code) { if (!test) fail(code); }
function number(value, code, { positive = false, integer = false } = {}) {
  requireThat(typeof value === 'number' && Number.isFinite(value) && value >= 0 &&
    (!positive || value > 0) && (!integer || Number.isSafeInteger(value)), code);
  return value;
}
function id(value) {
  requireThat(typeof value === 'string' && /^[a-zA-Z0-9][a-zA-Z0-9_.-]{0,79}$/.test(value) && !secret.test(value), 'INVALID_ID');
  return value;
}
export function redact(value, key = '') {
  if (sensitiveKey.test(key) && !(['tokens', 'inputTokens', 'outputTokens'].includes(key) && typeof value === 'number')) return '[REDACTED]';
  if (typeof value === 'string') return secret.test(value) ? '[REDACTED]' : value;
  if (Array.isArray(value)) return value.map(item => redact(item));
  if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, redact(v, k)]));
  return value;
}
function safePath(value) {
  requireThat(typeof value === 'string' && path.isAbsolute(value) && !secret.test(value) && !/[\x00-\x1f]/.test(value), 'INVALID_PATH');
  requireThat(path.resolve(value) === value, 'NONCANONICAL_PATH');
  return path.resolve(value);
}
function branchName(value) {
  requireThat(typeof value === 'string' && /^[a-zA-Z0-9][a-zA-Z0-9_./-]{0,199}$/.test(value) && !secret.test(value), 'INVALID_BRANCH');
  return value;
}
function taskBranchPolicy(value) {
  requireThat(value?.version === 1, 'UNSUPPORTED_TASK_BRANCH_POLICY_VERSION');
  requireThat(Array.isArray(value.prefixes) && value.prefixes.length > 0 &&
    value.prefixes.every(prefix => typeof prefix === 'string' &&
      /^[a-zA-Z0-9][a-zA-Z0-9_-]{0,78}\/$/.test(prefix) && !secret.test(prefix)), 'INVALID_TASK_BRANCH_PREFIXES');
  return { version: 1, prefixes: [...new Set(value.prefixes)] };
}
function noSymlinks(target) {
  const absolute = safePath(target);
  let current = path.parse(absolute).root;
  for (const part of absolute.slice(current.length).split(path.sep).filter(Boolean)) {
    current = path.join(current, part);
    requireThat(!fs.lstatSync(current).isSymbolicLink(), 'SYMLINK_REJECTED');
  }
  requireThat(fs.realpathSync(absolute) === absolute, 'NONCANONICAL_PATH');
  return absolute;
}
function caps(value) {
  requireThat(value && typeof value === 'object', 'INVALID_CAPS');
  const result = {};
  for (const key of ['tokens', 'wallMs', 'toolCalls', 'usd']) {
    result[key] = number(value[key], 'INVALID_CAPS', { positive: true, integer: key !== 'usd' });
  }
  return result;
}
function pricing(value) {
  requireThat(value && typeof value === 'object', 'INVALID_PRICING');
  requireThat(typeof value.effectiveDate === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value.effectiveDate) &&
    new Date(value.effectiveDate).toISOString().slice(0, 10) === value.effectiveDate, 'INVALID_PRICING_DATE');
  return {
    version: id(value.version), effectiveDate: value.effectiveDate,
    inputPerMillion: number(value.inputPerMillion, 'INVALID_PRICING'),
    outputPerMillion: number(value.outputPerMillion, 'INVALID_PRICING')
  };
}
function git(repo, args, optional = false) {
  const env = Object.fromEntries(Object.entries(process.env).filter(([key]) => !key.startsWith('GIT_')));
  Object.assign(env, { GIT_CONFIG_NOSYSTEM: '1', GIT_CONFIG_GLOBAL: '/dev/null', GIT_TERMINAL_PROMPT: '0' });
  try {
    return execFileSync('git', ['--no-optional-locks', ...args], {
      cwd: repo, env, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], timeout: 5000, maxBuffer: MAX_INPUT
    }).trim();
  } catch { if (optional) return ''; fail('INVALID_REPOSITORY'); }
}
function inspectRepo(config, repoPath) {
  requireThat(config.approvedRoot, 'CLEANUP_ROOT_NOT_CONFIGURED');
  const root = noSymlinks(config.approvedRoot);
  const repo = noSymlinks(repoPath);
  requireThat(repo !== root && repo.startsWith(root + path.sep), 'REPOSITORY_OUTSIDE_ROOT');
  const gitDir = path.join(repo, '.git');
  requireThat(fs.lstatSync(gitDir).isDirectory(), 'NOT_STANDALONE_REPOSITORY');
  noSymlinks(gitDir);
  requireThat(git(repo, ['rev-parse', '--show-toplevel']) === repo &&
    git(repo, ['rev-parse', '--absolute-git-dir']) === gitDir &&
    git(repo, ['rev-parse', '--is-bare-repository']) === 'false', 'NOT_STANDALONE_REPOSITORY');
  requireThat(!fs.existsSync(path.join(gitDir, 'commondir')), 'NOT_STANDALONE_REPOSITORY');
  const branch = git(repo, ['symbolic-ref', '--quiet', '--short', 'HEAD']);
  const remoteDefault = git(repo, ['symbolic-ref', '--quiet', '--short', 'refs/remotes/origin/HEAD'], true).replace(/^origin\//, '');
  const initDefault = git(repo, ['config', '--get', 'init.defaultBranch'], true);
  requireThat(![...config.defaultBranches, remoteDefault, initDefault].includes(branch), 'DEFAULT_BRANCH_REJECTED');
  requireThat(config.taskBranchPolicy.prefixes.some(prefix => branch.startsWith(prefix) && branch.length > prefix.length), 'TASK_BRANCH_REQUIRED');
  requireThat(!secret.test(branch), 'INVALID_BRANCH');
  const repoStat = fs.statSync(repo);
  const gitStat = fs.statSync(gitDir);
  return { path: repo, gitDir, branch, device: repoStat.dev, inode: repoStat.ino, gitDevice: gitStat.dev, gitInode: gitStat.ino };
}
function sentinel(task) {
  return { version: VERSION, taskId: task.id, runId: task.runId, ...task.repo };
}
function scanTree(directory) {
  for (const entry of fs.readdirSync(directory)) {
    const child = path.join(directory, entry);
    const stat = fs.lstatSync(child);
    requireThat(!stat.isSymbolicLink(), 'SYMLINK_REJECTED');
    if (stat.isDirectory()) scanTree(child);
    else requireThat(stat.isFile(), 'SPECIAL_FILE_REJECTED');
  }
}
function cleanup(state, task) {
  const inspected = inspectRepo(state.config, task.repo.path);
  requireThat(JSON.stringify(inspected) === JSON.stringify(task.repo), 'REPOSITORY_IDENTITY_MISMATCH');
  const file = path.join(inspected.path, '.openclaw-task-guard.json');
  const stat = fs.lstatSync(file);
  requireThat(stat.isFile() && !stat.isSymbolicLink() && stat.nlink === 1, 'INVALID_SENTINEL');
  requireThat(fs.readFileSync(file, 'utf8') === JSON.stringify(sentinel(task)) + '\n', 'SENTINEL_MISMATCH');
  scanTree(inspected.path);
  fs.rmSync(inspected.path, { recursive: true });
}
function processIdentity(pid, task) {
  requireThat(Number.isSafeInteger(pid) && pid > 1 && pid !== process.pid, 'INVALID_PID');
  let stat, environment;
  try {
    requireThat(fs.statSync(`/proc/${pid}`).uid === process.getuid(), 'PROCESS_OWNER_MISMATCH');
    stat = fs.readFileSync(`/proc/${pid}/stat`, 'utf8');
    environment = fs.readFileSync(`/proc/${pid}/environ`, 'utf8').split('\0');
  } catch (error) { if (error instanceof GuardError) throw error; fail('PROCESS_NOT_FOUND'); }
  requireThat(environment.includes(`OPENCLAW_TASK_ID=${task.id}`) &&
    environment.includes(`OPENCLAW_TASK_RUN_ID=${task.runId}`), 'PROCESS_IDENTITY_MISMATCH');
  const fields = stat.slice(stat.lastIndexOf(')') + 2).split(' ');
  requireThat(fields[0] !== 'Z', 'PROCESS_NOT_FOUND');
  const second = fs.readFileSync(`/proc/${pid}/stat`, 'utf8');
  requireThat(second.slice(second.lastIndexOf(')') + 2).split(' ')[19] === fields[19], 'PROCESS_IDENTITY_MISMATCH');
  return { pid, startTime: fields[19], bootId: fs.readFileSync('/proc/sys/kernel/random/boot_id', 'utf8').trim() };
}
function stillRunning(identity) {
  try {
    const stat = fs.readFileSync(`/proc/${identity.pid}/stat`, 'utf8');
    const fields = stat.slice(stat.lastIndexOf(')') + 2).split(' ');
    return fields[0] !== 'Z' && fields[19] === identity.startTime;
  } catch (error) { if (error.code === 'ENOENT' || error.code === 'ESRCH') return false; throw error; }
}
async function stop(task) {
  requireThat(task.process, 'PROCESS_NOT_RECORDED');
  requireThat(JSON.stringify(processIdentity(task.process.pid, task)) === JSON.stringify(task.process), 'PROCESS_IDENTITY_MISMATCH');
  process.kill(task.process.pid, 'SIGTERM');
  const deadline = Date.now() + 500;
  while (stillRunning(task.process) && Date.now() < deadline) await new Promise(resolve => setTimeout(resolve, 20));
  if (stillRunning(task.process)) {
    requireThat(JSON.stringify(processIdentity(task.process.pid, task)) === JSON.stringify(task.process), 'PROCESS_IDENTITY_MISMATCH');
    process.kill(task.process.pid, 'SIGKILL');
    const killDeadline = Date.now() + 2000;
    while (stillRunning(task.process) && Date.now() < killDeadline) await new Promise(resolve => setTimeout(resolve, 20));
  }
  requireThat(!stillRunning(task.process), 'PROCESS_STOP_FAILED');
}
function atomicWrite(file, state) {
  const temp = `${file}.${crypto.randomUUID()}.tmp`;
  let fd;
  try {
    fd = fs.openSync(temp, fs.constants.O_WRONLY | fs.constants.O_CREAT | fs.constants.O_EXCL | fs.constants.O_NOFOLLOW, 0o600);
    fs.fchmodSync(fd, 0o600);
    fs.writeFileSync(fd, JSON.stringify(state, null, 2) + '\n');
    fs.fsyncSync(fd);
    fs.closeSync(fd); fd = undefined;
    fs.renameSync(temp, file);
    const directory = fs.openSync(path.dirname(file), 'r');
    try { fs.fsyncSync(directory); } finally { fs.closeSync(directory); }
  } finally {
    if (fd !== undefined) fs.closeSync(fd);
    if (fs.existsSync(temp)) fs.unlinkSync(temp);
  }
}
function validateState(state) {
  requireThat(state?.version === VERSION, 'UNSUPPORTED_STATE_VERSION');
  const object = value => value && typeof value === 'object' && !Array.isArray(value);
  requireThat(object(state.config) && object(state.tasks) && object(state.providers) && object(state.dailySpend), 'INVALID_STATE');
  const config = state.config;
  caps(config.caps);
  number(config.dailyCloudUsd, 'INVALID_STATE', { positive: true });
  number(config.alertRatio, 'INVALID_STATE', { positive: true });
  requireThat(config.alertRatio < 1, 'INVALID_STATE');
  number(config.failureThreshold, 'INVALID_STATE', { positive: true, integer: true });
  number(config.cooldownMs, 'INVALID_STATE', { positive: true, integer: true });
  requireThat(Array.isArray(config.defaultBranches) && config.defaultBranches.includes('main') && config.defaultBranches.includes('master') && object(config.pricing), 'INVALID_STATE');
  config.defaultBranches.forEach(branchName);
  taskBranchPolicy(config.taskBranchPolicy);
  if (config.approvedRoot !== null) safePath(config.approvedRoot);
  for (const [provider, entry] of Object.entries(config.pricing)) { id(provider); pricing(entry); }
  for (const [day, spend] of Object.entries(state.dailySpend)) {
    requireThat(/^\d{4}-\d{2}-\d{2}$/.test(day), 'INVALID_STATE');
    number(spend, 'INVALID_STATE');
  }
  for (const [provider, breaker] of Object.entries(state.providers)) {
    id(provider);
    requireThat(object(breaker) && ['closed', 'open', 'half-open'].includes(breaker.state), 'INVALID_STATE');
    number(breaker.failures, 'INVALID_STATE', { integer: true });
    if (breaker.state !== 'closed') number(breaker.openedAt, 'INVALID_STATE', { integer: true });
    if (breaker.state === 'half-open') id(breaker.probeTask);
  }
  for (const [taskId, task] of Object.entries(state.tasks)) {
    requireThat(object(task) && task.id === id(taskId) && typeof task.runId === 'string' && /^[0-9a-f-]{36}$/.test(task.runId) &&
      ['local', 'cloud'].includes(task.mode) && ['active', 'finished', 'failed', 'terminated'].includes(task.status), 'INVALID_STATE');
    caps(task.caps);
    requireThat(Object.keys(task.caps).every(key => task.caps[key] <= config.caps[key]), 'INVALID_STATE');
    number(task.startedAt, 'INVALID_STATE', { integer: true });
    requireThat(object(task.usage), 'INVALID_STATE');
    for (const key of ['inputTokens', 'outputTokens', 'toolCalls', 'usd']) number(task.usage[key], 'INVALID_STATE', { integer: key !== 'usd' });
    if (task.mode === 'cloud') {
      id(task.provider); pricing(task.pricing);
      requireThat(Object.hasOwn(state.providers, task.provider), 'INVALID_STATE');
    }
    if (task.process !== null) {
      requireThat(object(task.process) && Number.isSafeInteger(task.process.pid) && task.process.pid > 1 &&
        typeof task.process.startTime === 'string' && /^\d+$/.test(task.process.startTime) &&
        typeof task.process.bootId === 'string' && /^[0-9a-f-]{36}$/.test(task.process.bootId), 'INVALID_STATE');
    }
    requireThat(!task.processStopped || task.process, 'INVALID_STATE');
    if (task.repo !== null) {
      requireThat(object(task.repo), 'INVALID_STATE');
      safePath(task.repo.path); safePath(task.repo.gitDir); branchName(task.repo.branch);
      for (const key of ['device', 'inode', 'gitDevice', 'gitInode']) number(task.repo[key], 'INVALID_STATE', { integer: true });
    }
  }
}
function taskFor(state, input) {
  const taskId = id(input.taskId);
  requireThat(Object.hasOwn(state.tasks, taskId), 'TASK_NOT_FOUND');
  const task = state.tasks[taskId];
  return task;
}
function active(task) { requireThat(task.status === 'active', 'TASK_NOT_ACTIVE'); }
function releaseProbe(state, task, now) {
  const breaker = task.provider && state.providers[task.provider];
  if (breaker?.state === 'half-open' && breaker.probeTask === task.id) {
    Object.assign(breaker, { state: 'open', openedAt: now, probeTask: null });
  }
}
function measure(task, now, alertRatio) {
  const usage = { tokens: task.usage.inputTokens + task.usage.outputTokens, wallMs: Math.max(0, now - task.startedAt), toolCalls: task.usage.toolCalls, usd: task.usage.usd };
  const breaches = Object.keys(usage).filter(key => usage[key] >= task.caps[key]);
  const alerts = Object.keys(usage).filter(key => usage[key] >= task.caps[key] * alertRatio);
  return { decision: breaches.length ? 'terminate' : 'continue', breaches, alerts, usage, caps: task.caps };
}
function account(state, task, input, now) {
  const next = { ...task.usage };
  for (const key of ['inputTokens', 'outputTokens', 'toolCalls']) {
    if (input[key] !== undefined) {
      next[key] = number(input[key], 'INVALID_USAGE', { integer: true });
      requireThat(next[key] >= task.usage[key], 'USAGE_MUST_BE_MONOTONIC');
    }
  }
  const reported = input.usd === undefined ? task.usage.usd : number(input.usd, 'INVALID_USAGE');
  requireThat(reported >= task.usage.usd, 'USAGE_MUST_BE_MONOTONIC');
  const estimated = task.pricing ? (next.inputTokens * task.pricing.inputPerMillion + next.outputTokens * task.pricing.outputPerMillion) / 1e6 : 0;
  next.usd = Math.max(reported, estimated);
  requireThat(Number.isFinite(next.usd) && Number.isSafeInteger(next.inputTokens + next.outputTokens), 'INVALID_USAGE');
  if (task.mode === 'cloud') {
    const day = new Date(now).toISOString().slice(0, 10);
    const total = (state.dailySpend[day] ?? 0) + (next.usd - task.usage.usd);
    requireThat(Number.isFinite(total) && total <= Number.MAX_SAFE_INTEGER, 'INVALID_USAGE');
    state.dailySpend[day] = total;
  }
  task.usage = next;
}
function configFrom(input) {
  const config = {
    caps: caps(input.caps ?? { tokens: 100000, wallMs: 3600000, toolCalls: 100, usd: 5 }),
    dailyCloudUsd: number(input.dailyCloudUsd ?? 10, 'INVALID_DAILY_CAP', { positive: true }),
    alertRatio: number(input.alertRatio ?? 0.8, 'INVALID_ALERT_RATIO', { positive: true }),
    failureThreshold: number(input.failureThreshold ?? 3, 'INVALID_FAILURE_THRESHOLD', { positive: true, integer: true }),
    cooldownMs: number(input.cooldownMs ?? 60000, 'INVALID_COOLDOWN', { positive: true, integer: true }),
    approvedRoot: input.approvedRoot === undefined ? null : noSymlinks(input.approvedRoot),
    taskBranchPolicy: taskBranchPolicy(input.taskBranchPolicy === undefined ? { version: 1, prefixes: ['nad/', 'task/'] } : input.taskBranchPolicy),
    defaultBranches: [...new Set(['main', 'master', ...(input.defaultBranches ?? []).map(branchName)])], pricing: {}
  };
  requireThat(config.alertRatio < 1, 'INVALID_ALERT_RATIO');
  if (config.approvedRoot) requireThat(fs.statSync(config.approvedRoot).isDirectory(), 'INVALID_ROOT');
  for (const [provider, entry] of Object.entries(input.pricing ?? {})) {
    config.pricing[id(provider)] = pricing(entry);
  }
  return config;
}
async function apply(state, command, input, now) {
  if (command === 'admit') {
    const taskId = id(input.taskId);
    requireThat(!Object.hasOwn(state.tasks, taskId), 'TASK_ALREADY_EXISTS');
    const mode = input.mode ?? 'local';
    requireThat(mode === 'local' || mode === 'cloud', 'INVALID_MODE');
    let provider, rate, breaker;
    if (mode === 'cloud') {
      requireThat(input.cloudOptIn === true, 'CLOUD_OPT_IN_REQUIRED');
      provider = id(input.provider);
      rate = state.config.pricing[provider];
      requireThat(rate && Object.hasOwn(state.config.pricing, provider), 'PRICING_REQUIRED');
      requireThat((state.dailySpend[new Date(now).toISOString().slice(0, 10)] ?? 0) < state.config.dailyCloudUsd, 'DAILY_CLOUD_CAP');
      breaker = Object.hasOwn(state.providers, provider) ? state.providers[provider] : { failures: 0, state: 'closed', openedAt: null, probeTask: null };
      if (breaker.state === 'open') requireThat(now >= breaker.openedAt + state.config.cooldownMs, 'CIRCUIT_OPEN');
      requireThat(breaker.state !== 'half-open', 'CIRCUIT_PROBE_IN_PROGRESS');
    }
    const limits = input.caps ? caps(input.caps) : { ...state.config.caps };
    requireThat(Object.keys(limits).every(key => limits[key] <= state.config.caps[key]), 'CAP_EXCEEDS_CONFIG');
    const task = {
      id: taskId, runId: crypto.randomUUID(), mode, provider: provider ?? null,
      pricing: rate ? { ...rate } : null, caps: limits, startedAt: now, status: 'active',
      usage: { inputTokens: 0, outputTokens: 0, toolCalls: 0, usd: 0 }, process: null, repo: null,
      terminationReason: null, cleanup: null
    };
    if (input.repoPath !== undefined) {
      task.repo = inspectRepo(state.config, safePath(input.repoPath));
      fs.writeFileSync(path.join(task.repo.path, '.openclaw-task-guard.json'), JSON.stringify(sentinel(task)) + '\n', { flag: 'wx', mode: 0o600 });
    }
    if (breaker) {
      if (breaker.state === 'open') { breaker.state = 'half-open'; breaker.probeTask = taskId; }
      state.providers[provider] = breaker;
    }
    state.tasks[taskId] = task;
    return { ok: true, decision: 'admit', taskId, runId: task.runId, mode, caps: limits, circuit: breaker?.state ?? null };
  }
  const task = taskFor(state, input);
  if (command === 'heartbeat' || command === 'finish') {
    active(task);
    // Validate all usage and process input before committing any accounting changes.
    const identity = input.pid === undefined ? null : processIdentity(input.pid, task);
    if (identity && task.process) requireThat(JSON.stringify(identity) === JSON.stringify(task.process), 'PROCESS_ALREADY_RECORDED');
    account(state, task, input, now);
    if (identity) task.process = identity;
    const result = measure(task, now, state.config.alertRatio);
    if (result.decision === 'terminate') task.terminationReason ??= { code: 'HARD_CAP', breaches: result.breaches, at: now };
    if (task.terminationReason) result.decision = 'terminate';
    if (command === 'finish') {
      task.status = task.terminationReason ? 'failed' : 'finished';
      task.finishedAt = now;
      releaseProbe(state, task, now);
    }
    return { ok: true, taskId: task.id, ...result };
  }
  if (command === 'provider-result') {
    active(task);
    requireThat(task.mode === 'cloud' && typeof input.success === 'boolean', 'INVALID_PROVIDER_RESULT');
    const breaker = state.providers[task.provider];
    // Results from older in-flight requests cannot close another task's probe.
    if (breaker.state === 'half-open' && breaker.probeTask !== task.id) return { ok: true, circuit: breaker.state, ignored: true };
    if (input.success) {
      if (breaker.state !== 'open') Object.assign(breaker, { failures: 0, state: 'closed', openedAt: null, probeTask: null });
    } else {
      breaker.failures++;
      if (breaker.failures >= state.config.failureThreshold || breaker.state === 'half-open') {
        Object.assign(breaker, { state: 'open', openedAt: now, probeTask: null });
      }
    }
    return { ok: true, circuit: breaker.state, failures: breaker.failures, retryAt: breaker.openedAt === null ? null : breaker.openedAt + state.config.cooldownMs };
  }
  if (command === 'terminate') {
    if (task.status === 'terminated') return { ok: true, taskId: task.id, decision: 'terminated', cleanup: task.cleanup };
    task.terminationReason ??= { code: 'REQUESTED', at: now };
    releaseProbe(state, task, now);
    try {
      if (task.processStopped) requireThat(!stillRunning(task.process), 'PROCESS_STILL_RUNNING');
      else await stop(task);
      task.processStopped = true;
      if (task.repo) {
        cleanup(state, task);
        task.cleanup = { status: 'cleaned', at: now };
      } else task.cleanup = { status: 'not-recorded', at: now };
      task.status = 'terminated';
      task.finishedAt = now;
      return { ok: true, taskId: task.id, decision: 'terminated', cleanup: task.cleanup };
    } catch (error) {
      task.cleanup = { status: 'rejected', reason: error instanceof GuardError ? error.code : 'CLEANUP_FAILED', at: now };
      return { ok: false, taskId: task.id, decision: 'manual-intervention', cleanup: task.cleanup };
    }
  }
  fail('UNKNOWN_COMMAND');
}

// A fail-closed exclusive lock serializes admission, accounting and cleanup.
// A crash leaves a lock for an operator to inspect; it is never stolen by age.
export async function execute(command, input, { statePath, now = Date.now() } = {}) {
  let lock, lockPath;
  try {
    requireThat(commands.has(command), 'UNKNOWN_COMMAND');
    requireThat(input && typeof input === 'object' && !Array.isArray(input), 'INVALID_INPUT');
    requireThat(Number.isSafeInteger(now) && now >= 0, 'INVALID_TIME');
    const file = safePath(statePath);
    noSymlinks(path.dirname(file));
    lockPath = `${file}.lock`;
    try { lock = fs.openSync(lockPath, fs.constants.O_WRONLY | fs.constants.O_CREAT | fs.constants.O_EXCL | fs.constants.O_NOFOLLOW, 0o600); }
    catch { fail('STATE_LOCKED'); }
    let state;
    if (command === 'init') {
      requireThat(!fs.lstatSync(file, { throwIfNoEntry: false }), 'STATE_ALREADY_EXISTS');
      state = { version: VERSION, config: configFrom(input), tasks: {}, providers: {}, dailySpend: {} };
      requireThat(!state.config.approvedRoot || !file.startsWith(state.config.approvedRoot + path.sep), 'STATE_INSIDE_CLEANUP_ROOT');
    } else {
      const stat = fs.lstatSync(file);
      requireThat(stat.isFile() && !stat.isSymbolicLink() && stat.nlink === 1 && (stat.mode & 0o777) === 0o600 && stat.uid === process.getuid(), 'UNSAFE_STATE_FILE');
      state = JSON.parse(fs.readFileSync(file, 'utf8'));
      validateState(state);
    }
    const result = command === 'init' ? { ok: true, version: VERSION } : await apply(state, command, input, now);
    atomicWrite(file, state);
    return redact(result);
  } catch (error) {
    return { ok: false, error: error instanceof GuardError ? error.code : 'INVALID_INPUT_OR_STATE', ...(command === 'heartbeat' ? { decision: 'terminate' } : {}) };
  } finally {
    if (lock !== undefined) { fs.closeSync(lock); fs.unlinkSync(lockPath); }
  }
}
async function main() {
  try {
    const [command, flag, statePath, ...extra] = process.argv.slice(2);
    requireThat(flag === '--state' && statePath && extra.length === 0, 'USAGE_COMMAND_--state_PATH_JSON_ON_STDIN');
    let text = '';
    for await (const chunk of process.stdin) {
      text += chunk;
      requireThat(Buffer.byteLength(text) <= MAX_INPUT, 'INPUT_TOO_LARGE');
    }
    const result = await execute(command, text.trim() ? JSON.parse(text) : {}, { statePath });
    console.log(JSON.stringify(result));
    if (!result.ok) process.exitCode = 1;
  } catch {
    console.log(JSON.stringify({ ok: false, error: 'INVALID_CLI_INPUT', ...(process.argv[2] === 'heartbeat' ? { decision: 'terminate' } : {}) }));
    process.exitCode = 1;
  }
}
if (process.argv[1] && fs.realpathSync(process.argv[1]) === fileURLToPath(import.meta.url)) await main();
