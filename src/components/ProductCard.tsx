import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import type { Product } from "../data/products";
import { useStore } from "../context/StoreContext";
import { useLockBody, useOnEscape } from "../hooks/useApp";
import { createWhatsAppProductLink, openWhatsApp } from "../lib/whatsapp";
import { cx, discountPercent } from "../lib/utils";
import { IconArrowUpRight, IconBag, IconClose, IconHeart, IconWhatsApp, Img, Price, QtyStepper, Reveal, Stars } from "./ui";

/* ============================================================================
 *  PRODUCT CARD — image crossfade, wishlist, quick view, add-to-cart, Buy Now.
 * ==========================================================================*/

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const { addToCart, toggleWishlist, isWishlisted } = useStore();
  const [quickView, setQuickView] = useState(false);
  const navigate = useNavigate();
  const off = product.originalPrice ? discountPercent(product.originalPrice, product.price) : 0;
  const wishlisted = isWishlisted(product.id);

  const quickAdd = () => {
    if (product.sizes && product.sizes.length > 0) {
      navigate(`/product/${product.slug}`);
    } else {
      addToCart(product, { color: product.colors[0]?.name, quantity: 1 });
    }
  };

  const buyNow = () => {
    openWhatsApp(
      createWhatsAppProductLink(product, {
        color: product.colors[0]?.name,
        size: product.sizes ? product.sizes[Math.floor(product.sizes.length / 2)] : undefined,
        quantity: 1,
      })
    );
  };

  return (
    <Reveal as="article" delay={(index % 4) * 70} className="group flex flex-col">
      <div className="relative overflow-hidden rounded-md">
        <Link to={`/product/${product.slug}`} aria-label={product.name} className="block">
          <div className="relative aspect-[4/5] overflow-hidden bg-mist-soft">
            <Img
              src={product.image}
              alt={`${product.name} — ${product.category}`}
              className="absolute inset-0"
              imgClassName="transition-transform duration-[900ms] ease-out group-hover:scale-[1.06]"
              sizes="(max-width: 640px) 50vw, (max-width: 1280px) 33vw, 25vw"
            />
            {/* second "view" — tighter crop revealed on hover */}
            <div className="absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100">
              <Img
                src={product.image}
                alt=""
                className="absolute inset-0"
                imgClassName="scale-[1.28] object-center [object-position:50%_18%] transition-transform duration-[900ms] ease-out group-hover:scale-[1.34]"
              />
            </div>
          </div>
        </Link>

        {/* badges */}
        <div className="pointer-events-none absolute left-3 top-3 flex flex-col gap-1.5">
          {off > 0 && (
            <span className="rounded-full bg-pine px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-paper">
              Save {off}%
            </span>
          )}
          {product.isNew && (
            <span className="rounded-full bg-brass px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-paper">
              New
            </span>
          )}
        </div>

        {/* wishlist */}
        <button
          type="button"
          onClick={() => toggleWishlist(product)}
          aria-label={wishlisted ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`}
          aria-pressed={wishlisted}
          className={cx(
            "absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full border backdrop-blur-sm transition-all duration-300",
            wishlisted
              ? "border-pine bg-pine text-paper"
              : "border-ink/10 bg-paper/85 text-ink hover:border-pine hover:text-pine"
          )}
        >
          <IconHeart size={16} filled={wishlisted} />
        </button>

        {/* hover action bar */}
        <div className="absolute inset-x-3 bottom-3 flex translate-y-0 items-center gap-2 rounded-full border border-ink/8 bg-paper/95 p-1.5 opacity-100 shadow-card backdrop-blur transition-all duration-400 md:translate-y-[calc(100%+16px)] md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 md:group-focus-within:translate-y-0 md:group-focus-within:opacity-100">
          <button
            type="button"
            onClick={() => setQuickView(true)}
            className="flex h-9 flex-1 items-center justify-center gap-1.5 rounded-full text-xs font-bold uppercase tracking-wider text-ink transition-colors hover:bg-mist-soft"
          >
            Quick view
            <IconArrowUpRight size={13} />
          </button>
          <button
            type="button"
            onClick={quickAdd}
            aria-label={product.sizes ? `Choose options for ${product.name}` : `Add ${product.name} to bag`}
            title={product.sizes ? "Choose options" : "Add to bag"}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-pine text-paper transition-colors hover:bg-pine-deep"
          >
            <IconBag size={16} />
          </button>
        </div>
      </div>

      {/* meta */}
      <div className="flex flex-1 flex-col pt-4">
        <div className="flex items-center justify-between gap-2">
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-ink-mute">{product.category}</p>
          <span className="flex items-center gap-1.5">
            <Stars rating={product.rating} size={11} />
            <span className="text-[11px] text-ink-mute">({product.reviews})</span>
          </span>
        </div>
        <h3 className="mt-1.5 font-display text-[17px] font-medium leading-snug tracking-tight">
          <Link to={`/product/${product.slug}`} className="link-line decoration-pine">
            {product.name}
          </Link>
        </h3>
        <div className="mt-1.5">
          <Price product={product} />
        </div>
        <div className="mt-3 flex items-center gap-2">
          <button
            type="button"
            onClick={buyNow}
            className="btn btn-outline btn-sm flex-1 text-[10px]!"
            aria-label={`Buy ${product.name} now via WhatsApp`}
          >
            <IconWhatsApp size={14} className="text-pine" />
            Buy Now
          </button>
          <button
            type="button"
            onClick={quickAdd}
            className="btn btn-primary btn-sm px-3.5!"
            aria-label={product.sizes ? `Choose options for ${product.name}` : `Add ${product.name} to bag`}
          >
            <IconBag size={14} />
            {product.sizes ? "Options" : "Add"}
          </button>
        </div>
      </div>

      {quickView && <QuickView product={product} onClose={() => setQuickView(false)} />}
    </Reveal>
  );
}

/* ============================================================================
 *  QUICK VIEW MODAL
 * ==========================================================================*/

function QuickView({ product, onClose }: { product: Product; onClose: () => void }) {
  const { addToCart } = useStore();
  const [color, setColor] = useState(product.colors[0]?.name);
  const [size, setSize] = useState(product.sizes?.[0]);
  const [qty, setQty] = useState(1);
  const navigate = useNavigate();
  useLockBody(true);
  useOnEscape(onClose);

  return (
    <div className="fixed inset-0 z-[75] flex items-end justify-center p-0 sm:items-center sm:p-6" role="dialog" aria-modal="true" aria-label={`Quick view: ${product.name}`}>
      <button type="button" aria-label="Close quick view" onClick={onClose} className="anim-fade-in absolute inset-0 bg-night/60 backdrop-blur-[2px]" />
      <div className="anim-fade-up relative grid max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-t-xl bg-card shadow-lift sm:grid-cols-2 sm:rounded-xl" style={{ animationDuration: "0.4s" }}>
        <div className="relative hidden sm:block">
          <Img src={product.image} alt={product.name} className="h-full min-h-[420px]" eager />
          {product.originalPrice && (
            <span className="absolute left-4 top-4 rounded-full bg-pine px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-paper">
              Save {discountPercent(product.originalPrice, product.price)}%
            </span>
          )}
        </div>
        <div className="flex flex-col p-6 sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-brass">{product.category}</p>
              <h3 className="mt-1.5 font-display text-2xl font-medium tracking-tight">{product.name}</h3>
            </div>
            <button type="button" onClick={onClose} aria-label="Close" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-mist text-ink-soft transition-colors hover:border-ink hover:text-ink">
              <IconClose size={16} />
            </button>
          </div>

          <div className="mt-2 flex items-center gap-2">
            <Stars rating={product.rating} showValue />
            <span className="text-xs text-ink-mute">· {product.reviews} reviews</span>
          </div>
          <div className="mt-3">
            <Price product={product} size="lg" />
          </div>
          <p className="mt-3 text-sm leading-relaxed text-ink-soft">{product.description}</p>

          {product.colors.length > 1 && (
            <div className="mt-5">
              <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.2em] text-ink-mute">
                Colour — <span className="text-ink">{color}</span>
              </p>
              <div className="flex gap-2.5">
                {product.colors.map((c) => (
                  <button
                    key={c.name}
                    type="button"
                    onClick={() => setColor(c.name)}
                    aria-label={`Colour ${c.name}`}
                    aria-pressed={color === c.name}
                    className={cx(
                      "h-8 w-8 rounded-full border-2 transition-all",
                      color === c.name ? "border-pine ring-2 ring-pine/25" : "border-mist hover:border-ink/40"
                    )}
                    style={{ backgroundColor: c.hex }}
                  />
                ))}
              </div>
            </div>
          )}

          {product.sizes && (
            <div className="mt-5">
              <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.2em] text-ink-mute">Size</p>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSize(s)}
                    aria-pressed={size === s}
                    className={cx(
                      "min-w-11 rounded-full border px-3 py-1.5 text-xs font-semibold transition-all",
                      size === s ? "border-ink bg-ink text-paper" : "border-mist bg-paper text-ink-soft hover:border-ink/40"
                    )}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-5 flex items-center gap-3">
            <QtyStepper value={qty} onChange={(v) => setQty(Math.max(1, v))} label={`Quantity for ${product.name}`} />
            <button
              type="button"
              className="btn btn-ink btn-sm flex-1"
              onClick={() => {
                addToCart(product, { color, size, quantity: qty });
                onClose();
              }}
            >
              <IconBag size={15} /> Add to bag
            </button>
          </div>
          <button
            type="button"
            className="btn btn-primary mt-2.5 w-full"
            onClick={() =>
              openWhatsApp(createWhatsAppProductLink(product, { color, size, quantity: qty }))
            }
          >
            <IconWhatsApp size={16} /> Buy Now on WhatsApp
          </button>
          <Link
            to={`/product/${product.slug}`}
            onClick={onClose}
            className="link-line mx-auto mt-4 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.18em] text-pine"
          >
            View full details <IconArrowUpRight size={13} />
          </Link>
        </div>
      </div>
    </div>
  );
}
