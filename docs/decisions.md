# Decisions

Settled choices and why. Check this before proposing an alternative. To change a
decision, add a new entry that supersedes the old one; don't edit history.

Format: `## YYYY-MM-DD — Title` · **Decision** · **Why** · (optional) **Supersedes**

---

## 2026-11-25 — React / Next.js web app
**Decision:** wildflower-wonder will be a React / Next.js web app.
**Why:** Derek's choice at repo setup; the reason wasn't given. Version, styling and hosting are open.

## 2026-11-25 — Agent tools come from plugins
**Decision:** agent-kit (`agent-kit@derekadombek`) and Impeccable (`impeccable@impeccable`) are
enabled in `.claude/settings.json`. No hook or skill copies in this repo.
**Why:** same as Derek's other repos: a plugin updates in one place, copies have to be updated per repo.

## 2026-11-25 — Impeccable on every UI change
**Decision:** edits to `UI_PATHS` in `.claude/agent-kit.conf` are blocked until the session has loaded
Impeccable. The globs are broad until the app is scaffolded; then narrow them to its real folders.
**Why:** a skill otherwise loads only when the agent thinks the task matches, so UI work can skip it.

## 2026-11-25 — Cut-paper meadow
**Decision:** one painted cut-paper world, sky to soil, for the whole site. `DESIGN.md` records it. Built
code-led, with art drawn in `art/` and rendered to images.
**Why:** chosen by the user from three looks. It carries the brief's colors and motifs, matches what preschoolers
make, and unreleased products can honestly show as pencil outlines. Original art needs no licences.

## 2026-11-25 — Plain CSS, few dependencies
**Decision:** Next.js 16.4, TypeScript, plain CSS (tokens in `app/theme.css`, CSS modules per component). No Tailwind,
no UI kit, no CMS.
**Why:** the owner is a beginner: one file of named colors and a few files of words are easier to edit than a framework.

## 2026-11-25 — Words and products live in content/
**Decision:** all copy, products, categories and menu links are in `content/*.ts`.
**Why:** adding a product must be copying one block, not a rebuild. TypeScript catches a missing field before publishing.

## 2026-11-25 — Build in steps
**Decision:** one reviewable step at a time, in `PLAN.md` order. Links appear only when their page exists.
**Why:** the user said it needn't be one shot.

## 2026-11-25 — UI gate narrowed
**Decision:** `UI_PATHS` is now `app/*.tsx`, `app/*.css`, `components/`, `art/`, `public/`, `DESIGN.md`. `content/` is not gated.
**Why:** the app is scaffolded; word and price changes don't need the design skill.
**Supersedes:** the broad globs in "Impeccable on every UI change"; the rule itself stands.
