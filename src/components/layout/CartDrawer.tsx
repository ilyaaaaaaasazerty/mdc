"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
import { X, Minus, Plus, Trash2 } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { formatPrice, getLocalizedText } from "@/lib/utils";
import Button from "@/components/ui/Button";
import Image from "next/image";

export default function CartDrawer() {
  const t = useTranslations("cart");
  const locale = useLocale();
  const { items, isOpen, closeCart, removeItem, updateQuantity, getTotalPrice } = useCartStore();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-black/60 z-50"
            data-lenis-prevent
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: locale === "ar" ? "-100%" : "100%" }}
            animate={{ x: 0 }}
            exit={{ x: locale === "ar" ? "-100%" : "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 bottom-0 w-full max-w-md bg-bg-elevated z-50 flex flex-col"
            style={{ [locale === "ar" ? "left" : "right"]: 0 }}
            data-lenis-prevent
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="text-lg font-semibold">{t("title")}</h2>
              <button onClick={closeCart} className="p-2 text-text-muted hover:text-text-primary transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-6">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-text-muted">
                  <p className="text-lg">{t("empty")}</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {items.map((item) => (
                    <motion.div
                      key={item.product.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex gap-4"
                    >
                      <div className="w-20 h-20 rounded-[var(--border-radius-md)] bg-surface overflow-hidden shrink-0">
                        {item.product.images[0] && (
                          <Image
                            src={item.product.images[0]}
                            alt={getLocalizedText(item.product.name, locale)}
                            width={80}
                            height={80}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-text-primary truncate">
                          {getLocalizedText(item.product.name, locale)}
                        </h3>
                        <p className="text-accent font-semibold text-sm mt-1">
                          {formatPrice(item.product.price)} {t("title") ? "" : ""}
                        </p>
                        <div className="flex items-center gap-3 mt-2">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="w-7 h-7 rounded-[var(--border-radius-xs)] bg-surface flex items-center justify-center text-text-muted hover:text-accent transition-colors"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="w-7 h-7 rounded-[var(--border-radius-xs)] bg-surface flex items-center justify-center text-text-muted hover:text-accent transition-colors"
                          >
                            <Plus size={14} />
                          </button>
                          <button
                            onClick={() => removeItem(item.product.id)}
                            className="ms-auto text-text-muted hover:text-error transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-6 border-t border-border space-y-4">
                <div className="flex justify-between text-lg font-semibold">
                  <span>{t("total")}</span>
                  <span className="text-accent">{formatPrice(getTotalPrice())} د.ج</span>
                </div>
                <Button className="w-full" size="lg">{t("checkout")}</Button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
