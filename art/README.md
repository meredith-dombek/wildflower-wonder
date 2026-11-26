# Art

Every picture is drawn here from paper shapes, so there is nothing to license.

- `paper.mjs`: colors, paper texture, plants and animals · `sprites.mjs`: single pieces, painted and pencil
- `scenes.mjs`: meadow and forest floor, plus `EDGES`, the ground lines the page cuts its bands along
- `title.mjs`: brand lettering · `mockups.mjs`: placeholder product cover and link-preview image

Render: `npm install --no-save puppeteer-core`, then `node art/render.mjs [name]`. Uses Google Chrome (set `CHROME`
if it lives elsewhere). After rendering, run Impeccable's `embed-prompt` on changed images with `provenance.txt`.
