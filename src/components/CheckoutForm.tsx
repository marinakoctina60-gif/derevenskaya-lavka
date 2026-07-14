"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { formatPrice } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { useSiteData } from "@/context/SiteDataContext";
import type { PaymentMethod } from "@/lib/types";

type Status =
  | { type: "idle" }
  | { type: "loading" }
  | { type: "success"; orderId: string }
  | { type: "error"; message: string };

export function CheckoutForm() {
  const { items, total, clearCart } = useCart();
  const { getProduct } = useSiteData();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cash");
  const [comment, setComment] = useState("");
  const [status, setStatus] = useState<Status>({ type: "idle" });

  const lines = items
    .map((item) => {
      const product = getProduct(item.productId);
      if (!product) return null;
      return { product, quantity: item.quantity };
    })
    .filter(Boolean);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (lines.length === 0) {
      setStatus({ type: "error", message: "Добавьте товары в корзину" });
      return;
    }

    setStatus({ type: "loading" });

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          address: address.trim(),
          paymentMethod,
          comment: comment.trim() || undefined,
          items: lines.map((line) => {
            if (!line) return null;
            return {
              productId: line.product.id,
              name: line.product.name,
              unit: line.product.unit,
              price: line.product.price,
              quantity: line.quantity,
            };
          }),
          total,
        }),
      });

      const data = (await res.json()) as { id?: string; error?: string };
      if (!res.ok) {
        setStatus({
          type: "error",
          message: data.error ?? "Не удалось отправить заявку",
        });
        return;
      }

      clearCart();
      setStatus({ type: "success", orderId: data.id ?? "" });
    } catch {
      setStatus({
        type: "error",
        message: "Ошибка сети. Попробуйте ещё раз.",
      });
    }
  }

  if (status.type === "success") {
    return (
      <div className="checkout-success">
        <h2>Заявка принята</h2>
        <p>
          Номер заявки: <strong>{status.orderId}</strong>. Мы свяжемся с вами,
          чтобы подтвердить заказ. Оплата — при получении.
        </p>
        <Link href="/" className="btn btn--primary">
          Вернуться в каталог
        </Link>
      </div>
    );
  }

  if (lines.length === 0) {
    return (
      <div className="checkout-empty">
        <h2>Корзина пуста</h2>
        <p>Сначала добавьте продукты, затем оформите заявку.</p>
        <Link href="/#catalog" className="btn btn--primary">
          Перейти к каталогу
        </Link>
      </div>
    );
  }

  return (
    <div className="checkout-layout">
      <form className="checkout-form" onSubmit={onSubmit}>
        <h2>Контакты для заявки</h2>
        <p className="form-lead">
          Онлайн-оплаты нет: заплатите при получении наличными или по терминалу.
        </p>

        <label>
          Имя
          <input
            required
            name="name"
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Как к вам обращаться"
          />
        </label>

        <label>
          Телефон
          <input
            required
            name="phone"
            type="tel"
            autoComplete="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+7 (___) ___-__-__"
          />
        </label>

        <label>
          Адрес доставки или самовывоз
          <textarea
            required
            name="address"
            rows={3}
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Улица, дом, подъезд или «самовывоз»"
          />
        </label>

        <fieldset className="payment-fieldset">
          <legend>Способ оплаты при получении</legend>
          <label className="radio">
            <input
              type="radio"
              name="payment"
              checked={paymentMethod === "cash"}
              onChange={() => setPaymentMethod("cash")}
            />
            <span>Наличными</span>
          </label>
          <label className="radio">
            <input
              type="radio"
              name="payment"
              checked={paymentMethod === "terminal"}
              onChange={() => setPaymentMethod("terminal")}
            />
            <span>Картой по терминалу</span>
          </label>
        </fieldset>

        <label>
          Комментарий
          <textarea
            name="comment"
            rows={2}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Удобное время, пожелания к заказу"
          />
        </label>

        {status.type === "error" && (
          <p className="form-error" role="alert">
            {status.message}
          </p>
        )}

        <button
          type="submit"
          className="btn btn--primary btn--block"
          disabled={status.type === "loading"}
        >
          {status.type === "loading" ? "Отправляем…" : "Отправить заявку"}
        </button>
      </form>

      <aside className="checkout-summary" aria-label="Состав заказа">
        <h2>Ваш заказ</h2>
        <ul>
          {lines.map((line) => {
            if (!line) return null;
            return (
              <li key={line.product.id}>
                <div>
                  <strong>{line.product.name}</strong>
                  <span>
                    {line.quantity} × {formatPrice(line.product.price)}
                  </span>
                </div>
                <span>{formatPrice(line.product.price * line.quantity)}</span>
              </li>
            );
          })}
        </ul>
        <div className="checkout-summary__total">
          <span>Итого</span>
          <strong>{formatPrice(total)}</strong>
        </div>
        <p className="checkout-summary__note">
          К оплате при получении · без предоплаты
        </p>
      </aside>
    </div>
  );
}
