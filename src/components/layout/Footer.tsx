"use client";

import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import Image from "next/image";

export default function Footer() {
  const t = useTranslations("footer");
  const tn = useTranslations("nav");
  const locale = useLocale();

  return (
    <footer className="bg-bg-secondary border-t border-border mt-20">
      <div className="container mx-auto px-4 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <Image src="/logo.jpg" alt="أثاث الثقة" width={36} height={36} className="rounded-[var(--border-radius-sm)]" />
              <span className="text-lg font-bold text-text-primary">
                {locale === "ar" ? "أثاث الثقة" : "Athath Al Thiqa"}
              </span>
            </div>
            <p className="text-text-muted text-sm leading-relaxed">{t("description")}</p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-text-primary font-semibold mb-4">{t("quick_links")}</h4>
            <ul className="space-y-3">
              {[
                { href: "/products", label: tn("products") },
                { href: "/collections", label: tn("collections") },
                { href: "/rooms", label: tn("rooms") },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-text-muted hover:text-accent transition-colors text-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-text-primary font-semibold mb-4">{t("contact_info")}</h4>
            <ul className="space-y-3 text-sm text-text-muted">
              <li>{t("phone")}: +213 555 123 456</li>
              <li>{t("email")}: contact@atathalthiqa.dz</li>
              <li>{t("address")}: {locale === "ar" ? "الجزائر العاصمة" : "Alger, Algérie"}</li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-text-primary font-semibold mb-4">{t("follow_us")}</h4>
            <div className="flex gap-4">
              {["Facebook", "Instagram", "TikTok"].map((s) => (
                <a key={s} href="#" className="w-10 h-10 rounded-[var(--border-radius-md)] bg-surface flex items-center justify-center text-text-muted hover:text-accent hover:bg-accent-subtle transition-all text-xs font-bold">
                  {s[0]}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-12 pt-8 text-center text-text-muted text-sm">
          © {new Date().getFullYear()} {locale === "ar" ? "أثاث الثقة" : "Athath Al Thiqa"}. {t("rights")}.
        </div>
      </div>
    </footer>
  );
}
