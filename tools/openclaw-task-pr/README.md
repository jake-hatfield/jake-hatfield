# openclaw-task-pr

Dependency-free Node 24 publisher that refuses to mutate a remote until task evidence and the checked-out repository match exactly.

## Usage

```sh
node bin/openclaw-task-pr.mjs publish --evidence evidence.json --repo OWNER/REPO --title "Title" --summary "What changed" --task-url https://tracker/tasks/123 --model model-name [--remote github]
```

Evidence is the schema-version-1 JSON emitted by `openclaw-task-git finish`:

```json
{
  "version": 1,
  "taskId": "TASK-123",
  "repository": "/absolute/path/to/task-repo",
  "defaultBranch": "main",
  "taskBranch": "nad/TASK-123-change",
  "baseCommit": "<40-hex SHA>",
  "outputCommit": "<40-hex SHA>",
  "commitCount": 1,
  "changedFiles": ["file.txt"],
  "test": { "argv": ["node", "--test"], "exitCode": 0, "log": "TASK-123.test.log", "sha256": "<64-hex SHA-256>" },
  "artifacts": {
    "bundle": { "file": "TASK-123.bundle", "sha256": "<64-hex SHA-256>" },
    "patch": { "file": "TASK-123.patch", "sha256": "<64-hex SHA-256>" }
  }
}
```

Artifact filenames are resolved relative to the evidence file. Before `gh auth status`, `gh repo view`, push, or PR mutation, the command verifies artifact hashes, the bundle, clean top-level checkout, branch, base/output commits, ancestry, descendant count, changed files, and `git diff --check`. It then confirms the GitHub default branch and checks for an open PR with the exact head branch. An existing PR is returned without push/create. PR bodies are temporary files under `.git`; commands use `spawnSync`, never a shell.

Run tests with `npm test`.
