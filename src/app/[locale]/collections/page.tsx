"use client";

import { motion } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
import { sampleCategories } from "@/lib/queries";
import { getLocalizedText } from "@/lib/utils";
import { Link } from "@/i18n/navigation";
import { ArrowUpRight } from "lucide-react";

export default function CollectionsPage() {
  const t = useTranslations("sections");
  const locale = useLocale();

  return (
    <div className="pt-24 pb-16 px-4">
      <div className="container mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-bold mb-12"
          style={{ fontFamily: locale === "ar" ? "var(--font-reem-kufi)" : "var(--font-montserrat)" }}
        >
          {t("featured")}
        </motion.h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {sampleCategories.map((cat, i) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Link
                href="/products"
                className="group block relative aspect-[16/10] rounded-[var(--border-radius-lg)] overflow-hidden bg-surface border border-border hover:border-accent/30 transition-all duration-500"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent z-10" />
                <div className="w-full h-full bg-gradient-to-br from-surface to-bg-elevated group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute bottom-0 inset-x-0 p-8 z-20">
                  <h2 className="text-3xl font-bold text-white mb-2">{getLocalizedText(cat.name, locale)}</h2>
                  <p className="text-white/60">{getLocalizedText(cat.description, locale)}</p>
                  <div className="mt-4 flex items-center gap-1 text-accent font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    {locale === "ar" ? "تصفح المجموعة" : "Parcourir"} <ArrowUpRight size={16} />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
