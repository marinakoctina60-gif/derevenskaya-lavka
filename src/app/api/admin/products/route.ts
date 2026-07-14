import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { isAuthenticated } from "@/lib/auth";
import { getProducts, saveProducts, slugifyId } from "@/lib/store";
import type { Product, ProductInput } from "@/lib/types";

function uniqueId(base: string, existing: Product[]) {
  let id = base;
  let i = 2;
  while (existing.some((p) => p.id === id)) {
    id = `${base}-${i}`;
    i += 1;
  }
  return id;
}

export async function GET() {
  const products = await getProducts();
  return NextResponse.json({ products });
}

export async function POST(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Нужен вход" }, { status: 401 });
  }

  let body: ProductInput;
  try {
    body = (await request.json()) as ProductInput;
  } catch {
    return NextResponse.json({ error: "Некорректный запрос" }, { status: 400 });
  }

  if (!body.name?.trim()) {
    return NextResponse.json({ error: "Укажите название" }, { status: 400 });
  }

  const products = await getProducts();
  const id = uniqueId(slugifyId(body.name), products);
  const product: Product = {
    id,
    name: body.name.trim(),
    description: (body.description ?? "").trim(),
    price: Number(body.price) || 0,
    unit: (body.unit ?? "шт").trim(),
    category: (body.category ?? "Разное").trim(),
    accent: (body.accent ?? "#7a9e7e").trim(),
    available: body.available !== false,
    ...(body.image?.trim() ? { image: body.image.trim() } : {}),
  };

  const next = await saveProducts([...products, product]);
  revalidatePath("/", "layout");
  return NextResponse.json({ product, products: next });
}

export async function PUT(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Нужен вход" }, { status: 401 });
  }

  let body: { products?: Product[] };
  try {
    body = (await request.json()) as { products?: Product[] };
  } catch {
    return NextResponse.json({ error: "Некорректный запрос" }, { status: 400 });
  }

  if (!Array.isArray(body.products)) {
    return NextResponse.json({ error: "Ожидается список товаров" }, { status: 400 });
  }

  const next = await saveProducts(body.products);
  revalidatePath("/", "layout");
  return NextResponse.json({ products: next });
}
