import { STORE_NAME, WHATSAPP_NUMBER } from "../config/store";
import { formatINR } from "./utils";
import type { CartItem, Product } from "../data/products";
import { getProductById } from "../data/products";

/* ============================================================================
 *  WHATSAPP COMMERCE ENGINE
 *  All Buy-Now / Checkout links are built here. The phone number comes from
 *  src/config/store.ts — product names are ALWAYS read from live product data,
 *  never hard-coded into UI components.
 * ==========================================================================*/

export interface ProductSelection {
  color?: string;
  size?: string;
  quantity: number;
}

export interface ResolvedCartLine {
  product: Product;
  color?: string;
  size?: string;
  qty: number;
}

/** https://wa.me/919876543210?text=<encoded> */
export function buildWhatsAppUrl(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

function variantLine(size?: string, color?: string): string | null {
  const parts = [size, color].filter(Boolean);
  return parts.length > 0 ? `Variant: ${parts.join(" / ")}` : null;
}

function priceLine(unit: number, qty: number): string {
  const total = unit * qty;
  return qty > 1
    ? `Price: ${formatINR(total)} (${qty} × ${formatINR(unit)})`
    : `Price: ${formatINR(total)}`;
}

/** Pre-filled message for a single product (Buy Now on product page / cards). */
export function createWhatsAppProductMessage(
  product: Product,
  selection: ProductSelection
): string {
  const lines: string[] = [
    `Hi ${STORE_NAME}! I'd like to order the following product:`,
    "",
    `Product: ${product.name}`,
  ];
  const variant = variantLine(selection.size, selection.color);
  if (variant) lines.push(variant);
  lines.push(`Quantity: ${selection.quantity}`, priceLine(product.price, selection.quantity));
  lines.push("", "Please provide me with the next steps.");
  return lines.join("\n");
}

export function createWhatsAppProductLink(
  product: Product,
  selection: ProductSelection
): string {
  return buildWhatsAppUrl(createWhatsAppProductMessage(product, selection));
}

/** Pre-filled message containing every line in the cart (Checkout). */
export function createWhatsAppCartMessage(items: ResolvedCartLine[]): string {
  const lines: string[] = [`Hi ${STORE_NAME}! I'd like to place an order:`, ""];
  items.forEach((item, index) => {
    lines.push(`${index + 1}. ${item.product.name}`);
    const variant = variantLine(item.size, item.color);
    if (variant) lines.push(`   ${variant}`);
    lines.push(`   Quantity: ${item.qty}`);
    lines.push(`   ${priceLine(item.product.price, item.qty)}`);
    lines.push("");
  });
  const total = items.reduce((sum, item) => sum + item.product.price * item.qty, 0);
  lines.push(`Total: ${formatINR(total)}`);
  lines.push("", "Please provide me with the next steps.");
  return lines.join("\n");
}

export function createWhatsAppCartLink(items: ResolvedCartLine[]): string {
  return buildWhatsAppUrl(createWhatsAppCartMessage(items));
}

/** Generic "chat with us" link (contact page, footer). */
export function createWhatsAppChatLink(message?: string): string {
  return buildWhatsAppUrl(message ?? `Hi ${STORE_NAME}! I have a question about your products.`);
}

/** Resolve raw cart items (ids) into full product lines for messaging. */
export function resolveCartLines(items: CartItem[]): ResolvedCartLine[] {
  return items.flatMap((item) => {
    const product = getProductById(item.productId);
    if (!product) return [];
    return [{ product, color: item.color, size: item.size, qty: item.qty }];
  });
}

/** Open a wa.me link in a new tab — works on desktop and deep-links the app on mobile. */
export function openWhatsApp(url: string): void {
  window.open(url, "_blank", "noopener,noreferrer");
}
