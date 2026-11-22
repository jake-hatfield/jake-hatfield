import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';

const cli = fileURLToPath(new URL('../bin/openclaw-task-recorder.mjs', import.meta.url));
function fixture(t) {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'flight-recorder-'));
  t.after(() => fs.rmSync(directory, { recursive: true, force: true }));
  const root = path.join(directory, 'records');
  function run(...args) {
    return spawnSync(process.execPath, [cli, ...args], { encoding: 'utf8' });
  }
  function ok(...args) {
    const result = run(...args);
    assert.equal(result.status, 0, result.stderr);
    assert.equal(result.stderr, '');
    return result.stdout.trim();
  }
  function start(...extra) {
    return ok('start', '--task-id', 'NAD-014', '--dir', root, '--model', 'model-24', '--branch', 'feature/flight', ...extra);
  }
  function append(record, type, data) {
    return ok('append', '--record', record, '--type', type, '--data-json', JSON.stringify(data));
  }
  function finish(record, ...extra) {
    return ok('finish', '--record', record, '--status', 'failed', '--exit-code', '7', ...extra);
  }
  function read(record) { return JSON.parse(fs.readFileSync(record, 'utf8')); }
  function change(record, mutate) {
    const value = read(record);
    mutate(value);
    fs.writeFileSync(record, JSON.stringify(value));
  }
  function bad(...args) {
    const result = run(...args);
    assert.equal(result.status, 1);
    assert.equal(result.stdout, '');
    assert.equal(result.stderr, 'Recorder error: invalid input, malformed record, or unsafe/unavailable path.\n');
  }
  return { directory, root, run, ok, start, append, finish, read, change, bad };
}

test('start creates a versioned private record with unique identity', t => {
  const f = fixture(t);
  const file = f.start();
  const record = f.read(file);
  assert.equal(record.version, 1);
  assert.equal(record.taskId, 'NAD-014');
  assert.equal(record.model, 'model-24');
  assert.equal(record.branch, 'feature/flight');
  assert.equal(record.status, 'running');
  assert.equal(record.completion, null);
  assert.deepEqual(record.events, []);
  assert.equal(fs.statSync(file).mode & 0o777, 0o600);
  assert.equal(fs.statSync(path.dirname(file)).mode & 0o777, 0o700);
  assert.notEqual(file, f.start());
});

test('failed task export preserves diagnostics, all event types, and concrete replay provenance without secrets', t => {
  const f = fixture(t);
  const file = f.start();
  const secrets = ['sensitive-token-value', 'sensitive-api-value', 'sensitive-secret-value',
    'sensitive-password-value', 'sensitive-auth-value', 'sensitive-cookie-value',
    'sensitive-credential-value', 'sensitive-private-value', 'sk-proj-abcdefghijklmno',
    'ghp_123456789abcdefgh', 'bearer-secret-12345', 'inline-secret-value'];
  f.append(file, 'lifecycle', { phase: 'started', token: secrets[0], nested: [{ API_KEY: secrets[1],
    clientSecret: secrets[2], 'pass-word': secrets[3], AUTHORIZATION: secrets[4],
    session_cookie: secrets[5], credentials: secrets[6], private_key: secrets[7] }] });
  f.append(file, 'tool', { name: 'compile', output: `Unauthorized: Bearer ${secrets[10]}`, innocent: secrets[8] });
  f.append(file, 'command', { executable: 'node', args: ['build.mjs', `--token=${secrets[11]}`], cwd: '/work/project', result: 'missing dependency', innocent: secrets[9] });
  f.append(file, 'exit', { code: 7, signal: null, stderr: 'Module missing: example' });
  f.append(file, 'fallback', { from: 'model-24', to: 'model-backup', reason: 'rate limit' });
  f.append(file, 'cost', { inputTokens: 120, usd: 0.02 });
  f.finish(file);
  const raw = fs.readFileSync(file, 'utf8');
  const output = f.ok('export', '--record', file);
  for (const secret of secrets) {
    assert.ok(!raw.includes(secret), secret);
    assert.ok(!output.includes(secret), secret);
  }
  const bundle = JSON.parse(output);
  assert.equal(bundle.record.taskId, 'NAD-014');
  assert.equal(bundle.record.model, 'model-24');
  assert.equal(bundle.record.branch, 'feature/flight');
  assert.equal(bundle.record.status, 'failed');
  assert.equal(bundle.record.completion.exitCode, 7);
  assert.deepEqual(bundle.record.events.map(event => event.type), ['lifecycle', 'tool', 'command', 'exit', 'fallback', 'cost']);
  assert.ok(bundle.record.events.every(event => Number.isFinite(Date.parse(event.timestamp))));
  assert.equal(bundle.replay.commands[0].executable, 'node');
  assert.equal(bundle.replay.commands[0].cwd, '/work/project');
  assert.match(output, /missing dependency/);
  assert.match(output, /Check out branch/);
  assert.match(output, /SHA-256/);
  assert.equal(fs.statSync(file).mode & 0o777, 0o600);
  assert.deepEqual(fs.readdirSync(path.dirname(file)), ['record.json']);
});

test('hashes multiple artifacts byte-for-byte without copying their secret contents', t => {
  const f = fixture(t);
  const file = f.start();
  const artifact = path.join(f.directory, 'output.bin');
  const empty = path.join(f.directory, 'empty');
  const bytes = Buffer.from([0, 255, 10, 17, 42]);
  fs.writeFileSync(artifact, bytes);
  fs.writeFileSync(empty, '');
  f.finish(file, '--artifact', artifact, '--artifact', empty);
  const bundle = JSON.parse(f.ok('export', '--record', file));
  assert.deepEqual(bundle.record.completion.artifacts, [
    { path: artifact, sha256: createHash('sha256').update(bytes).digest('hex'), bytes: 5 },
    { path: empty, sha256: createHash('sha256').update('').digest('hex'), bytes: 0 },
  ]);
  assert.deepEqual(fs.readdirSync(path.dirname(file)), ['record.json']);
});

test('redacts metadata, arbitrary nested arrays, URL credentials, private keys and token prefixes', t => {
  const f = fixture(t);
  const file = f.ok('start', '--dir', f.root, '--task-id', 'Bearer metadata-secret', '--model', 'sk-1234567890abcdef', '--branch', 'topic');
  f.append(file, 'tool', { lines: [['xoxb-1234567890abcdef', 'github_pat_1234567890abcdef', 'AKIA1234567890ABCDEF']],
    message: 'https://user:verysecret@example.com/path',
    pem: '-----BEGIN RSA PRIVATE KEY-----\nprivate-payload\n-----END RSA PRIVATE KEY-----',
    'sk-live-secretkey12345': 'key name also filtered',
    values: 'api_key="quoted-secret" password=unquoted-secret',
  });
  const output = f.ok('export', '--record', file);
  for (const secret of ['metadata-secret', 'sk-1234567890abcdef', 'xoxb-1234567890abcdef',
    'github_pat_1234567890abcdef', 'AKIA1234567890ABCDEF', 'verysecret', 'private-payload',
    'sk-live-secretkey12345', 'quoted-secret', 'unquoted-secret']) assert.ok(!output.includes(secret), secret);
});

test('export redacts externally injected secrets and never rewrites the source', t => {
  const f = fixture(t);
  const file = f.start();
  f.append(file, 'tool', {});
  f.change(file, record => { record.events[0].data = { password: 'injected-secret' }; });
  assert.ok(!f.ok('export', '--record', file).includes('injected-secret'));
  assert.ok(fs.readFileSync(file, 'utf8').includes('injected-secret'));
});

for (const args of [[], ['unknown'], ['start'], ['start', '--dir'],
  ['start', '--task-id', 'a', '--task-id', 'b'], ['purge', '--dir', '.', '--older-than', '30h']]) {
  test(`rejects invalid CLI: ${JSON.stringify(args)}`, t => fixture(t).bad(...args));
}

for (const data of ['not JSON secret', '[]', 'null', '42']) {
  test(`rejects invalid event payload ${data} without echoing it`, t => {
    const f = fixture(t);
    const file = f.start();
    const before = fs.readFileSync(file);
    f.bad('append', '--record', file, '--type', 'tool', '--data-json', data);
    assert.deepEqual(fs.readFileSync(file), before);
  });
}

test('rejects unknown event types, duplicate flags and invalid finish arguments', t => {
  const f = fixture(t);
  const file = f.start();
  f.bad('append', '--record', file, '--type', 'anything', '--data-json', '{}');
  f.bad('append', '--record', file, '--type', 'tool', '--type', 'exit', '--data-json', '{}');
  for (const code of ['1.5', 'NaN', '9007199254740992', '7oops']) {
    f.bad('finish', '--record', file, '--status', 'failed', '--exit-code', code);
  }
  f.bad('finish', '--record', file, '--status', 'unknown', '--exit-code', '1');
  assert.equal(f.read(file).status, 'running');
});

test('completed records cannot be appended or finished again', t => {
  const f = fixture(t);
  const file = f.start();
  f.finish(file);
  const before = fs.readFileSync(file);
  f.bad('append', '--record', file, '--type', 'exit', '--data-json', '{}');
  f.bad('finish', '--record', file, '--status', 'succeeded', '--exit-code', '0');
  assert.deepEqual(fs.readFileSync(file), before);
});

for (const [name, mutate] of [
  ['version', record => { record.version = 2; }],
  ['missing model', record => { delete record.model; }],
  ['unknown field', record => { record.extra = 'secret'; }],
  ['invalid timestamp', record => { record.createdAt = 'yesterday'; }],
  ['invalid events', record => { record.events = [{}]; }],
  ['inconsistent completion', record => { record.status = 'running'; }],
  ['bad hash', record => { record.completion.artifacts = [{ path: '/tmp/a', bytes: 1, sha256: 'bad' }]; }],
  ['relative artifact', record => { record.completion.artifacts = [{ path: '../a', bytes: 1, sha256: 'a'.repeat(64) }]; }],
]) {
  test(`fails closed on malformed record: ${name}`, t => {
    const f = fixture(t);
    const file = f.start();
    f.finish(file);
    f.change(file, mutate);
    f.bad('export', '--record', file);
    f.bad('purge', '--dir', f.root);
    assert.ok(fs.existsSync(file));
  });
}

test('invalid JSON and record location are rejected', t => {
  const f = fixture(t);
  const file = f.start();
  const moved = path.join(f.directory, 'moved.json');
  fs.copyFileSync(file, moved);
  f.bad('export', '--record', moved);
  fs.writeFileSync(file, '{"password":"never-echo-this",');
  f.bad('export', '--record', file);
});

test('rejects missing, directory, symlink, parent-symlink and internal artifacts atomically', t => {
  const f = fixture(t);
  const file = f.start();
  const target = path.join(f.directory, 'target');
  fs.writeFileSync(target, 'artifact');
  const link = path.join(f.directory, 'link');
  fs.symlinkSync(target, link);
  const parentLink = path.join(f.directory, 'parent-link');
  fs.symlinkSync(path.dirname(file), parentLink);
  const before = fs.readFileSync(file);
  for (const artifact of [path.join(f.directory, 'missing'), f.directory, link, path.join(parentLink, 'record.json'), file]) {
    f.bad('finish', '--record', file, '--status', 'failed', '--exit-code', '1', '--artifact', target, '--artifact', artifact);
    assert.deepEqual(fs.readFileSync(file), before);
  }
});

test('rejects symlink records and symlink storage roots', t => {
  const f = fixture(t);
  const file = f.start();
  const link = path.join(f.directory, 'linked-root');
  fs.symlinkSync(f.root, link);
  f.bad('start', '--dir', link, '--task-id', 'x', '--model', 'm', '--branch', 'b');
  f.bad('purge', '--dir', link);
  const contents = fs.readFileSync(file);
  const target = path.join(f.directory, 'record-copy');
  fs.writeFileSync(target, contents);
  fs.unlinkSync(file);
  fs.symlinkSync(target, file);
  f.bad('export', '--record', file);
});

test('default purge expires completed records older than 30 days and retains recent and running records', t => {
  const f = fixture(t);
  const old = f.start();
  const recent = f.start();
  const running = f.start();
  f.finish(old);
  f.finish(recent);
  const past = new Date(Date.now() - 31 * 86400000).toISOString();
  f.change(old, record => {
    record.createdAt = record.updatedAt = record.completion.timestamp = past;
  });
  f.change(running, record => { record.createdAt = record.updatedAt = past; });
  assert.deepEqual(JSON.parse(f.ok('purge', '--dir', f.root)), { purged: 1 });
  assert.ok(!fs.existsSync(path.dirname(old)));
  assert.ok(fs.existsSync(recent));
  assert.ok(fs.existsSync(running));
});

test('purge uses completion age, honors custom retention and preserves original artifacts', t => {
  const f = fixture(t);
  const file = f.start();
  const artifact = path.join(f.directory, 'artifact');
  fs.writeFileSync(artifact, 'original');
  f.finish(file, '--artifact', artifact);
  f.change(file, record => {
    record.createdAt = new Date(Date.now() - 60 * 86400000).toISOString();
    record.updatedAt = record.completion.timestamp = new Date(Date.now() - 3 * 86400000).toISOString();
  });
  assert.deepEqual(JSON.parse(f.ok('purge', '--dir', f.root)), { purged: 0 });
  assert.deepEqual(JSON.parse(f.ok('purge', '--dir', f.root, '--older-than', '2d')), { purged: 1 });
  assert.equal(fs.readFileSync(artifact, 'utf8'), 'original');
});

test('purge fails before deleting records when unexpected associated files exist', t => {
  const f = fixture(t);
  const file = f.start();
  f.finish(file);
  const past = new Date(Date.now() - 40 * 86400000).toISOString();
  f.change(file, record => { record.createdAt = record.updatedAt = record.completion.timestamp = past; });
  fs.writeFileSync(path.join(path.dirname(file), 'unmanaged'), 'do not delete');
  f.bad('purge', '--dir', f.root);
  assert.ok(fs.existsSync(file));
});

test('command events are inert data, including shell metacharacters', t => {
  const f = fixture(t);
  const file = f.start();
  const marker = path.join(f.directory, 'should-not-exist');
  f.append(file, 'command', { executable: `touch ${marker}; $(touch ${marker})`, args: [] });
  f.ok('export', '--record', file);
  assert.ok(!fs.existsSync(marker));
});

test('artifact paths are redacted while hashes still describe original contents', t => {
  const f = fixture(t);
  const file = f.start();
  const artifact = path.join(f.directory, 'sk-proj-sensitiveartifactname');
  fs.writeFileSync(artifact, 'password=artifact-secret-value');
  f.finish(file, '--artifact', artifact);
  const output = f.ok('export', '--record', file);
  assert.ok(!output.includes('sk-proj-sensitiveartifactname'));
  assert.ok(!output.includes('artifact-secret-value'));
  assert.equal(JSON.parse(output).record.completion.artifacts[0].sha256,
    createHash('sha256').update('password=artifact-secret-value').digest('hex'));
});

test('purge validates the entire batch before deleting any expired record', t => {
  const f = fixture(t);
  const old = f.start();
  const malformed = f.start();
  f.finish(old);
  const past = new Date(Date.now() - 40 * 86400000).toISOString();
  f.change(old, record => { record.createdAt = record.updatedAt = record.completion.timestamp = past; });
  fs.writeFileSync(malformed, 'malformed');
  f.bad('purge', '--dir', f.root);
  assert.ok(fs.existsSync(old));
  assert.ok(fs.existsSync(malformed));
});

test('succeeded and cancelled statuses and additional API token formats are supported', t => {
  const f = fixture(t);
  for (const status of ['succeeded', 'cancelled']) {
    const file = f.start();
    const secrets = ['AIza1234567890abcdef', 'glpat-1234567890abcdef', 'npm_1234567890abcdef',
      'hf_1234567890abcdef', 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxIn0.signature'];
    f.append(file, 'tool', { output: secrets });
    f.ok('finish', '--record', file, '--status', status, '--exit-code', '0');
    const output = f.ok('export', '--record', file);
    for (const secret of secrets) assert.ok(!output.includes(secret));
    assert.equal(JSON.parse(output).record.status, status);
  }
});
