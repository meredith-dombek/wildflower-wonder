// ─────────────────────────────────────────────────────────────
//  YOUR PRODUCTS AND SHOP SHELVES
//  To add a product: copy everything from one { to its matching },
//  paste it below the last one, and change the words.
// ─────────────────────────────────────────────────────────────

export type Product = {
  slug: string; // the product's web address: lowercase words with dashes
  name: string;
  kind: "digital" | "physical";
  category: CategoryId;
  price: number; // in dollars
  ages: string;
  status: "coming-soon" | "available";
  summary: string;
  format: string;
  cover: string; // a picture inside the "public" folder
  coverAlt: string; // describe the picture for people who can't see it
  inside: string[];
};

export const products: Product[] = [
  {
    slug: "my-little-nature-explorer-pack",
    name: "My Little Nature Explorer Pack",
    kind: "digital",
    category: "digital-downloads",
    price: 6.99,
    ages: "3–6",
    status: "coming-soon",
    summary:
      "Nine pages to print, tuck under your arm and take outside. Your child hunts, matches, counts, colors and glues, and comes home a certified Little Explorer.",
    format: "Nine-page printable PDF",
    cover: "/products/my-little-nature-explorer-pack/cover.webp",
    coverAlt:
      "Pack cover in cut paper: a rabbit on a green hill among tall flowers, with a bee and a butterfly above.",
    inside: [
      "Nature scavenger hunt",
      "Leaf identification activity",
      "Flower coloring page",
      "Bug discovery worksheet",
      "Nature matching game",
      "Outdoor observation sheet",
      "Nature counting activity",
      "Create-your-own nature collage",
      "Little Explorer certificate",
    ],
  },
];

export type CategoryId = "digital-downloads" | "nature-crafts" | "seasonal-activities" | "activity-bundles" | "craft-kits";

// open: true  = the shelf has something on it and shows in full color
// open: false = the shelf is planned and shows as a pencil outline
export const categories: { id: CategoryId; name: string; plan: string; plant: string; open: boolean }[] = [
  { id: "digital-downloads", name: "Digital Downloads", plan: "Scavenger hunts, coloring pages, nature journals and worksheets to print.", plant: "plant-poppy", open: true },
  { id: "nature-crafts", name: "Nature Crafts", plan: "Things to make from what you find on a walk.", plant: "plant-daisy", open: false },
  { id: "seasonal-activities", name: "Seasonal Activities", plan: "Activity packs to match what’s happening outside.", plant: "plant-balsam", open: false },
  { id: "activity-bundles", name: "Activity Bundles", plan: "Several activities gathered together.", plant: "plant-lupine", open: false },
  { id: "craft-kits", name: "Physical Craft Kits", plan: "Hands-on kits and boxes that arrive by mail.", plant: "plant-cone", open: false },
];
