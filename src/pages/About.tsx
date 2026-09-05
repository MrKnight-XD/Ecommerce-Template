import { Link } from "react-router-dom";
import { ATELIER_IMAGE, PRODUCTS } from "../data/products";
import { useDocumentTitle } from "../hooks/useApp";
import { IconArrow, IconArrowUpRight, Img, Reveal } from "../components/ui";

const VALUES = [
  {
    n: "01",
    title: "Materials first, always",
    copy: "Supima cotton from Maharashtra, vegetable-tanned leather from Kanpur, extra-fine merino, 24 oz waxed canvas. If the material isn't something we'd keep for a decade, the object doesn't get made.",
  },
  {
    n: "02",
    title: "Small, numbered batches",
    copy: "Every run is limited and stamped with a batch number. It keeps quality obsessive and means your object was made by people, for people — not extruded by the kilometre.",
  },
  {
    n: "03",
    title: "Repair is a promise",
    copy: "Leather goods carry a lifetime repair promise; everything else gets two years, minimum. Send it back, our bench in Chandpol Bazar puts it right, and it goes back to work.",
  },
  {
    n: "04",
    title: "Honest, permanent pricing",
    copy: "No fake markups, no festival chaos. One fair price, occasional honest sales when a batch ends. The price you see is the price the object deserves.",
  },
];

const PROCESS = [
  { step: "Listen", copy: "Every object starts as a complaint from a customer — a strap that tore, a collar that curled. We keep a ledger of them." },
  { step: "Prototype", copy: "Our pattern makers cut three to five prototypes, each worn hard by the team for a month before anything is approved." },
  { step: "Number", copy: "Approved objects join the permanent collection with a batch number, a cost breakdown, and a care card signed by the maker." },
  { step: "Keep", copy: "Years later, the repair bench still has your batch on file. That's the whole point." },
];

export default function About() {
  useDocumentTitle(
    "Our Story — BRAND NAME HERE",
    "Nine considered goods made in small numbered batches from Jaipur — designed to be kept, repaired and passed on."
  );

  return (
    <div className="pb-24">
      {/* Opening statement */}
      <section className="container-x pt-14 md:pt-20" aria-labelledby="about-heading">
        <div className="max-w-4xl">
          <p className="eyebrow anim-fade-up">Our story · Est. 2026</p>
          <h1 id="about-heading" className="anim-fade-up mt-6 font-display text-[clamp(2.6rem,6.5vw,5rem)] font-medium leading-[1.04] tracking-tight" style={{ animationDelay: "120ms" }}>
            We make nine things.
            <br />
            <em className="font-light italic text-pine">On purpose.</em>
          </h1>
          <p className="anim-fade-up mt-7 max-w-2xl text-[15px] leading-relaxed text-ink-soft md:text-base" style={{ animationDelay: "240ms" }}>
            It began with a torn strap. Our founder watched a "premium" bag fail
            in six months and couldn't find a single person willing to repair it. The answer became
            obvious: stop making more things, start making things that stay. Today, forty-two
            partner artisans across Rajasthan, Kanpur and Coimbatore make a permanent collection
            of nine objects — each engineered for decades, numbered by hand, and sold the way we'd
            want to buy: one honest conversation away.
          </p>
        </div>

        <Reveal className="mt-14">
          <figure className="relative overflow-hidden rounded-md">
            <div className="aspect-[16/9] md:aspect-[21/9]">
              <Img src={ATELIER_IMAGE} alt="The atelier in Jaipur — fabrics, leather and tools on an oak table" eager className="h-full" imgClassName="anim-kenburns" sizes="94vw" />
            </div>
            <figcaption className="absolute bottom-5 left-5 rounded-full bg-paper/90 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.22em] text-ink backdrop-blur-sm">
              The atelier · Chandpol Bazar, Jaipur
            </figcaption>
          </figure>
        </Reveal>
      </section>

      {/* Values — editorial numbered rows */}
      <section className="container-x mt-20 md:mt-28" aria-labelledby="values-heading">
        <Reveal className="mb-12 max-w-2xl">
          <p className="eyebrow">What we refuse to compromise</p>
          <h2 id="values-heading" className="mt-4 font-display text-3xl font-medium leading-tight tracking-tight md:text-5xl">
            Four rules. <em className="font-light italic text-pine">No exceptions.</em>
          </h2>
        </Reveal>
        <div>
          {VALUES.map((value, i) => (
            <Reveal key={value.n} delay={i * 60}>
              <div className="group grid gap-4 border-t border-mist py-8 transition-colors last:border-b md:grid-cols-[100px_280px_1fr] md:gap-8 md:py-10">
                <p className="font-display text-3xl font-light italic text-brass transition-transform duration-500 group-hover:-translate-y-1 md:text-4xl">{value.n}</p>
                <h3 className="font-display text-xl font-medium tracking-tight md:text-2xl">{value.title}</h3>
                <p className="max-w-xl text-sm leading-relaxed text-ink-soft md:text-[15px]">{value.copy}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Process */}
      <section className="mt-20 bg-night py-20 text-paper md:mt-28 md:py-28" aria-labelledby="process-heading">
        <div className="container-x">
          <Reveal className="mb-14 max-w-2xl">
            <p className="eyebrow text-brass-soft!">How an object earns its place</p>
            <h2 id="process-heading" className="mt-4 font-display text-3xl font-medium leading-tight tracking-tight md:text-5xl">
              From complaint to <em className="font-light italic text-brass-soft">collection.</em>
            </h2>
          </Reveal>
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {PROCESS.map((item, i) => (
              <Reveal key={item.step} delay={i * 110}>
                <div className="relative pl-6">
                  <span className="absolute left-0 top-1.5 h-full w-px bg-paper/15" aria-hidden="true" />
                  <span className="absolute -left-[5px] top-1.5 h-[11px] w-[11px] rounded-full border-2 border-brass-soft bg-night" aria-hidden="true" />
                  <p className="text-[11px] font-bold uppercase tracking-[0.26em] text-brass-soft">Step {i + 1}</p>
                  <h3 className="mt-3 font-display text-2xl font-medium tracking-tight">{item.step}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-paper/60">{item.copy}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* The nine */}
      <section className="container-x mt-20 md:mt-28" aria-labelledby="nine-heading">
        <Reveal className="mb-10 flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            <p className="eyebrow">The permanent collection</p>
            <h2 id="nine-heading" className="mt-4 font-display text-3xl font-medium leading-tight tracking-tight md:text-5xl">
              Nine objects, <em className="font-light italic text-pine">each with a job.</em>
            </h2>
          </div>
          <Link to="/shop" className="group mb-1.5 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-pine">
            <span className="link-line">Meet them all</span>
            <IconArrow size={15} className="transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </Reveal>
        <div className="no-scrollbar -mx-[clamp(1.25rem,4vw,3.5rem)] flex gap-4 overflow-x-auto px-[clamp(1.25rem,4vw,3.5rem)] pb-2">
          {PRODUCTS.map((p, i) => (
            <Link key={p.id} to={`/product/${p.slug}`} className="group w-40 shrink-0 sm:w-48" aria-label={`${p.name}`}>
              <div className="overflow-hidden rounded-md">
                <Img src={p.image} alt={p.name} className="aspect-[4/5]" imgClassName="transition-transform duration-700 group-hover:scale-107" />
              </div>
              <p className="mt-3 flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.14em] text-ink-soft">
                <span className="font-display text-sm italic text-brass">Nº {String(i + 1).padStart(2, "0")}</span>
                <span className="truncate font-body">{p.name}</span>
                <IconArrowUpRight size={12} className="shrink-0 opacity-0 transition-opacity group-hover:opacity-100" />
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      <Reveal className="container-x mt-20 md:mt-28">
        <div className="flex flex-col items-start justify-between gap-8 rounded-md bg-pine-deep px-8 py-12 text-paper md:flex-row md:items-center md:px-14 md:py-16">
          <div>
            <p className="eyebrow text-brass-soft!">Chapter one is yours</p>
            <h2 className="mt-4 max-w-xl font-display text-3xl font-medium leading-tight tracking-tight md:text-4xl">
              The best review we get: <em className="italic text-brass-soft">"bought it once."</em>
            </h2>
          </div>
          <Link to="/shop" className="btn btn-outline-light shrink-0">
            Shop the collection <IconArrow size={16} className="btn-arrow" />
          </Link>
        </div>
      </Reveal>
    </div>
  );
}
