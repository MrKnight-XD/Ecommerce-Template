import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FREE_SHIPPING_THRESHOLD } from "../config/store";
import { CATEGORIES, PRODUCTS, getProductById } from "../data/products";
import { describeVariant, useStore } from "../context/StoreContext";
import { useLockBody, useOnEscape } from "../hooks/useApp";
import { createWhatsAppCartLink, openWhatsApp, resolveCartLines } from "../lib/whatsapp";
import { cx, formatINR } from "../lib/utils";
import {
  IconArrow,
  IconArrowUpRight,
  IconBag,
  IconCheck,
  IconClose,
  IconMinus,
  IconPlus,
  IconSearch,
  IconTrash,
  IconWhatsApp,
  Img,
} from "./ui";

/* ============================================================================
 *  CART DRAWER
 * ==========================================================================*/

export function CartDrawer() {
  const { isCartOpen, setCartOpen, cart, updateQty, removeFromCart, subtotal, cartCount } = useStore();
  useLockBody(isCartOpen);
  useOnEscape(() => setCartOpen(false), isCartOpen);
  if (!isCartOpen) return null;

  const remaining = FREE_SHIPPING_THRESHOLD - subtotal;
  const progress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);
  const checkout = () => openWhatsApp(createWhatsAppCartLink(resolveCartLines(cart)));

  return (
    <div className="fixed inset-0 z-[70]" role="dialog" aria-modal="true" aria-label="Shopping bag">
      <button type="button" aria-label="Close bag" onClick={() => setCartOpen(false)} className="anim-fade-in absolute inset-0 w-full bg-night/55 backdrop-blur-[2px]" />
      <aside className="anim-drawer absolute inset-y-0 right-0 flex w-full max-w-[430px] flex-col bg-paper shadow-lift">
        {/* Header */}
        <header className="flex items-center justify-between border-b border-mist px-6 py-5">
          <h2 className="font-display text-xl font-medium tracking-tight">
            Your Bag <span className="text-ink-mute">({cartCount})</span>
          </h2>
          <button type="button" onClick={() => setCartOpen(false)} aria-label="Close bag" className="flex h-9 w-9 items-center justify-center rounded-full border border-mist text-ink-soft transition-colors hover:border-ink hover:text-ink">
            <IconClose size={16} />
          </button>
        </header>

        {/* Free shipping meter */}
        <div className="border-b border-mist bg-card px-6 py-4">
          {remaining > 0 ? (
            <p className="text-xs font-medium text-ink-soft">
              You're <strong className="text-pine">{formatINR(remaining)}</strong> away from{" "}
              <strong>free shipping</strong>
            </p>
          ) : (
            <p className="flex items-center gap-1.5 text-xs font-semibold text-pine">
              <IconCheck size={13} /> Free shipping unlocked
            </p>
          )}
          <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-mist">
            <div
              className="h-full rounded-full bg-pine transition-[width] duration-700 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Lines */}
        <div className="thin-scroll flex-1 overflow-y-auto px-6 py-5">
          {cart.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <span className="flex h-20 w-20 items-center justify-center rounded-full bg-mist-soft text-ink-mute">
                <IconBag size={34} />
              </span>
              <h3 className="mt-5 font-display text-xl font-medium">Your bag is empty</h3>
              <p className="mt-2 max-w-[240px] text-sm text-ink-mute">
                Goods made to be kept are waiting. Start with a bestseller.
              </p>
              <Link to="/shop" onClick={() => setCartOpen(false)} className="btn btn-primary btn-sm mt-6">
                Browse the shop <IconArrow size={14} className="btn-arrow" />
              </Link>
            </div>
          ) : (
            <ul className="space-y-5">
              {cart.map((item) => {
                const product = getProductById(item.productId);
                if (!product) return null;
                const variant = describeVariant(item);
                return (
                  <li key={item.key} className="anim-fade-in flex gap-4">
                    <Link to={`/product/${product.slug}`} onClick={() => setCartOpen(false)} className="shrink-0">
                      <Img src={product.image} alt={product.name} className="h-24 w-20 rounded-[5px]" />
                    </Link>
                    <div className="flex flex-1 flex-col">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <Link to={`/product/${product.slug}`} onClick={() => setCartOpen(false)} className="font-display text-[15px] font-medium leading-snug tracking-tight hover:text-pine">
                            {product.name}
                          </Link>
                          {variant && <p className="mt-0.5 text-xs text-ink-mute">{variant}</p>}
                        </div>
                        <button type="button" onClick={() => removeFromCart(item.key)} aria-label={`Remove ${product.name} from bag`} className="text-ink-mute transition-colors hover:text-[#a05244]">
                          <IconTrash size={16} />
                        </button>
                      </div>
                      <div className="mt-auto flex items-center justify-between pt-2">
                        <div className="inline-flex items-center rounded-full border border-mist bg-card">
                          <button type="button" className="flex h-7 w-7 items-center justify-center rounded-full transition-colors hover:bg-mist-soft disabled:opacity-30" onClick={() => updateQty(item.key, item.qty - 1)} disabled={item.qty <= 1} aria-label="Decrease quantity">
                            <IconMinus size={12} />
                          </button>
                          <span className="w-6 text-center text-xs font-semibold tabular-nums">{item.qty}</span>
                          <button type="button" className="flex h-7 w-7 items-center justify-center rounded-full transition-colors hover:bg-mist-soft disabled:opacity-30" onClick={() => updateQty(item.key, item.qty + 1)} disabled={item.qty >= 9} aria-label="Increase quantity">
                            <IconPlus size={12} />
                          </button>
                        </div>
                        <p className="text-sm font-semibold tabular-nums">{formatINR(product.price * item.qty)}</p>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <footer className="border-t border-mist bg-card px-6 py-5">
            <div className="flex items-center justify-between text-sm">
              <span className="text-ink-soft">Subtotal</span>
              <span className="font-display text-lg font-semibold tabular-nums">{formatINR(subtotal)}</span>
            </div>
            <p className="mt-1 text-xs text-ink-mute">Shipping and payment settled in the chat — COD, UPI or card.</p>
            <button type="button" onClick={checkout} className="btn btn-primary mt-4 w-full">
              <IconWhatsApp size={17} /> Checkout via WhatsApp
            </button>
            <button type="button" onClick={() => setCartOpen(false)} className="btn btn-outline btn-sm mt-2.5 w-full">
              Continue shopping
            </button>
            <Link
              to="/cart"
              onClick={() => setCartOpen(false)}
              className="link-line mx-auto mt-3.5 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-pine"
            >
              View full bag page <IconArrow size={13} />
            </Link>
          </footer>
        )}
      </aside>
    </div>
  );
}

/* ============================================================================
 *  SEARCH OVERLAY
 * ==========================================================================*/

export function SearchOverlay() {
  const { isSearchOpen, setSearchOpen } = useStore();
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  useLockBody(isSearchOpen);
  useOnEscape(() => setSearchOpen(false), isSearchOpen);

  useEffect(() => {
    if (isSearchOpen) {
      setQuery("");
      setActiveIndex(0);
      window.setTimeout(() => inputRef.current?.focus(), 60);
    }
  }, [isSearchOpen]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return PRODUCTS.filter((p) =>
      [p.name, p.category, p.material, ...p.tags].join(" ").toLowerCase().includes(q)
    ).slice(0, 6);
  }, [query]);

  const matchedCategories = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return CATEGORIES.filter((c) => c.name.toLowerCase().includes(q) || c.blurb.toLowerCase().includes(q));
  }, [query]);

  useEffect(() => setActiveIndex(0), [results.length, query]);

  if (!isSearchOpen) return null;

  const go = (slug: string) => {
    setSearchOpen(false);
    navigate(`/product/${slug}`);
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (event.key === "Enter" && results[activeIndex]) {
      go(results[activeIndex].slug);
    }
  };

  const popular = PRODUCTS.filter((p) => p.bestseller).slice(0, 4);

  return (
    <div className="fixed inset-0 z-[80]" role="dialog" aria-modal="true" aria-label="Search">
      <button type="button" aria-label="Close search" onClick={() => setSearchOpen(false)} className="anim-fade-in absolute inset-0 w-full bg-night/60 backdrop-blur-[3px]" />
      <div className="anim-fade-up relative mx-auto mt-[8vh] w-[min(680px,92vw)] overflow-hidden rounded-lg bg-paper shadow-lift" style={{ animationDuration: "0.35s" }}>
        {/* Input */}
        <div className="flex items-center gap-3 border-b border-mist px-5 py-4">
          <IconSearch size={20} className="shrink-0 text-ink-mute" />
          <input
            ref={inputRef}
            type="search"
            role="searchbox"
            aria-label="Search products"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Search goods, categories, materials…"
            className="w-full bg-transparent font-display text-lg tracking-tight outline-none placeholder:text-ink-mute/70 [&::-webkit-search-cancel-button]:hidden"
          />
          <button type="button" onClick={() => setSearchOpen(false)} className="hidden shrink-0 rounded border border-mist px-2 py-1 text-[10px] font-bold tracking-wider text-ink-mute transition-colors hover:border-ink hover:text-ink sm:block">
            ESC
          </button>
        </div>

        <div className="max-h-[56vh] overflow-y-auto p-2.5">
          {!query.trim() && (
            <div className="px-3 py-4">
              <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-ink-mute">Popular right now</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {popular.map((p) => (
                  <button key={p.id} type="button" onClick={() => go(p.slug)} className="rounded-full border border-mist bg-card px-3.5 py-1.5 text-xs font-semibold text-ink-soft transition-all hover:border-pine hover:text-pine">
                    {p.name}
                  </button>
                ))}
              </div>
              <p className="mt-6 text-[11px] font-bold uppercase tracking-[0.22em] text-ink-mute">Browse categories</p>
              <div className="mt-3 grid grid-cols-2 gap-2">
                {CATEGORIES.map((c) => (
                  <Link key={c.name} to={`/shop?cat=${encodeURIComponent(c.name)}`} onClick={() => setSearchOpen(false)} className="group flex items-center gap-3 rounded-md border border-mist bg-card p-2.5 transition-colors hover:border-pine">
                    <Img src={c.image} alt="" className="h-11 w-11 rounded-[4px]" />
                    <span className="text-sm font-semibold text-ink group-hover:text-pine">{c.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {query.trim() && results.length === 0 && matchedCategories.length === 0 && (
            <div className="px-6 py-12 text-center">
              <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-mist-soft text-ink-mute">
                <IconSearch size={26} />
              </span>
              <h3 className="mt-4 font-display text-lg font-medium">Nothing found for "{query.trim()}"</h3>
              <p className="mx-auto mt-1.5 max-w-[300px] text-sm text-ink-mute">
                Try "hoodie", "leather" or "wool" — or browse the full collection.
              </p>
              <Link to="/shop" onClick={() => setSearchOpen(false)} className="btn btn-outline btn-sm mt-5">
                Browse all goods
              </Link>
            </div>
          )}

          {matchedCategories.length > 0 && (
            <div className="px-3 pb-2 pt-3">
              <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-ink-mute">Categories</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {matchedCategories.map((c) => (
                  <Link key={c.name} to={`/shop?cat=${encodeURIComponent(c.name)}`} onClick={() => setSearchOpen(false)} className="rounded-full bg-ink px-3.5 py-1.5 text-xs font-semibold text-paper transition-colors hover:bg-pine">
                    {c.name}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {results.length > 0 && (
            <ul role="listbox" aria-label="Search results" className="pt-1">
              {results.map((p, i) => (
                <li key={p.id} role="option" aria-selected={i === activeIndex}>
                  <button
                    type="button"
                    onClick={() => go(p.slug)}
                    onMouseEnter={() => setActiveIndex(i)}
                    className={cx(
                      "flex w-full items-center gap-4 rounded-md px-3 py-2.5 text-left transition-colors",
                      i === activeIndex ? "bg-mist-soft" : "hover:bg-mist-soft/60"
                    )}
                  >
                    <Img src={p.image} alt="" className="h-14 w-12 shrink-0 rounded-[4px]" />
                    <span className="flex-1">
                      <span className="block font-display text-[15px] font-medium tracking-tight">{p.name}</span>
                      <span className="text-xs text-ink-mute">{p.category} · ★ {p.rating.toFixed(1)}</span>
                    </span>
                    <span className="text-sm font-semibold tabular-nums">{formatINR(p.price)}</span>
                    <IconArrowUpRight size={15} className={cx("transition-opacity", i === activeIndex ? "opacity-100" : "opacity-30")} />
                  </button>
                </li>
              ))}
            </ul>
          )}

          {results.length > 0 && (
            <div className="border-t border-mist px-4 py-3">
              <Link to="/shop" onClick={() => setSearchOpen(false)} className="group flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-pine">
                View all results in shop
                <IconArrow size={14} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ============================================================================
 *  TOASTS
 * ==========================================================================*/

export function ToastHost() {
  const { toasts, dismissToast, setCartOpen } = useStore();
  return (
    <div className="pointer-events-none fixed bottom-5 left-5 z-[95] flex w-[min(360px,calc(100vw-2.5rem))] flex-col gap-2.5" aria-live="polite" role="status">
      {toasts.map((toast) => (
        <div key={toast.id} className="anim-toast pointer-events-auto flex items-center gap-3.5 rounded-lg border border-paper/10 bg-ink p-3.5 text-paper shadow-lift">
          {toast.image ? (
            <Img src={toast.image} alt="" className="h-12 w-12 shrink-0 rounded-[5px]" />
          ) : (
            <span className={cx("flex h-9 w-9 shrink-0 items-center justify-center rounded-full", toast.tone === "success" ? "bg-pine text-paper" : "bg-brass text-paper")}>
              {toast.tone === "success" ? <IconCheck size={16} /> : <IconBag size={16} />}
            </span>
          )}
          <div className="min-w-0 flex-1">
            <p className="text-[13px] font-semibold leading-tight">{toast.title}</p>
            {toast.message && <p className="mt-0.5 truncate text-xs text-paper/60">{toast.message}</p>}
            {toast.tone === "success" && (
              <button type="button" onClick={() => { dismissToast(toast.id); setCartOpen(true); }} className="link-line mt-1 text-[11px] font-bold uppercase tracking-wider text-brass-soft">
                View bag
              </button>
            )}
          </div>
          <button type="button" onClick={() => dismissToast(toast.id)} aria-label="Dismiss notification" className="shrink-0 text-paper/40 transition-colors hover:text-paper">
            <IconClose size={15} />
          </button>
        </div>
      ))}
    </div>
  );
}


