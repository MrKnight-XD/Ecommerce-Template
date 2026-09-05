/* ============================================================================
 *  AVANI — PRODUCT CATALOGUE
 *  ----------------------------------------------------------------------------
 *  Store owners: add a new product by appending an object to PRODUCTS below.
 *  Everything else (shop grid, search, filters, WhatsApp messages, related
 *  products) picks it up automatically. Keep `slug` unique.
 * ==========================================================================*/

const IMG = {
  hoodie: "https://image.qwenlm.ai/generated-images/a74bedc4-0f39-44f8-8d7f-5f20c1bed62a/_result.png",
  tee: "https://image.qwenlm.ai/generated-images/7ef25a91-63ad-4a57-a54b-0ab261eaa5e8/_result.png",
  overshirt: "https://image.qwenlm.ai/generated-images/e380c224-f8f4-484d-a438-9100094d2747/_result.png",
  sneaker: "https://image.qwenlm.ai/generated-images/bcc83699-4d2f-4d80-990f-5953d8adb056/_result.png",
  wallet: "https://image.qwenlm.ai/generated-images/a580a5d0-3d9a-4b85-af71-2f4bb1632ec1/_result.png",
  cap: "https://image.qwenlm.ai/generated-images/46a28c90-6c6f-4873-a225-de78b0f85ae5/_result.png",
  watch: "https://image.qwenlm.ai/generated-images/f0388315-ae26-4a20-8e73-f431bea435c7/_result.png",
  tote: "https://image.qwenlm.ai/generated-images/473bcd0b-b4c9-4e7e-84b2-7ca12c234c50/_result.png",
  beanie: "https://image.qwenlm.ai/generated-images/568f7925-4b34-4ca9-9a25-a5ed8aa976d7/_result.png",
} as const;

/** Editorial imagery used across the site (hero collage, story, promo). */
export const ATELIER_IMAGE =
  "https://image.qwenlm.ai/generated-images/86e3b626-e803-4451-9501-48552d4b4452/_result.png";

export type CategoryName = "Apparel" | "Footwear" | "Accessories" | "Carry";

export interface ProductColor {
  name: string;
  hex: string;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number;
  category: CategoryName;
  rating: number;
  reviews: number;
  image: string;
  description: string;
  details: string[];
  material: string;
  sizes?: string[];
  colors: ProductColor[];
  featured?: boolean;
  bestseller?: boolean;
  isNew?: boolean;
  stock: "in" | "low";
  addedOn: string; // ISO date — used for "Newest" sorting
  tags: string[];
}

export interface CartItem {
  /** Unique line key: productId | color | size */
  key: string;
  productId: number;
  color?: string;
  size?: string;
  qty: number;
}

export const PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Heavyweight Loop Hoodie",
    slug: "heavyweight-loop-hoodie",
    price: 2499,
    originalPrice: 2999,
    category: "Apparel",
    rating: 4.8,
    reviews: 124,
    image: IMG.hoodie,
    description:
      "A 480 GSM loopback cotton hoodie with a boxy cut, dropped shoulder and tonal flatlock stitching. Pre-washed so it never shrinks, never fades — it just breaks in.",
    details: [
      "480 GSM loopback French terry, garment-dyed",
      "Boxy fit with dropped shoulder",
      "Hidden phone pocket inside the kangaroo pouch",
      "Pre-washed — zero shrinkage, guaranteed",
    ],
    material: "100% Supima loopback cotton",
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "Ink", hex: "#1c211d" },
      { name: "Ash", hex: "#8f938c" },
    ],
    featured: true,
    bestseller: true,
    stock: "in",
    addedOn: "2025-09-12",
    tags: ["hoodie", "winter", "cotton", "unisex", "sweatshirt"],
  },
  {
    id: 2,
    name: "Boxy Heavyweight Tee",
    slug: "boxy-heavyweight-tee",
    price: 1299,
    originalPrice: 1599,
    category: "Apparel",
    rating: 4.7,
    reviews: 231,
    image: IMG.tee,
    description:
      "Cut from 240 GSM combed cotton with a ribbed collar that holds its shape wash after wash. The tee you reach for every single day — in the best way.",
    details: [
      "240 GSM combed Supima cotton",
      "Boxy, true-to-size fit",
      "Double-stitched ribbed collar",
      "Enzyme-washed for a broken-in feel",
    ],
    material: "100% combed Supima cotton",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "Ecru", hex: "#e9e4d8" },
      { name: "Ink", hex: "#1c211d" },
    ],
    featured: true,
    bestseller: true,
    stock: "in",
    addedOn: "2025-08-02",
    tags: ["tee", "t-shirt", "basics", "cotton", "unisex"],
  },
  {
    id: 3,
    name: "Flint Flannel Overshirt",
    slug: "flint-flannel-overshirt",
    price: 2799,
    originalPrice: 3299,
    category: "Apparel",
    rating: 4.9,
    reviews: 87,
    image: IMG.overshirt,
    description:
      "A brushed cotton flannel overshirt built to layer. Two chest pockets, corozo nut buttons, and a hem cut to sit perfectly over a tee or under a jacket.",
    details: [
      "Brushed 310 GSM cotton flannel",
      "Genuine corozo nut buttons",
      "Two chest pockets, two hand pockets",
      "Relaxed fit — size down for a closer cut",
    ],
    material: "100% brushed cotton flannel",
    sizes: ["M", "L", "XL"],
    colors: [{ name: "Olive", hex: "#5c6148" }],
    featured: true,
    isNew: true,
    stock: "low",
    addedOn: "2025-11-20",
    tags: ["overshirt", "shacket", "flannel", "layer", "jacket"],
  },
  {
    id: 4,
    name: "Court Sneaker 01",
    slug: "court-sneaker-01",
    price: 4499,
    originalPrice: 5499,
    category: "Footwear",
    rating: 4.8,
    reviews: 156,
    image: IMG.sneaker,
    description:
      "A clean-line court sneaker in full-grain leather with a natural gum sole. Stitched, not glued — so it can be resoled and worn for years, not seasons.",
    details: [
      "Full-grain leather upper, vegetable-tanned",
      "Natural gum rubber cupsole",
      "Blake-stitched construction — fully resoleable",
      "Recycled cotton laces, spare pair included",
    ],
    material: "Full-grain leather, gum rubber",
    sizes: ["UK 6", "UK 7", "UK 8", "UK 9", "UK 10", "UK 11"],
    colors: [{ name: "Bone", hex: "#e7e2d6" }],
    featured: true,
    bestseller: true,
    stock: "in",
    addedOn: "2025-07-18",
    tags: ["sneaker", "shoes", "leather", "footwear", "court"],
  },
  {
    id: 5,
    name: "Heritage Bifold Wallet",
    slug: "heritage-bifold-wallet",
    price: 1899,
    category: "Carry",
    rating: 4.9,
    reviews: 203,
    image: IMG.wallet,
    description:
      "Hand-stitched in Jaipur from a single piece of vegetable-tanned leather. Six card slots, two hidden sleeves, and a patina that gets better every year.",
    details: [
      "Single-piece vegetable-tanned leather",
      "Hand-stitched with waxed linen thread",
      "6 card slots + 2 hidden sleeves",
      "Lifetime repair promise included",
    ],
    material: "Vegetable-tanned cowhide leather",
    colors: [{ name: "Tan", hex: "#a9744a" }],
    featured: true,
    bestseller: true,
    stock: "in",
    addedOn: "2025-06-30",
    tags: ["wallet", "leather", "bifold", "gift", "handcrafted"],
  },
  {
    id: 6,
    name: "Field Wool Cap",
    slug: "field-wool-cap",
    price: 999,
    originalPrice: 1299,
    category: "Accessories",
    rating: 4.6,
    reviews: 64,
    image: IMG.cap,
    description:
      "A six-panel cap in dense wool twill with a vegetable-tanned leather strap closure. Quietly structured, endlessly wearable, four-season capable.",
    details: [
      "Dense 340 GSM wool twill",
      "Vegetable-tanned leather strap closure",
      "Pre-curved brim, brass hardware",
      "One size — adjustable 55–60 cm",
    ],
    material: "Wool twill, leather closure",
    colors: [
      { name: "Pine", hex: "#22392c" },
      { name: "Ink", hex: "#1c211d" },
    ],
    isNew: true,
    stock: "in",
    addedOn: "2025-12-01",
    tags: ["cap", "hat", "wool", "winter", "headwear"],
  },
  {
    id: 7,
    name: "Meridian Field Watch",
    slug: "meridian-field-watch",
    price: 6999,
    originalPrice: 8499,
    category: "Accessories",
    rating: 4.9,
    reviews: 41,
    image: IMG.watch,
    description:
      "A 38 mm field watch with a cream dial, brass case and Japanese quartz movement. Sapphire-coated glass, 5 ATM resistance, and a leather strap that moulds to you.",
    details: [
      "38 mm brass case, cream matte dial",
      "Japanese Miyota quartz movement",
      "Sapphire-coated mineral glass",
      "5 ATM water resistance, quick-release strap",
    ],
    material: "Brass, sapphire glass, leather",
    colors: [{ name: "Moss", hex: "#3d4a3c" }],
    featured: true,
    stock: "low",
    addedOn: "2025-10-05",
    tags: ["watch", "field watch", "brass", "gift", "timepiece"],
  },
  {
    id: 8,
    name: "Dock Canvas Tote",
    slug: "dock-canvas-tote",
    price: 1599,
    category: "Carry",
    rating: 4.7,
    reviews: 118,
    image: IMG.tote,
    description:
      "An 18-litre tote in 24 oz waxed canvas with bridle leather handles. Carries a laptop, a market haul, or a weekend away — and looks better the rougher you treat it.",
    details: [
      "24 oz waxed canvas, water-repellent",
      "Bridle leather handles, copper rivets",
      "Interior 15\" laptop sleeve + key leash",
      "18 L capacity, 12 kg rated load",
    ],
    material: "Waxed canvas, bridle leather",
    colors: [{ name: "Ecru", hex: "#e3dcc9" }],
    featured: true,
    bestseller: true,
    stock: "in",
    addedOn: "2025-08-25",
    tags: ["tote", "bag", "canvas", "laptop bag", "carry"],
  },
  {
    id: 9,
    name: "Cloud Rib Beanie",
    slug: "cloud-rib-beanie",
    price: 899,
    originalPrice: 1099,
    category: "Apparel",
    rating: 4.5,
    reviews: 52,
    image: IMG.beanie,
    description:
      "Knitted from extra-fine merino in a deep 2×2 rib. Warm without the itch, structured without the bulk — the beanie that stays on all day.",
    details: [
      "Extra-fine 19.5 micron merino wool",
      "Deep 2×2 rib knit, double-layered crown",
      "Naturally temperature-regulating",
      "One size with generous stretch",
    ],
    material: "100% extra-fine merino wool",
    colors: [
      { name: "Heather", hex: "#9b9b96" },
      { name: "Pine", hex: "#22392c" },
    ],
    isNew: true,
    stock: "in",
    addedOn: "2025-11-28",
    tags: ["beanie", "winter", "merino", "wool", "knit"],
  },
];

export const CATEGORIES: Array<{ name: CategoryName; blurb: string; image: string }> = [
  { name: "Apparel", blurb: "Heavyweight staples, cut to be kept.", image: IMG.hoodie },
  { name: "Footwear", blurb: "Stitched — never glued — and resoleable.", image: IMG.sneaker },
  { name: "Accessories", blurb: "Small objects with long lives.", image: IMG.watch },
  { name: "Carry", blurb: "Leather and canvas that earn their patina.", image: IMG.tote },
];

export const TESTIMONIALS = [
  {
    name: "Aarav Mehta",
    city: "Mumbai",
    rating: 5,
    quote:
      "The hoodie survived a Goa monsoon, a Delhi winter and about forty washes. It honestly looks better now than the day it arrived.",
    product: "Heavyweight Loop Hoodie",
    initials: "AM",
  },
  {
    name: "Sneha Kulkarni",
    city: "Pune",
    rating: 5,
    quote:
      "Ordered on WhatsApp at 11 pm, had a human reply in three minutes, and the wallet was at my door in two days. This is how every brand should work.",
    product: "Heritage Bifold Wallet",
    initials: "SK",
  },
  {
    name: "Rohan Bansal",
    city: "Bengaluru",
    rating: 4.5,
    quote:
      "Court Sneaker 01 is the cleanest white shoe I've owned. The fact that it can be resoled sold me — everything else is fast fashion.",
    product: "Court Sneaker 01",
    initials: "RB",
  },
  {
    name: "Ira Chatterjee",
    city: "Kolkata",
    rating: 5,
    quote:
      "The tote carries my laptop, gym kit and groceries without looking like a hiking bag. The waxed canvas has aged beautifully.",
    product: "Dock Canvas Tote",
    initials: "IC",
  },
  {
    name: "Dev Malhotra",
    city: "Jaipur",
    rating: 5,
    quote:
      "Bought the field watch for my father. The brass case and cream dial look twice the price. Packaging alone felt like a ceremony.",
    product: "Meridian Field Watch",
    initials: "DM",
  },
];

/* ---------- lookups ---------- */

export function getProductBySlug(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function getProductById(id: number): Product | undefined {
  return PRODUCTS.find((p) => p.id === id);
}

export function relatedProducts(product: Product, count = 4): Product[] {
  const sameCategory = PRODUCTS.filter(
    (p) => p.id !== product.id && p.category === product.category
  );
  const others = PRODUCTS.filter((p) => p.id !== product.id && p.category !== product.category);
  return [...sameCategory, ...others].slice(0, count);
}

export function categoryCount(name: CategoryName): number {
  return PRODUCTS.filter((p) => p.category === name).length;
}
