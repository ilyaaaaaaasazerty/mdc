import { Product, Category, Room } from "@/types";

// ==========================================
// Sample Data (used until Firebase is connected)
// ==========================================

export const sampleProducts: Omit<Product, "createdAt" | "updatedAt">[] = [
  {
    id: "1",
    slug: "modern-sofa-x",
    name: { ar: "أريكة عصرية إكس", fr: "Canapé Moderne X" },
    description: {
      ar: "أريكة فاخرة بتصميم عصري مع وسائد مريحة وهيكل خشبي متين. مثالية لغرفة المعيشة العصرية.",
      fr: "Canapé luxueux au design contemporain avec coussins confortables et structure en bois massif. Parfait pour un salon moderne.",
    },
    price: 185000,
    compareAtPrice: 220000,
    images: ["/images/products/sofa-1.jpg", "/images/products/sofa-2.jpg"],
    category: "living-room",
    collection: "modern-living",
    materials: ["leather", "wood"],
    colors: [
      { name: { ar: "أسود", fr: "Noir" }, hex: "#1a1a1a" },
      { name: { ar: "بيج", fr: "Beige" }, hex: "#d4c5a9" },
      { name: { ar: "رمادي", fr: "Gris" }, hex: "#6b6b6b" },
    ],
    dimensions: { width: 220, height: 85, depth: 95 },
    featured: true,
    inStock: true,
    stockByStore: { algiers: 5, oran: 3, constantine: 2 },
  },
  {
    id: "2",
    slug: "royal-bed-frame",
    name: { ar: "سرير رويال", fr: "Lit Royal" },
    description: {
      ar: "سرير فاخر بتصميم ملكي مع لوح أمامي مبطن وقاعدة خشبية صلبة. يضفي لمسة من الفخامة على غرفة نومك.",
      fr: "Lit luxueux au design royal avec tête de lit capitonnée et base en bois massif. Apporte une touche de luxe à votre chambre.",
    },
    price: 145000,
    images: ["/images/products/bed-1.jpg"],
    category: "bedroom",
    collection: "royal-comfort",
    materials: ["velvet", "oak"],
    colors: [
      { name: { ar: "كحلي", fr: "Bleu marine" }, hex: "#1a2744" },
      { name: { ar: "رمادي فاتح", fr: "Gris clair" }, hex: "#c8c8c8" },
    ],
    dimensions: { width: 180, height: 120, depth: 210 },
    featured: true,
    inStock: true,
    stockByStore: { algiers: 8, oran: 4 },
  },
  {
    id: "3",
    slug: "dining-table-elegance",
    name: { ar: "طاولة طعام إليغانس", fr: "Table à Manger Élégance" },
    description: {
      ar: "طاولة طعام أنيقة من خشب الجوز الطبيعي، تتسع لـ 8 أشخاص. التصميم البسيط والأنيق يجعلها محور غرفة الطعام.",
      fr: "Table à manger élégante en noyer naturel, pouvant accueillir 8 personnes. Son design simple et raffiné en fait le point focal de votre salle à manger.",
    },
    price: 98000,
    images: ["/images/products/table-1.jpg"],
    category: "dining-room",
    collection: "natural-wood",
    materials: ["walnut"],
    colors: [
      { name: { ar: "جوزي", fr: "Noyer" }, hex: "#5c3a1e" },
      { name: { ar: "بلوط فاتح", fr: "Chêne clair" }, hex: "#c4a67d" },
    ],
    dimensions: { width: 200, height: 76, depth: 100 },
    featured: true,
    inStock: true,
    stockByStore: { algiers: 3, oran: 2, constantine: 1 },
  },
  {
    id: "4",
    slug: "executive-desk-pro",
    name: { ar: "مكتب تنفيذي برو", fr: "Bureau Executive Pro" },
    description: {
      ar: "مكتب تنفيذي فخم بتصميم عصري مع أدراج تخزين واسعة وسطح عمل من الزجاج المقسى.",
      fr: "Bureau exécutif luxueux au design moderne avec de généreux tiroirs de rangement et un plateau en verre trempé.",
    },
    price: 75000,
    compareAtPrice: 89000,
    images: ["/images/products/desk-1.jpg"],
    category: "office",
    collection: "workspace",
    materials: ["glass", "steel", "wood"],
    colors: [
      { name: { ar: "أسود", fr: "Noir" }, hex: "#1a1a1a" },
      { name: { ar: "أبيض", fr: "Blanc" }, hex: "#f5f5f0" },
    ],
    dimensions: { width: 160, height: 76, depth: 80 },
    featured: false,
    inStock: true,
    stockByStore: { algiers: 6, oran: 4 },
  },
  {
    id: "5",
    slug: "lounge-armchair-comfort",
    name: { ar: "كرسي استرخاء كمفورت", fr: "Fauteuil Lounge Comfort" },
    description: {
      ar: "كرسي استرخاء مريح بتصميم اسكندنافي مع مسند ظهر مريح وقاعدة خشبية دوّارة.",
      fr: "Fauteuil de détente confortable au design scandinave avec dossier ergonomique et base pivotante en bois.",
    },
    price: 62000,
    images: ["/images/products/chair-1.jpg"],
    category: "living-room",
    collection: "scandinavian",
    materials: ["fabric", "birch"],
    colors: [
      { name: { ar: "أخضر زيتوني", fr: "Vert olive" }, hex: "#556b2f" },
      { name: { ar: "خردلي", fr: "Moutarde" }, hex: "#c8a951" },
      { name: { ar: "وردي", fr: "Rose" }, hex: "#d4a0a0" },
    ],
    dimensions: { width: 80, height: 95, depth: 85 },
    featured: true,
    inStock: true,
    stockByStore: { algiers: 12, oran: 8, constantine: 6 },
  },
  {
    id: "6",
    slug: "minimalist-tv-unit",
    name: { ar: "وحدة تلفاز مينيماليست", fr: "Meuble TV Minimaliste" },
    description: {
      ar: "وحدة تلفاز بتصميم بسيط وعصري مع مساحات تخزين مخفية وإضاءة LED مدمجة.",
      fr: "Meuble TV au design simple et moderne avec espaces de rangement cachés et éclairage LED intégré.",
    },
    price: 54000,
    images: ["/images/products/tv-unit-1.jpg"],
    category: "living-room",
    collection: "modern-living",
    materials: ["MDF", "steel"],
    colors: [
      { name: { ar: "أبيض مطفي", fr: "Blanc mat" }, hex: "#e8e8e3" },
      { name: { ar: "رمادي داكن", fr: "Gris foncé" }, hex: "#3a3a3a" },
    ],
    dimensions: { width: 180, height: 45, depth: 40 },
    featured: false,
    inStock: true,
    stockByStore: { algiers: 7, oran: 5 },
  },
];

export const sampleCategories: Category[] = [
  {
    id: "1",
    name: { ar: "غرفة المعيشة", fr: "Salon" },
    slug: "living-room",
    image: "/images/categories/living-room.jpg",
    description: {
      ar: "أثاث فاخر لغرفة معيشة عصرية ومريحة",
      fr: "Mobilier luxueux pour un salon moderne et confortable",
    },
    order: 1,
  },
  {
    id: "2",
    name: { ar: "غرفة النوم", fr: "Chambre à coucher" },
    slug: "bedroom",
    image: "/images/categories/bedroom.jpg",
    description: {
      ar: "أسرّة وأثاث لنوم مريح وهادئ",
      fr: "Lits et mobilier pour un sommeil confortable et paisible",
    },
    order: 2,
  },
  {
    id: "3",
    name: { ar: "غرفة الطعام", fr: "Salle à manger" },
    slug: "dining-room",
    image: "/images/categories/dining-room.jpg",
    description: {
      ar: "طاولات وكراسي لأجمل لحظات العائلة",
      fr: "Tables et chaises pour les meilleurs moments en famille",
    },
    order: 3,
  },
  {
    id: "4",
    name: { ar: "المكتب", fr: "Bureau" },
    slug: "office",
    image: "/images/categories/office.jpg",
    description: {
      ar: "أثاث مكتبي أنيق ومريح للإنتاجية",
      fr: "Mobilier de bureau élégant et confortable pour la productivité",
    },
    order: 4,
  },
];

export const sampleRooms: Room[] = [
  {
    id: "1",
    name: { ar: "الصالون العصري", fr: "Le Salon Moderne" },
    slug: "modern-living",
    image: "/images/rooms/living-room.jpg",
    description: {
      ar: "صالون عصري بألوان هادئة وأثاث مريح",
      fr: "Un salon moderne aux couleurs apaisantes et au mobilier confortable",
    },
    productIds: ["1", "5", "6"],
  },
  {
    id: "2",
    name: { ar: "غرفة النوم الملكية", fr: "La Chambre Royale" },
    slug: "royal-bedroom",
    image: "/images/rooms/bedroom.jpg",
    description: {
      ar: "غرفة نوم فاخرة بطابع ملكي",
      fr: "Une chambre luxueuse au style royal",
    },
    productIds: ["2"],
  },
  {
    id: "3",
    name: { ar: "غرفة الطعام الأنيقة", fr: "La Salle à Manger Élégante" },
    slug: "elegant-dining",
    image: "/images/rooms/dining-room.jpg",
    description: {
      ar: "غرفة طعام أنيقة لأجمل اللحظات",
      fr: "Une salle à manger élégante pour les meilleurs moments",
    },
    productIds: ["3"],
  },
  {
    id: "4",
    name: { ar: "مكتب العمل", fr: "L'Espace Bureau" },
    slug: "home-office",
    image: "/images/rooms/office.jpg",
    description: {
      ar: "مساحة عمل أنيقة ومنتجة",
      fr: "Un espace de travail élégant et productif",
    },
    productIds: ["4"],
  },
];
