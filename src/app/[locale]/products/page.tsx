"use client";

import { motion } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
import ProductCard from "@/components/product/ProductCard";
import { sampleProducts } from "@/lib/queries";
import { Product } from "@/types";
import { Timestamp } from "firebase/firestore";
import { useState } from "react";

export default function ProductsPage() {
  const t = useTranslations("nav");
  const tp = useTranslations("product");
  const locale = useLocale();
  const [activeCategory, setActiveCategory] = useState("all");

  const products = sampleProducts.map((p) => ({
    ...p,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  })) as Product[];

  const categories = ["all", "living-room", "bedroom", "dining-room", "office"];
  const categoryLabels: Record<string, string> = {
    all: locale === "ar" ? "الكل" : "Tout",
    "living-room": locale === "ar" ? "غرفة المعيشة" : "Salon",
    bedroom: locale === "ar" ? "غرفة النوم" : "Chambre",
    "dining-room": locale === "ar" ? "غرفة الطعام" : "Salle à manger",
    office: locale === "ar" ? "المكتب" : "Bureau",
  };

  const filtered = activeCategory === "all" ? products : products.filter((p) => p.category === activeCategory);

  return (
    <div className="pt-24 pb-16 px-4">
      <div className="container mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <h1
            className="text-4xl md:text-5xl font-bold mb-4"
            style={{ fontFamily: locale === "ar" ? "var(--font-reem-kufi)" : "var(--font-montserrat)" }}
          >
            {t("products")}
          </h1>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-3 mt-8">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2 rounded-[var(--border-radius-full)] text-sm font-medium transition-all duration-300 ${
                  activeCategory === cat
                    ? "bg-accent text-white"
                    : "bg-surface text-text-secondary hover:text-text-primary border border-border hover:border-accent/30"
                }`}
              >
                {categoryLabels[cat]}
              </button>
            ))}
          </div>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filtered.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20 text-text-muted">
            <p className="text-lg">{locale === "ar" ? "لا توجد منتجات" : "Aucun produit trouvé"}</p>
          </div>
        )}
      </div>
    </div>
  );
}
