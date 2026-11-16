# Claude Code Instructions

## Code Style

After editing files, run Prettier to ensure consistent formatting:

```
npx prettier --write <file>
```

## Merging

Before merging, run the checks in the `pre-merge-checks` skill (`.claude/skills/pre-merge-checks/`).
