import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { CATEGORIES } from "../data/products";
import {
  SOCIALS,
  SUPPORT_EMAIL,
  SUPPORT_HOURS,
  SUPPORT_PHONE_DISPLAY,
  STUDIO_ADDRESS,
} from "../config/store";
import { createWhatsAppChatLink } from "../lib/whatsapp";
import { cx } from "../lib/utils";
import {
  IconArrow,
  IconCheck,
  IconInstagram,
  IconMail,
  IconPhone,
  IconPin,
  IconPinterest,
  IconWhatsApp,
  IconXSocial,
  IconYoutube,
  LogoMark,
  Reveal,
} from "./ui";

/* ---------- Newsletter band ---------- */
export function NewsletterBand() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "error" | "done">("idle");

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      setStatus("error");
      return;
    }
    setStatus("done");
  };

  return (
    <section className="container-x pb-20 md:pb-28" aria-labelledby="newsletter-heading">
      <Reveal className="relative overflow-hidden rounded-lg bg-pine-deep px-7 py-12 text-paper md:px-14 md:py-16">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.13]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, #F2F0E9 1px, transparent 0)",
            backgroundSize: "22px 22px",
          }}
          aria-hidden="true"
        />
        <div className="relative grid items-center gap-10 md:grid-cols-[1.2fr_1fr]">
          <div>
            <p className="eyebrow text-brass-soft!">The Slow List</p>
            <h2 id="newsletter-heading" className="mt-4 font-display text-3xl font-medium leading-[1.1] tracking-tight md:text-[44px]">
              One letter a month.
              <br />
              <em className="text-brass-soft">Zero</em> noise, ever.
            </h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-paper/70">
              New batch drops, atelier notes and early access to repairs sales. Written by the
              makers, not the marketing team.
            </p>
          </div>
          {status === "done" ? (
            <div className="anim-fade-up flex items-center gap-4 rounded-md border border-paper/20 bg-paper/10 p-5">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brass-soft text-night">
                <IconCheck size={20} />
              </span>
              <div>
                <p className="font-display text-lg font-medium">You're on the list.</p>
                <p className="text-sm text-paper/70">The next letter leaves the atelier on the 1st.</p>
              </div>
            </div>
          ) : (
            <form onSubmit={submit} className="w-full" noValidate>
              <label htmlFor="newsletter-email" className="mb-2 block text-[11px] font-bold uppercase tracking-[0.22em] text-paper/60">
                Email address
              </label>
              <div className={cx("flex overflow-hidden rounded-full border bg-paper/95 transition-colors", status === "error" ? "border-[#d98c7a]" : "border-transparent")}>
                <input
                  id="newsletter-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (status === "error") setStatus("idle");
                  }}
                  placeholder="you@example.com"
                  className="w-full bg-transparent px-5 py-3.5 text-sm text-ink outline-none placeholder:text-ink-mute"
                />
                <button type="submit" className="m-1 flex shrink-0 items-center gap-2 rounded-full bg-ink px-5 text-[11px] font-bold uppercase tracking-[0.16em] text-paper transition-colors hover:bg-pine">
                  Subscribe
                  <IconArrow size={14} />
                </button>
              </div>
              <p className={cx("mt-2 text-xs", status === "error" ? "text-[#eab5a6]" : "text-paper/50")}>
                {status === "error" ? "Please enter a valid email address." : "Unsubscribe anytime. We never share your data."}
              </p>
            </form>
          )}
        </div>
      </Reveal>
    </section>
  );
}

/* ---------- Footer ---------- */
const SHOP_LINKS = [
  { label: "All goods", to: "/shop" },
  ...CATEGORIES.map((c) => ({ label: c.name, to: `/shop?cat=${encodeURIComponent(c.name)}` })),
  { label: "Bestsellers", to: "/shop?collection=bestsellers" },
  { label: "New arrivals", to: "/shop?collection=new" },
];

const SUPPORT_LINKS = [
  { label: "FAQs", to: "/contact" },
  { label: "Shipping", to: "/contact?faq=shipping" },
  { label: "Returns & exchanges", to: "/contact?faq=returns" },
  { label: "Lifetime repairs", to: "/about" },
];

const COMPANY_LINKS = [
  { label: "Our story", to: "/about" },
  { label: "Craft & materials", to: "/about" },
  { label: "Contact us", to: "/contact" },
];

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative overflow-hidden bg-night text-paper">
      <div className="container-x relative grid gap-12 py-16 md:grid-cols-[1.4fr_1fr_1fr_1fr] md:py-20">
        {/* Brand */}
        <div>
          <Link to="/" className="flex items-center" aria-label="Home">
            <LogoMark />
          </Link>
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-paper/60">
            Considered goods in small batches — apparel, footwear and carry designed in Jaipur
            and made to be kept for decades, not seasons.
          </p>
          <a href={createWhatsAppChatLink()} target="_blank" rel="noopener noreferrer" className="btn btn-outline-light btn-sm mt-6">
            <IconWhatsApp size={15} /> Chat with us
          </a>
          <div className="mt-6 flex items-center gap-2.5">
            {[
              { label: "Instagram", href: SOCIALS.instagram, icon: <IconInstagram size={17} /> },
              { label: "Pinterest", href: SOCIALS.pinterest, icon: <IconPinterest size={17} /> },
              { label: "YouTube", href: SOCIALS.youtube, icon: <IconYoutube size={17} /> },
              { label: "X", href: SOCIALS.x, icon: <IconXSocial size={15} /> },
            ].map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-paper/15 text-paper/60 transition-all duration-300 hover:-translate-y-0.5 hover:border-brass-soft hover:text-brass-soft"
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Link columns */}
        <FooterColumn title="Shop" links={SHOP_LINKS} />
        <FooterColumn title="Support" links={SUPPORT_LINKS} />
        <FooterColumn title="Company" links={COMPANY_LINKS} />
      </div>

      {/* Contact strip */}
      <div className="container-x grid gap-4 border-t border-paper/10 py-8 text-sm text-paper/60 sm:grid-cols-3">
        <a href={`mailto:${SUPPORT_EMAIL}`} className="flex items-center gap-2.5 transition-colors hover:text-paper">
          <IconMail size={16} className="text-brass-soft" /> {SUPPORT_EMAIL}
        </a>
        <a href={createWhatsAppChatLink()} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 transition-colors hover:text-paper">
          <IconPhone size={16} className="text-brass-soft" /> {SUPPORT_PHONE_DISPLAY} · {SUPPORT_HOURS}
        </a>
        <p className="flex items-center gap-2.5">
          <IconPin size={16} className="shrink-0 text-brass-soft" /> {STUDIO_ADDRESS}
        </p>
      </div>

      {/* Legal */}
      <div className="container-x flex flex-col items-center justify-between gap-3 border-t border-paper/10 py-6 text-xs text-paper/45 md:flex-row">
        <p>© {year} All rights reserved.</p>
        <div className="flex items-center gap-6">
          <Link to="/contact?faq=privacy" className="link-line hover:text-paper">Privacy Policy</Link>
          <Link to="/contact?faq=terms" className="link-line hover:text-paper">Terms of Service</Link>
        </div>
        <p className="flex items-center gap-2">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-brass-soft" aria-hidden="true" />
          Designed in Jaipur · Made across India
        </p>
      </div>

    </footer>
  );
}

function FooterColumn({ title, links }: { title: string; links: Array<{ label: string; to: string }> }) {
  return (
    <nav aria-label={title}>
      <h3 className="text-[11px] font-bold uppercase tracking-[0.26em] text-brass-soft">{title}</h3>
      <ul className="mt-5 space-y-3">
        {links.map((link) => (
          <li key={link.label}>
            <Link to={link.to} className="link-line text-sm text-paper/65 transition-colors hover:text-paper">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/* Re-export so App can place the band above the footer */
export { LogoMark };
