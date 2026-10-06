import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { PRODUCTS, type CategoryName } from "../data/products";
import { useDocumentTitle, useLockBody, useOnEscape } from "../hooks/useApp";
import { cx } from "../lib/utils";
import {
  DEFAULT_FILTERS,
  FilterPanel,
  PRICE_BOUNDS,
  SORT_OPTIONS,
  countActiveFilters,
  type ShopFilters,
  type SortKey,
} from "../components/FilterPanel";
import { ProductCard } from "../components/ProductCard";
import { Breadcrumbs, IconChevron, IconClose, IconFilter, IconSearch, IconWhatsApp, Reveal, SkeletonCard } from "../components/ui";
import { STORE_NAME } from "../config/store";
import { createWhatsAppChatLink } from "../lib/whatsapp";

function applySort(list: typeof PRODUCTS, sort: SortKey) {
  const copy = [...list];
  switch (sort) {
    case "price-asc":
      return copy.sort((a, b) => a.price - b.price);
    case "price-desc":
      return copy.sort((a, b) => b.price - a.price);
    case "rating":
      return copy.sort((a, b) => b.rating - a.rating || b.reviews - a.reviews);
    case "newest":
      return copy.sort((a, b) => +new Date(b.addedOn) - +new Date(a.addedOn));
    default:
      return copy.sort(
        (a, b) => Number(b.featured ?? false) - Number(a.featured ?? false) || Number(b.bestseller ?? false) - Number(a.bestseller ?? false)
      );
  }
}

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const catParam = searchParams.get("cat") as CategoryName | null;
  const collectionParam = searchParams.get("collection");
  const sortParam = (searchParams.get("sort") as SortKey | null) ?? "featured";

  const [filters, setFilters] = useState<ShopFilters>({
    ...DEFAULT_FILTERS,
    category: catParam ?? "All",
    newArrivals: collectionParam === "new",
  });
  const [sort, setSort] = useState<SortKey>(SORT_OPTIONS.some((o) => o.key === sortParam) ? sortParam : "featured");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const firstRun = useRef(true);

  useDocumentTitle(
    filters.category === "All" ? `Shop All Goods — ${STORE_NAME}` : `${filters.category} — ${STORE_NAME}`,
    "Browse the permanent collection: heavyweight apparel, resoleable footwear, leather and canvas carry."
  );
  useLockBody(sheetOpen);
  useOnEscape(() => setSheetOpen(false), sheetOpen);

  /* Keep in sync when URL params change (footer/category links while on /shop) */
  useEffect(() => {
    setFilters((f) => ({
      ...f,
      category: catParam ?? "All",
      newArrivals: collectionParam === "new",
    }));
    if (collectionParam === "bestsellers") setSort("featured");
  }, [catParam, collectionParam]);

  /* Simulated fetch → skeleton feedback on filter changes */
  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }
    setLoading(true);
    const timer = window.setTimeout(() => setLoading(false), 380);
    return () => window.clearTimeout(timer);
  }, [filters, sort, query]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = PRODUCTS.filter((p) => {
      if (collectionParam === "bestsellers" && !p.bestseller) return false;
      if (collectionParam === "new" && !p.isNew) return false;
      if (filters.category !== "All" && p.category !== filters.category) return false;
      if (p.price < filters.priceMin || p.price > filters.priceMax) return false;
      if (p.rating < filters.minRating) return false;
      if (filters.newArrivals && !p.isNew) return false;
      if (q && ![p.name, p.category, p.material, ...p.tags].join(" ").toLowerCase().includes(q)) return false;
      return true;
    });
    return applySort(list, sort);
  }, [filters, sort, query, collectionParam]);

  const activeCount = countActiveFilters(filters) + (collectionParam === "bestsellers" ? 1 : 0);

  const clearAll = () => {
    setFilters({ ...DEFAULT_FILTERS });
    setQuery("");
    if (collectionParam) setSearchParams({}, { replace: true });
  };

  const heading =
    collectionParam === "bestsellers" ? "Bestsellers" : collectionParam === "new" ? "New Arrivals" : filters.category === "All" ? "All Goods" : filters.category;

  return (
    <div className="container-x pb-24 pt-8 md:pt-12">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-6 border-b border-mist pb-8">
        <div>
          <Breadcrumbs trail={[{ label: "Shop" }, ...(heading !== "All Goods" ? [{ label: heading }] : [])]} />
          <h1 className="mt-4 font-display text-4xl font-medium tracking-tight md:text-6xl">{heading}</h1>
          <p className="mt-3 max-w-lg text-sm leading-relaxed text-ink-soft">
            {collectionParam === "bestsellers"
              ? "The objects our customers reorder most — proven in daily life."
              : collectionParam === "new"
                ? "Fresh out of the atelier. Numbered batches, gone when they're gone."
                : "The permanent collection — every object we make, nothing we don't stand behind."}
          </p>
        </div>
        <p className="text-sm font-semibold text-ink-mute" aria-live="polite">
          {loading ? "Finding goods…" : `${results.length} ${results.length === 1 ? "good" : "goods"}`}
        </p>
      </div>

      <div className="mt-8 grid gap-10 lg:grid-cols-[250px_1fr] xl:grid-cols-[270px_1fr]">
        {/* Sidebar */}
        <aside className="hidden lg:block" aria-label="Filters">
          <div className="sticky top-28">
            <FilterPanel filters={filters} onChange={setFilters} onClear={clearAll} activeCount={activeCount} />
          </div>
        </aside>

        {/* Main column */}
        <div>
          {/* Toolbar */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setSheetOpen(true)}
              className="btn btn-outline btn-sm lg:hidden"
              aria-label="Open filters and sorting"
            >
              <IconFilter size={15} /> Filters{activeCount > 0 && ` · ${activeCount}`}
            </button>
            <label className="relative flex-1 basis-52">
              <IconSearch size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-mute" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search within results…"
                aria-label="Search within results"
                className="w-full rounded-full border border-mist bg-card py-2.5 pl-11 pr-4 text-sm outline-none transition-colors placeholder:text-ink-mute focus:border-pine"
              />
            </label>
            <label className="relative">
              <span className="sr-only">Sort products</span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
                className="cursor-pointer appearance-none rounded-full border border-mist bg-card py-2.5 pl-4 pr-10 text-sm font-semibold outline-none transition-colors focus:border-pine"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.key} value={opt.key}>
                    Sort · {opt.label}
                  </option>
                ))}
              </select>
              <IconChevron size={14} className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-mute" />
            </label>
          </div>

          {/* Active chips */}
          {activeCount > 0 && (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              {filters.category !== "All" && (
                <FilterChip label={filters.category} onRemove={() => setFilters({ ...filters, category: "All" })} />
              )}
              {(filters.priceMin !== PRICE_BOUNDS.min || filters.priceMax !== PRICE_BOUNDS.max) && (
                <FilterChip
                  label={`₹${filters.priceMin} – ₹${filters.priceMax}`}
                  onRemove={() => setFilters({ ...filters, priceMin: PRICE_BOUNDS.min, priceMax: PRICE_BOUNDS.max })}
                />
              )}
              {filters.minRating > 0 && (
                <FilterChip label={`${filters.minRating}★ & up`} onRemove={() => setFilters({ ...filters, minRating: 0 })} />
              )}
              {filters.newArrivals && (
                <FilterChip label="New arrivals" onRemove={() => setFilters({ ...filters, newArrivals: false })} />
              )}
              {collectionParam === "bestsellers" && (
                <FilterChip label="Bestsellers" onRemove={() => setSearchParams({}, { replace: true })} />
              )}
              <button type="button" onClick={clearAll} className="link-line ml-1 text-xs font-bold uppercase tracking-wider text-brass">
                Clear all
              </button>
            </div>
          )}

          {/* Grid */}
          {loading ? (
            <div className="mt-8 grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-3 md:gap-x-6 xl:grid-cols-3 2xl:grid-cols-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : results.length === 0 ? (
            <div className="mt-16 flex flex-col items-center rounded-md border border-dashed border-mist py-20 text-center">
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-mist-soft text-ink-mute">
                <IconSearch size={26} />
              </span>
              <h2 className="mt-5 font-display text-2xl font-medium">No goods match</h2>
              <p className="mt-2 max-w-xs text-sm text-ink-mute">
                Try widening the price range or clearing a filter — the collection is small but mighty.
              </p>
              <button type="button" onClick={clearAll} className="btn btn-primary btn-sm mt-6">
                Reset all filters
              </button>
            </div>
          ) : (
            <div className="mt-8 grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-3 md:gap-x-6 xl:grid-cols-3 2xl:grid-cols-4">
              {results.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </div>
          )}

          {!loading && results.length > 0 && (
            <Reveal className="mt-16 rounded-md border border-mist bg-card p-6 text-center md:p-8">
              <p className="font-display text-lg italic text-ink-soft">
                Can't find what you're after? We take requests — tell us what you wish we made.
              </p>
              <a
                href={createWhatsAppChatLink(`Hi ${STORE_NAME}! I have an idea for an object I'd love you to add to the permanent collection:`)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline btn-sm mt-4"
              >
                <IconWhatsApp size={15} /> Request an object
              </a>
            </Reveal>
          )}
        </div>
      </div>

      {/* Mobile filter sheet */}
      {sheetOpen && <MobileFilterSheet filters={filters} onChange={setFilters} onClear={clearAll} activeCount={activeCount} sort={sort} onSort={setSort} resultCount={results.length} onClose={() => setSheetOpen(false)} />}
    </div>
  );
}

function FilterChip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="anim-fade-in inline-flex items-center gap-2 rounded-full bg-ink py-1.5 pl-3.5 pr-2 text-xs font-semibold text-paper">
      {label}
      <button type="button" onClick={onRemove} aria-label={`Remove filter ${label}`} className="flex h-5 w-5 items-center justify-center rounded-full bg-paper/15 transition-colors hover:bg-paper/30">
        <IconClose size={11} />
      </button>
    </span>
  );
}

function MobileFilterSheet({
  filters,
  onChange,
  onClear,
  activeCount,
  sort,
  onSort,
  resultCount,
  onClose,
}: {
  filters: ShopFilters;
  onChange: (f: ShopFilters) => void;
  onClear: () => void;
  activeCount: number;
  sort: SortKey;
  onSort: (s: SortKey) => void;
  resultCount: number;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[70] lg:hidden" role="dialog" aria-modal="true" aria-label="Filters and sorting">
      <button type="button" aria-label="Close filters" onClick={onClose} className="anim-fade-in absolute inset-0 w-full bg-night/55 backdrop-blur-[2px]" />
      <div className="anim-sheet absolute inset-x-0 bottom-0 max-h-[86vh] overflow-hidden rounded-t-xl bg-paper shadow-lift">
        <div className="flex items-center justify-between border-b border-mist px-6 py-4">
          <h2 className="font-display text-lg font-medium">Filters & Sorting</h2>
          <button type="button" onClick={onClose} aria-label="Close" className="flex h-9 w-9 items-center justify-center rounded-full border border-mist text-ink-soft">
            <IconClose size={16} />
          </button>
        </div>
        <div className="thin-scroll max-h-[56vh] overflow-y-auto px-6 py-6">
          <FilterPanel filters={filters} onChange={onChange} onClear={onClear} activeCount={activeCount} />
          <div className="mt-9">
            <h3 className="mb-3 text-[11px] font-bold uppercase tracking-[0.22em] text-ink-mute">Sort by</h3>
            <div className="flex flex-wrap gap-2">
              {SORT_OPTIONS.map((opt) => (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => onSort(opt.key)}
                  aria-pressed={sort === opt.key}
                  className={cx(
                    "rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-all",
                    sort === opt.key ? "border-pine bg-pine text-paper" : "border-mist bg-card text-ink-soft"
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="border-t border-mist bg-card px-6 py-4">
          <button type="button" onClick={onClose} className="btn btn-primary w-full">
            Show {resultCount} {resultCount === 1 ? "good" : "goods"}
          </button>
        </div>
      </div>
    </div>
  );
}
