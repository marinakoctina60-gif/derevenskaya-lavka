import Link from "next/link";
import { getOrders, getProducts, getSettings } from "@/lib/store";

export const metadata = {
  title: "Кабинет — Деревенская лавка",
};

export default async function AdminHomePage() {
  const [products, settings, orders] = await Promise.all([
    getProducts(),
    getSettings(),
    getOrders(),
  ]);

  const available = products.filter((p) => p.available).length;

  return (
    <div className="admin-panel">
      <div className="admin-panel__head">
        <div>
          <h1>Обзор</h1>
          <p>Добро пожаловать в кабинет «{settings.brandName}».</p>
        </div>
      </div>

      <div className="admin-stats">
        <div className="admin-stat">
          <strong>{products.length}</strong>
          <span>товаров всего</span>
        </div>
        <div className="admin-stat">
          <strong>{available}</strong>
          <span>на витрине</span>
        </div>
        <div className="admin-stat">
          <strong>{orders.length}</strong>
          <span>заявок</span>
        </div>
      </div>

      <div className="admin-quick">
        <Link className="btn btn--primary" href="/admin/products">
          Править товары и цены
        </Link>
        <Link className="btn btn--ghost" href="/admin/settings">
          Тексты и контакты
        </Link>
        <Link className="btn btn--ghost" href="/admin/orders">
          Смотреть заявки
        </Link>
      </div>
    </div>
  );
}
