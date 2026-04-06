"use client";

import { motion } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
import ProductCard from "@/components/product/ProductCard";
import { sampleProducts } from "@/lib/queries";
import { Product } from "@/types";
import { Timestamp } from "firebase/firestore";

export default function Bestsellers() {
  const t = useTranslations("sections");
  const locale = useLocale();

  const featured = sampleProducts
    .filter((p) => p.featured)
    .map((p) => ({
      ...p,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    })) as Product[];

  return (
    <section className="py-24 px-4">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2
            className="text-3xl md:text-4xl font-bold mb-4"
            style={{ fontFamily: locale === "ar" ? "var(--font-reem-kufi)" : "var(--font-montserrat)" }}
          >
            {t("bestsellers")}
          </h2>
          <p className="text-text-secondary max-w-xl mx-auto">{t("bestsellers_subtitle")}</p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {featured.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
