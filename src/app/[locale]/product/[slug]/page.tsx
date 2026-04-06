"use client";

import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
import { sampleProducts } from "@/lib/queries";
import { formatPrice, getLocalizedText } from "@/lib/utils";
import { Product } from "@/types";
import { Timestamp } from "firebase/firestore";
import Button from "@/components/ui/Button";
import ProductCard from "@/components/product/ProductCard";
import { useCartStore } from "@/store/cartStore";
import { ShoppingBag, Ruler, Box, Check } from "lucide-react";
import { useState } from "react";
import dynamic from "next/dynamic";

const ProductViewer = dynamic(() => import("@/components/3d/ProductViewer"), { ssr: false });

export default function ProductDetailPage() {
  const params = useParams();
  const t = useTranslations("product");
  const locale = useLocale();
  const addItem = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.openCart);

  const slug = params?.slug as string;
  const raw = sampleProducts.find((p) => p.slug === slug) || sampleProducts[0];
  const product = { ...raw, createdAt: Timestamp.now(), updatedAt: Timestamp.now() } as Product;

  const [selectedColor, setSelectedColor] = useState(product.colors[0]?.hex || "");
  const [quantity, setQuantity] = useState(1);
  const [show3D, setShow3D] = useState(false);
  const [added, setAdded] = useState(false);

  const relatedProducts = sampleProducts
    .filter((p) => p.category === product.category && p.id !== product.id)
    .map((p) => ({ ...p, createdAt: Timestamp.now(), updatedAt: Timestamp.now() })) as Product[];

  const handleAddToCart = () => {
    addItem(product, quantity);
    setAdded(true);
    setTimeout(() => { setAdded(false); openCart(); }, 800);
  };

  return (
    <div className="pt-24 pb-16 px-4">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          {/* Image / 3D Section */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="aspect-square rounded-[var(--border-radius-xl)] overflow-hidden bg-surface relative">
              {show3D ? (
                <ProductViewer />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-surface to-bg-elevated flex items-center justify-center">
                  <div className="text-text-muted flex flex-col items-center gap-2">
                    <Box size={48} className="text-border" />
                    <span className="text-sm">{getLocalizedText(product.name, locale)}</span>
                  </div>
                </div>
              )}
            </div>

            {/* 3D Toggle */}
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => setShow3D(false)}
                className={`flex-1 py-3 rounded-[var(--border-radius-md)] text-sm font-medium transition-all ${!show3D ? "bg-accent text-white" : "bg-surface text-text-secondary border border-border"}`}
              >
                {t("gallery")}
              </button>
              <button
                onClick={() => setShow3D(true)}
                className={`flex-1 py-3 rounded-[var(--border-radius-md)] text-sm font-medium transition-all ${show3D ? "bg-accent text-white" : "bg-surface text-text-secondary border border-border"}`}
              >
                {t("view_3d")}
              </button>
            </div>
          </motion.div>

          {/* Product Info */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <div>
              <h1
                className="text-3xl md:text-4xl font-bold mb-3"
                style={{ fontFamily: locale === "ar" ? "var(--font-reem-kufi)" : "var(--font-montserrat)" }}
              >
                {getLocalizedText(product.name, locale)}
              </h1>
              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold text-accent">{formatPrice(product.price)} {t("currency")}</span>
                {product.compareAtPrice && (
                  <span className="text-text-muted line-through text-lg">{formatPrice(product.compareAtPrice)} {t("currency")}</span>
                )}
              </div>
            </div>

            <p className="text-text-secondary leading-relaxed">{getLocalizedText(product.description, locale)}</p>

            {/* Colors */}
            <div>
              <h3 className="text-sm font-semibold text-text-primary mb-3">{t("colors")}</h3>
              <div className="flex gap-3">
                {product.colors.map((color) => (
                  <button
                    key={color.hex}
                    onClick={() => setSelectedColor(color.hex)}
                    className={`w-10 h-10 rounded-full border-2 transition-all ${selectedColor === color.hex ? "border-accent scale-110" : "border-border"}`}
                    style={{ backgroundColor: color.hex }}
                    title={getLocalizedText(color.name, locale)}
                  />
                ))}
              </div>
            </div>

            {/* Materials */}
            <div>
              <h3 className="text-sm font-semibold text-text-primary mb-3">{t("materials")}</h3>
              <div className="flex flex-wrap gap-2">
                {product.materials.map((mat) => (
                  <span key={mat} className="px-4 py-2 bg-surface rounded-[var(--border-radius-full)] text-sm text-text-secondary border border-border">
                    {mat}
                  </span>
                ))}
              </div>
            </div>

            {/* Dimensions */}
            <div>
              <h3 className="text-sm font-semibold text-text-primary mb-3 flex items-center gap-2"><Ruler size={16} />{t("dimensions")}</h3>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: t("width"), val: product.dimensions.width },
                  { label: t("height"), val: product.dimensions.height },
                  { label: t("depth"), val: product.dimensions.depth },
                ].map(({ label, val }) => (
                  <div key={label} className="bg-surface rounded-[var(--border-radius-md)] p-3 text-center border border-border">
                    <div className="text-text-muted text-xs">{label}</div>
                    <div className="text-text-primary font-semibold">{val} سم</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quantity + Add to Cart */}
            <div className="flex items-center gap-4 pt-4">
              <div className="flex items-center bg-surface rounded-[var(--border-radius-sm)] border border-border">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-4 py-3 text-text-muted hover:text-text-primary">−</button>
                <span className="px-4 py-3 font-medium min-w-[3rem] text-center">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="px-4 py-3 text-text-muted hover:text-text-primary">+</button>
              </div>
              <Button onClick={handleAddToCart} size="lg" className="flex-1 gap-2">
                {added ? <Check size={20} /> : <ShoppingBag size={20} />}
                {added ? (locale === "ar" ? "تمت الإضافة!" : "Ajouté !") : t("add_to_cart")}
              </Button>
            </div>

            {/* Stock */}
            <div className="flex items-center gap-2 text-sm">
              <div className={`w-2 h-2 rounded-full ${product.inStock ? "bg-success" : "bg-error"}`} />
              <span className="text-text-secondary">{product.inStock ? t("in_stock") : t("out_of_stock")}</span>
            </div>
          </motion.div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold mb-8">{t("related")}</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
