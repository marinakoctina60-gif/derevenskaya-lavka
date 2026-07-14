export type PaymentMethod = "cash" | "terminal";

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  unit: string;
  category: string;
  accent: string;
  available: boolean;
  image?: string;
};

export type SiteSettings = {
  brandName: string;
  tagline: string;
  heroTitle: string;
  heroLead: string;
  heroImage: string;
  phone: string;
  phoneDisplay: string;
  hours: string;
  aboutTitle: string;
  aboutText1: string;
  aboutText2: string;
  catalogIntro: string;
  footerTagline: string;
};

export type CartItem = {
  productId: string;
  quantity: number;
};

export type OrderItem = {
  productId: string;
  name: string;
  unit: string;
  price: number;
  quantity: number;
};

export type OrderPayload = {
  name: string;
  phone: string;
  address: string;
  paymentMethod: PaymentMethod;
  comment?: string;
  items: OrderItem[];
  total: number;
};

export type SavedOrder = OrderPayload & {
  id: string;
  createdAt: string;
  status: "new";
};

export type ProductInput = Omit<Product, "id"> & { id?: string };
