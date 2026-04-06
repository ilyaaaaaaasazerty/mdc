"use client";

import { motion } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ArrowUpRight } from "lucide-react";

const rooms = [
  { key: "living", icon: "🛋️", color: "from-amber-900/30" },
  { key: "bedroom", icon: "🛏️", color: "from-blue-900/30" },
  { key: "dining", icon: "🍽️", color: "from-green-900/30" },
  { key: "office", icon: "💼", color: "from-purple-900/30" },
];

export default function ExploreByRoom() {
  const t = useTranslations("sections");
  const tr = useTranslations("rooms_page");
  const locale = useLocale();

  return (
    <section className="py-24 px-4 bg-bg-secondary">
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
            {t("rooms")}
          </h2>
          <p className="text-text-secondary max-w-xl mx-auto">{t("rooms_subtitle")}</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {rooms.map((room, i) => (
            <motion.div
              key={room.key}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Link
                href="/rooms"
                className={`group block relative h-64 rounded-[var(--border-radius-lg)] overflow-hidden bg-gradient-to-br ${room.color} to-surface border border-border hover:border-accent/30 transition-all duration-500`}
              >
                <div className="absolute inset-0 flex flex-col justify-end p-8">
                  <span className="text-4xl mb-3">{room.icon}</span>
                  <h3 className="text-2xl font-bold text-text-primary mb-1">
                    {tr(room.key as "living" | "bedroom" | "dining" | "office")}
                  </h3>
                  <p className="text-text-muted text-sm">
                    {tr(`${room.key}_desc` as "living_desc" | "bedroom_desc" | "dining_desc" | "office_desc")}
                  </p>
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
