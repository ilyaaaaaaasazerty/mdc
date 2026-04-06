"use client";

import { Reem_Kufi, Cairo, Montserrat, DM_Sans } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import LenisProvider from "@/components/providers/LenisProvider";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CartDrawer from "@/components/layout/CartDrawer";
import { ThemeProvider } from "@/context/ThemeContext";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const reemKufi = Reem_Kufi({
  subsets: ["arabic"],
  variable: "--font-reem-kufi",
  display: "swap",
});

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-cairo",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

export default function LocaleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const locale = (params?.locale as string) || "ar";
  const isArabic = locale === "ar";
  const direction = isArabic ? "rtl" : "ltr";
  const [messages, setMessages] = useState<Record<string, unknown> | null>(null);

  useEffect(() => {
    import(`../../../messages/${locale}.json`).then((m) => setMessages(m.default));
  }, [locale]);

  const fontVars = `${reemKufi.variable} ${cairo.variable} ${montserrat.variable} ${dmSans.variable}`;
  const fontFamily = isArabic ? cairo.className : dmSans.className;

  if (!messages) {
    return (
      <html lang={locale} dir={direction} className={fontVars}>
        <body className={`${fontFamily} min-h-screen bg-bg-primary text-text-primary`}>
          <div className="flex items-center justify-center min-h-screen">
            <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
          </div>
        </body>
      </html>
    );
  }

  return (
    <html lang={locale} dir={direction} className={`${fontVars} antialiased`}>
      <body className={`${fontFamily} min-h-screen bg-bg-primary text-text-primary`}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ThemeProvider>
            <LenisProvider>
              <Navbar />
              <main className="flex-1">{children}</main>
              <Footer />
              <CartDrawer />
            </LenisProvider>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
