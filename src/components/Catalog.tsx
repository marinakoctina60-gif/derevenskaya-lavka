"use client";

import { formatPrice } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { useSiteData } from "@/context/SiteDataContext";

export function Catalog() {
  const { addItem } = useCart();
  const { availableProducts, settings } = useSiteData();

  return (
    <section id="catalog" className="section catalog" aria-labelledby="catalog-title">
      <div className="section-inner">
        <div className="section-intro">
          <h2 id="catalog-title">Каталог</h2>
          <p>{settings.catalogIntro}</p>
        </div>

        {availableProducts.length === 0 ? (
          <p className="empty-catalog">Пока нет доступных товаров.</p>
        ) : (
          <ul className="product-grid">
            {availableProducts.map((product) => (
              <li key={product.id} className="product">
                <div
                  className={`product__visual ${product.image ? "product__visual--photo" : ""}`}
                  style={{ ["--accent" as string]: product.accent }}
                >
                  {product.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={product.image} alt={product.name} />
                  ) : null}
                  <span className="product__category">{product.category}</span>
                </div>
                <div className="product__body">
                  <h3>{product.name}</h3>
                  <p>{product.description}</p>
                  <div className="product__meta">
                    <div>
                      <strong>{formatPrice(product.price)}</strong>
                      <span> / {product.unit}</span>
                    </div>
                    <button
                      type="button"
                      className="btn btn--small"
                      onClick={() => addItem(product.id)}
                    >
                      В корзину
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
