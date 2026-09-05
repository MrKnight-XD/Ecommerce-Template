/* ============================================================================
 *  AVANI — CENTRAL STORE CONFIGURATION
 *  ----------------------------------------------------------------------------
 *  Store owners: edit this file to change the WhatsApp number, store name,
 *  shipping rules and contact details. Nothing else in the codebase needs
 *  to be touched — every WhatsApp button reads from here.
 * ==========================================================================*/

/**
 * WhatsApp number in international format, DIGITS ONLY (no +, spaces or dashes).
 * Example for India: "919876543210"  →  +91 98765 43210
 */
export const WHATSAPP_NUMBER = "919876543210";

export const STORE_NAME = "AVANI";
export const STORE_LEGAL_NAME = "Avani Goods Pvt. Ltd.";
export const STORE_TAGLINE = "Considered goods, made to last.";

export const CURRENCY = "INR";
export const CURRENCY_LOCALE = "en-IN";

/** Orders above this amount ship free (shown in announcement bar + cart). */
export const FREE_SHIPPING_THRESHOLD = 999;

export const SUPPORT_EMAIL = "care@avani.in";
export const SUPPORT_PHONE_DISPLAY = "+91 98765 43210";
export const SUPPORT_HOURS = "Mon–Sat, 10:00–19:00 IST";
export const STUDIO_ADDRESS = "14 Chandpol Bazar, Jaipur, Rajasthan 302001";

export const SOCIALS = {
  instagram: "https://instagram.com",
  pinterest: "https://pinterest.com",
  youtube: "https://youtube.com",
  x: "https://x.com",
} as const;

export const ANNOUNCEMENTS = [
  `Free shipping on orders over ₹${FREE_SHIPPING_THRESHOLD}`,
  "Small batches · Lifetime repairs on leather",
  "Cash on delivery available across India",
] as const;
