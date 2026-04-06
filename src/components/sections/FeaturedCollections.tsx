"use client";

import { motion } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { sampleCategories } from "@/lib/queries";
import { getLocalizedText } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";

export default function FeaturedCollections() {
  const t = useTranslations("sections");
  const locale = useLocale();

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
            {t("featured")}
          </h2>
          <p className="text-text-secondary max-w-xl mx-auto">{t("featured_subtitle")}</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {sampleCategories.map((cat, i) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Link href={`/collections`} className="group block relative aspect-[3/4] rounded-[var(--border-radius-lg)] overflow-hidden bg-surface">
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent z-10" />
                <div className="absolute inset-0 bg-accent/0 group-hover:bg-accent/10 transition-colors duration-500 z-10" />
                <div className="w-full h-full bg-gradient-to-br from-surface to-bg-secondary group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute bottom-0 inset-x-0 p-6 z-20">
                  <h3 className="text-xl font-bold text-white mb-1">{getLocalizedText(cat.name, locale)}</h3>
                  <p className="text-white/60 text-sm">{getLocalizedText(cat.description, locale)}</p>
                  <div className="mt-3 flex items-center gap-1 text-accent text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {locale === "ar" ? "استكشف" : "Explorer"}
                    <ArrowUpRight size={14} />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
