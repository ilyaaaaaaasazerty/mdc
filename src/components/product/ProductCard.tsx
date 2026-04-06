"use client";

import { motion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Product } from "@/types";
import { formatPrice, getLocalizedText } from "@/lib/utils";
import { ShoppingBag } from "lucide-react";
import { useCartStore } from "@/store/cartStore";

export default function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const locale = useLocale();
  const t = useTranslations("product");
  const addItem = useCartStore((s) => s.addItem);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative"
    >
      <Link href={`/product/${product.slug}`} className="block">
        {/* Image */}
        <div className="relative aspect-[4/5] rounded-[var(--border-radius-lg)] overflow-hidden bg-surface mb-4">
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          {product.images[0] ? (
            <img
              src={product.images[0]}
              alt={getLocalizedText(product.name, locale)}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-text-muted">
              <div className="w-16 h-16 border-2 border-border rounded-[var(--border-radius-md)] flex items-center justify-center">
                <ShoppingBag size={24} />
              </div>
            </div>
          )}

          {/* Compare Price Badge */}
          {product.compareAtPrice && (
            <span className="absolute top-3 start-3 z-20 px-2.5 py-1 bg-accent text-white text-xs font-bold rounded-[var(--border-radius-full)]">
              -{Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)}%
            </span>
          )}

          {/* Quick Add */}
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            whileHover={{ scale: 1.05 }}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              addItem(product as Product);
            }}
            className="absolute bottom-3 end-3 z-20 w-10 h-10 bg-accent text-white rounded-[var(--border-radius-md)] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg cursor-pointer"
          >
            <ShoppingBag size={18} />
          </motion.button>
        </div>

        {/* Info */}
        <div className="space-y-1.5">
          <h3 className="text-text-primary font-medium text-sm group-hover:text-accent transition-colors duration-300 line-clamp-1">
            {getLocalizedText(product.name, locale)}
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-accent font-bold">{formatPrice(product.price)} {t("currency")}</span>
            {product.compareAtPrice && (
              <span className="text-text-muted text-sm line-through">
                {formatPrice(product.compareAtPrice)}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
