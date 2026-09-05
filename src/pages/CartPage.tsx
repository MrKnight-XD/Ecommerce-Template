import { Link } from "react-router-dom";
import { describeVariant, useStore } from "../context/StoreContext";
import { getProductById } from "../data/products";
import { useDocumentTitle } from "../hooks/useApp";
import { createWhatsAppCartLink, openWhatsApp, resolveCartLines } from "../lib/whatsapp";
import { cx, formatINR } from "../lib/utils";
import { FREE_SHIPPING_THRESHOLD } from "../config/store";
import { Breadcrumbs, IconArrow, IconBag, IconMinus, IconPlus, IconRefresh, IconShield, IconTrash, IconTruck, IconWhatsApp, Img, Reveal } from "../components/ui";

const FLAT_SHIPPING = 79;

export default function CartPage() {
  const { cart, cartCount, subtotal, updateQty, removeFromCart } = useStore();
  useDocumentTitle("Your Bag", "Review your goods and checkout in one WhatsApp message.");

  const shipping = subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : FLAT_SHIPPING;
  const total = subtotal + shipping;
  const savings = cart.reduce((sum, item) => {
    const product = getProductById(item.productId);
    return product?.originalPrice ? sum + (product.originalPrice - product.price) * item.qty : sum;
  }, 0);

  const checkout = () => openWhatsApp(createWhatsAppCartLink(resolveCartLines(cart)));

  return (
    <div className="container-x pb-24 pt-8 md:pt-12">
      <Breadcrumbs trail={[{ label: "Your Bag" }]} />
      <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
        <h1 className="font-display text-4xl font-medium tracking-tight md:text-6xl">
          Your Bag <span className="text-ink-mute">({cartCount})</span>
        </h1>
        {cart.length > 0 && (
          <Link to="/shop" className="link-line text-xs font-bold uppercase tracking-[0.18em] text-pine">
            Continue shopping
          </Link>
        )}
      </div>

      {cart.length === 0 ? (
        <Reveal className="mt-12 flex flex-col items-center rounded-md border border-dashed border-mist px-6 py-24 text-center">
          <span className="flex h-24 w-24 items-center justify-center rounded-full bg-mist-soft text-ink-mute">
            <IconBag size={40} />
          </span>
          <h2 className="mt-6 font-display text-3xl font-medium">Nothing in here yet.</h2>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-ink-mute">
            Your future favourite object is probably in the collection. Nine goods, all of them kept for years.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/shop" className="btn btn-primary">
              Browse the shop <IconArrow size={15} className="btn-arrow" />
            </Link>
            <Link to="/shop?collection=bestsellers" className="btn btn-outline">
              See bestsellers
            </Link>
          </div>
        </Reveal>
      ) : (
        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_380px]">
          {/* Lines */}
          <div>
            <ul className="divide-y divide-mist border-y border-mist">
              {cart.map((item) => {
                const product = getProductById(item.productId);
                if (!product) return null;
                const variant = describeVariant(item);
                return (
                  <li key={item.key} className="anim-fade-in flex gap-5 py-6">
                    <Link to={`/product/${product.slug}`} className="shrink-0">
                      <Img src={product.image} alt={product.name} className="h-32 w-[104px] rounded-md sm:h-36 sm:w-28" />
                    </Link>
                    <div className="flex flex-1 flex-col">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-ink-mute">{product.category}</p>
                          <Link to={`/product/${product.slug}`} className="link-line mt-1 inline-block font-display text-lg font-medium leading-snug tracking-tight">
                            {product.name}
                          </Link>
                          {variant && <p className="mt-1 text-xs text-ink-mute">{variant}</p>}
                          <p className="mt-1 text-xs text-ink-mute">{formatINR(product.price)} each</p>
                        </div>
                        <button type="button" onClick={() => removeFromCart(item.key)} aria-label={`Remove ${product.name} from bag`} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-ink-mute transition-colors hover:bg-mist-soft hover:text-[#a05244]">
                          <IconTrash size={17} />
                        </button>
                      </div>
                      <div className="mt-auto flex items-center justify-between pt-3">
                        <div className="inline-flex items-center rounded-full border border-mist bg-card">
                          <button type="button" className="flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-mist-soft disabled:opacity-30" onClick={() => updateQty(item.key, item.qty - 1)} disabled={item.qty <= 1} aria-label={`Decrease quantity of ${product.name}`}>
                            <IconMinus size={13} />
                          </button>
                          <span className="w-8 text-center text-sm font-semibold tabular-nums" aria-live="polite">{item.qty}</span>
                          <button type="button" className="flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-mist-soft disabled:opacity-30" onClick={() => updateQty(item.key, item.qty + 1)} disabled={item.qty >= 9} aria-label={`Increase quantity of ${product.name}`}>
                            <IconPlus size={13} />
                          </button>
                        </div>
                        <p className="font-display text-xl font-semibold tabular-nums">{formatINR(product.price * item.qty)}</p>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
            <Link to="/shop" className="link-line mt-6 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-pine">
              <IconArrow size={14} className="rotate-180" /> Keep browsing
            </Link>
          </div>

          {/* Summary */}
          <aside className="h-fit lg:sticky lg:top-28">
            <Reveal className="rounded-md border border-mist bg-card p-6 md:p-7">
              <h2 className="font-display text-xl font-medium tracking-tight">Order summary</h2>
              <dl className="mt-5 space-y-3 text-sm">
                <div className="flex justify-between">
                  <dt className="text-ink-soft">Subtotal</dt>
                  <dd className="font-semibold tabular-nums">{formatINR(subtotal)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-ink-soft">Shipping</dt>
                  <dd className={cx("font-semibold tabular-nums", shipping === 0 && "text-pine")}>
                    {shipping === 0 ? "Free" : formatINR(shipping)}
                  </dd>
                </div>
                {savings > 0 && (
                  <div className="flex justify-between text-pine">
                    <dt>You're saving</dt>
                    <dd className="font-semibold tabular-nums">−{formatINR(savings)}</dd>
                  </div>
                )}
                {shipping > 0 && (
                  <p className="rounded-full bg-mist-soft px-3.5 py-2 text-xs text-ink-soft">
                    Add {formatINR(FREE_SHIPPING_THRESHOLD - subtotal)} more for free shipping
                  </p>
                )}
                <div className="flex justify-between border-t border-mist pt-4 text-base">
                  <dt className="font-semibold">Total</dt>
                  <dd className="font-display text-2xl font-semibold tabular-nums">{formatINR(total)}</dd>
                </div>
              </dl>
              <button type="button" onClick={checkout} className="btn btn-primary mt-6 w-full py-[1.1rem]!">
                <IconWhatsApp size={18} /> Checkout via WhatsApp
              </button>
              <p className="mt-3 text-center text-xs leading-relaxed text-ink-mute">
                Your full order is pre-filled in the chat — confirm details, pay by UPI, card or COD.
              </p>
              <div className="mt-5 grid gap-2 border-t border-mist pt-5 text-xs text-ink-soft">
                <p className="flex items-center gap-2.5"><IconShield size={15} className="text-pine" /> Secure payment, settled in chat</p>
                <p className="flex items-center gap-2.5"><IconTruck size={15} className="text-pine" /> Dispatched from Jaipur within 24h</p>
                <p className="flex items-center gap-2.5"><IconRefresh size={15} className="text-pine" /> 30-day returns, free pickup</p>
              </div>
            </Reveal>
          </aside>
        </div>
      )}
    </div>
  );
}
