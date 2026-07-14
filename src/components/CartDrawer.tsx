"use client";

import Link from "next/link";
import { useEffect } from "react";
import { formatPrice } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { useSiteData } from "@/context/SiteDataContext";

export function CartDrawer() {
  const { items, total, isOpen, closeCart, setQuantity, removeItem } = useCart();
  const { getProduct } = useSiteData();

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeCart();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, closeCart]);

  if (!isOpen) return null;

  const lines = items
    .map((item) => {
      const product = getProduct(item.productId);
      if (!product) return null;
      return { ...item, product };
    })
    .filter(Boolean);

  return (
    <div className="drawer-root" role="presentation">
      <button
        type="button"
        className="drawer-backdrop"
        aria-label="Закрыть корзину"
        onClick={closeCart}
      />
      <aside className="drawer" role="dialog" aria-modal="true" aria-labelledby="cart-title">
        <div className="drawer__head">
          <h2 id="cart-title">Корзина</h2>
          <button type="button" className="icon-btn" onClick={closeCart} aria-label="Закрыть">
            ×
          </button>
        </div>

        {lines.length === 0 ? (
          <div className="drawer__empty">
            <p>Пока пусто. Добавьте продукты из каталога.</p>
            <button type="button" className="btn btn--primary" onClick={closeCart}>
              К каталогу
            </button>
          </div>
        ) : (
          <>
            <ul className="drawer__list">
              {lines.map((line) => {
                if (!line) return null;
                const { product, quantity } = line;
                return (
                  <li key={product.id} className="drawer__item">
                    <div>
                      <strong>{product.name}</strong>
                      <span>
                        {formatPrice(product.price)} / {product.unit}
                      </span>
                    </div>
                    <div className="qty">
                      <button
                        type="button"
                        aria-label="Уменьшить"
                        onClick={() => setQuantity(product.id, quantity - 1)}
                      >
                        −
                      </button>
                      <span>{quantity}</span>
                      <button
                        type="button"
                        aria-label="Увеличить"
                        onClick={() => setQuantity(product.id, quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                    <div className="drawer__line-total">
                      <span>{formatPrice(product.price * quantity)}</span>
                      <button
                        type="button"
                        className="linkish"
                        onClick={() => removeItem(product.id)}
                      >
                        Убрать
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>

            <div className="drawer__foot">
              <div className="drawer__total">
                <span>Итого</span>
                <strong>{formatPrice(total)}</strong>
              </div>
              <p className="drawer__hint">
                Оплата при получении: наличными или по терминалу
              </p>
              <Link
                href="/zakaz"
                className="btn btn--primary btn--block"
                onClick={closeCart}
              >
                Оставить заявку
              </Link>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
