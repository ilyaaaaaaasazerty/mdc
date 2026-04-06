"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import Button from "@/components/ui/Button";
import { sampleProducts, sampleCategories } from "@/lib/queries";
import { formatPrice, getLocalizedText } from "@/lib/utils";
import {
  Package, FolderOpen, ShoppingCart, BarChart3,
  Plus, Pencil, Trash2, LogIn, LogOut, Eye
} from "lucide-react";
import Image from "next/image";

export default function AdminPage() {
  const t = useTranslations("admin");
  const locale = useLocale();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  if (!isLoggedIn) {
    return (
      <div className="pt-24 min-h-screen flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-bg-elevated rounded-[var(--border-radius-xl)] p-8 border border-border"
        >
          <div className="flex justify-center mb-6">
            <Image src="/logo.jpg" alt="Logo" width={60} height={60} className="rounded-[var(--border-radius-md)]" />
          </div>
          <h1 className="text-2xl font-bold text-center mb-8">{t("login")}</h1>
          <form
            onSubmit={(e) => { e.preventDefault(); setIsLoggedIn(true); }}
            className="space-y-4"
          >
            <div>
              <label className="text-sm text-text-secondary mb-1.5 block">{t("email")}</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-surface rounded-[var(--border-radius-sm)] text-text-primary border border-border focus:border-accent focus:outline-none"
                placeholder="admin@atathalthiqa.dz"
              />
            </div>
            <div>
              <label className="text-sm text-text-secondary mb-1.5 block">{t("password")}</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-surface rounded-[var(--border-radius-sm)] text-text-primary border border-border focus:border-accent focus:outline-none"
                placeholder="••••••••"
              />
            </div>
            <Button type="submit" className="w-full" size="lg">{t("login")}</Button>
          </form>
        </motion.div>
      </div>
    );
  }

  const tabs = [
    { id: "dashboard", label: t("dashboard"), icon: BarChart3 },
    { id: "products", label: t("products"), icon: Package },
    { id: "categories", label: t("categories"), icon: FolderOpen },
    { id: "orders", label: t("orders"), icon: ShoppingCart },
  ];

  const stats = [
    { label: t("total_products"), value: sampleProducts.length, icon: Package, color: "text-accent" },
    { label: t("total_orders"), value: 24, icon: ShoppingCart, color: "text-success" },
    { label: t("revenue"), value: `${formatPrice(2450000)} ${locale === "ar" ? "د.ج" : "DA"}`, icon: BarChart3, color: "text-warning" },
  ];

  return (
    <div className="pt-20 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold">{t("title")}</h1>
          <Button variant="ghost" onClick={() => setIsLoggedIn(false)} className="gap-2">
            <LogOut size={16} />{t("logout")}
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-[var(--border-radius-full)] text-sm font-medium whitespace-nowrap transition-all ${
                activeTab === id ? "bg-accent text-white" : "bg-surface text-text-secondary hover:text-text-primary border border-border"
              }`}
            >
              <Icon size={16} />{label}
            </button>
          ))}
        </div>

        {/* Dashboard */}
        {activeTab === "dashboard" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stats.map((stat) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-bg-elevated rounded-[var(--border-radius-lg)] p-6 border border-border"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-text-muted text-sm">{stat.label}</span>
                  <stat.icon size={20} className={stat.color} />
                </div>
                <div className="text-2xl font-bold">{stat.value}</div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Products Table */}
        {activeTab === "products" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold">{t("products")}</h2>
              <Button size="sm" className="gap-2"><Plus size={14} />{t("add_product")}</Button>
            </div>
            <div className="bg-bg-elevated rounded-[var(--border-radius-lg)] border border-border overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-start px-6 py-4 text-sm text-text-muted font-medium">{locale === "ar" ? "المنتج" : "Produit"}</th>
                    <th className="text-start px-6 py-4 text-sm text-text-muted font-medium">{locale === "ar" ? "الفئة" : "Catégorie"}</th>
                    <th className="text-start px-6 py-4 text-sm text-text-muted font-medium">{t("products") === t("products") ? (locale === "ar" ? "السعر" : "Prix") : ""}</th>
                    <th className="text-end px-6 py-4 text-sm text-text-muted font-medium">{locale === "ar" ? "إجراءات" : "Actions"}</th>
                  </tr>
                </thead>
                <tbody>
                  {sampleProducts.map((product) => (
                    <tr key={product.id} className="border-b border-border last:border-0 hover:bg-surface/50 transition-colors">
                      <td className="px-6 py-4">
                        <span className="font-medium text-text-primary">{getLocalizedText(product.name, locale)}</span>
                      </td>
                      <td className="px-6 py-4 text-text-secondary text-sm">{product.category}</td>
                      <td className="px-6 py-4 text-accent font-semibold">{formatPrice(product.price)} {locale === "ar" ? "د.ج" : "DA"}</td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          <button className="p-2 text-text-muted hover:text-accent transition-colors"><Eye size={16} /></button>
                          <button className="p-2 text-text-muted hover:text-accent transition-colors"><Pencil size={16} /></button>
                          <button className="p-2 text-text-muted hover:text-error transition-colors"><Trash2 size={16} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Categories */}
        {activeTab === "categories" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {sampleCategories.map((cat) => (
              <div key={cat.id} className="bg-bg-elevated rounded-[var(--border-radius-lg)] p-6 border border-border">
                <h3 className="font-semibold mb-2">{getLocalizedText(cat.name, locale)}</h3>
                <p className="text-text-muted text-sm">{getLocalizedText(cat.description, locale)}</p>
              </div>
            ))}
          </div>
        )}

        {/* Orders */}
        {activeTab === "orders" && (
          <div className="bg-bg-elevated rounded-[var(--border-radius-lg)] p-12 border border-border text-center text-text-muted">
            <ShoppingCart size={48} className="mx-auto mb-4 text-border" />
            <p>{locale === "ar" ? "لا توجد طلبات حالياً" : "Aucune commande pour le moment"}</p>
          </div>
        )}
      </div>
    </div>
  );
}
