# OpenClaw Task Guard (NAD-015)

A dependency-free Node 24 CLI for local-first admission, cumulative task budgets,
daily cloud accounting, provider circuit breaking, and identity-checked runaway
termination. Git and Linux `/proc` are required for repository cleanup and process
identity checks respectively. No network calls, shell execution, or `eval` occur.
Git is invoked with argument arrays, a timeout, captured output, and isolated
Git environment/global configuration.

## CLI contract

Run `bin/openclaw-task-guard.mjs COMMAND --state /absolute/state.json` with one
JSON object on stdin (empty stdin means `{}`). Every invocation emits exactly one
JSON object to stdout; diagnostic errors contain fixed codes, not raw input or
stack traces. Exit status is 0 for a handled successful operation and 1 for a
rejection/error. A successful heartbeat that reaches a cap still exits 0: always
inspect `decision`. Any heartbeat error also returns `decision: "terminate"`.
Input is limited to 64 KiB. State directories and the approved root must already
exist. Paths must be absolute, canonical, and free of symlink components.

Example initialization (prices below are illustrative, not provider quotes):

```sh
node bin/openclaw-task-guard.mjs init --state /srv/guard/state.json <<'JSON'
{
  "approvedRoot": "/srv/task-repos",
  "defaultBranches": ["trunk", "production"],
  "taskBranchPolicy": {"version": 1, "prefixes": ["nad/", "task/"]},
  "caps": {"tokens": 100000, "wallMs": 3600000, "toolCalls": 100, "usd": 5},
  "dailyCloudUsd": 10,
  "alertRatio": 0.8,
  "failureThreshold": 3,
  "cooldownMs": 60000,
  "pricing": {
    "example-model": {
      "version": "2026-11-reviewed",
      "effectiveDate": "2026-11-01",
      "inputPerMillion": 1.25,
      "outputPerMillion": 5
    }
  }
}
JSON
```

| Command | JSON input | Behavior |
| --- | --- | --- |
| `init` | Optional configuration shown above | Creates schema version 1; refuses replacement of existing state. |
| `admit` | `taskId`, optional `mode`, `caps`, `repoPath`; cloud also requires `cloudOptIn: true`, `provider` | Defaults to local; returns `decision: "admit"`, `runId`, effective caps, and circuit state. |
| `heartbeat` | `taskId`, optional cumulative `inputTokens`, `outputTokens`, `toolCalls`, `usd`, optional `pid` | Updates accounting, optionally binds a process once, returns `decision`, `alerts`, `breaches`, `usage`, and `caps`. |
| `provider-result` | `taskId`, boolean `success` | Records one cloud attempt outcome; returns `circuit`, failure count, and retry time. |
| `finish` | `taskId`, optional cumulative usage as for heartbeat | Accounts final usage; marks finished or failed if a hard cap was reached. Does not signal a process or delete a repo. |
| `terminate` | `taskId` | Stops only the recorded matching PID, then validates/deletes only its recorded repo; retains accounting and reason. Other supplied PID/path fields are ignored. |

Identifiers are non-secret 1-80 character alphanumeric/dot/underscore/hyphen
labels starting with an alphanumeric. Task IDs are never reused, even after
finish. Cloud opt-in applies only to the specified admission; it is not a global
switch or inherited from another task. Local admission ignores provider outages
and cloud spend limits. For separate model prices, use separate provider/model
identifiers (the breaker is scoped to that identifier).

Default caps are the example caps above; daily cap is $10, alert ratio 0.8,
failure threshold 3, cooldown 60 seconds, and pricing is empty. All caps must be
positive; counts and durations must be safe integers. Per-task `caps`, if supplied,
must include all four fields and may only lower configured caps. Cleanup is
disabled unless `approvedRoot` is explicitly configured.

`taskBranchPolicy` is an explicit versioned cleanup admission policy, persisted
in `config` and validated on every state load. Its default is
`{"version": 1, "prefixes": ["nad/", "task/"]}`, accepting controlled branches
such as `nad/NAD-015-task-guard`. A supplied policy replaces the prefix list;
it must use version 1 and a nonempty array of literal namespace prefixes.
Each prefix is 1-79 alphanumeric/underscore/hyphen characters, starts with an
alphanumeric, and ends with exactly one `/`. Empty strings/lists, bare partial
names such as `n` or `nad`, `/`, wildcards, and nested/full-ref prefixes are
rejected. Matching requires a nonempty branch suffix. Prefixes never override
default/release branch protections or the exact recorded-branch check.

## Supervisor integration and hard caps

The trusted supervisor admits a task before starting work. For a process that
may require termination, launch it directly with `spawn`/`execFile` (no shell)
and these environment variables from the admission response:

```js
const child = spawn(process.execPath, ['worker.mjs'], {
  env: {
    ...process.env,
    OPENCLAW_TASK_ID: admitted.taskId,
    OPENCLAW_TASK_RUN_ID: admitted.runId
  }
});
// Immediately heartbeat with { taskId: admitted.taskId, pid: child.pid }.
```

The run ID is non-secret correlation metadata, not an authorization credential.
Register before allowing work, then heartbeat from an independent supervisor
timer even if the worker hangs. Heartbeat before each tool/provider dispatch,
and supply projected cumulative consumption before work whose known cost would
reach a cap. Do not dispatch when `decision` is `terminate`; invoke `terminate`
and stop scheduling the task. Report actual cumulative totals after each result.
Use a single recorded worker, not a shell wrapper or a process tree: this guard
deliberately never signals a process group or an unrecorded descendant.

Limits are reached at **greater than or equal to** the configured value. Tokens
are input plus output; wall time is elapsed from admission using the guard's
clock; tool calls are cumulative. Alerts appear at `alertRatio * cap` (strictly
below the cap). Breaches persist as a failure reason and the terminate decision
is sticky. Wall time is checked even on empty heartbeats. Invalid/regressing
usage is rejected without changing accounting and fails closed.

This is an admission/accounting primitive, not an autonomous daemon or an OS
sandbox. Its hard decisions must be enforced by the independent supervisor;
it cannot observe unreported provider consumption or stop a worker if nobody
invokes it. Keep the host clock synchronized. Provider streaming calls should
also have native output-token and request-timeout limits, since delayed usage
reports cannot prevent already-incurred charges.

Effective USD is the larger of reported cumulative USD and the token-pricing
estimate. A later report cannot lower already-accounted USD. Local work can also
report non-cloud USD, which counts toward the task's USD cap but not cloud spend.
Cloud increments are charged once to the UTC day when reported, including final
usage. The daily limit blocks **new cloud admissions** at/above the cap; it does
not stop existing tasks or reserve their full budgets. Concurrent admitted tasks
can therefore overshoot the daily admission limit. Task caps still apply.

## Provider circuit

Count each real provider attempt once, including retries. Successful outcomes
in the closed state reset consecutive failures. At `failureThreshold` failures,
the circuit opens and blocks cloud admissions for that provider until cooldown.
Older in-flight successes cannot bypass an open cooldown.

After cooldown, the next admission acquires the single **half-open** probe slot;
other admissions remain blocked until its result. Success closes the circuit
and resets failures; failure reopens it with a new cooldown. Results from other
tasks cannot affect the probe. A probe that finishes or is terminated without
a result reopens the circuit so it cannot strand the slot forever. The supervisor
must heartbeat and terminate an abandoned probe just like any other runaway.
Local tasks and other providers remain available.

## Hardened termination and cleanup

Use a dedicated approved root for disposable standalone repositories and keep
the guard state outside that root. Only repositories explicitly supplied at
admission can be deleted; admission writes an exclusive mode-0600
`.openclaw-task-guard.json` sentinel and records canonical path, branch, Git-dir,
directory device/inode identities, task ID, and run ID. Do not create the sentinel
yourself. Existing sentinels are rejected, not overwritten.

Termination verifies the same-owner PID against Linux boot ID, process start
time, and exact task/run environment markers before signaling it. PID 1 and the
guard itself are rejected. It sends SIGTERM, waits 500 ms, rechecks identity, and
uses SIGKILL if necessary, waiting up to another 2 seconds. No cleanup happens
unless the recorded process was identity-checked and observed stopped. Missing,
reused, mismatched, or unrecorded PIDs fail closed.

Only then is repository cleanup considered. Every validation must still pass:

- The path is a strict descendant of the explicitly configured canonical root;
  the root itself and paths outside it are excluded.
- No path component, Git-dir, sentinel, or repository tree entry is a symlink.
  Special files in the tree are rejected too.
- The repo is standalone with an actual `.git` directory, matching Git top-level
  and absolute Git-dir; linked worktrees and shared common directories are rejected.
- HEAD is attached to the exact same recorded branch in `taskBranchPolicy`
  (by default `nad/*` or `task/*`). `main`, `master`, all
  configured `defaultBranches`, `init.defaultBranch`, and the origin remote HEAD
  branch are protected. Configure every additional default/release branch when
  initializing, including protected branches inside allowed task namespaces.
- Directory inode/device identities and exact sentinel metadata match admission;
  the sentinel must be a regular, non-hardlinked file.

Rejections return `decision: "manual-intervention"` and persist a fixed cleanup
reason, termination reason, usage, and daily spend. A retry after a verified stop
can revalidate cleanup without signaling another PID. Successful termination is
idempotent. Finish/termination never erase ledger entries or failure history.

Run the supervisor and state as a trusted owner, with an operator-controlled
state directory and exclusive access to the disposable root during cleanup.
These are filesystem/process identity checks, not isolation from a malicious
same-UID writer concurrently swapping paths or PIDs; Node has no portable
pidfd/openat-based deletion primitive. Use OS isolation for hostile workers.
Do not put unrelated data or the default checkout inside a disposable task repo.

## State, secrets, and recovery

State has `version: 1` and is written using an exclusive mode-0600 temporary file,
file fsync, atomic rename, and parent-directory fsync. Existing state must be a
same-owner regular mode-0600, non-symlink, non-hardlinked file. An exclusive
mode-0600 `.lock` serializes all mutations, including admissions and accounting.
A busy lock fails closed; stale locks are never stolen on a timer. After a crash,
stop the supervisor, inspect pending processes/repos and the ledger, and remove
only the verified stale lock before restarting. Temporary files from a killed
writer are not treated as state. Unsupported schema versions require an explicit
operator migration; the CLI never silently resets spend.
State without `config.taskBranchPolicy` also fails closed. Before using this
revision with older state, pause the supervisor and guard invocations, acquire
the state lock, back up the ledger, and atomically add the reviewed version-1
policy with mode 0600, preserving all tasks, accounting and other configuration.
Release the lock and resume; never reinitialize the ledger to update policy.

Inputs are allowlisted into the ledger: prompts, credentials, metadata, raw
provider responses/errors, and other unknown fields are never stored. Structured
redaction removes sensitive-key values recursively and recognizable bearer/API/
GitHub/Slack/JWT or long token-like strings. IDs, paths, pricing versions and
branches containing token-like values are rejected. Output is built from
controlled fields and redacted again; errors never interpolate raw input. Keep
credentials exclusively in the provider adapter, and use non-secret labels for
task/provider IDs and paths. Redaction is defense in depth, not a way to store
arbitrary secret-bearing payloads.

## Pricing maintenance

There are no bundled live prices. Cloud admission requires an explicit entry
with a non-secret `version`, real ISO `effectiveDate` (`YYYY-MM-DD`), and
nonnegative USD rates per million input/output tokens. Verify rates against the
provider's official model/tier schedule at deployment, on price/model changes,
and on a regular operator review cadence. Review cache, batch, reasoning-token,
regional, tool and other surcharges; include unmodeled fees in reported `usd`.

For a price update, pause admissions and stop guard invocations, acquire the
same exclusive state lock, preserve a mode-0600 backup, and atomically replace
only the relevant `config.pricing` entry with reviewed rates and a new version/
effective date. Preserve task snapshots, spend, circuits and all other state;
release the lock and resume. There is intentionally no generic state-edit CLI.
Each admitted cloud task retains its exact pricing snapshot, so later updates
cannot retroactively reprice running or completed tasks. If an active task must
switch pricing, finish it and admit a new task ID. Never reinitialize the ledger
to update rates or bypass daily spend.

## Verification

```sh
node --check bin/openclaw-task-guard.mjs
node --check test/guard.test.mjs
npm test
git diff --check
```

The `node:test` suite uses isolated disposable directories and real Node child
processes/Git repos. It covers forced runaway shutdown, controlled deletion,
identity/branch/path/sentinel rejection, durable failure accounting, per-task
caps and early alerts, UTC cloud admission limits, circuit cooldown/probe
recovery, state safety, CLI JSON behavior, and secret suppression.
