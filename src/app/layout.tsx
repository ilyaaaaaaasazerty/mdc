import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "أثاث الثقة | Athath Al Thiqa",
  description: "أثاث فاخر وعصري في الجزائر - Mobilier luxueux et contemporain en Algérie",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
