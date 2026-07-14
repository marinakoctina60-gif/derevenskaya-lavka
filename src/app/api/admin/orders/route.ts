import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { getOrders } from "@/lib/store";

export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Нужен вход" }, { status: 401 });
  }
  const orders = await getOrders();
  return NextResponse.json({ orders });
}
