import { type ClassValue, clsx } from "clsx";

// Combines class names intelligently (supports conditionals)
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

// Format price in DZD
export function formatPrice(price: number): string {
  return new Intl.NumberFormat("ar-DZ", {
    style: "decimal",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

// Generate a slug from text
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Get bilingual text based on locale
export function getLocalizedText(
  text: { ar: string; fr: string },
  locale: string
): string {
  return locale === "ar" ? text.ar : text.fr;
}

// Debounce function
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}
