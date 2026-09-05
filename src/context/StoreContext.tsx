import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { CartItem, Product } from "../data/products";
import { getProductById } from "../data/products";
import type { ProductSelection } from "../lib/whatsapp";
import { formatINR } from "../lib/utils";

export interface Toast {
  id: number;
  title: string;
  message?: string;
  image?: string;
  tone: "success" | "info";
}

interface StoreState {
  cart: CartItem[];
  cartCount: number;
  subtotal: number;
  badgeKey: number;
  wishlist: number[];
  toasts: Toast[];
  isCartOpen: boolean;
  isSearchOpen: boolean;
  isMenuOpen: boolean;
  addToCart: (product: Product, selection: ProductSelection) => void;
  updateQty: (key: string, qty: number) => void;
  removeFromCart: (key: string) => void;
  toggleWishlist: (product: Product) => void;
  isWishlisted: (id: number) => boolean;
  setCartOpen: (open: boolean) => void;
  setSearchOpen: (open: boolean) => void;
  setMenuOpen: (open: boolean) => void;
  pushToast: (toast: Omit<Toast, "id">) => void;
  dismissToast: (id: number) => void;
}

const StoreContext = createContext<StoreState | null>(null);

function loadJSON<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function cartLineKey(productId: number, color?: string, size?: string): string {
  return `${productId}|${color ?? "-"}|${size ?? "-"}`;
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>(() => loadJSON<CartItem[]>("avani:cart", []));
  const [wishlist, setWishlist] = useState<number[]>(() => loadJSON<number[]>("avani:wishlist", []));
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [isCartOpen, setCartOpen] = useState(false);
  const [isSearchOpen, setSearchOpen] = useState(false);
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [badgeKey, setBadgeKey] = useState(0);

  useEffect(() => {
    try {
      window.localStorage.setItem("avani:cart", JSON.stringify(cart));
    } catch {
      /* storage unavailable — cart lives in memory */
    }
  }, [cart]);

  useEffect(() => {
    try {
      window.localStorage.setItem("avani:wishlist", JSON.stringify(wishlist));
    } catch {
      /* storage unavailable */
    }
  }, [wishlist]);

  const dismissToast = useCallback((id: number) => {
    setToasts((current) => current.filter((t) => t.id !== id));
  }, []);

  const pushToast = useCallback(
    (toast: Omit<Toast, "id">) => {
      const id = Date.now() + Math.floor(Math.random() * 1000);
      setToasts((current) => [...current.slice(-2), { ...toast, id }]);
      window.setTimeout(() => dismissToast(id), 3800);
    },
    [dismissToast]
  );

  const addToCart = useCallback(
    (product: Product, selection: ProductSelection) => {
      const key = cartLineKey(product.id, selection.color, selection.size);
      setCart((current) => {
        const existing = current.find((item) => item.key === key);
        if (existing) {
          return current.map((item) =>
            item.key === key ? { ...item, qty: Math.min(9, item.qty + selection.quantity) } : item
          );
        }
        return [
          ...current,
          { key, productId: product.id, color: selection.color, size: selection.size, qty: selection.quantity },
        ];
      });
      setBadgeKey((k) => k + 1);
      const variant = [selection.size, selection.color].filter(Boolean).join(" / ");
      pushToast({
        tone: "success",
        title: "Added to your bag",
        message: `${product.name}${variant ? ` — ${variant}` : ""} × ${selection.quantity}`,
        image: product.image,
      });
    },
    [pushToast]
  );

  const updateQty = useCallback((key: string, qty: number) => {
    setCart((current) =>
      qty <= 0
        ? current.filter((item) => item.key !== key)
        : current.map((item) => (item.key === key ? { ...item, qty: Math.min(9, qty) } : item))
    );
  }, []);

  const removeFromCart = useCallback(
    (key: string) => {
      const item = cart.find((i) => i.key === key);
      setCart((current) => current.filter((i) => i.key !== key));
      if (item) {
        const product = getProductById(item.productId);
        if (product) {
          pushToast({ tone: "info", title: "Removed from bag", message: product.name });
        }
      }
    },
    [cart, pushToast]
  );

  const toggleWishlist = useCallback(
    (product: Product) => {
      setWishlist((current) => {
        const has = current.includes(product.id);
        if (has) {
          pushToast({ tone: "info", title: "Removed from wishlist", message: product.name });
          return current.filter((id) => id !== product.id);
        }
        pushToast({ tone: "success", title: "Saved to wishlist", message: product.name, image: product.image });
        return [...current, product.id];
      });
    },
    [pushToast]
  );

  const isWishlisted = useCallback((id: number) => wishlist.includes(id), [wishlist]);

  const { cartCount, subtotal } = useMemo(() => {
    let count = 0;
    let total = 0;
    cart.forEach((item) => {
      const product = getProductById(item.productId);
      count += item.qty;
      if (product) total += product.price * item.qty;
    });
    return { cartCount: count, subtotal: total };
  }, [cart]);

  const value: StoreState = {
    cart,
    cartCount,
    subtotal,
    badgeKey,
    wishlist,
    toasts,
    isCartOpen,
    isSearchOpen,
    isMenuOpen,
    addToCart,
    updateQty,
    removeFromCart,
    toggleWishlist,
    isWishlisted,
    setCartOpen,
    setSearchOpen,
    setMenuOpen,
    pushToast,
    dismissToast,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreState {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside <StoreProvider>");
  return ctx;
}

/** Human-readable variant summary for a cart line. */
export function describeVariant(item: CartItem): string {
  return [item.size, item.color].filter(Boolean).join(" / ");
}

/** Line total formatted. */
export function lineTotal(item: CartItem): string {
  const product = getProductById(item.productId);
  return product ? formatINR(product.price * item.qty) : "";
}
