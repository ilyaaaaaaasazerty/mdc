"use client";

import { motion } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
import { Send } from "lucide-react";
import Button from "@/components/ui/Button";

export default function Newsletter() {
  const t = useTranslations("sections");
  const locale = useLocale();

  return (
    <section className="py-24 px-4">
      <div className="container mx-auto max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass rounded-[var(--border-radius-xl)] p-10 md:p-14 text-center"
        >
          <h2
            className="text-2xl md:text-3xl font-bold mb-4"
            style={{ fontFamily: locale === "ar" ? "var(--font-reem-kufi)" : "var(--font-montserrat)" }}
          >
            {t("newsletter")}
          </h2>
          <p className="text-text-secondary mb-8">{t("newsletter_subtitle")}</p>

          <form className="flex flex-col sm:flex-row gap-3" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder={t("newsletter_placeholder")}
              className="flex-1 px-5 py-3 bg-surface rounded-[var(--border-radius-sm)] text-text-primary placeholder:text-text-muted border border-border focus:border-accent focus:outline-none transition-colors"
              dir={locale === "ar" ? "rtl" : "ltr"}
            />
            <Button type="submit" className="gap-2">
              {t("newsletter_button")}
              <Send size={16} />
            </Button>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
