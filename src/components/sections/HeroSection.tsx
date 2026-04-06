"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { useTranslations, useLocale } from "next-intl";
import Button from "@/components/ui/Button";
import { Link } from "@/i18n/navigation";
import { ArrowDown } from "lucide-react";
import Image from "next/image";

export default function HeroSection() {
  const container = useRef<HTMLDivElement>(null);
  const t = useTranslations("hero");
  const locale = useLocale();
  const isArabic = locale === "ar";

  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    tl.from(".hero-bg", { scale: 1.1, opacity: 0, duration: 1.8 })
      .from(".hero-overlay", { opacity: 0, duration: 1 }, "-=1.2")
      .from(".hero-logo", { y: 40, opacity: 0, duration: 0.8 }, "-=0.6")
      .from(".hero-title", { y: 60, opacity: 0, duration: 0.8 }, "-=0.4")
      .from(".hero-subtitle", { y: 40, opacity: 0, duration: 0.7 }, "-=0.4")
      .from(".hero-cta", { y: 30, opacity: 0, duration: 0.6 }, "-=0.3")
      .from(".hero-scroll", { y: 20, opacity: 0, duration: 0.5 }, "-=0.2");

    // Parallax on scroll
    gsap.to(".hero-bg", {
      yPercent: 20,
      ease: "none",
      scrollTrigger: {
        trigger: container.current,
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    });
  }, { scope: container });

  return (
    <section ref={container} className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="hero-bg absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-bg-primary via-bg-secondary to-bg-primary" />
        {/* Ambient glow */}
        <div className="absolute top-1/4 start-1/4 w-96 h-96 bg-accent/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 end-1/4 w-72 h-72 bg-accent/8 rounded-full blur-[100px]" />
      </div>

      {/* Overlay */}
      <div className="hero-overlay absolute inset-0 bg-gradient-to-t from-bg-primary via-bg-primary/40 to-transparent" />

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <div className="hero-logo flex justify-center mb-8">
          <Image
            src="/logo.jpg"
            alt="أثاث الثقة"
            width={100}
            height={100}
            className="rounded-[var(--border-radius-xl)] shadow-2xl"
          />
        </div>

        <h1
          className="hero-title text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6"
          style={{ fontFamily: isArabic ? "var(--font-reem-kufi)" : "var(--font-montserrat)" }}
        >
          {t("title")}
        </h1>

        <p className="hero-subtitle text-text-secondary text-base sm:text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
          {t("subtitle")}
        </p>

        <div className="hero-cta flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/products">
            <Button size="lg">{t("cta")}</Button>
          </Link>
          <Link href="/collections">
            <Button variant="outline" size="lg">{t("secondary_cta")}</Button>
          </Link>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="hero-scroll absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-text-muted">
        <ArrowDown size={20} className="animate-bounce" />
      </div>
    </section>
  );
}
