---
name: Autofix CI
description: Fix failed CI runs on their originating pull request branches.
on:
  workflow_dispatch:
    inputs:
      branch:
        description: Branch to reproduce and fix
        required: true
        type: string
  workflow_run:
    workflows:
      - CI
    types:
      - completed
if: ${{ github.event_name == 'workflow_dispatch' || github.event.workflow_run.conclusion == 'failure' }}
engine: copilot
network: defaults
permissions:
  contents: read
  actions: read
steps:
  - name: Check out the failing branch
    uses: actions/checkout@v4
    with:
      fetch-depth: 0
      persist-credentials: false
      ref: ${{ github.event.workflow_run.head_branch || github.event.inputs.branch }}
safe-outputs:
  create-pull-request:
    draft: false
    preserve-branch-name: true
    allowed-base-branches:
      - "*"
      - "!main"
      - "!master"
    allowed-files:
      - app/src/domain.mjs
---

Read `notes/ci-fix-guide.md` before changing code.

Determine the failing branch from `github.event.workflow_run.head_branch` on automatic runs, or from the `branch` input on manual `workflow_dispatch` runs. The runner has already checked out that branch for you. Confirm the current branch with `git status`, and do not fetch, switch branches, or reconstruct the branch on top of `main`.

Reproduce the failure with:

```sh
cd app && npm test
```

Read the failing assertion carefully. Find the smallest needed source fix in `app/src/domain.mjs`; avoid unrelated changes, generated files, dependency updates, test changes, or hiding the failure. Re-run `cd app && npm test` after the fix.

Open the fix as a stacked pull request with `create-pull-request`. Its base must be the failing branch, never `main` or `master`, and its branch name must be the failing branch with `-fix` appended. Set the PR base explicitly to the failing branch and the branch explicitly to `<failing-branch>-fix`. Mention the test command you ran in the PR description. If the test passes without a needed source change, do not open a pull request.
