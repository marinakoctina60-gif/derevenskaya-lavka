import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import productsSeed from "../../data/products.json";
import settingsSeed from "../../data/settings.json";
import { getCloudKv } from "@/lib/cloud-kv";
import type { Product, SavedOrder, SiteSettings } from "@/lib/types";

const DATA_DIR = path.join(process.cwd(), "data");
const PRODUCTS_FILE = path.join(DATA_DIR, "products.json");
const SETTINGS_FILE = path.join(DATA_DIR, "settings.json");
const ORDERS_FILE = path.join(DATA_DIR, "orders.json");

const KV_PRODUCTS = "products";
const KV_SETTINGS = "settings";
const KV_ORDERS = "orders";

const DEFAULT_SETTINGS: SiteSettings = {
  brandName: "Деревенская лавка",
  tagline: "Домашняя продукция с нашего двора",
  heroTitle: "Свежие продукты с нашего двора",
  heroLead:
    "Соберите корзину на сайте и оставьте заявку. Оплатите при получении — наличными или по терминалу.",
  heroImage: "/uploads/hero-farm-table.jpg",
  phone: "+79000000000",
  phoneDisplay: "+7 (900) 000-00-00",
  hours: "Ежедневно с 9:00 до 20:00",
  aboutTitle: "О нашей лавке",
  aboutText1:
    "Мы выращиваем и готовим продукты для семьи и соседей: молоко и творог со своего двора, овощи с грядки, мёд с пасеки и домашние заготовки.",
  aboutText2:
    "На сайте можно спокойно собрать заказ и оставить заявку. Мы свяжемся с вами, подтвердим наличие и договоримся о времени. Деньги — только при получении.",
  catalogIntro: "Домашняя деревенская продукция — с грядки и с двора.",
  footerTagline: "Домашняя продукция с нашего двора",
};

function seedProducts(): Product[] {
  return (productsSeed as Partial<Product>[]).map((item, index) =>
    normalizeProduct(item, `product-${index + 1}`),
  );
}

function seedSettings(): SiteSettings {
  return { ...DEFAULT_SETTINGS, ...(settingsSeed as Partial<SiteSettings>) };
}

async function ensureDataDir() {
  await mkdir(DATA_DIR, { recursive: true });
}

function normalizeProduct(raw: Partial<Product>, fallbackId: string): Product {
  const price = Number(raw.price);
  const image = typeof raw.image === "string" ? raw.image.trim() : "";
  return {
    id: String(raw.id || fallbackId),
    name: String(raw.name || "Без названия").trim(),
    description: String(raw.description || "").trim(),
    price: Number.isFinite(price) && price >= 0 ? Math.round(price) : 0,
    unit: String(raw.unit || "шт").trim(),
    category: String(raw.category || "Разное").trim(),
    accent: String(raw.accent || "#7a9e7e").trim(),
    available: raw.available !== false,
    ...(image ? { image } : {}),
  };
}

function normalizeProducts(raw: Partial<Product>[]): Product[] {
  return raw.map((item, index) => normalizeProduct(item, `product-${index + 1}`));
}

async function readJsonFile<T>(filePath: string): Promise<T | null> {
  try {
    const raw = await readFile(filePath, "utf8");
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export async function getProducts(): Promise<Product[]> {
  const kv = await getCloudKv();
  if (kv) {
    const raw = await kv.get(KV_PRODUCTS);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<Product>[];
      if (Array.isArray(parsed) && parsed.length > 0) {
        return normalizeProducts(parsed);
      }
    }
    const seeded = seedProducts();
    await kv.put(KV_PRODUCTS, JSON.stringify(seeded));
    return seeded;
  }

  const fromFile = await readJsonFile<Partial<Product>[]>(PRODUCTS_FILE);
  if (Array.isArray(fromFile) && fromFile.length > 0) {
    return normalizeProducts(fromFile);
  }
  return seedProducts();
}

export async function getAvailableProducts(): Promise<Product[]> {
  const products = await getProducts();
  return products.filter((p) => p.available);
}

export async function saveProducts(products: Product[]) {
  const normalized = normalizeProducts(products);
  const kv = await getCloudKv();
  if (kv) {
    await kv.put(KV_PRODUCTS, JSON.stringify(normalized));
    return normalized;
  }

  try {
    await ensureDataDir();
    await writeFile(PRODUCTS_FILE, JSON.stringify(normalized, null, 2), "utf8");
    return normalized;
  } catch {
    throw new Error(
      "Сохранение недоступно: подключите Cloudflare KV (привязка LAVKA_DATA) или правьте сайт на компьютере.",
    );
  }
}

export async function getSettings(): Promise<SiteSettings> {
  const kv = await getCloudKv();
  if (kv) {
    const raw = await kv.get(KV_SETTINGS);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<SiteSettings>;
      return { ...DEFAULT_SETTINGS, ...parsed };
    }
    const seeded = seedSettings();
    await kv.put(KV_SETTINGS, JSON.stringify(seeded));
    return seeded;
  }

  const fromFile = await readJsonFile<Partial<SiteSettings>>(SETTINGS_FILE);
  if (fromFile) {
    return { ...DEFAULT_SETTINGS, ...fromFile };
  }
  return seedSettings();
}

export async function saveSettings(settings: SiteSettings) {
  const next: SiteSettings = {
    brandName: settings.brandName.trim() || DEFAULT_SETTINGS.brandName,
    tagline: settings.tagline.trim() || DEFAULT_SETTINGS.tagline,
    heroTitle: settings.heroTitle.trim() || DEFAULT_SETTINGS.heroTitle,
    heroLead: settings.heroLead.trim() || DEFAULT_SETTINGS.heroLead,
    heroImage: (settings.heroImage ?? "").trim(),
    phone: settings.phone.trim() || DEFAULT_SETTINGS.phone,
    phoneDisplay: settings.phoneDisplay.trim() || DEFAULT_SETTINGS.phoneDisplay,
    hours: settings.hours.trim() || DEFAULT_SETTINGS.hours,
    aboutTitle: settings.aboutTitle.trim() || DEFAULT_SETTINGS.aboutTitle,
    aboutText1: settings.aboutText1.trim() || DEFAULT_SETTINGS.aboutText1,
    aboutText2: settings.aboutText2.trim() || DEFAULT_SETTINGS.aboutText2,
    catalogIntro: settings.catalogIntro.trim() || DEFAULT_SETTINGS.catalogIntro,
    footerTagline:
      settings.footerTagline.trim() || DEFAULT_SETTINGS.footerTagline,
  };

  const kv = await getCloudKv();
  if (kv) {
    await kv.put(KV_SETTINGS, JSON.stringify(next));
    return next;
  }

  try {
    await ensureDataDir();
    await writeFile(SETTINGS_FILE, JSON.stringify(next, null, 2), "utf8");
    return next;
  } catch {
    throw new Error(
      "Сохранение недоступно: подключите Cloudflare KV (привязка LAVKA_DATA).",
    );
  }
}

export async function getOrders(): Promise<SavedOrder[]> {
  const kv = await getCloudKv();
  if (kv) {
    const raw = await kv.get(KV_ORDERS);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as SavedOrder[];
    return Array.isArray(parsed) ? parsed : [];
  }

  const fromFile = await readJsonFile<SavedOrder[]>(ORDERS_FILE);
  return Array.isArray(fromFile) ? fromFile : [];
}

export async function saveOrders(orders: SavedOrder[]) {
  const kv = await getCloudKv();
  if (kv) {
    await kv.put(KV_ORDERS, JSON.stringify(orders));
    return;
  }

  try {
    await ensureDataDir();
    await writeFile(ORDERS_FILE, JSON.stringify(orders, null, 2), "utf8");
  } catch {
    throw new Error(
      "Сохранение заявок недоступно: подключите Cloudflare KV (привязка LAVKA_DATA).",
    );
  }
}

export function slugifyId(name: string): string {
  const map: Record<string, string> = {
    а: "a",
    б: "b",
    в: "v",
    г: "g",
    д: "d",
    е: "e",
    ё: "e",
    ж: "zh",
    з: "z",
    и: "i",
    й: "y",
    к: "k",
    л: "l",
    м: "m",
    н: "n",
    о: "o",
    п: "p",
    р: "r",
    с: "s",
    т: "t",
    у: "u",
    ф: "f",
    х: "h",
    ц: "ts",
    ч: "ch",
    ш: "sh",
    щ: "sch",
    ъ: "",
    ы: "y",
    ь: "",
    э: "e",
    ю: "yu",
    я: "ya",
  };

  const base = name
    .toLowerCase()
    .split("")
    .map((ch) => map[ch] ?? ch)
    .join("")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 40);

  return base || `product-${Date.now().toString(36)}`;
}
