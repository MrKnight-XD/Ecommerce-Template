import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getProductBySlug, relatedProducts } from "../data/products";
import { useStore } from "../context/StoreContext";
import { useDocumentTitle } from "../hooks/useApp";
import { createWhatsAppProductLink, openWhatsApp } from "../lib/whatsapp";
import { cx, discountPercent, formatINR } from "../lib/utils";
import {
  Accordion,
  Breadcrumbs,
  IconArrow,
  IconBag,
  IconCheck,
  IconHeart,
  IconRefresh,
  IconShield,
  IconTruck,
  IconWhatsApp,
  Price,
  QtyStepper,
  Reveal,
  SectionHeader,
  Stars,
} from "../components/ui";
import { ProductCard } from "../components/ProductCard";
import { FREE_SHIPPING_THRESHOLD } from "../config/store";

const VIEWS = [
  { label: "Full view", position: "50% 50%", scale: 1 },
  { label: "Upper detail", position: "50% 16%", scale: 1.85 },
  { label: "Lower detail", position: "50% 84%", scale: 1.85 },
];

export default function ProductPage() {
  const { slug } = useParams<{ slug: string }>();
  const product = useMemo(() => (slug ? getProductBySlug(slug) : undefined), [slug]);
  const { addToCart, toggleWishlist, isWishlisted } = useStore();

  const [color, setColor] = useState(product?.colors[0]?.name);
  const [size, setSize] = useState(product?.sizes?.[0]);
  const [qty, setQty] = useState(1);
  const [view, setView] = useState(0);
  const [addState, setAddState] = useState<"idle" | "adding" | "added">("idle");
  const [buying, setBuying] = useState(false);

  /* Reset selections when navigating between products */
  useEffect(() => {
    setColor(product?.colors[0]?.name);
    setSize(product?.sizes?.[0]);
    setQty(1);
    setView(0);
    setAddState("idle");
    window.scrollTo({ top: 0 });
  }, [product?.id]);

  useDocumentTitle(
    product ? `${product.name} — ${formatINR(product.price)} | BRAND NAME HERE` : "Product not found",
    product?.description
  );

  /* Product structured data for SEO */
  useEffect(() => {
    if (!product) return;
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Product",
      name: product.name,
      description: product.description,
      sku: product.slug,
      aggregateRating: { "@type": "AggregateRating", ratingValue: product.rating, reviewCount: product.reviews },
      offers: {
        "@type": "Offer",
        priceCurrency: "INR",
        price: product.price,
        availability: product.stock === "in" ? "https://schema.org/InStock" : "https://schema.org/LimitedAvailability",
      },
    });
    document.head.appendChild(script);
    return () => script.remove();
  }, [product]);

  if (!product) {
    return (
      <div className="container-x flex flex-col items-center py-32 text-center">
        <p className="eyebrow">Error 404</p>
        <h1 className="mt-4 font-display text-4xl font-medium">That good doesn't exist.</h1>
        <p className="mt-3 max-w-sm text-sm text-ink-mute">The link may be old, or the batch may have retired. The collection, however, lives on.</p>
        <Link to="/shop" className="btn btn-primary mt-8">
          Back to the shop <IconArrow size={15} className="btn-arrow" />
        </Link>
      </div>
    );
  }

  const off = product.originalPrice ? discountPercent(product.originalPrice, product.price) : 0;
  const related = relatedProducts(product);
  const wishlisted = isWishlisted(product.id);

  const handleAdd = () => {
    if (addState !== "idle") return;
    setAddState("adding");
    window.setTimeout(() => {
      addToCart(product, { color, size, quantity: qty });
      setAddState("added");
      window.setTimeout(() => setAddState("idle"), 1400);
    }, 450);
  };

  const handleBuyNow = () => {
    if (buying) return;
    setBuying(true);
    /* Small delay so the pressed state is perceptible before the new tab opens */
    window.setTimeout(() => {
      openWhatsApp(createWhatsAppProductLink(product, { color, size, quantity: qty }));
      setBuying(false);
    }, 350);
  };

  const activeView = VIEWS[view];

  return (
    <div className="container-x pb-24 pt-8 md:pt-12">
      <Breadcrumbs trail={[{ label: "Shop", to: "/shop" }, { label: product.category, to: `/shop?cat=${encodeURIComponent(product.category)}` }, { label: product.name }]} />

      <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:gap-14 xl:gap-20">
        {/* Gallery */}
        <div className="lg:sticky lg:top-28 lg:self-start">
          <div className="relative overflow-hidden rounded-md bg-mist-soft">
            <div className="aspect-[4/5]">
              <img
                key={view}
                src={product.image}
                alt={`${product.name} — ${activeView.label.toLowerCase()}`}
                className="anim-fade-in h-full w-full object-cover"
                style={{ objectPosition: activeView.position, transform: `scale(${activeView.scale})`, transition: "transform 0.6s cubic-bezier(0.22,1,0.36,1), object-position 0.6s" }}
              />
            </div>
            <div className="absolute left-4 top-4 flex flex-col gap-1.5">
              {off > 0 && <span className="rounded-full bg-pine px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-paper">Save {off}%</span>}
              {product.isNew && <span className="rounded-full bg-brass px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-paper">New</span>}
            </div>
            {product.stock === "low" && (
              <span className="absolute right-4 top-4 flex items-center gap-1.5 rounded-full bg-paper/90 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-ink backdrop-blur-sm">
                <span className="relative flex h-2 w-2">
                  <span className="absolute h-full w-full animate-ping rounded-full bg-brass opacity-70" />
                  <span className="relative h-2 w-2 rounded-full bg-brass" />
                </span>
                Low stock
              </span>
            )}
          </div>
          <div className="mt-3 flex gap-3" role="tablist" aria-label="Product image views">
            {VIEWS.map((v, i) => (
              <button
                key={v.label}
                type="button"
                role="tab"
                aria-selected={view === i}
                aria-label={v.label}
                onClick={() => setView(i)}
                className={cx(
                  "relative h-24 w-20 overflow-hidden rounded-[5px] border-2 transition-all",
                  view === i ? "border-pine" : "border-transparent opacity-60 hover:opacity-100"
                )}
              >
                <img src={product.image} alt="" className="h-full w-full object-cover" style={{ objectPosition: v.position, transform: `scale(${Math.max(v.scale, 1.4)})` }} />
              </button>
            ))}
          </div>
        </div>

        {/* Info */}
        <div>
          <p className="eyebrow">{product.category} · Batch Nº {String(product.id).padStart(2, "0")}</p>
          <h1 className="mt-3 font-display text-[clamp(2rem,4vw,3rem)] font-medium leading-[1.05] tracking-tight">{product.name}</h1>

          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
            <span className="flex items-center gap-2">
              <Stars rating={product.rating} showValue />
              <span className="text-xs text-ink-mute">{product.reviews} reviews</span>
            </span>
            <span className="hidden h-3.5 w-px bg-mist sm:block" aria-hidden="true" />
            <span className={cx("flex items-center gap-1.5 text-xs font-semibold", product.stock === "in" ? "text-pine" : "text-brass")}>
              <span className={cx("h-1.5 w-1.5 rounded-full", product.stock === "in" ? "bg-pine" : "bg-brass")} aria-hidden="true" />
              {product.stock === "in" ? "In stock — ships in 24h" : "Only a few left"}
            </span>
          </div>

          <div className="mt-5 flex items-end gap-4">
            <Price product={product} size="lg" />
            <span className="pb-1 text-xs text-ink-mute">Inclusive of all taxes</span>
          </div>

          <p className="mt-6 max-w-lg text-[15px] leading-relaxed text-ink-soft">{product.description}</p>

          {/* Colour */}
          {product.colors.length > 1 && (
            <div className="mt-7">
              <p className="mb-2.5 text-[11px] font-bold uppercase tracking-[0.22em] text-ink-mute">
                Colour — <span className="text-ink">{color}</span>
              </p>
              <div className="flex gap-3">
                {product.colors.map((c) => (
                  <button
                    key={c.name}
                    type="button"
                    onClick={() => setColor(c.name)}
                    aria-label={`Colour ${c.name}`}
                    aria-pressed={color === c.name}
                    className={cx("h-9 w-9 rounded-full border-2 transition-all", color === c.name ? "border-pine ring-2 ring-pine/25" : "border-mist hover:border-ink/40")}
                    style={{ backgroundColor: c.hex }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Size */}
          {product.sizes && (
            <div className="mt-7">
              <div className="mb-2.5 flex items-center justify-between">
                <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-ink-mute">Size</p>
                <span className="text-xs text-ink-mute">True to size</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSize(s)}
                    aria-pressed={size === s}
                    className={cx(
                      "min-w-12 rounded-full border px-4 py-2.5 text-sm font-semibold transition-all",
                      size === s ? "border-ink bg-ink text-paper shadow-sm" : "border-mist bg-card text-ink-soft hover:border-ink/40 hover:text-ink"
                    )}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Qty + wishlist */}
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <QtyStepper value={qty} onChange={(v) => setQty(Math.max(1, v))} label={`Quantity for ${product.name}`} />
            <button
              type="button"
              onClick={() => toggleWishlist(product)}
              aria-pressed={wishlisted}
              className={cx(
                "flex h-11 items-center gap-2 rounded-full border px-5 text-xs font-bold uppercase tracking-wider transition-all",
                wishlisted ? "border-pine bg-pine/5 text-pine" : "border-ink/20 text-ink-soft hover:border-ink hover:text-ink"
              )}
            >
              <IconHeart size={15} filled={wishlisted} />
              {wishlisted ? "Saved" : "Wishlist"}
            </button>
          </div>

          {/* CTAs — Buy Now is the primary conversion */}
          <div className="mt-8 space-y-3">
            <button type="button" onClick={handleBuyNow} disabled={buying} className="btn btn-primary w-full py-[1.15rem]! text-[13px]!">
              {buying ? (
                <>
                  <span className="h-4 w-4 animate-[spin-slow_0.8s_linear_infinite] rounded-full border-2 border-paper/40 border-t-paper" aria-hidden="true" />
                  Opening WhatsApp…
                </>
              ) : (
                <>
                  <IconWhatsApp size={18} /> Buy Now — {formatINR(product.price * qty)}
                </>
              )}
            </button>
            <button type="button" onClick={handleAdd} disabled={addState !== "idle"} className={cx("btn w-full", addState === "added" ? "btn-primary" : "btn-outline")}>
              {addState === "adding" ? (
                <>
                  <span className="h-4 w-4 animate-[spin-slow_0.8s_linear_infinite] rounded-full border-2 border-ink/25 border-t-ink" aria-hidden="true" />
                  Adding…
                </>
              ) : addState === "added" ? (
                <>
                  <IconCheck size={16} /> Added to bag
                </>
              ) : (
                <>
                  <IconBag size={16} /> Add to bag
                </>
              )}
            </button>
          </div>

          {/* Shipping summary */}
          <div className="mt-6 grid gap-2.5 rounded-md border border-mist bg-card p-4 text-[13px] text-ink-soft">
            <p className="flex items-center gap-3">
              <IconTruck size={17} className="shrink-0 text-pine" />
              Free shipping over {formatINR(FREE_SHIPPING_THRESHOLD)} · arrives in 3–5 days
            </p>
            <p className="flex items-center gap-3">
              <IconRefresh size={17} className="shrink-0 text-pine" />
              30-day returns, no questions asked
            </p>
            <p className="flex items-center gap-3">
              <IconShield size={17} className="shrink-0 text-pine" />
              Pay securely by UPI, card or cash on delivery
            </p>
          </div>

          {/* Accordions */}
          <div className="mt-8">
            <Accordion
              items={[
                {
                  title: "Shipping & delivery",
                  content: (
                    <p>
                      Orders are dispatched from our Jaipur studio within 24 hours. Delivery takes 3–5 working days
                      anywhere in India and is free on orders over {formatINR(FREE_SHIPPING_THRESHOLD)}. You'll receive
                      tracking details in your WhatsApp chat the moment the parcel leaves.
                    </p>
                  ),
                },
                {
                  title: "Returns & exchanges",
                  content: (
                    <p>
                      Changed your mind? Send it back within 30 days in its original condition for a full refund or an
                      exchange — we'll arrange the pickup. Leather goods that develop faults are repaired free, for life,
                      under our repair promise.
                    </p>
                  ),
                },
                {
                  title: "Materials & care",
                  content: (
                    <div>
                      <p className="font-semibold text-ink">{product.material}</p>
                      <ul className="mt-3 space-y-2">
                        {product.details.map((detail) => (
                          <li key={detail} className="flex gap-2.5">
                            <IconCheck size={14} className="mt-0.5 shrink-0 text-pine" />
                            {detail}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ),
                },
              ]}
            />
          </div>
        </div>
      </div>

      {/* Related */}
      <section className="mt-24" aria-labelledby="related-heading">
        <SectionHeader
          eyebrow="Pairs well with"
          title={<span id="related-heading">Complete <em className="font-light italic text-pine">the set.</em></span>}
          link={{ label: "View all goods", to: "/shop" }}
        />
        <div className="grid grid-cols-2 gap-x-5 gap-y-10 md:gap-x-6 lg:grid-cols-4">
          {related.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      </section>

      <Reveal className="mt-20 flex flex-col items-center rounded-md bg-pine-deep px-6 py-12 text-center text-paper md:py-16">
        <p className="eyebrow text-brass-soft!">Questions about this good?</p>
        <h2 className="mt-4 max-w-xl font-display text-3xl font-medium leading-tight md:text-4xl">
          A maker — not a bot — will answer on WhatsApp.
        </h2>
        <button type="button" onClick={handleBuyNow} className="btn btn-outline-light mt-8">
          <IconWhatsApp size={16} /> Ask about the {product.name}
        </button>
      </Reveal>
    </div>
  );
}
