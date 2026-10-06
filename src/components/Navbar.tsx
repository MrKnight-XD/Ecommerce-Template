import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { ANNOUNCEMENTS, STORE_NAME } from "../config/store";
import { CATEGORIES } from "../data/products";
import { useStore } from "../context/StoreContext";
import { useLockBody, useScrolled } from "../hooks/useApp";
import { createWhatsAppChatLink } from "../lib/whatsapp";
import { cx } from "../lib/utils";
import { IconArrowUpRight, IconBag, IconClose, IconInstagram, IconMenu, IconPinterest, IconSearch, IconWhatsApp, IconXSocial, IconYoutube, Img, LogoMark } from "./ui";
import { SOCIALS } from "../config/store";

const NAV_LINKS = [
  { label: "Home", to: "/" },
  { label: "Shop", to: "/shop" },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
];

/* ---------- Announcement bar with rotating messages ---------- */
function AnnouncementBar() {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const timer = window.setInterval(() => {
      setIndex((i) => (i + 1) % ANNOUNCEMENTS.length);
    }, 4200);
    return () => window.clearInterval(timer);
  }, []);
  return (
    <div className="relative z-[55] overflow-hidden bg-night py-2 text-center text-paper">
      <p key={index} className="anim-fade-in px-4 text-[10.5px] font-semibold uppercase tracking-[0.26em]">
        {ANNOUNCEMENTS[index]}
      </p>
    </div>
  );
}

/* ---------- Categories mega dropdown ---------- */
function CategoriesDropdown() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const closeTimer = useRef<number | undefined>(undefined);

  useEffect(() => setOpen(false), [location]);

  const scheduleClose = () => {
    closeTimer.current = window.setTimeout(() => setOpen(false), 160);
  };
  const cancelClose = () => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
  };

  return (
    <div
      className="relative"
      onMouseEnter={() => {
        cancelClose();
        setOpen(true);
      }}
      onMouseLeave={scheduleClose}
    >
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="true"
        className={cx("link-line py-2 text-[13px] font-semibold tracking-wide", open ? "is-active text-ink" : "text-ink-soft hover:text-ink")}
      >
        Categories
      </button>
      <div
        className={cx(
          "absolute left-1/2 top-full z-50 w-[540px] -translate-x-1/2 pt-3 transition-all duration-300",
          open ? "pointer-events-auto translate-y-0 opacity-100" : "pointer-events-none translate-y-2 opacity-0"
        )}
      >
        <div className="grid grid-cols-2 gap-2 rounded-lg border border-mist bg-card p-3 shadow-lift">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.name}
              to={`/shop?cat=${encodeURIComponent(cat.name)}`}
              className="group flex items-center gap-3.5 rounded-md p-2.5 transition-colors hover:bg-mist-soft"
            >
              <Img src={cat.image} alt={cat.name} className="h-16 w-14 shrink-0 rounded-[5px]" imgClassName="transition-transform duration-500 group-hover:scale-108" />
              <span>
                <span className="flex items-center gap-1.5 font-display text-[15px] font-medium tracking-tight text-ink">
                  {cat.name}
                  <IconArrowUpRight size={13} className="opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:opacity-100" />
                </span>
                <span className="mt-0.5 block text-xs leading-snug text-ink-mute">{cat.blurb}</span>
              </span>
            </Link>
          ))}
          <Link
            to="/shop"
            className="col-span-2 mt-1 flex items-center justify-between rounded-md border border-mist px-4 py-3 text-xs font-bold uppercase tracking-[0.18em] text-pine transition-colors hover:border-pine hover:bg-pine hover:text-paper"
          >
            Browse all goods
            <IconArrowUpRight size={15} />
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ---------- Mobile full-screen menu ---------- */
function MobileMenu() {
  const { isMenuOpen, setMenuOpen, cartCount, setCartOpen } = useStore();
  const location = useLocation();
  useLockBody(isMenuOpen);
  useEffect(() => setMenuOpen(false), [location, setMenuOpen]);
  if (!isMenuOpen) return null;

  const links = [
    { label: "Home", to: "/" },
    { label: "Shop All", to: "/shop" },
    ...CATEGORIES.map((c) => ({ label: c.name, to: `/shop?cat=${encodeURIComponent(c.name)}` })),
    { label: "About", to: "/about" },
    { label: "Contact", to: "/contact" },
  ];

  return (
    <div className="fixed inset-0 z-[65] flex flex-col bg-night text-paper" role="dialog" aria-modal="true" aria-label="Menu">
      <div className="container-x flex h-[68px] items-center justify-between">
        <Link to="/" onClick={() => setMenuOpen(false)} className="flex items-center gap-3" aria-label={`${STORE_NAME} home`}>
          <LogoMark size={32} />
          <span className="font-display text-lg font-medium tracking-[0.14em]">{STORE_NAME}</span>
        </Link>
        <button type="button" onClick={() => setMenuOpen(false)} aria-label="Close menu" className="flex h-10 w-10 items-center justify-center rounded-full border border-paper/25 transition-colors hover:border-paper">
          <IconClose size={18} />
        </button>
      </div>
      <nav className="container-x flex-1 overflow-y-auto py-6" aria-label="Mobile">
        <ul className="space-y-1">
          {links.map((link, i) => (
            <li key={link.label} className="anim-fade-up" style={{ animationDelay: `${60 + i * 55}ms` }}>
              <Link
                to={link.to}
                className="group flex items-baseline gap-4 border-b border-paper/10 py-3.5 font-display text-[26px] font-medium tracking-tight transition-colors hover:text-brass-soft"
              >
                <span className="text-[11px] font-body font-semibold tracking-[0.2em] text-paper/35">{String(i + 1).padStart(2, "0")}</span>
                {link.label}
                <IconArrowUpRight size={18} className="ml-auto self-center text-paper/30 transition-all duration-300 group-hover:translate-x-1 group-hover:text-brass-soft" />
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="container-x anim-fade-up pb-8 pt-4" style={{ animationDelay: "480ms" }}>
        <div className="flex items-center gap-3">
          <a href={createWhatsAppChatLink()} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm flex-1">
            <IconWhatsApp size={15} /> Chat on WhatsApp
          </a>
          <button type="button" onClick={() => { setMenuOpen(false); setCartOpen(true); }} className="btn btn-outline-light btn-sm" aria-label={`Open bag, ${cartCount} items`}>
            <IconBag size={15} /> Bag ({cartCount})
          </button>
        </div>
        <div className="mt-5 flex items-center justify-center gap-5 text-paper/50">
          <a href={SOCIALS.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="transition-colors hover:text-paper"><IconInstagram size={18} /></a>
          <a href={SOCIALS.pinterest} target="_blank" rel="noopener noreferrer" aria-label="Pinterest" className="transition-colors hover:text-paper"><IconPinterest size={18} /></a>
          <a href={SOCIALS.youtube} target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="transition-colors hover:text-paper"><IconYoutube size={18} /></a>
          <a href={SOCIALS.x} target="_blank" rel="noopener noreferrer" aria-label="X" className="transition-colors hover:text-paper"><IconXSocial size={16} /></a>
        </div>
      </div>
    </div>
  );
}

/* ---------- Main navbar ---------- */
export default function Navbar() {
  const { cartCount, badgeKey, setCartOpen, setSearchOpen, setMenuOpen } = useStore();
  const scrolled = useScrolled(16);
  const location = useLocation();

  return (
    <>
      <AnnouncementBar />
      <header
        className={cx(
          "sticky top-0 z-50 transition-all duration-400",
          scrolled ? "border-b border-mist bg-paper/90 shadow-[0_8px_30px_-18px_rgb(23_30_25/0.25)] backdrop-blur-md" : "border-b border-transparent bg-paper"
        )}
      >
        <div className="container-x flex h-[68px] items-center justify-between gap-4">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-3" aria-label={`${STORE_NAME} home`}>
              <LogoMark />
              <span className="hidden flex-col sm:flex">
                <span className="font-display text-[19px] font-semibold leading-none tracking-[0.16em] text-ink">{STORE_NAME}</span>
                <span className="mt-1 text-[8.5px] font-semibold uppercase tracking-[0.34em] text-ink-mute">Goods · Est. 2026</span>
              </span>
            </Link>
          </div>

          <nav className="hidden items-center gap-8 lg:flex" aria-label="Primary">
            {NAV_LINKS.slice(0, 2).map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === "/"}
                className={({ isActive }) =>
                  cx("link-line py-2 text-[13px] font-semibold tracking-wide transition-colors", isActive ? "is-active text-ink" : "text-ink-soft hover:text-ink")
                }
              >
                {link.label}
              </NavLink>
            ))}
            <CategoriesDropdown />
            {NAV_LINKS.slice(2).map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  cx("link-line py-2 text-[13px] font-semibold tracking-wide transition-colors", isActive ? "is-active text-ink" : "text-ink-soft hover:text-ink")
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-1.5 sm:gap-2.5">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              aria-label="Search products"
              className="flex h-10 w-10 items-center justify-center rounded-full text-ink transition-colors hover:bg-mist-soft"
            >
              <IconSearch size={19} />
            </button>
            <button
              type="button"
              onClick={() => setCartOpen(true)}
              aria-label={`Open shopping bag, ${cartCount} items`}
              className="relative flex h-10 w-10 items-center justify-center rounded-full text-ink transition-colors hover:bg-mist-soft"
            >
              <IconBag size={19} />
              {cartCount > 0 && (
                <span
                  key={badgeKey}
                  className="anim-pop absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-pine px-1 text-[10px] font-bold text-paper"
                >
                  {cartCount}
                </span>
              )}
            </button>
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              className="flex h-10 w-10 items-center justify-center rounded-full text-ink transition-colors hover:bg-mist-soft lg:hidden"
            >
              <IconMenu size={20} />
            </button>
          </div>
        </div>
      </header>
      <MobileMenu />
    </>
  );
}
