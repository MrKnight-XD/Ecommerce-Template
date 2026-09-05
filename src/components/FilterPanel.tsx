import { CATEGORIES, PRODUCTS, type CategoryName } from "../data/products";
import { cx, formatINR } from "../lib/utils";
import { IconCheck } from "./ui";

export interface ShopFilters {
  category: CategoryName | "All";
  priceMin: number;
  priceMax: number;
  minRating: number;
  newArrivals: boolean;
}

export const PRICE_BOUNDS = {
  min: Math.min(...PRODUCTS.map((p) => p.price)),
  max: Math.max(...PRODUCTS.map((p) => p.price)),
};

export const DEFAULT_FILTERS: ShopFilters = {
  category: "All",
  priceMin: PRICE_BOUNDS.min,
  priceMax: PRICE_BOUNDS.max,
  minRating: 0,
  newArrivals: false,
};

export type SortKey = "featured" | "newest" | "price-asc" | "price-desc" | "rating";

export const SORT_OPTIONS: Array<{ key: SortKey; label: string }> = [
  { key: "featured", label: "Featured" },
  { key: "newest", label: "Newest" },
  { key: "price-asc", label: "Price: Low to High" },
  { key: "price-desc", label: "Price: High to Low" },
  { key: "rating", label: "Best Rated" },
];

const RATING_OPTIONS = [
  { value: 0, label: "Any rating" },
  { value: 4, label: "4.0 & up" },
  { value: 4.5, label: "4.5 & up" },
  { value: 4.8, label: "4.8 & up" },
];

function FilterHeading({ children }: { children: string }) {
  return (
    <h3 className="mb-3 text-[11px] font-bold uppercase tracking-[0.22em] text-ink-mute">{children}</h3>
  );
}

export function FilterPanel({
  filters,
  onChange,
  onClear,
  activeCount,
}: {
  filters: ShopFilters;
  onChange: (next: ShopFilters) => void;
  onClear: () => void;
  activeCount: number;
}) {
  const set = (patch: Partial<ShopFilters>) => onChange({ ...filters, ...patch });

  const priceTrackFill = {
    left: `${((filters.priceMin - PRICE_BOUNDS.min) / (PRICE_BOUNDS.max - PRICE_BOUNDS.min)) * 100}%`,
    right: `${100 - ((filters.priceMax - PRICE_BOUNDS.min) / (PRICE_BOUNDS.max - PRICE_BOUNDS.min)) * 100}%`,
  };

  return (
    <div className="space-y-8">
      {/* Category */}
      <div>
        <FilterHeading>Category</FilterHeading>
        <div className="space-y-1">
          {(["All", ...CATEGORIES.map((c) => c.name)] as Array<CategoryName | "All">).map((cat) => {
            const count = cat === "All" ? PRODUCTS.length : PRODUCTS.filter((p) => p.category === cat).length;
            const active = filters.category === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => set({ category: cat })}
                aria-pressed={active}
                className={cx(
                  "group flex w-full items-center justify-between rounded-md px-3 py-2 text-sm transition-colors",
                  active ? "bg-ink font-semibold text-paper" : "text-ink-soft hover:bg-mist-soft hover:text-ink"
                )}
              >
                <span>{cat === "All" ? "All Goods" : cat}</span>
                <span className={cx("text-xs tabular-nums", active ? "text-paper/60" : "text-ink-mute")}>{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Price */}
      <div>
        <FilterHeading>Price</FilterHeading>
        <div className="px-1">
          <div className="relative h-1 rounded-full bg-mist">
            <div className="absolute inset-y-0 rounded-full bg-pine" style={priceTrackFill} />
            <input
              type="range"
              min={PRICE_BOUNDS.min}
              max={PRICE_BOUNDS.max}
              step={100}
              value={filters.priceMin}
              aria-label="Minimum price"
              onChange={(e) => set({ priceMin: Math.min(Number(e.target.value), filters.priceMax - 100) })}
              className="pointer-events-none absolute -top-2 h-5 w-full [&::-webkit-slider-thumb]:pointer-events-auto [&::-moz-range-thumb]:pointer-events-auto"
            />
            <input
              type="range"
              min={PRICE_BOUNDS.min}
              max={PRICE_BOUNDS.max}
              step={100}
              value={filters.priceMax}
              aria-label="Maximum price"
              onChange={(e) => set({ priceMax: Math.max(Number(e.target.value), filters.priceMin + 100) })}
              className="pointer-events-none absolute -top-2 h-5 w-full [&::-webkit-slider-thumb]:pointer-events-auto [&::-moz-range-thumb]:pointer-events-auto"
            />
          </div>
          <div className="mt-3 flex items-center justify-between text-xs font-semibold text-ink-soft">
            <span className="rounded-full border border-mist bg-card px-2.5 py-1 tabular-nums">{formatINR(filters.priceMin)}</span>
            <span className="text-ink-mute">to</span>
            <span className="rounded-full border border-mist bg-card px-2.5 py-1 tabular-nums">{formatINR(filters.priceMax)}</span>
          </div>
        </div>
      </div>

      {/* Rating */}
      <div>
        <FilterHeading>Rating</FilterHeading>
        <div className="flex flex-wrap gap-2">
          {RATING_OPTIONS.map((opt) => {
            const active = filters.minRating === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => set({ minRating: opt.value })}
                aria-pressed={active}
                className={cx(
                  "rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-all",
                  active
                    ? "border-pine bg-pine text-paper shadow-sm"
                    : "border-mist bg-card text-ink-soft hover:border-ink/30 hover:text-ink"
                )}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* New arrivals */}
      <div>
        <FilterHeading>Collection</FilterHeading>
        <button
          type="button"
          onClick={() => set({ newArrivals: !filters.newArrivals })}
          aria-pressed={filters.newArrivals}
          className={cx(
            "flex w-full items-center justify-between rounded-md border px-3 py-2.5 text-sm font-medium transition-colors",
            filters.newArrivals
              ? "border-pine bg-pine/5 text-pine"
              : "border-mist bg-card text-ink-soft hover:border-ink/30"
          )}
        >
          New arrivals only
          <span
            className={cx(
              "flex h-4.5 w-4.5 items-center justify-center rounded-full border transition-colors",
              filters.newArrivals ? "border-pine bg-pine text-paper" : "border-mist bg-paper text-transparent"
            )}
            style={{ width: 18, height: 18 }}
          >
            <IconCheck size={11} />
          </span>
        </button>
      </div>

      {activeCount > 0 && (
        <button
          type="button"
          onClick={onClear}
          className="link-line text-xs font-bold uppercase tracking-[0.18em] text-brass"
        >
          Clear all filters ({activeCount})
        </button>
      )}
    </div>
  );
}

/** Count of active (non-default) filters for the badge. */
export function countActiveFilters(f: ShopFilters): number {
  let n = 0;
  if (f.category !== "All") n++;
  if (f.priceMin !== PRICE_BOUNDS.min || f.priceMax !== PRICE_BOUNDS.max) n++;
  if (f.minRating !== 0) n++;
  if (f.newArrivals) n++;
  return n;
}
