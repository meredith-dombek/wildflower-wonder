# Session handoff

<!--
Rules for agents:
- OVERWRITE this file at the end of every task that changed files. Don't append.
  Old versions are in git history.
- Keep it under ~30 lines. Long-term status belongs in PLAN.md; decisions belong in
  docs/decisions.md. Link to them; don't copy them here.
- "Next step" must be concrete enough that a fresh agent can start without asking.
-->

**Updated:** 2026-11-25 · **Branch:** main (no commits yet)

## Just done
- Recorded the owner's brief (`PRODUCT.md`), chose the cut-paper look, built Step 1 (art kit + Home).
- Set up agent-kit (build check, guards, narrowed UI gate) and Impeccable (`DESIGN.md`, sidecar, Home brief).

## Current state
- Lint, typecheck and build pass; agent-kit selftest passes; detector run on `app` and `components`.
- Only Home exists. Nothing is purchasable. No services, keys or accounts are connected.
- Finish review was done in-thread, without the Impeccable reviewer and documenter agents.

## Next step
1. Get the owner's reaction to Home and make those changes.
2. Then `PLAN.md` Step 2: nine page mockups (extend `art/mockups.mjs`), `/shop`, `/shop/[slug]`. Inherit `DESIGN.md`.
   Point "Explore the shop", the shelf link and `site.menu` at the new pages in the same change.

## Watch out for
- A page that renders `<Meadow>` is Home only; other pages need a quieter header band. The header is absolutely positioned.
- Each `.band` needs `--band` plus an edge class; a higher z-index on one band hides the next band's cut edge.
- Scenes end in bare stems on purpose: the next band's edge covers them.
- Images are cached 60 seconds; use a new file name when replacing a picture.
