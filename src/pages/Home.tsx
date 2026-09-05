import { Link } from "react-router-dom";
import { ATELIER_IMAGE, PRODUCTS, TESTIMONIALS, categoryCount } from "../data/products";
import { useDocumentTitle, useReveal } from "../hooks/useApp";
import { formatINR, cx } from "../lib/utils";
import {
  IconArrow,
  IconArrowUpRight,
  IconChat,
  IconLeaf,
  IconShield,
  IconStarSolid,
  IconTruck,
  Img,
  Marquee,
  Reveal,
  SectionHeader,
  Stars,
} from "../components/ui";
import { ProductCard } from "../components/ProductCard";

/* ---------- hero ---------- */
function Hero() {
  const [ref, inView] = useReveal<HTMLDivElement>(0.15);
  const hoodie = PRODUCTS[0];
  const sneaker = PRODUCTS[3];
  const overshirt = PRODUCTS[2];

  return (
    <section aria-labelledby="hero-heading">
      <div ref={ref as React.Ref<HTMLDivElement>} className={cx("relative overflow-hidden", inView && "is-in")}>
      {/* ambient watermark */}
      <p className="pointer-events-none absolute -top-8 left-0 select-none font-display text-[26vw] font-semibold italic leading-none text-ink/[0.035]" aria-hidden="true">
        ✦
      </p>

      <div className="container-x grid items-center gap-14 pb-20 pt-12 md:pt-16 lg:grid-cols-12 lg:gap-8 lg:pb-28">
        {/* Copy */}
        <div className="relative z-10 lg:col-span-6 lg:pr-8">
          <p className="eyebrow anim-fade-up flex items-center gap-3" style={{ animationDelay: "80ms" }}>
            <span className="inline-block h-px w-10 bg-brass" aria-hidden="true" />
            The Permanent Collection · Nº 09
          </p>
          <h1 id="hero-heading" className="mt-6 font-display text-[clamp(2.9rem,7.2vw,5.6rem)] font-medium leading-[1.02] tracking-[-0.02em] text-ink">
            <span className="mask-line">
              <span style={{ ["--line-delay" as string]: "120ms" }}>Considered goods,</span>
            </span>
            <span className="mask-line">
              <span style={{ ["--line-delay" as string]: "240ms" }}>
                made to be <em className="font-light italic text-pine">kept.</em>
              </span>
            </span>
          </h1>
          <p className="anim-fade-up mt-6 max-w-md text-[15px] leading-relaxed text-ink-soft" style={{ animationDelay: "420ms" }}>
            Premium essentials designed in Jaipur — heavyweight cotton, vegetable-tanned leather
            and waxed canvas, cut in small numbered batches. One WhatsApp message away.
          </p>
          <div className="anim-fade-up mt-9 flex flex-wrap items-center gap-3.5" style={{ animationDelay: "540ms" }}>
            <Link to="/shop" className="btn btn-primary">
              Explore Collection <IconArrow size={16} className="btn-arrow" />
            </Link>
            <Link to="/about" className="btn btn-outline">
              Our Story
            </Link>
          </div>
          <div className="anim-fade-up mt-10 flex flex-wrap items-center gap-x-8 gap-y-3" style={{ animationDelay: "660ms" }}>
            <span className="flex items-center gap-2.5">
              <Stars rating={4.8} />
              <span className="text-xs font-semibold text-ink-soft">4.8 · 1,200+ reviews</span>
            </span>
            <span className="hidden h-4 w-px bg-mist sm:block" aria-hidden="true" />
            <span className="text-xs font-semibold tracking-wide text-ink-mute">
              Free shipping over {formatINR(999)} · COD across India
            </span>
          </div>
        </div>

        {/* Imagery */}
        <div className="relative lg:col-span-6">
          <div className="relative ml-auto w-full max-w-[480px]">
            {/* offset frame */}
            <div className="absolute -right-4 -top-4 h-full w-full rounded-md border border-brass/50" aria-hidden="true" />
            <div className="anim-fade-up relative overflow-hidden rounded-md" style={{ animationDelay: "200ms" }}>
              <div className="aspect-[4/5]">
                <Img src={hoodie.image} alt={hoodie.name} eager className="h-full" imgClassName="anim-kenburns" sizes="(max-width: 1024px) 90vw, 44vw" />
              </div>
              <figcaption className="absolute bottom-4 left-4 rounded-full bg-paper/90 px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-ink backdrop-blur-sm">
                Nº 01 — {hoodie.name}
              </figcaption>
            </div>

            {/* overlapping secondary */}
            <Link
              to={`/product/${sneaker.slug}`}
              className="anim-fade-up group absolute -bottom-10 -left-6 hidden w-40 -rotate-3 overflow-hidden rounded-md border-4 border-paper shadow-lift transition-transform duration-500 hover:rotate-0 sm:block md:-left-14 md:w-48"
              style={{ animationDelay: "480ms" }}
              aria-label={`${sneaker.name} — ${formatINR(sneaker.price)}`}
            >
              <Img src={sneaker.image} alt={sneaker.name} className="aspect-[4/5]" imgClassName="transition-transform duration-700 group-hover:scale-108" />
              <span className="absolute inset-x-0 bottom-0 bg-night/70 px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-paper backdrop-blur-sm">
                {sneaker.name}
              </span>
            </Link>

            {/* floating product chip */}
            <Link
              to={`/product/${overshirt.slug}`}
              className="anim-fade-up absolute bottom-16 right-1 flex w-[210px] items-center gap-3 rounded-md border border-mist bg-card p-2.5 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lift md:-right-10"
              style={{ animationDelay: "620ms" }}
            >
              <Img src={overshirt.image} alt="" className="h-14 w-12 shrink-0 rounded-[4px]" />
              <span className="min-w-0">
                <span className="block truncate text-xs font-semibold">{overshirt.name}</span>
                <span className="mt-0.5 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-brass">
                  Just landed <IconArrowUpRight size={11} />
                </span>
              </span>
            </Link>

            {/* rotating stamp */}
            <div className="absolute -left-9 -top-9 hidden h-28 w-28 md:block" aria-hidden="true">
              <svg viewBox="0 0 100 100" className="h-full w-full" style={{ animation: "spin-slow 24s linear infinite" }}>
                <defs>
                  <path id="stamp-circle" d="M50,50 m-38,0 a38,38 0 1,1 76,0 a38,38 0 1,1 -76,0" />
                </defs>
                <text fontSize="9.2" letterSpacing="2.6" className="fill-brass font-body font-semibold uppercase">
                  <textPath href="#stamp-circle">Jaipur · Small batch · Numbered ·</textPath>
                </text>
                <path d="M50 39 L59 50 L50 61 L41 50 Z" className="fill-pine" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      </div>
    </section>
  );
}

/* ---------- value marquee ---------- */
const MARQUEE_ITEMS = [
  "Free shipping over ₹999",
  "Small numbered batches",
  "Lifetime repairs on leather",
  "30-day easy returns",
  "COD available across India",
  "Designed in Jaipur",
];

function ValueMarquee() {
  return (
    <div className="border-y border-ink/12 bg-card py-4">
      <Marquee duration={36}>
        {MARQUEE_ITEMS.map((item) => (
          <span key={item} className="flex items-center">
            <span className="px-6 font-display text-[15px] italic tracking-wide text-ink-soft md:px-8">{item}</span>
            <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true" className="text-brass">
              <path d="M5 0l1.2 3.8L10 5 6.2 6.2 5 10 3.8 6.2 0 5l3.8-1.2L5 0z" fill="currentColor" />
            </svg>
          </span>
        ))}
      </Marquee>
    </div>
  );
}

export default function Home() {
  useDocumentTitle(
    "Considered Goods, Made to Last",
    "Premium small-batch apparel, footwear and everyday carry. Designed in Jaipur, made to be kept. Free shipping over ₹999."
  );

  const featured = PRODUCTS.filter((p) => p.featured).slice(0, 8);
  const bestsellers = PRODUCTS.filter((p) => p.bestseller);
  const newArrivals = PRODUCTS.filter((p) => p.isNew);

  return (
    <>
      <Hero />
      <ValueMarquee />

      {/* Featured */}
      <section className="container-x py-20 md:py-28" aria-labelledby="featured-heading">
        <SectionHeader
          eyebrow="The Permanent Collection"
          title={
            <span id="featured-heading">
              Nine goods. <em className="font-light italic text-pine">Nothing</em> disposable.
            </span>
          }
          link={{ label: "View all goods", to: "/shop" }}
        />
        <div className="grid grid-cols-2 gap-x-5 gap-y-10 md:gap-x-6 lg:grid-cols-4">
          {featured.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="container-x pb-20 md:pb-28" aria-labelledby="categories-heading">
        <SectionHeader
          eyebrow="Browse by category"
          title={<span id="categories-heading">Every object, <em className="font-light italic text-pine">accounted for.</em></span>}
        />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-12 lg:grid-rows-[280px_280px]">
          <CategoryTile name="Apparel" to="/shop?cat=Apparel" image={PRODUCTS[0].image} count={categoryCount("Apparel")} className="lg:col-span-5 lg:row-span-2" big />
          <CategoryTile name="Footwear" to="/shop?cat=Footwear" image={PRODUCTS[3].image} count={categoryCount("Footwear")} className="lg:col-span-4" />
          <CategoryTile name="Accessories" to="/shop?cat=Accessories" image={PRODUCTS[6].image} count={categoryCount("Accessories")} className="lg:col-span-3" />
          <CategoryTile name="Carry" to="/shop?cat=Carry" image={PRODUCTS[7].image} count={categoryCount("Carry")} className="sm:col-span-2 lg:col-span-7" wide />
        </div>
      </section>

      {/* Promo band */}
      <section className="relative overflow-hidden bg-night py-20 text-paper md:py-28" aria-labelledby="promo-heading">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.1]"
          style={{ backgroundImage: "radial-gradient(circle at 1px 1px, #F2F0E9 1px, transparent 0)", backgroundSize: "24px 24px" }}
          aria-hidden="true"
        />
        <div className="container-x relative grid items-center gap-12 lg:grid-cols-[1.2fr_1fr]">
          <Reveal>
            <p className="eyebrow text-brass-soft!">Just out of the atelier</p>
            <h2 id="promo-heading" className="mt-5 font-display text-[clamp(2.4rem,5.5vw,4.2rem)] font-medium leading-[1.04] tracking-tight">
              The New <em className="font-light italic text-brass-soft">Essentials</em>
              <span className="block text-paper/85">have landed.</span>
            </h2>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-paper/65">
              Three new objects join the permanent collection this season — a flannel overshirt,
              a wool field cap and a merino beanie. Batch numbers are limited.
            </p>
            <div className="mt-8 flex flex-wrap gap-3.5">
              <Link to="/shop?collection=new" className="btn btn-primary">
                Shop New Arrivals <IconArrow size={16} className="btn-arrow" />
              </Link>
              <Link to="/about" className="btn btn-outline-light">
                How they're made
              </Link>
            </div>
          </Reveal>
          <div className="flex items-end justify-center gap-4 lg:justify-end lg:pr-6">
            {newArrivals.map((product, i) => (
              <Reveal key={product.id} delay={i * 130}>
                <Link
                  to={`/product/${product.slug}`}
                  className={cx(
                    "group block w-[34vw] max-w-[180px] overflow-hidden rounded-md border-4 border-paper/10 shadow-lift transition-all duration-500 hover:-translate-y-2 hover:border-brass-soft/60",
                    i === 0 && "-rotate-3",
                    i === 1 && "translate-y-4",
                    i === 2 && "rotate-3"
                  )}
                >
                  <Img src={product.image} alt={product.name} className="aspect-[4/5]" imgClassName="transition-transform duration-700 group-hover:scale-106" />
                  <span className="flex items-center justify-between bg-paper px-3 py-2.5 text-[10px] font-bold uppercase tracking-wider text-ink">
                    {product.name}
                    <IconArrowUpRight size={12} className="text-brass transition-transform group-hover:translate-x-0.5" />
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Bestsellers */}
      <section className="container-x py-20 md:py-28" aria-labelledby="bestsellers-heading">
        <SectionHeader
          eyebrow="Most reordered"
          title={<span id="bestsellers-heading">The goods people <em className="font-light italic text-pine">come back for.</em></span>}
          link={{ label: "Shop bestsellers", to: "/shop?collection=bestsellers" }}
        />
        <div className="no-scrollbar -mx-[clamp(1.25rem,4vw,3.5rem)] flex snap-x snap-mandatory gap-5 overflow-x-auto px-[clamp(1.25rem,4vw,3.5rem)] pb-2 md:gap-6">
          {bestsellers.map((product, i) => (
            <div key={product.id} className="w-[240px] shrink-0 snap-start sm:w-[280px]">
              <ProductCard product={product} index={i} />
            </div>
          ))}
        </div>
      </section>

      {/* Brand story */}
      <BrandStory />

      {/* Trust strip */}
      <section className="border-y border-ink/12 bg-card" aria-label="Why shop with us">
        <div className="container-x grid grid-cols-1 divide-y divide-ink/10 sm:grid-cols-2 sm:divide-x lg:grid-cols-4 lg:divide-y-0">
          {[
            { icon: <IconLeaf size={22} />, title: "Premium materials", copy: "Supima cotton, full-grain leather, extra-fine merino — nothing synthetic, nothing hidden." },
            { icon: <IconShield size={22} />, title: "Secure shopping", copy: "Pay by UPI, card or cash on delivery — settled safely in your WhatsApp chat." },
            { icon: <IconTruck size={22} />, title: "Fast shipping", copy: "Dispatched within 24 hours from Jaipur. 3–5 days anywhere in India, free over ₹999." },
            { icon: <IconChat size={22} />, title: "Human support", copy: "A real person answers within minutes, 7 days a week. No bots, no ticket numbers." },
          ].map((item, i) => (
            <Reveal key={item.title} delay={i * 90} className="flex items-start gap-4 px-6 py-8 lg:py-10">
              <span className="mt-0.5 text-pine">{item.icon}</span>
              <span>
                <span className="block font-display text-[17px] font-medium tracking-tight">{item.title}</span>
                <span className="mt-1.5 block text-[13px] leading-relaxed text-ink-mute">{item.copy}</span>
              </span>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Reviews */}
      <Reviews />
    </>
  );
}

/* ---------- category tile ---------- */
function CategoryTile({
  name,
  to,
  image,
  count,
  className,
  big = false,
  wide = false,
}: {
  name: string;
  to: string;
  image: string;
  count: number;
  className?: string;
  big?: boolean;
  wide?: boolean;
}) {
  return (
    <Reveal className={cx("group relative", className)}>
      <Link to={to} className="block h-full overflow-hidden rounded-md" aria-label={`Shop ${name} — ${count} products`}>
        <div className={cx("relative w-full", big ? "h-full min-h-[300px]" : wide ? "h-[240px] lg:h-full" : "h-[240px] lg:h-full")}>
          <Img src={image} alt="" className="absolute inset-0" imgClassName="transition-transform duration-[900ms] ease-out group-hover:scale-107" />
          <div className="absolute inset-0 bg-gradient-to-t from-night/75 via-night/10 to-transparent transition-opacity duration-500" />
          <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-5">
            <div>
              <p className={cx("font-display font-medium tracking-tight text-paper", big ? "text-3xl" : "text-xl")}>{name}</p>
              <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-paper/65">{count} {count === 1 ? "good" : "goods"}</p>
            </div>
            <span className="flex h-10 w-10 items-center justify-center rounded-full border border-paper/40 text-paper transition-all duration-300 group-hover:border-brass-soft group-hover:bg-brass-soft group-hover:text-night">
              <IconArrowUpRight size={16} />
            </span>
          </div>
        </div>
      </Link>
    </Reveal>
  );
}

/* ---------- brand story ---------- */
function BrandStory() {
  return (
    <section className="container-x py-20 md:py-28" aria-labelledby="story-heading">
      <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <Reveal>
            <p className="eyebrow">The promise</p>
            <h2 id="story-heading" className="mt-5 font-display text-[clamp(2.2rem,4.5vw,3.6rem)] font-medium leading-[1.06] tracking-tight">
              Fewer, better things —
              <br />
              <em className="font-light italic text-pine">made slowly,</em> made once.
            </h2>
            <p className="mt-6 max-w-md text-[15px] leading-relaxed text-ink-soft">
              We started with a simple frustration: everything was designed to be
              replaced. So we began making the opposite — a permanent collection of nine objects,
              each engineered with the people who use it, in batches small enough to number by hand.
            </p>
            <p className="mt-4 max-w-md text-[15px] leading-relaxed text-ink-soft">
              Every stitch, rivet and seam is chosen for the decade ahead. And when life happens —
              a torn strap, a worn sole — our repair bench in Jaipur puts it right, for life.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-6">
              <Link to="/about" className="btn btn-ink">
                Read our story <IconArrow size={15} className="btn-arrow" />
              </Link>
              <p className="font-display text-lg italic text-ink-mute">— The Atelier</p>
            </div>
          </Reveal>
        </div>

        <div>
          <Reveal>
            <figure className="relative">
              <div className="absolute -left-4 -top-4 h-full w-full rounded-md border border-brass/50" aria-hidden="true" />
              <div className="relative overflow-hidden rounded-md">
                <div className="aspect-[16/11]">
                  <Img src={ATELIER_IMAGE} alt="The atelier — fabrics, leather and tools arranged on an oak table" className="h-full" imgClassName="anim-kenburns" sizes="(max-width: 1024px) 92vw, 46vw" />
                </div>
              </div>
              <figcaption className="mt-3 text-xs text-ink-mute">The cutting bench in Chandpol Bazar, Jaipur — where every batch begins.</figcaption>
            </figure>
          </Reveal>
          <div className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-md border border-mist bg-mist sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
            {[
              { value: "06", label: "Years of craft" },
              { value: "42", label: "Partner artisans" },
              { value: "18k+", label: "Goods shipped" },
              { value: "4.8", label: "Average rating" },
            ].map((stat, i) => (
              <Reveal key={stat.label} delay={i * 80} className="bg-card px-5 py-6">
                <p className="font-display text-3xl font-medium tracking-tight text-pine">{stat.value}</p>
                <p className="mt-1 text-[11px] font-bold uppercase tracking-[0.18em] text-ink-mute">{stat.label}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- reviews ---------- */
function Reviews() {
  const [lead, ...rest] = TESTIMONIALS;
  return (
    <section className="container-x py-20 md:py-28" aria-labelledby="reviews-heading">
      <SectionHeader
        eyebrow="Word of mouth"
        title={<span id="reviews-heading">Kept, worn, <em className="font-light italic text-pine">recommended.</em></span>}
        align="center"
      />
      <div className="grid gap-5 lg:grid-cols-[1.15fr_1fr]">
        <Reveal className="relative flex flex-col justify-between overflow-hidden rounded-md bg-pine-deep p-8 text-paper md:p-12">
          <span className="pointer-events-none absolute -top-8 left-6 select-none font-display text-[180px] italic leading-none text-paper/10" aria-hidden="true">
            "
          </span>
          <div className="relative">
            <span className="flex gap-1 text-brass-soft" aria-label={`${lead.rating} stars`}>
              {Array.from({ length: 5 }).map((_, i) => (
                <IconStarSolid key={i} size={16} />
              ))}
            </span>
            <blockquote className="mt-6 font-display text-2xl font-light leading-[1.35] tracking-tight md:text-[30px]">
              "{lead.quote}"
            </blockquote>
          </div>
          <footer className="relative mt-8 flex items-center gap-4">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brass-soft font-display text-sm font-semibold italic text-night">
              {lead.initials}
            </span>
            <div>
              <p className="text-sm font-semibold">{lead.name}</p>
              <p className="text-xs text-paper/60">{lead.city} · bought the {lead.product}</p>
            </div>
            <span className="ml-auto hidden rounded-full border border-paper/25 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-paper/70 sm:block">
              Verified buyer
            </span>
          </footer>
        </Reveal>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
          {rest.slice(0, 4).map((t, i) => (
            <Reveal key={t.name} delay={i * 90} className="flex flex-col rounded-md border border-mist bg-card p-6 transition-shadow duration-300 hover:shadow-card">
              <Stars rating={t.rating} />
              <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-ink-soft">"{t.quote}"</blockquote>
              <footer className="mt-5 flex items-center gap-3 border-t border-mist pt-4">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-mist-soft font-display text-xs font-semibold italic text-ink-soft">
                  {t.initials}
                </span>
                <div>
                  <p className="text-xs font-bold">{t.name}</p>
                  <p className="text-[11px] text-ink-mute">{t.city}</p>
                </div>
              </footer>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
