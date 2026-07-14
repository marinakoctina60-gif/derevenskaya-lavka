import { OrdersList } from "@/components/admin/OrdersList";
import { getOrders } from "@/lib/store";

export const metadata = {
  title: "Заявки — кабинет",
};

export default async function AdminOrdersPage() {
  const orders = await getOrders();
  return <OrdersList orders={orders} />;
}
