import { useEffect } from "react";
import { HashRouter, Link, Route, Routes, useLocation } from "react-router-dom";
import { StoreProvider, useStore } from "./context/StoreContext";
import Navbar from "./components/Navbar";
import Footer, { NewsletterBand } from "./components/Footer";
import { CartDrawer, SearchOverlay, ToastHost } from "./components/Overlays";
import { IconArrow, IconSearch } from "./components/ui";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import ProductPage from "./pages/Product";
import CartPage from "./pages/CartPage";
import About from "./pages/About";
import Contact from "./pages/Contact";

/* Scroll to top on route change */
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [pathname]);
  return null;
}

/* Global keyboard shortcuts: "/" or ⌘K opens search */
function GlobalShortcuts() {
  const { setSearchOpen, isSearchOpen } = useStore();
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const typing = target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.tagName === "SELECT" || target.isContentEditable);
      if ((event.key === "k" && (event.metaKey || event.ctrlKey)) || (event.key === "/" && !typing)) {
        event.preventDefault();
        if (!isSearchOpen) setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setSearchOpen, isSearchOpen]);
  return null;
}

function NotFound() {
  return (
    <div className="container-x flex flex-col items-center py-32 text-center">
      <p className="eyebrow">Error 404</p>
      <h1 className="mt-4 font-display text-5xl font-medium tracking-tight md:text-7xl">
        Off the <em className="font-light italic text-pine">map.</em>
      </h1>
      <p className="mt-4 max-w-sm text-sm leading-relaxed text-ink-mute">
        This page isn't part of the permanent collection. Let's get you back to something real.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link to="/" className="btn btn-primary">
          Back home <IconArrow size={15} className="btn-arrow" />
        </Link>
        <Link to="/shop" className="btn btn-outline">
          <IconSearch size={15} /> Browse the shop
        </Link>
      </div>
    </div>
  );
}

function Shell() {
  const location = useLocation();
  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-ink focus:px-5 focus:py-2.5 focus:text-sm focus:font-semibold focus:text-paper"
      >
        Skip to content
      </a>
      <ScrollToTop />
      <GlobalShortcuts />
      <Navbar />
      <main id="main-content" key={location.pathname} className="anim-fade-in flex-1" style={{ animationDuration: "0.45s" }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:slug" element={<ProductPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <NewsletterBand />
      <Footer />
      <CartDrawer />
      <SearchOverlay />
      <ToastHost />
      <div className="noise-layer" aria-hidden="true" />
    </div>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <HashRouter>
        <Shell />
      </HashRouter>
    </StoreProvider>
  );
}
