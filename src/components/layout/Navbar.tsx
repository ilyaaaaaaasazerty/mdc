"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ShoppingBag, Search } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import Image from "next/image";

export default function Navbar() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const [mobileOpen, setMobileOpen] = useState(false);
  const totalItems = useCartStore((s) => s.getTotalItems());
  const openCart = useCartStore((s) => s.openCart);
  const otherLocale = locale === "ar" ? "fr" : "ar";

  const links = [
    { href: "/", label: t("home") },
    { href: "/products", label: t("products") },
    { href: "/collections", label: t("collections") },
    { href: "/rooms", label: t("rooms") },
  ];

  return (
    <header className="fixed top-0 inset-x-0 z-50 glass">
      <nav className="container mx-auto flex items-center justify-between h-16 px-4 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <Image src="/logo.png" alt="أثاث الثقة" width={40} height={40} className="rounded-[var(--border-radius-sm)]" style={{ mixBlendMode: "screen" }} />
          <span className="text-lg font-bold text-text-primary hidden sm:block">
            {locale === "ar" ? "أثاث الثقة" : "Athath Al Thiqa"}
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-text-secondary hover:text-accent transition-colors duration-300 text-sm font-medium"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {/* Language Switcher */}
          <a
            href={`/${otherLocale}`}
            className="text-xs font-bold px-3 py-1.5 rounded-[var(--border-radius-full)] border border-border text-text-secondary hover:text-accent hover:border-accent transition-all duration-300"
          >
            {locale === "ar" ? "FR" : "ع"}
          </a>

          {/* Search */}
          <button className="p-2 text-text-secondary hover:text-accent transition-colors">
            <Search size={20} />
          </button>

          {/* Cart */}
          <button onClick={openCart} className="relative p-2 text-text-secondary hover:text-accent transition-colors">
            <ShoppingBag size={20} />
            {totalItems > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-accent text-white text-[10px] flex items-center justify-center rounded-full font-bold"
              >
                {totalItems}
              </motion.span>
            )}
          </button>

          {/* Mobile Menu Toggle */}
          <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 text-text-secondary">
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-bg-elevated border-t border-border"
          >
            <div className="flex flex-col px-6 py-4 gap-4">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-text-secondary hover:text-accent transition-colors py-2 text-base"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
