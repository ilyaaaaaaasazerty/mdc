"use client";

import { motion } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
import { sampleRooms, sampleProducts } from "@/lib/queries";
import { getLocalizedText, formatPrice } from "@/lib/utils";
import { Link } from "@/i18n/navigation";
import { Product } from "@/types";
import { Timestamp } from "firebase/firestore";

export default function RoomsPage() {
  const t = useTranslations("sections");
  const locale = useLocale();

  const getProducts = (ids: string[]) =>
    sampleProducts
      .filter((p) => ids.includes(p.id))
      .map((p) => ({ ...p, createdAt: Timestamp.now(), updatedAt: Timestamp.now() })) as Product[];

  return (
    <div className="pt-24 pb-16 px-4">
      <div className="container mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-bold mb-12"
          style={{ fontFamily: locale === "ar" ? "var(--font-reem-kufi)" : "var(--font-montserrat)" }}
        >
          {t("rooms")}
        </motion.h1>

        <div className="space-y-16">
          {sampleRooms.map((room, i) => (
            <motion.div
              key={room.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="relative rounded-[var(--border-radius-xl)] overflow-hidden bg-surface border border-border p-8 md:p-12">
                <div className="absolute top-0 end-0 w-64 h-64 bg-accent/5 rounded-full blur-[80px]" />
                <h2 className="text-2xl md:text-3xl font-bold mb-2">{getLocalizedText(room.name, locale)}</h2>
                <p className="text-text-secondary mb-8">{getLocalizedText(room.description, locale)}</p>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {getProducts(room.productIds).map((product) => (
                    <Link
                      key={product.id}
                      href={`/product/${product.slug}`}
                      className="group bg-bg-primary rounded-[var(--border-radius-md)] p-4 border border-border hover:border-accent/30 transition-all duration-300"
                    >
                      <div className="aspect-square rounded-[var(--border-radius-sm)] bg-bg-secondary mb-3 overflow-hidden">
                        <div className="w-full h-full bg-gradient-to-br from-surface to-bg-elevated group-hover:scale-105 transition-transform duration-500" />
                      </div>
                      <h3 className="text-sm font-medium text-text-primary group-hover:text-accent transition-colors truncate">
                        {getLocalizedText(product.name, locale)}
                      </h3>
                      <p className="text-accent text-sm font-bold mt-1">
                        {formatPrice(product.price)} {locale === "ar" ? "د.ج" : "DA"}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
