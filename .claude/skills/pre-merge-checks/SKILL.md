---
name: pre-merge-checks
description: The checks Oxygen must pass before a feature branch is merged into main. Used by the merge workflow; also use when asked whether a branch is ready to merge.
---

# Oxygen pre-merge checks

Run these in order on the committed code. All must pass.

1. `npx tsc --noEmit`
2. `npm run lint`
3. `npm run build`
4. `docker build -t oxygen:premerge .`, the real production path. If Docker isn't available, say so: that check was skipped.

There is no unit or e2e test suite yet. Say so in the report rather than implying the
change was tested.

## For the deploy

- If the branch added anything under `prisma/migrations/`, say that the deploy must run
  `node node_modules/prisma/build/index.js migrate deploy` (the image has no npx).
