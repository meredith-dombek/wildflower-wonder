# Your website guide

Simple steps for changing the site yourself. Chapters on your domain, payments, digital delivery and publishing
get added as we connect each one.

## See the site on your computer

1. Open the project folder in VS Code.
2. Open the menu **Terminal → New Terminal**.
3. The first time only, type `npm install` and press Enter.
4. Type `npm run dev` and press Enter.
5. In your web browser, go to `http://localhost:3000`.

Leave the terminal running while you work. Each time you save a file, the page updates. To stop, click the
terminal and press **Control + C**. Only you can see this preview.

## Change words

| To change | Open this file |
|---|---|
| Name, slogan, menu links, the text Google shows | `content/site.ts` |
| Home page words | `content/home.ts` |
| Products, prices, shop shelves | `content/products.ts` |

Change only what is between the quote marks, then save. Keep the quote marks and the comma at the end of the line.
If the page shows an error, press **Command + Z** until it goes away.

The large "Wildflower & Wonder" lettering at the top of Home is a picture, so it doesn't change with the words.

## Change colors

Open `app/theme.css`. Each line is one color, like `--sage: #a2b38c;`. Replace the code after the `#` with another
color code and save. Keep dark text on light colors so it stays easy to read. The painted flowers and animals are
pictures and keep their own colors.

## Change a product picture

1. Put your picture in `public/products/`, in the folder named after the product.
2. In `content/products.ts`, change that product's `cover` line to match, for example
   `/products/my-little-nature-explorer-pack/my-photo.jpg`.
3. Update `coverAlt` with one sentence describing the picture, for people who can't see it.

Use a new file name each time, so you never see an old saved copy. Upright pictures about 900 pixels wide and 1160 tall fit best.

## Add a product

1. In `content/products.ts`, copy the whole product from `{` to `},` and paste it below.
2. Give it a new `slug` (lowercase words with dashes) and change the rest.
3. Leave `status: "coming-soon"`. Nothing can be bought yet, and changing this word alone won't connect a checkout.

For now Home shows the first product in the list. The Shop page, which lists every product, is the next step.

## Color in a shop shelf

In `content/products.ts`, find the shelf and change `open: false` to `open: true`. It turns from pencil to paint.
Its link goes to the Explorer Pack until the Shop page is built, so wait until then.

## Never put a paid PDF in the "public" folder

Anyone can download anything in that folder. Paid files get their own private place in the checkout step.
