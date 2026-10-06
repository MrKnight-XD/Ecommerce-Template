import { useState, type FormEvent } from "react";
import { useSearchParams } from "react-router-dom";
import { SUPPORT_EMAIL, SUPPORT_HOURS, SUPPORT_PHONE_DISPLAY, STUDIO_ADDRESS } from "../config/store";
import { useDocumentTitle } from "../hooks/useApp";
import { createWhatsAppChatLink } from "../lib/whatsapp";
import { cx } from "../lib/utils";
import { Accordion, Breadcrumbs, IconArrow, IconCheck, IconChat, IconMail, IconPhone, IconPin, IconWhatsApp, Reveal } from "../components/ui";

const FAQ_ITEMS = [
  {
    id: "shipping",
    title: "How fast is shipping, and what does it cost?",
    content:
      "Orders leave our Jaipur studio within 24 hours and arrive in 3–5 working days anywhere in India. Shipping is free on orders over ₹999; below that it's a flat ₹79. Tracking arrives in your WhatsApp chat the moment the parcel is dispatched.",
  },
  {
    id: "returns",
    title: "What is your return & exchange policy?",
    content:
      "30 days, no questions asked. If the object isn't right, message us on WhatsApp and we'll arrange a free pickup and a full refund or exchange. Leather goods with a manufacturing fault are repaired free for life under our repair promise.",
  },
  {
    id: "privacy",
    title: "Privacy Policy — how is my data used?",
    content:
      "We collect only what an order needs: your name, delivery address, phone number and order history. We never sell or share your data with third parties, and we never spam. Newsletter emails are one per month, with a one-click unsubscribe.",
  },
  {
    id: "terms",
    title: "Terms of Service — the short, honest version",
    content:
      "Prices include GST. Orders are confirmed in your WhatsApp chat and can be cancelled free before dispatch. Our liability is limited to the value of your order, and our lifetime repair promise covers manufacturing faults — not damage from misuse. That's the whole deal.",
  },
  {
    id: "payments",
    title: "How do I pay?",
    content:
      "UPI, any credit or debit card, or cash on delivery — settled safely inside your WhatsApp chat after you confirm the order. We never ask for OTPs, card PINs or passwords.",
  },
];

export default function Contact() {
  const [searchParams] = useSearchParams();
  const faqParam = searchParams.get("faq");
  const defaultOpen = FAQ_ITEMS.findIndex((item) => item.id === faqParam);

  const [form, setForm] = useState({ name: "", email: "", topic: "Order question", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sent, setSent] = useState(false);

  useDocumentTitle("Contact — BRAND NAME HERE", "Talk to a human. WhatsApp, email or the old-fashioned form — we reply within minutes, 7 days a week.");

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const next: Record<string, string> = {};
    if (form.name.trim().length < 2) next.name = "Please tell us your name.";
    if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) next.email = "That email doesn't look right.";
    if (form.message.trim().length < 10) next.message = "A few more words will help us help you.";
    setErrors(next);
    if (Object.keys(next).length === 0) setSent(true);
  };

  const field = (name: keyof typeof form) => ({
    value: form[name],
    onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [name]: event.target.value })),
  });

  const inputClass = (hasError: boolean) =>
    cx(
      "w-full rounded-md border bg-card px-4 py-3 text-sm outline-none transition-colors placeholder:text-ink-mute",
      hasError ? "border-[#c4836f] focus:border-[#a05244]" : "border-mist focus:border-pine"
    );

  return (
    <div className="container-x pb-24 pt-8 md:pt-12">
      <Breadcrumbs trail={[{ label: "Contact" }]} />
      <div className="mt-4 max-w-3xl">
        <p className="eyebrow anim-fade-up">We answer like humans</p>
        <h1 className="anim-fade-up mt-4 font-display text-4xl font-medium tracking-tight md:text-6xl" style={{ animationDelay: "100ms" }}>
          Talk to a <em className="font-light italic text-pine">maker.</em>
        </h1>
        <p className="anim-fade-up mt-4 max-w-xl text-[15px] leading-relaxed text-ink-soft" style={{ animationDelay: "200ms" }}>
          No ticket numbers, no hold music. Message us and the person who answers probably stitched,
          stitched together, or packed the very object you're asking about.
        </p>
      </div>

      <div className="mt-14 grid gap-10 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
        {/* Form */}
        <Reveal>
          {sent ? (
            <div className="anim-fade-up flex h-full flex-col items-start justify-center rounded-md border border-mist bg-card p-8 md:p-12">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-pine text-paper">
                <IconCheck size={24} />
              </span>
              <h2 className="mt-6 font-display text-3xl font-medium tracking-tight">Message received.</h2>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-ink-soft">
                Thanks, {form.name.split(" ")[0] || "friend"} — we'll reply to {form.email} within the hour during
                studio time. For anything urgent, WhatsApp is fastest:
              </p>
              <a href={createWhatsAppChatLink()} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm mt-6">
                <IconWhatsApp size={15} /> Continue on WhatsApp
              </a>
            </div>
          ) : (
            <form onSubmit={submit} noValidate className="rounded-md border border-mist bg-card p-7 md:p-9">
              <h2 className="font-display text-2xl font-medium tracking-tight">Send us a note</h2>
              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="contact-name" className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.2em] text-ink-mute">Name</label>
                  <input id="contact-name" type="text" placeholder="Aarav Mehta" className={inputClass(!!errors.name)} {...field("name")} />
                  {errors.name && <p className="mt-1.5 text-xs text-[#a05244]">{errors.name}</p>}
                </div>
                <div>
                  <label htmlFor="contact-email" className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.2em] text-ink-mute">Email</label>
                  <input id="contact-email" type="email" placeholder="you@example.com" className={inputClass(!!errors.email)} {...field("email")} />
                  {errors.email && <p className="mt-1.5 text-xs text-[#a05244]">{errors.email}</p>}
                </div>
              </div>
              <div className="mt-5">
                <label htmlFor="contact-topic" className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.2em] text-ink-mute">Topic</label>
                <select id="contact-topic" className={inputClass(false)} {...field("topic")}>
                  {["Order question", "Sizing help", "Repair request", "Wholesale", "Something else"].map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div className="mt-5">
                <label htmlFor="contact-message" className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.2em] text-ink-mute">Message</label>
                <textarea id="contact-message" rows={5} placeholder="Tell us what's on your mind…" className={cx(inputClass(!!errors.message), "resize-none")} {...field("message")} />
                {errors.message && <p className="mt-1.5 text-xs text-[#a05244]">{errors.message}</p>}
              </div>
              <button type="submit" className="btn btn-ink mt-7 w-full sm:w-auto">
                Send message <IconArrow size={15} className="btn-arrow" />
              </button>
            </form>
          )}
        </Reveal>

        {/* Direct channels */}
        <div className="space-y-5">
          <Reveal delay={80}>
            <a href={createWhatsAppChatLink()} target="_blank" rel="noopener noreferrer" className="group flex items-center gap-5 rounded-md bg-pine-deep p-6 text-paper transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lift md:p-7">
              <span className="flex h-13 w-13 shrink-0 items-center justify-center rounded-full bg-paper/10 transition-colors group-hover:bg-paper/20" style={{ width: 52, height: 52 }}>
                <IconWhatsApp size={24} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-2 font-display text-xl font-medium tracking-tight">
                  WhatsApp — fastest
                  <span className="relative flex h-2 w-2"><span className="absolute h-full w-full animate-ping rounded-full bg-brass-soft opacity-70" /><span className="relative h-2 w-2 rounded-full bg-brass-soft" /></span>
                </span>
                <span className="mt-1 block text-sm text-paper/65">{SUPPORT_PHONE_DISPLAY} · replies in minutes</span>
              </span>
              <IconArrow size={18} className="shrink-0 transition-transform duration-300 group-hover:translate-x-1" />
            </a>
          </Reveal>
          {[
            { icon: <IconMail size={19} />, label: "Email us", value: SUPPORT_EMAIL, href: `mailto:${SUPPORT_EMAIL}` },
            { icon: <IconPhone size={19} />, label: "Call the studio", value: `${SUPPORT_PHONE_DISPLAY} · ${SUPPORT_HOURS}`, href: createWhatsAppChatLink() },
            { icon: <IconPin size={19} />, label: "Visit the atelier", value: STUDIO_ADDRESS },
            { icon: <IconChat size={19} />, label: "Repair bench", value: "Lifetime repairs — bring or courier your object in" },
          ].map((row, i) =>
            row.href ? (
              <Reveal key={row.label} delay={140 + i * 70}>
                <a href={row.href} target={row.href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" className="group flex items-center gap-5 rounded-md border border-mist bg-card p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-pine/40 hover:shadow-card md:px-6">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-mist-soft text-pine transition-colors group-hover:bg-pine group-hover:text-paper">{row.icon}</span>
                  <span className="min-w-0">
                    <span className="block text-[11px] font-bold uppercase tracking-[0.2em] text-ink-mute">{row.label}</span>
                    <span className="mt-0.5 block truncate text-sm font-semibold text-ink">{row.value}</span>
                  </span>
                </a>
              </Reveal>
            ) : (
              <Reveal key={row.label} delay={140 + i * 70}>
                <div className="flex items-center gap-5 rounded-md border border-mist bg-card p-5 md:px-6">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-mist-soft text-pine">{row.icon}</span>
                  <span className="min-w-0">
                    <span className="block text-[11px] font-bold uppercase tracking-[0.2em] text-ink-mute">{row.label}</span>
                    <span className="mt-0.5 block text-sm font-semibold text-ink">{row.value}</span>
                  </span>
                </div>
              </Reveal>
            )
          )}
        </div>
      </div>

      {/* FAQ */}
      <section className="mt-24 grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-16" aria-labelledby="faq-heading">
        <Reveal>
          <p className="eyebrow">Good to know</p>
          <h2 id="faq-heading" className="mt-4 font-display text-3xl font-medium leading-tight tracking-tight md:text-4xl">
            Questions, <em className="font-light italic text-pine">answered straight.</em>
          </h2>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-ink-mute">
            Shipping, returns, privacy and the fine print — written by us, not by lawyers. Anything
            missing? Ask on WhatsApp.
          </p>
        </Reveal>
        <Reveal delay={100}>
          <Accordion items={FAQ_ITEMS.map(({ title, content }) => ({ title, content }))} defaultOpen={defaultOpen >= 0 ? defaultOpen : 0} />
        </Reveal>
      </section>
    </div>
  );
}
