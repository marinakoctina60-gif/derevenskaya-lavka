import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { isAuthenticated } from "@/lib/auth";
import { getProducts, saveProducts } from "@/lib/store";
import type { ProductInput } from "@/lib/types";

type Params = { params: Promise<{ id: string }> };

export async function PUT(request: Request, { params }: Params) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Нужен вход" }, { status: 401 });
  }

  const { id } = await params;
  let body: ProductInput;
  try {
    body = (await request.json()) as ProductInput;
  } catch {
    return NextResponse.json({ error: "Некорректный запрос" }, { status: 400 });
  }

  const products = await getProducts();
  const index = products.findIndex((p) => p.id === id);
  if (index < 0) {
    return NextResponse.json({ error: "Товар не найден" }, { status: 404 });
  }

  if (!body.name?.trim()) {
    return NextResponse.json({ error: "Укажите название" }, { status: 400 });
  }

  products[index] = {
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

  const next = await saveProducts(products);
  revalidatePath("/", "layout");
  return NextResponse.json({ product: products[index], products: next });
}

export async function DELETE(_request: Request, { params }: Params) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Нужен вход" }, { status: 401 });
  }

  const { id } = await params;
  const products = await getProducts();
  const next = products.filter((p) => p.id !== id);
  if (next.length === products.length) {
    return NextResponse.json({ error: "Товар не найден" }, { status: 404 });
  }

  await saveProducts(next);
  revalidatePath("/", "layout");
  return NextResponse.json({ products: next });
}
