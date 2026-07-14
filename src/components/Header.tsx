"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useSiteData } from "@/context/SiteDataContext";

export function Header() {
  const { itemCount, openCart } = useCart();
  const { settings } = useSiteData();

  return (
    <header className="site-header">
      <div className="header-inner">
        <Link href="/" className="brand-mark" aria-label={`${settings.brandName} — на главную`}>
          <span className="brand-mark__leaf" aria-hidden />
          <span className="brand-mark__text">{settings.brandName}</span>
        </Link>

        <nav className="header-nav" aria-label="Основная навигация">
          <a href="/#catalog">Каталог</a>
          <a href="/#how">Как заказать</a>
          <a href="/#about">О нас</a>
        </nav>

        <button type="button" className="cart-trigger" onClick={openCart}>
          <span>Корзина</span>
          <span className={`cart-badge ${itemCount > 0 ? "cart-badge--active" : ""}`}>
            {itemCount}
          </span>
        </button>
      </div>
    </header>
  );
}
