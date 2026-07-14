import { NextResponse } from "next/server";
import { getAvailableProducts, getOrders, saveOrders } from "@/lib/store";
import type { OrderPayload, SavedOrder } from "@/lib/types";

function isValidPhone(phone: string) {
  const digits = phone.replace(/\D/g, "");
  return digits.length >= 10 && digits.length <= 15;
}

export async function POST(request: Request) {
  let body: OrderPayload;

  try {
    body = (await request.json()) as OrderPayload;
  } catch {
    return NextResponse.json({ error: "Некорректный запрос" }, { status: 400 });
  }

  const name = body.name?.trim() ?? "";
  const phone = body.phone?.trim() ?? "";
  const address = body.address?.trim() ?? "";
  const comment = body.comment?.trim();
  const paymentMethod = body.paymentMethod;

  if (name.length < 2) {
    return NextResponse.json({ error: "Укажите имя" }, { status: 400 });
  }
  if (!isValidPhone(phone)) {
    return NextResponse.json({ error: "Укажите корректный телефон" }, { status: 400 });
  }
  if (address.length < 3) {
    return NextResponse.json({ error: "Укажите адрес или самовывоз" }, { status: 400 });
  }
  if (paymentMethod !== "cash" && paymentMethod !== "terminal") {
    return NextResponse.json(
      { error: "Выберите способ оплаты при получении" },
      { status: 400 },
    );
  }
  if (!Array.isArray(body.items) || body.items.length === 0) {
    return NextResponse.json({ error: "Корзина пуста" }, { status: 400 });
  }

  const products = await getAvailableProducts();

  let validatedItems;
  try {
    validatedItems = body.items.map((item) => {
      const product = products.find((p) => p.id === item.productId);
      if (!product || !Number.isFinite(item.quantity) || item.quantity < 1) {
        throw new Error("invalid-item");
      }
      return {
        productId: product.id,
        name: product.name,
        unit: product.unit,
        price: product.price,
        quantity: Math.min(99, Math.floor(item.quantity)),
      };
    });
  } catch {
    return NextResponse.json({ error: "Некорректный состав заказа" }, { status: 400 });
  }

  const total = validatedItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const order: SavedOrder = {
    id: `DL-${Date.now().toString(36).toUpperCase()}`,
    createdAt: new Date().toISOString(),
    status: "new",
    name,
    phone,
    address,
    paymentMethod,
    comment: comment || undefined,
    items: validatedItems,
    total,
  };

  const orders = await getOrders();
  orders.unshift(order);
  await saveOrders(orders);

  return NextResponse.json({ id: order.id, ok: true });
}
