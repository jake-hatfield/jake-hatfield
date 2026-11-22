#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { createHash, randomUUID } from 'node:crypto';

const VERSION = 1;
const MARKER = '[REDACTED]';
const sensitive = /token|apikey|accesskey|secret|password|passwd|passphrase|authorization|cookie|credential|privatekey/i;
const statuses = new Set(['succeeded', 'failed', 'cancelled']);
const types = new Set(['lifecycle', 'tool', 'command', 'exit', 'fallback', 'cost']);
const fail = () => { throw new Error('Invalid input, malformed record, or unsafe path'); };
const object = value => value !== null && typeof value === 'object' && !Array.isArray(value);
const exact = (value, keys) => object(value) && Object.keys(value).sort().join(',') === [...keys].sort().join(',');
const text = value => typeof value === 'string' && value.length > 0;
const date = value => text(value) && Number.isFinite(Date.parse(value)) && new Date(value).toISOString() === value;

function redact(value) {
  if (typeof value === 'string') {
    return value
      .replace(/\bBearer\s+[^\s"'<>;,]+/gi, `Bearer ${MARKER}`)
      .replace(/\b(?:sk-(?:proj-)?|sk_live_|sk_test_|gh[pousr]_|github_pat_|xox[baprs]-|AKIA|AIza|glpat-|npm_|hf_)[A-Za-z0-9_-]{8,}/g, MARKER)
      .replace(/\beyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/g, MARKER)
      .replace(/\b(api[\s_-]*key|access[\s_-]*token|refresh[\s_-]*token|token|secret|password|authorization|cookie|credential|private[\s_-]*key)\s*[:=]\s*(?:"[^"\r\n]*"|'[^'\r\n]*'|[^\s,;]+)/gi, `$1=${MARKER}`)
      .replace(/-----BEGIN (?:[A-Z]+ )?PRIVATE KEY-----[\s\S]*?(?:-----END (?:[A-Z]+ )?PRIVATE KEY-----|$)/g, MARKER)
      .replace(/(https?:\/\/)[^\s/@]+:[^\s/@]+@/gi, `$1${MARKER}@`);
  }
  if (Array.isArray(value)) return value.map(redact);
  if (object(value)) {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [
      redact(key), sensitive.test(key.replace(/[^a-z0-9]/gi, '')) ? MARKER : redact(item),
    ]));
  }
  return value;
}

// Refuse symlinks in every path component, including parent directories.
function safePath(input, kind) {
  if (!text(input) || input.includes('\0')) fail();
  const resolved = path.resolve(input);
  let current = path.parse(resolved).root;
  for (const part of resolved.slice(current.length).split(path.sep).filter(Boolean)) {
    current = path.join(current, part);
    const stat = fs.lstatSync(current);
    if (stat.isSymbolicLink()) fail();
  }
  const stat = fs.lstatSync(resolved);
  if (kind === 'file' ? !stat.isFile() : !stat.isDirectory()) fail();
  return resolved;
}

function writeAtomic(file, value) {
  const temporary = path.join(path.dirname(file), `.tmp-${randomUUID()}`);
  try {
    fs.writeFileSync(temporary, `${JSON.stringify(redact(value), null, 2)}\n`, { mode: 0o600, flag: 'wx' });
    const fd = fs.openSync(temporary, 'r');
    try { fs.fsyncSync(fd); } finally { fs.closeSync(fd); }
    fs.renameSync(temporary, file);
  } finally {
    fs.rmSync(temporary, { force: true });
  }
}

function validate(record) {
  if (!exact(record, ['version', 'id', 'taskId', 'model', 'branch', 'createdAt', 'updatedAt', 'status', 'events', 'completion'])) fail();
  if (record.version !== VERSION || typeof record.id !== 'string' ||
      !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/.test(record.id) ||
      ![record.taskId, record.model, record.branch].every(text) || !date(record.createdAt) ||
      !date(record.updatedAt) || record.updatedAt < record.createdAt || !Array.isArray(record.events)) fail();
  let previous = record.createdAt;
  for (const event of record.events) {
    if (!exact(event, ['timestamp', 'type', 'data']) || !date(event.timestamp) ||
        !types.has(event.type) || !object(event.data) || event.timestamp < previous || event.timestamp > record.updatedAt) fail();
    previous = event.timestamp;
  }
  if (record.status === 'running') {
    if (record.completion !== null) fail();
  } else {
    const end = record.completion;
    if (!statuses.has(record.status) || !exact(end, ['timestamp', 'exitCode', 'artifacts']) ||
        !date(end.timestamp) || end.timestamp !== record.updatedAt || !Number.isSafeInteger(end.exitCode) ||
        !Array.isArray(end.artifacts)) fail();
    for (const artifact of end.artifacts) {
      if (!exact(artifact, ['path', 'sha256', 'bytes']) || !text(artifact.path) ||
          !path.isAbsolute(artifact.path) || artifact.path.includes('\0') || path.normalize(artifact.path) !== artifact.path ||
          !/^[a-f0-9]{64}$/.test(artifact.sha256) || !Number.isSafeInteger(artifact.bytes) || artifact.bytes < 0) fail();
    }
  }
  return record;
}

function load(input) {
  const file = safePath(input, 'file');
  const record = validate(JSON.parse(fs.readFileSync(file, 'utf8')));
  if (path.basename(file) !== 'record.json' || path.basename(path.dirname(file)) !== record.id) fail();
  return { file, record: redact(record) };
}

function parse(args, allowed, required) {
  const options = {};
  for (let i = 0; i < args.length; i += 2) {
    const key = args[i];
    if (!allowed.includes(key) || typeof args[i + 1] !== 'string' || !args[i + 1].length) fail();
    if (key === '--artifact') (options[key] ??= []).push(args[i + 1]);
    else {
      if (Object.hasOwn(options, key)) fail();
      options[key] = args[i + 1];
    }
  }
  if (!required.every(key => Object.hasOwn(options, key))) fail();
  return options;
}

const quote = value => `'${value.replaceAll("'", "'\\''")}'`;
function main([command, ...args]) {
  if (command === 'start') {
    const o = parse(args, ['--task-id', '--dir', '--model', '--branch'], ['--task-id', '--dir', '--model', '--branch']);
    // The parent must exist so creation never traverses an unchecked symlink.
    const root = path.resolve(o['--dir']);
    // Do not create a record at a path that would itself leak a recognizable secret.
    if (redact(root) !== root) fail();
    safePath(path.dirname(root), 'directory');
    if (!fs.existsSync(root)) fs.mkdirSync(root, { mode: 0o700 });
    safePath(root, 'directory');
    const id = randomUUID();
    const directory = path.join(root, id);
    fs.mkdirSync(directory, { mode: 0o700 });
    const now = new Date().toISOString();
    const file = path.join(directory, 'record.json');
    writeAtomic(file, { version: VERSION, id, taskId: o['--task-id'], model: o['--model'], branch: o['--branch'],
      createdAt: now, updatedAt: now, status: 'running', events: [], completion: null });
    console.log(file);
  } else if (command === 'append') {
    const o = parse(args, ['--record', '--type', '--data-json'], ['--record', '--type', '--data-json']);
    if (!types.has(o['--type'])) fail();
    const data = JSON.parse(o['--data-json']);
    if (!object(data)) fail();
    const { file, record } = load(o['--record']);
    if (record.status !== 'running') fail();
    record.updatedAt = new Date(Math.max(Date.now(), Date.parse(record.updatedAt))).toISOString();
    record.events.push({ timestamp: record.updatedAt, type: o['--type'], data: redact(data) });
    writeAtomic(file, record);
  } else if (command === 'finish') {
    const o = parse(args, ['--record', '--status', '--exit-code', '--artifact'], ['--record', '--status', '--exit-code']);
    if (!statuses.has(o['--status']) || !/^-?\d+$/.test(o['--exit-code']) || !Number.isSafeInteger(Number(o['--exit-code']))) fail();
    const { file, record } = load(o['--record']);
    if (record.status !== 'running') fail();
    const artifacts = (o['--artifact'] ?? []).map(input => {
      const artifact = safePath(input, 'file');
      if (artifact === file || artifact.startsWith(`${path.dirname(file)}${path.sep}`)) fail();
      const content = fs.readFileSync(artifact);
      return { path: redact(artifact), sha256: createHash('sha256').update(content).digest('hex'), bytes: content.length };
    });
    record.status = o['--status'];
    record.updatedAt = new Date(Math.max(Date.now(), Date.parse(record.updatedAt))).toISOString();
    record.completion = { timestamp: record.updatedAt, exitCode: Number(o['--exit-code']), artifacts };
    writeAtomic(file, record);
  } else if (command === 'export') {
    const o = parse(args, ['--record'], ['--record']);
    const { record } = load(o['--record']);
    const replayEvents = record.events.filter(event => event.type === 'command');
    console.log(JSON.stringify(redact({ bundleVersion: VERSION, record, replay: {
      instructions: [
        `Check out branch ${quote(record.branch)} in the original repository.`,
        `Use model ${quote(record.model)} and task ${quote(record.taskId)}. Restore redacted credentials locally; never paste them into this bundle.`,
        'Review each command event (cwd, executable, args, environment, and result when supplied), then rerun in timeline order. Commands are evidence, never executed by this recorder.',
        'Compare exit codes and SHA-256 hashes against completion.artifacts. Original artifact files must be obtained separately.',
      ],
      commands: replayEvents.map(({ timestamp, data }) => ({ timestamp, ...data })),
    } }), null, 2));
  } else if (command === 'purge') {
    const o = parse(args, ['--dir', '--older-than'], ['--dir']);
    const age = o['--older-than'] ?? '30d';
    if (!/^\d+d$/.test(age)) fail();
    const days = Number(age.slice(0, -1));
    if (!Number.isSafeInteger(days) || days < 1 || days > 365000) fail();
    const root = safePath(o['--dir'], 'directory');
    const cutoff = Date.now() - days * 86400000;
    const expired = [];
    // Validate the entire batch before removing anything; never follow record-supplied paths.
    for (const entry of fs.readdirSync(root)) {
      const directory = safePath(path.join(root, entry), 'directory');
      if (fs.readdirSync(directory).join(',') !== 'record.json') fail();
      const { record } = load(path.join(directory, 'record.json'));
      if (record.status !== 'running' && Date.parse(record.completion.timestamp) < cutoff) expired.push(directory);
    }
    for (const directory of expired) {
      fs.unlinkSync(path.join(directory, 'record.json'));
      fs.rmdirSync(directory);
    }
    console.log(JSON.stringify({ purged: expired.length }));
  } else fail();
}

try { main(process.argv.slice(2)); }
catch {
  // Never echo parser errors, paths, JSON, or OS errors: they may contain secrets.
  console.error('Recorder error: invalid input, malformed record, or unsafe/unavailable path.');
  process.exitCode = 1;
}
