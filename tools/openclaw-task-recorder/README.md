# OpenClaw Task Recorder

Dependency-free Node.js 24 flight recorder for ACP task diagnostics. No commands
are executed and no shell is invoked. Each task has a version-1 JSON record with
task/model/branch provenance, a timestamped event timeline, terminal status and
exit code, and artifact SHA-256 hashes.

## Usage

Run the executable directly or use `node bin/openclaw-task-recorder.mjs` from this
directory. The storage directory's parent must already exist.

```sh
RECORDER=./tools/openclaw-task-recorder/bin/openclaw-task-recorder.mjs
record=$("$RECORDER" start --task-id NAD-014 --dir ./task-records \
  --model model-24 --branch feature/flight)

"$RECORDER" append --record "$record" --type lifecycle \
  --data-json '{"phase":"started"}'
"$RECORDER" append --record "$record" --type command \
  --data-json '{"executable":"node","args":["build.mjs"],"cwd":"/work/project","result":"Module missing: example"}'
"$RECORDER" append --record "$record" --type exit \
  --data-json '{"code":7,"stderr":"Module missing: example"}'
"$RECORDER" finish --record "$record" --status failed --exit-code 7 \
  --artifact ./build.log
"$RECORDER" export --record "$record"
"$RECORDER" purge --dir ./task-records --older-than 30d
```

- `start` prints the absolute record path; creates `DIR/UUID/record.json`.
- `append` accepts `lifecycle`, `tool`, `command`, `exit`, `fallback`, and `cost`.
  Data must be a JSON object; nested objects and arrays are supported. Include
  executable, args, cwd, relevant environment, output/error, and result in command
  events to make replay useful. Include model transitions/reasons in fallback
  events and usage/amount/currency in cost events.
- `finish` accepts `succeeded`, `failed`, or `cancelled`, and a safe integer exit
  code. Repeat `--artifact PATH` for multiple existing regular files. Relative
  paths resolve against the recorder process's working directory. A finished
  record cannot be appended or finished again.
- `export` prints a JSON bundle to stdout, including the full redacted record,
  ordered command evidence, branch/model/task setup, and replay instructions.
  It also accepts running records for interrupted-task diagnosis. Replay requires
  the original repository, artifacts, and locally supplied credentials. Branch
  names alone cannot identify an exact source revision: add a commit SHA to a
  lifecycle event when reproducibility requires it.
- `purge` defaults to 30 days, measured from completion, not creation or file
  mtime. `--older-than Nd` accepts positive whole days. Running and recent
  records remain. It validates the entire storage directory before deletion.

Unknown, missing, or duplicate options (except repeatable artifacts), invalid
JSON, unsupported versions, malformed timelines, and unsafe paths exit 1 with a
generic error that never echoes input. Successful append/finish are silent;
purge prints `{"purged":N}`.

## Privacy And Storage

All persisted metadata and all exported values are recursively redacted.
Sensitive key matching is case-insensitive and ignores separators: token,
apiKey, accessKey, secret, password/passwd/passphrase, authorization, cookie, credential, privateKey,
and compound variants. Recognizable bearer credentials, common API token
prefixes, inline credential assignments, URL user/password credentials, and PEM
private keys are also redacted under otherwise innocent keys and in key names.
Raw parser/OS errors are never printed. Avoid secrets on command lines (including
`--data-json`) because the OS or calling shell can expose arguments/history.
This heuristic cannot identify every arbitrary unlabeled secret; use sensitive
field names for credentials, rather than embedding unrecognized secrets in prose.

Records use atomic same-directory temporary writes with mode 0600 and fsync
before rename. Per-task directories are mode 0700. Existing parent permissions
are not changed. Writers must be serialized per record; this utility provides no
multi-writer locking. Use a private, trusted storage directory: path checks reject
symlinks, but cannot defend against a hostile concurrent filesystem mutation.

Artifacts are read only for byte counts and SHA-256 hashes. Their paths are
redacted in metadata; their contents are never stored or printed. Directories,
symlinks (including parent components), missing files, and files inside the task's
own directory are rejected. The source artifacts are not recorder-owned and
are never removed. The only managed files are task records; purge removes the
expired records and their per-task directories. Unexpected associated files or
malformed records cause purge to fail closed, rather than delete unknown data.
Use a dedicated storage directory, with no unrelated files.

Export output is redacted but can contain operational details. If saving a bundle,
use a private destination (for example, set `umask 077`); externally saved bundles
are caller-owned and are not part of automatic retention.

## Verification

```sh
node --check bin/openclaw-task-recorder.mjs
npm test
git diff --check
```

Tests use only `node:test` and Node built-ins, exercising CLI subprocesses,
redaction, failed-task diagnostics, artifact hashes, rejection paths, permissions,
and retention. No install step or network access is needed.
