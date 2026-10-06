import { useState, type ReactNode, type SVGProps } from "react";
import { Link } from "react-router-dom";
import { useReveal } from "../hooks/useApp";
import { cx, discountPercent, formatINR } from "../lib/utils";
import type { Product } from "../data/products";

/* ============================================================================
 *  ICONS — hand-drawn inline SVGs, stroke-based, consistent 1.6 stroke.
 * ==========================================================================*/

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function base({ size = 20, ...props }: IconProps) {
  return {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    ...props,
  };
}

export const IconSearch = (p: IconProps) => (
  <svg {...base(p)}>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.2-3.2" />
  </svg>
);
export const IconBag = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M6 8h12l-1 12.5a1.5 1.5 0 0 1-1.5 1.4h-7A1.5 1.5 0 0 1 7 20.5L6 8Z" />
    <path d="M9 10V6a3 3 0 0 1 6 0v4" />
  </svg>
);
export const IconMenu = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M4 7h16M4 12h10M4 17h16" />
  </svg>
);
export const IconClose = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="m6 6 12 12M18 6 6 18" />
  </svg>
);
export const IconArrow = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M4 12h16m0 0-6-6m6 6-6 6" />
  </svg>
);
export const IconArrowUpRight = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M7 17 17 7m0 0H8m9 0v9" />
  </svg>
);
export const IconPlus = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M12 5v14M5 12h14" />
  </svg>
);
export const IconMinus = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M5 12h14" />
  </svg>
);
export const IconTrash = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2m3 0-.8 12.1a2 2 0 0 1-2 1.9H8.8a2 2 0 0 1-2-1.9L6 7M10 11v6m4-6v6" />
  </svg>
);
export const IconCheck = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="m5 12.5 4.5 4.5L19 7.5" />
  </svg>
);
export const IconChevron = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="m6 9 6 6 6-6" />
  </svg>
);
export const IconHeart = ({ filled, ...p }: IconProps & { filled?: boolean }) => (
  <svg {...base(p)} fill={filled ? "currentColor" : "none"}>
    <path d="M12 20.3S3.5 15.2 3.5 9.3a4.6 4.6 0 0 1 8.5-2.5A4.6 4.6 0 0 1 20.5 9.3c0 5.9-8.5 11-8.5 11Z" />
  </svg>
);
export const IconTruck = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M2 6h12v11H2zM14 10h4.5L21 13.5V17h-7" />
    <circle cx="6.5" cy="17.5" r="1.8" />
    <circle cx="17" cy="17.5" r="1.8" />
  </svg>
);
export const IconShield = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M12 3 5 6v5c0 4.6 3 8.4 7 10 4-1.6 7-5.4 7-10V6l-7-3Z" />
    <path d="m9 11.8 2.2 2.2L15.5 9.6" />
  </svg>
);
export const IconLeaf = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M5 19C5 9 12 4.5 20 4c.5 8-4 15-13 15" />
    <path d="M5 19c2.5-5.5 6.5-9.5 11-11.5" />
  </svg>
);
export const IconChat = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M4 6.5A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5v7a2.5 2.5 0 0 1-2.5 2.5H12l-4.5 4v-4h-1A2.5 2.5 0 0 1 4 13.5v-7Z" />
    <path d="M8.5 9.5h7m-7 3.5h4.5" />
  </svg>
);
export const IconRefresh = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M20 12a8 8 0 1 1-2.3-5.6M20 3v4h-4" />
  </svg>
);
export const IconMail = (p: IconProps) => (
  <svg {...base(p)}>
    <rect x="3.5" y="5.5" width="17" height="13" rx="2" />
    <path d="m4.5 7.5 7.5 6 7.5-6" />
  </svg>
);
export const IconPhone = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M5 4h4l1.5 4.5L8 10a12 12 0 0 0 6 6l1.5-2.5L20 15v4a1.5 1.5 0 0 1-1.7 1.5C10.5 19.6 4.4 13.5 3.5 5.7A1.5 1.5 0 0 1 5 4Z" />
  </svg>
);
export const IconPin = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M12 21s7-6.1 7-11.5a7 7 0 1 0-14 0C5 14.9 12 21 12 21Z" />
    <circle cx="12" cy="9.5" r="2.5" />
  </svg>
);
export const IconFilter = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M4 7h16M7 12h10m-7 5h4" />
  </svg>
);
export const IconStarSolid = ({ size = 14, ...p }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" stroke="none" {...p}>
    <path d="M12 2.8l2.9 5.9 6.5.9-4.7 4.5 1.1 6.4L12 17.5l-5.8 3 1.1-6.4-4.7-4.5 6.5-.9L12 2.8z" />
  </svg>
);
export const IconWhatsApp = ({ size = 18, ...p }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" stroke="none" {...p}>
    <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.47-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.49 0 1.47 1.07 2.89 1.22 3.09.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.7.63.71.22 1.36.19 1.87.12.57-.09 1.76-.72 2.01-1.42.25-.7.25-1.29.17-1.42-.07-.13-.27-.2-.57-.35ZM12.05 21.79h-.01a9.87 9.87 0 0 1-5.03-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.86 9.86 0 0 1-1.51-5.26c0-5.45 4.44-9.88 9.89-9.88a9.82 9.82 0 0 1 9.88 9.89c0 5.45-4.44 9.88-9.88 9.88Zm8.41-18.3A11.82 11.82 0 0 0 12.05 0C5.5 0 .16 5.33.16 11.89c0 2.1.55 4.14 1.59 5.94L.06 24l6.32-1.65a11.9 11.9 0 0 0 5.67 1.45h.01c6.55 0 11.89-5.33 11.89-11.89 0-3.18-1.24-6.16-3.49-8.41Z" />
  </svg>
);
export const IconInstagram = (p: IconProps) => (
  <svg {...base(p)}>
    <rect x="4" y="4" width="16" height="16" rx="4.5" />
    <circle cx="12" cy="12" r="3.6" />
    <circle cx="16.8" cy="7.2" r="0.9" fill="currentColor" stroke="none" />
  </svg>
);
export const IconPinterest = (p: IconProps) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M10.2 20 12 13m-2.3-2.4a3.1 3.1 0 1 1 5.4 2c-.6 1-1.9 1.3-2.8.7" />
  </svg>
);
export const IconYoutube = (p: IconProps) => (
  <svg {...base(p)}>
    <rect x="3" y="6" width="18" height="12" rx="3.5" />
    <path d="m10.5 9.8 4.2 2.2-4.2 2.2V9.8Z" fill="currentColor" stroke="none" />
  </svg>
);
export const IconXSocial = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="m4.5 4.5 15 15m0-15-15 15" />
  </svg>
);

/** Abstract mark — a four-point star inside a pine tile. No lettering. */
export const LogoMark = ({ size = 34 }: { size?: number }) => (
  <span
    className="inline-flex items-center justify-center rounded-[7px] bg-pine text-paper"
    style={{ width: size, height: size }}
    aria-hidden="true"
  >
    <svg width={Math.round(size * 0.52)} height={Math.round(size * 0.52)} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 1.5 L15 9 L22.5 12 L15 15 L12 22.5 L9 15 L1.5 12 L9 9 Z" />
    </svg>
  </span>
);

/* ============================================================================
 *  PRIMITIVES
 * ==========================================================================*/

/** Star rating display with fractional fill. */
export function Stars({ rating, size = 13, showValue = false }: { rating: number; size?: number; showValue?: boolean }) {
  const pct = Math.max(0, Math.min(100, (rating / 5) * 100));
  return (
    <span className="inline-flex items-center gap-1.5" aria-label={`Rated ${rating} out of 5 stars`}>
      <span className="relative inline-flex">
        <span className="flex gap-[2px] text-mist">
          {[0, 1, 2, 3, 4].map((i) => (
            <IconStarSolid key={i} size={size} />
          ))}
        </span>
        <span className="absolute inset-0 flex gap-[2px] overflow-hidden text-brass" style={{ width: `${pct}%` }}>
          {[0, 1, 2, 3, 4].map((i) => (
            <IconStarSolid key={i} size={size} />
          ))}
        </span>
      </span>
      {showValue && <span className="text-xs font-semibold text-ink-soft">{rating.toFixed(1)}</span>}
    </span>
  );
}

/** Price with optional struck-through original + discount badge. */
export function Price({ product, size = "md" }: { product: Product; size?: "sm" | "md" | "lg" }) {
  const cls = size === "lg" ? "text-2xl" : size === "sm" ? "text-sm" : "text-[15px]";
  const off = product.originalPrice ? discountPercent(product.originalPrice, product.price) : 0;
  return (
    <span className={cx("flex items-baseline gap-2", cls)}>
      <span className="font-semibold tracking-tight">{formatINR(product.price)}</span>
      {off > 0 && (
        <>
          <span className="text-ink-mute line-through decoration-[1.5px]" style={{ fontSize: "0.82em" }}>
            {formatINR(product.originalPrice!)}
          </span>
          <span className="rounded-full bg-pine px-2 py-0.5 text-[10px] font-bold tracking-wide text-paper" style={{ fontSize: "0.62em" }}>
            −{off}%
          </span>
        </>
      )}
    </span>
  );
}

/** Scroll-reveal wrapper. */
export function Reveal({
  children,
  className,
  delay = 0,
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "section" | "li" | "figure" | "article";
}) {
  const [ref, inView] = useReveal<HTMLDivElement>();
  return (
    <Tag
      ref={ref as never}
      className={cx("reveal", inView && "is-in", className)}
      style={{ ["--reveal-delay" as string]: `${delay}ms` }}
    >
      {children}
    </Tag>
  );
}

/** Infinite marquee strip. Pass inline items; content is duplicated for looping. */
export function Marquee({ children, duration = 34, className }: { children: ReactNode; duration?: number; className?: string }) {
  return (
    <div className={cx("overflow-hidden", className)} aria-hidden="true">
      <div className="anim-marquee flex w-max items-center" style={{ ["--marquee-duration" as string]: `${duration}s` }}>
        <div className="flex items-center">{children}</div>
        <div className="flex items-center">{children}</div>
      </div>
    </div>
  );
}

/** Accessible single-open accordion. */
export function Accordion({
  items,
  defaultOpen = -1,
  tone = "light",
}: {
  items: Array<{ title: string; content: ReactNode }>;
  defaultOpen?: number;
  tone?: "light" | "dark";
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className={cx("divide-y", tone === "light" ? "divide-mist border-y border-mist" : "divide-paper/15 border-y border-paper/15")}>
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={item.title}>
            <button
              type="button"
              onClick={() => setOpen(isOpen ? -1 : i)}
              aria-expanded={isOpen}
              className={cx(
                "flex w-full items-center justify-between gap-4 py-4 text-left text-sm font-semibold tracking-wide transition-colors",
                tone === "light" ? "text-ink hover:text-pine" : "text-paper hover:text-brass-soft"
              )}
            >
              {item.title}
              <IconChevron size={16} className={cx("shrink-0 transition-transform duration-300", isOpen && "rotate-180")} />
            </button>
            <div
              className={cx(
                "grid transition-[grid-template-rows] duration-300 ease-out",
                isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
              )}
            >
              <div className="overflow-hidden">
                <div className={cx("pb-5 text-sm leading-relaxed", tone === "light" ? "text-ink-soft" : "text-paper/70")}>
                  {item.content}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/** Quantity stepper with +/− controls. */
export function QtyStepper({
  value,
  onChange,
  small = false,
  label = "Quantity",
}: {
  value: number;
  onChange: (value: number) => void;
  small?: boolean;
  label?: string;
}) {
  const btn = cx(
    "flex items-center justify-center text-ink transition-colors hover:bg-mist-soft disabled:opacity-30 disabled:hover:bg-transparent",
    small ? "h-8 w-8" : "h-11 w-11"
  );
  return (
    <div
      className={cx(
        "inline-flex items-center rounded-full border border-ink/20 bg-card",
        small ? "h-8" : "h-11"
      )}
      role="group"
      aria-label={label}
    >
      <button type="button" className={btn} onClick={() => onChange(value - 1)} disabled={value <= 1} aria-label="Decrease quantity">
        <IconMinus size={small ? 13 : 15} />
      </button>
      <span className={cx("text-center font-semibold tabular-nums", small ? "w-7 text-xs" : "w-9 text-sm")} aria-live="polite">
        {value}
      </span>
      <button type="button" className={btn} onClick={() => onChange(value + 1)} disabled={value >= 9} aria-label="Increase quantity">
        <IconPlus size={small ? 13 : 15} />
      </button>
    </div>
  );
}

/** Breadcrumb trail. */
export function Breadcrumbs({ trail }: { trail: Array<{ label: string; to?: string }> }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-2 text-xs text-ink-mute">
        <li>
          <Link to="/" className="link-line hover:text-ink">
            Home
          </Link>
        </li>
        {trail.map((crumb, i) => (
          <li key={crumb.label} className="flex items-center gap-2">
            <span aria-hidden="true" className="text-mist">/</span>
            {crumb.to ? (
              <Link to={crumb.to} className="link-line hover:text-ink">
                {crumb.label}
              </Link>
            ) : (
              <span aria-current="page" className="font-medium text-ink">
                {crumb.label}
              </span>
            )}
            {i === trail.length && null}
          </li>
        ))}
      </ol>
    </nav>
  );
}

/** Section heading block: eyebrow + big display title + optional side link. */
export function SectionHeader({
  eyebrow,
  title,
  link,
  align = "between",
}: {
  eyebrow: string;
  title: ReactNode;
  link?: { label: string; to: string };
  align?: "between" | "center";
}) {
  return (
    <Reveal className={cx("mb-10 flex flex-wrap items-end gap-6 md:mb-14", align === "center" && "flex-col items-center text-center")}>
      <div className="max-w-2xl">
        <p className="eyebrow mb-4">{eyebrow}</p>
        <h2 className="font-display text-3xl leading-[1.08] tracking-tight text-ink md:text-5xl">{title}</h2>
      </div>
      {link && (
        <Link
          to={link.to}
          className="group mb-1.5 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-pine transition-colors hover:text-pine-deep"
        >
          <span className="link-line">{link.label}</span>
          <IconArrow size={15} className="transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      )}
    </Reveal>
  );
}

/** Image with skeleton background + fade-in once loaded. */
export function Img({
  src,
  alt,
  className,
  imgClassName,
  eager = false,
  sizes,
}: {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  eager?: boolean;
  sizes?: string;
}) {
  const [loaded, setLoaded] = useState(false);
  return (
    <div className={cx("relative overflow-hidden bg-mist-soft", className)}>
      {!loaded && <div className="skeleton absolute inset-0" aria-hidden="true" />}
      <img
        src={src}
        alt={alt}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        sizes={sizes}
        onLoad={() => setLoaded(true)}
        className={cx(
          "h-full w-full object-cover transition-[opacity,transform] duration-700",
          loaded ? "opacity-100" : "opacity-0",
          imgClassName
        )}
      />
    </div>
  );
}

/** Skeleton for product cards while the grid "loads". */
export function SkeletonCard() {
  return (
    <div aria-hidden="true">
      <div className="skeleton aspect-[4/5] rounded-md" />
      <div className="skeleton mt-4 h-3 w-1/3 rounded-full" />
      <div className="skeleton mt-2 h-4 w-3/4 rounded-full" />
      <div className="skeleton mt-2 h-3 w-1/4 rounded-full" />
    </div>
  );
}
