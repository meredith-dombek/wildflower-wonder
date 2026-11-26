# CLAUDE.md

Wildflower & Wonder: the website and shop of a Boise, Idaho sole proprietorship selling nature-inspired
preschool activities (printable downloads first, craft kits later) to parents, caregivers, preschool
teachers and homeschool families with children 3–6. The owner is a website beginner: explain in simple
language and keep everything they edit in `content/` and `app/theme.css`. Built step by step (`PLAN.md`).

`AGENTS.md` is a symlink to this file — edit only this one.

## Before you start any task (duplicate-work guardrail)

1. **Check what's already in flight.** The session-start hook prints the handoff,
   `git status`, recent commits, and the open items in `PLAN.md`. If the task overlaps
   uncommitted changes or an item marked `[~]` in progress, stop and ask.
2. **Check the source of truth below before creating anything.** Extend the existing
   file instead of adding a parallel one.
3. **Check `docs/decisions.md`** before proposing an approach — don't re-litigate a
   settled decision; if one needs to change, say so and add a superseding entry.
4. For multi-step work from `PLAN.md`, mark the item `[~]` when you start and `[x]`
   when it's done, in the same change as the work.

## Session handoff

- **Start:** the session-start hook prints `docs/handoff.md`. Begin from its
  "Next step" unless the user asks for something else.
- **End of every task that changed files:** overwrite `docs/handoff.md`: Just done /
  Current state / Next step / Watch out for. Under ~30 lines. A Stop hook blocks
  finishing until you do.
- Handoff is short-term. Status lives in `PLAN.md`; decisions in `docs/decisions.md`.

## Source of truth — read these for fundamentals

| Topic | Read this | Rule |
|---|---|---|
| Roadmap / what's done | `PLAN.md` | The work ledger. Status lives here, nowhere else. |
| Where the last session left off | `docs/handoff.md` | Overwritten each task; short-term only. |
| Settled decisions + why | `docs/decisions.md` | Append; don't duplicate elsewhere. |
| The business, audience, what may never be claimed | `PRODUCT.md` | From the owner's brief. Change only on the owner's word. |
| The look: colors, type, paper rules | `DESIGN.md` (tokens live in `app/theme.css`) | Inherit it; don't restyle per page. |
| What Home must keep doing | `.impeccable/surfaces/app-page-tsx.md` | Direction contract. Never copy it into shipped code. |
| Words, products, shelves, menu | `content/*.ts` | No copy or prices hardcoded in components. |
| Illustrations | `art/*.mjs` → `public/art`, `public/products` | Redraw in `art/` and render; don't hand-edit the images. |
| How the owner edits the site | `docs/owner-guide.md` | Update it in the same change when an edit point moves. |
| Guard rules, UI gate, build check, plugins | `.claude/agent-kit.conf` | Hook scripts live in the agent-kit plugin; never copy them here. |
| Impeccable detector settings and ignores | `.impeccable/config.json` | Every ignore needs a reason. |

## Commands

- `npm run dev`: preview at http://localhost:3000 · `npm run build` · `npm run lint` · `npm run typecheck`
- `npm run check`: lint and build, what the Stop hook runs. No tests yet.
- Redraw art: `npm install --no-save puppeteer-core`, then `node art/render.mjs [name]`, `art/title.mjs` or
  `art/mockups.mjs`. Then embed provenance with `impeccable embed-prompt` (see `art/README.md`).

## Rules

- **Say only what is true today.** Nothing may look purchasable, downloadable or connected until it really
  works (finished PDF + checkout + delivery). No fake reviews, testimonials, credentials, sales numbers,
  biography, address, phone, email or policies. Missing owner facts are clearly marked placeholders.
- **Unreleased = pencil outline, real = painted paper.** That is the site's availability language.
- Only link to pages that exist (`site.menu` in `content/site.ts`).
- This Next.js (16.4) is newer than training data: read the guide in `node_modules/next/dist/docs/` first.
- **UI work goes through Impeccable.** It comes from the official plugin `impeccable@impeccable`,
  enabled in `.claude/settings.json`; never copy it into the repo. Open Claude in this folder so
  the plugin loads. Load the `impeccable:impeccable` skill and follow its setup before touching a
  page, component, style or `public/` asset, even for a small change. A hook blocks those edits
  until you do (`UI_SKILL` / `UI_PATHS` in `.claude/agent-kit.conf`). Impeccable's detector then
  scans each edit and the whole session at the end; fix what it finds, or record a deliberate
  exception with `impeccable hooks ignore-value` and a reason.
- No secrets in git. Never Read/Edit `.env*`; never print keys.
- No remote actions unasked: no deploys, workflow runs, pushes or tags. Give Derek the commands.
  Derek's zsh breaks on `# ...` comments in pasted commands.

@PLAN.md
