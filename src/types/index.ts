// Types for أثاث الثقة e-commerce platform

import { Timestamp } from "firebase/firestore";

// ==========================================
// Product Types
// ==========================================

export interface BilingualText {
  ar: string;
  fr: string;
}

export interface ProductColor {
  name: BilingualText;
  hex: string;
}

export interface ProductDimensions {
  width: number;
  height: number;
  depth: number;
}

export interface Product {
  id: string;
  slug: string;
  name: BilingualText;
  description: BilingualText;
  price: number;
  compareAtPrice?: number;
  images: string[];
  category: string;
  collection: string;
  materials: string[];
  colors: ProductColor[];
  dimensions: ProductDimensions;
  modelUrl?: string;
  featured: boolean;
  inStock: boolean;
  stockByStore: Record<string, number>;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// ==========================================
// Category Types
// ==========================================

export interface Category {
  id: string;
  name: BilingualText;
  slug: string;
  image: string;
  description: BilingualText;
  order: number;
}

// ==========================================
// Room Types
// ==========================================

export interface Room {
  id: string;
  name: BilingualText;
  slug: string;
  image: string;
  description: BilingualText;
  productIds: string[];
}

// ==========================================
// Order Types
// ==========================================

export interface OrderItem {
  productId: string;
  name: BilingualText;
  quantity: number;
  price: number;
  image: string;
}

export interface Order {
  id: string;
  items: OrderItem[];
  total: number;
  status: "pending" | "processing" | "shipped" | "delivered";
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  createdAt: Timestamp;
}

// ==========================================
// Cart Types
// ==========================================

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
  selectedMaterial?: string;
}

// ==========================================
// UI Types
// ==========================================

export type Locale = "ar" | "fr";

export interface NavItem {
  label: BilingualText;
  href: string;
}
