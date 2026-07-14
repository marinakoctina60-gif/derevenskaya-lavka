import { formatPrice } from "@/data/products";
import type { SavedOrder } from "@/lib/types";

export function OrdersList({ orders }: { orders: SavedOrder[] }) {
  return (
    <div className="admin-panel">
      <div className="admin-panel__head">
        <div>
          <h1>Заявки</h1>
          <p>Заказы с сайта. Оплата при получении.</p>
        </div>
      </div>

      {orders.length === 0 ? (
        <p className="admin-muted">Заявок пока нет.</p>
      ) : (
        <ul className="admin-orders">
          {orders.map((order) => (
            <li key={order.id} className="admin-order">
              <div className="admin-order__head">
                <strong>{order.id}</strong>
                <span>{new Date(order.createdAt).toLocaleString("ru-RU")}</span>
              </div>
              <p>
                {order.name} · {order.phone}
              </p>
              <p>{order.address}</p>
              <p>
                Оплата:{" "}
                {order.paymentMethod === "cash" ? "наличными" : "по терминалу"}
              </p>
              {order.comment && <p>Комментарий: {order.comment}</p>}
              <ul>
                {order.items.map((item) => (
                  <li key={`${order.id}-${item.productId}`}>
                    {item.name} × {item.quantity} —{" "}
                    {formatPrice(item.price * item.quantity)}
                  </li>
                ))}
              </ul>
              <p className="admin-order__total">Итого: {formatPrice(order.total)}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
