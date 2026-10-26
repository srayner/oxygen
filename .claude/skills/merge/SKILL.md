---
name: merge
description: Pre-merge checklist for merging a feature branch into main in this repo. Verifies typecheck, lint, the production build and the Docker build, bumps the version with `npm version`, then merges only after the user confirms. Use when the user says "merge", "ready to merge", "release", or asks to land a feature branch on main.
---

# Merge a feature branch into main

Nothing here is committed, tagged, merged or pushed without the user's explicit
confirmation at the point it happens. A confirmation for one step does not cover the next.

## 1. Preconditions

- `git branch --show-current` must be a `feature/*` branch. If it is `main`, stop.
- `git status` must be clean. If not, stop and ask how to handle the changes
  (commit them first, with the user's approval of the diff). `npm version` refuses to run on a dirty tree.

## 2. Verify (all must pass, run in this order, stop at the first failure)

1. `npx tsc --noEmit`
2. `npm run lint`
3. `npm run build` — must complete with no errors. Next's build runs its own typecheck and
   lint, which is what catches problems `next dev` does not.
4. `docker build -t oxygen:premerge .` — the real production path (multi-stage Dockerfile).
   Skip only if Docker is unavailable, and say so explicitly.

This project has no unit or e2e test suite yet; if one is added, add it to this list.

Report each result plainly. If anything fails, show the error, fix it or hand it back —
do not continue to the version bump. Never merge on a failing or skipped check without
telling the user exactly what was skipped.

## 3. Bump the version

- Always use `npm version`, never hand-edit `version` in package.json or package-lock.json.
- Ask the user which bump: `patch`, `minor` or `major`. Suggest one based on the diff
  (fix → patch, new feature → minor, breaking → major) but let them decide.
- `npm version <type>` creates a commit and a `v<x.y.z>` tag. Because that is a commit,
  show the user the pending bump and get a yes before running it.
- Run it with the default message, then confirm package.json and package-lock.json both
  show the new version (`git show --stat HEAD`).

## 4. Merge to main

Ask whether to merge locally or open a PR (`gh` may need `gh auth login`).

- Local: `git checkout main && git merge --no-ff <branch>` — confirm before running.
- PR: push the branch (confirm first) and open the PR; end the description with the
  attribution line from the session's system reminder.

## 5. After the merge

- Do not push `main` or tags without confirmation (`git push origin main --follow-tags`).
- Remind the user that deploy runs migrations (`npx prisma migrate deploy`), and flag if
  the branch added anything under `prisma/migrations/`.
- Offer to delete the merged feature branch; don't delete it unprompted.
