---
name: Wildflower & Wonder
description: One painted cut-paper meadow, seen from a child's height
colors:
  cream: "#fbf3e2"
  paper: "#fffbf1"
  sage-pale: "#dbe4c9"
  sage: "#a2b38c"
  moss: "#3f573b"
  moss-deep: "#2f4530"
  rose-pale: "#f0d5cb"
  rose: "#c27e79"
  rose-deep: "#94504f"
  tan-pale: "#ecd9b6"
  tan: "#d5b585"
  brown: "#6b4b37"
  ink: "#3b2a1f"
  soil: "#3f2c21"
typography:
  display:
    fontFamily: "Caprasimo, Georgia, serif"
    fontSize: "clamp(2.1rem, 1.2rem + 3.9vw, 4.4rem)"
    fontWeight: 400
    lineHeight: 1.08
  headline:
    fontFamily: "Caprasimo, Georgia, serif"
    fontSize: "clamp(2rem, 1.35rem + 2.9vw, 3.6rem)"
    fontWeight: 400
    lineHeight: 1.08
  title:
    fontFamily: "Caprasimo, Georgia, serif"
    fontSize: "clamp(1.3rem, 1.15rem + .6vw, 1.6rem)"
    fontWeight: 400
    lineHeight: 1.15
  slogan:
    fontFamily: "Caprasimo, Georgia, serif"
    fontSize: "clamp(1.35rem, 1.1rem + 1vw, 1.9rem)"
    fontWeight: 400
    lineHeight: 1.2
  wordmark:
    fontFamily: "Caprasimo, Georgia, serif"
    fontSize: "1.9rem"
    fontWeight: 400
    lineHeight: 1.2
  caption:
    fontFamily: "Andika, Trebuchet MS, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
  body:
    fontFamily: "Andika, Trebuchet MS, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 400
    lineHeight: 1.6
rounded:
  cut-7: "7px"
  cut-8: "8px"
  cut-11: "11px"
  cut-12: "12px"
  cut-13: "13px"
  cut-14: "14px"
  cut-15: "15px"
  cut-16: "16px"
  cut-17: "17px"
  cut-18: "18px"
  cut-20: "20px"
  cut-22: "22px"
  cut-24: "24px"
  cut-26: "26px"
  cut-28: "28px"
  tab: "17px 22px 15px 24px"
  tab-small: "13px 17px 12px 18px"
  scrap: "46% 54% 50% 50% / 52% 48% 54% 46%"
spacing:
  gutter: "1.25rem"
  band: "clamp(3rem, 2rem + 4.5vw, 6rem)"
components:
  tab:
    backgroundColor: "{colors.rose-deep}"
    textColor: "{colors.paper}"
    rounded: "{rounded.tab}"
    padding: ".7rem 1.7rem .8rem"
  tab-pencil:
    textColor: "{colors.brown}"
    rounded: "{rounded.tab}"
    padding: ".6rem 1.5rem .7rem"
---

# Design System: Wildflower & Wonder

## Overview

**Creative North Star: "The Cut-Paper Meadow"**

The site is one landscape made of hand-painted paper, cut with scissors and layered, seen from a child's height.
Scrolling goes down through it: cream morning sky, moss hill, pale sage, rose field, tan path, forest floor, soil.

**Key Characteristics:**
- Full-width sheets of color meet along scissor-cut edges.
- Flowers and animals are large, textured and few; text areas stay calm.
- What is real is painted. What isn't released is a pencil outline.
- Light comes from the upper left; everything grows up from the ground.

## Colors

Five brand families, pinned by the owner: sage, cream, dusty rose, earthy brown, natural tan. Ochre appears only
inside illustrations (bees, flower centers).

**The Whole Sheet Rule.** Color covers a whole band. Never scatter it as small accents on cream.

**The Reading Rule.** Text is ink, moss, brown or rose-deep on light sheets and cream on moss or soil. Sage, rose and tan are sheets, never text.

## Typography

Caprasimo is the picture-book lettering, for headings, prices and the slogan. Andika, drawn for early readers,
carries everything else: 18px for reading, never below 16px for captions and labels. The brand name at display size is the rendered lettering `public/art/title.webp`.

## Layout

A 74rem column inside full-width bands. Headings sit left, with offset or staggered content beside them. At 899px
bands become one column; at 759px the header becomes a menu and scenes swap to their tall drawings.

## Elevation & Depth

Paper lies on paper: soft, warm brown, downward contact shadows. Larger pieces cast longer ones.

## Shapes

Corners are uneven, as if cut by hand: each box mixes four of the `cut-*` steps, never one radius all round. Band edges come from `public/art/edge-a|b|c.svg`, the same lines the scenes plant their stems on.

## Components

- **Band** (`.band` + `.edge-a|b|c`): set `--band` to a sheet color. Grain sits under a 60% wash so text stays clear.
- **Tab** (`.tab`): the one primary action. Lifts 3px and turns -1.2 degrees on hover.
- **Pencil tab** (`.tab-pencil`): a status, not a button. Marks what can't be bought yet.
- **Scrap**: an uneven cream round holding one piece.
- **The hunt** (`components/Meadow.tsx`): five hidden creatures fly to their outlines. Home only; once per site.
- **Shelf**: a plant on a hill with its label on the hill. Pencil shelves paint themselves in on hover.

Motion is lift, small turn, settle, with `cubic-bezier(.16, 1, .3, 1)`. Only the bee loops. Reduced motion swaps states instantly.

## Do's and Don'ts

### Do:
- **Do** draw new art in `art/` with the same paper pieces and render it.
- **Do** give every page a band sequence that ends in the forest floor.
- **Do** keep touch targets at least 44px.

### Don't:
- **Don't** paint something that isn't real yet.
- **Don't** use stock photos, clip art, emoji or icon fonts beside the paper art.
- **Don't** build rows of identical rounded cards.
- **Don't** put full-strength grain or a busy scene behind text.
