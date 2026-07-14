"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import type { Product } from "@/lib/types";
import { formatPrice } from "@/data/products";

type Draft = {
  name: string;
  description: string;
  price: number;
  unit: string;
  category: string;
  accent: string;
  available: boolean;
  image: string;
};

const emptyDraft: Draft = {
  name: "",
  description: "",
  price: 0,
  unit: "шт",
  category: "Разное",
  accent: "#7a9e7e",
  available: true,
  image: "",
};

export function ProductsManager({ initialProducts }: { initialProducts: Product[] }) {
  const router = useRouter();
  const [products, setProducts] = useState(initialProducts);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);

  function startCreate() {
    setEditingId("new");
    setDraft(emptyDraft);
    setMessage("");
    setError("");
  }

  function startEdit(product: Product) {
    setEditingId(product.id);
    setDraft({
      name: product.name,
      description: product.description,
      price: product.price,
      unit: product.unit,
      category: product.category,
      accent: product.accent,
      available: product.available,
      image: product.image ?? "",
    });
    setMessage("");
    setError("");
  }

  function cancelEdit() {
    setEditingId(null);
    setDraft(emptyDraft);
  }

  async function onUpload(file: File | null) {
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: form,
      });
      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !data.url) {
        setError(data.error ?? "Не удалось загрузить фото");
        return;
      }
      setDraft((prev) => ({ ...prev, image: data.url! }));
    } catch {
      setError("Ошибка загрузки фото");
    } finally {
      setUploading(false);
    }
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    setMessage("");

    try {
      const isNew = editingId === "new";
      const payload = {
        ...draft,
        image: draft.image.trim() || undefined,
      };
      const res = await fetch(
        isNew ? "/api/admin/products" : `/api/admin/products/${editingId}`,
        {
          method: isNew ? "POST" : "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );
      const data = (await res.json()) as {
        products?: Product[];
        error?: string;
      };
      if (!res.ok) {
        setError(data.error ?? "Не удалось сохранить");
        setBusy(false);
        return;
      }
      setProducts(data.products ?? []);
      setEditingId(null);
      setDraft(emptyDraft);
      setMessage(isNew ? "Товар добавлен" : "Товар сохранён");
      router.refresh();
    } catch {
      setError("Ошибка сети");
    } finally {
      setBusy(false);
    }
  }

  async function removeProduct(id: string) {
    if (!confirm("Удалить этот товар?")) return;
    setBusy(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
      const data = (await res.json()) as { products?: Product[]; error?: string };
      if (!res.ok) {
        setError(data.error ?? "Не удалось удалить");
        setBusy(false);
        return;
      }
      setProducts(data.products ?? []);
      if (editingId === id) cancelEdit();
      setMessage("Товар удалён");
      router.refresh();
    } catch {
      setError("Ошибка сети");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="admin-panel">
      <div className="admin-panel__head">
        <div>
          <h1>Товары и цены</h1>
          <p>Добавляйте, меняйте цены и скрывайте товары с витрины.</p>
        </div>
        <button type="button" className="btn btn--primary" onClick={startCreate}>
          Добавить товар
        </button>
      </div>

      {message && <p className="admin-ok">{message}</p>}
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}

      {editingId && (
        <form className="admin-form" onSubmit={onSubmit}>
          <h2>{editingId === "new" ? "Новый товар" : "Редактирование"}</h2>

          <div className="admin-photo">
            <div
              className="admin-photo__preview"
              style={
                draft.image
                  ? undefined
                  : { ["--accent" as string]: draft.accent }
              }
            >
              {draft.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={draft.image} alt="Фото товара" />
              ) : (
                <span>Нет фото</span>
              )}
            </div>
            <div className="admin-photo__controls">
              <label className="btn btn--small admin-photo__upload">
                {uploading ? "Загрузка…" : "Загрузить фото"}
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  hidden
                  disabled={uploading || busy}
                  onChange={(e) => {
                    const file = e.target.files?.[0] ?? null;
                    e.target.value = "";
                    void onUpload(file);
                  }}
                />
              </label>
              {draft.image && (
                <button
                  type="button"
                  className="linkish"
                  onClick={() => setDraft({ ...draft, image: "" })}
                >
                  Убрать фото
                </button>
              )}
              <p>JPG, PNG, WEBP или GIF до 5 МБ</p>
            </div>
          </div>

          <div className="admin-form__grid">
            <label>
              Название
              <input
                required
                value={draft.name}
                onChange={(e) => setDraft({ ...draft, name: e.target.value })}
              />
            </label>
            <label>
              Цена, ₽
              <input
                required
                type="number"
                min={0}
                step={1}
                value={draft.price}
                onChange={(e) =>
                  setDraft({ ...draft, price: Number(e.target.value) })
                }
              />
            </label>
            <label>
              Единица
              <input
                required
                value={draft.unit}
                onChange={(e) => setDraft({ ...draft, unit: e.target.value })}
              />
            </label>
            <label>
              Категория
              <input
                required
                value={draft.category}
                onChange={(e) => setDraft({ ...draft, category: e.target.value })}
              />
            </label>
            <label>
              Цвет карточки
              <input
                type="color"
                className="admin-color"
                value={draft.accent}
                onChange={(e) => setDraft({ ...draft, accent: e.target.value })}
              />
            </label>
            <label className="admin-check">
              <input
                type="checkbox"
                checked={draft.available}
                onChange={(e) =>
                  setDraft({ ...draft, available: e.target.checked })
                }
              />
              Показывать на сайте
            </label>
          </div>
          <label>
            Описание
            <textarea
              rows={3}
              value={draft.description}
              onChange={(e) =>
                setDraft({ ...draft, description: e.target.value })
              }
            />
          </label>
          <div className="admin-form__actions">
            <button type="submit" className="btn btn--primary" disabled={busy || uploading}>
              {busy ? "Сохраняем…" : "Сохранить"}
            </button>
            <button type="button" className="btn btn--ghost" onClick={cancelEdit}>
              Отмена
            </button>
          </div>
        </form>
      )}

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Товар</th>
              <th>Цена</th>
              <th>Категория</th>
              <th>Статус</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>
                  <div className="admin-product-cell">
                    <span
                      className="admin-product-thumb"
                      style={
                        product.image
                          ? undefined
                          : { ["--accent" as string]: product.accent }
                      }
                    >
                      {product.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={product.image} alt="" />
                      ) : null}
                    </span>
                    <span>
                      <strong>{product.name}</strong>
                      <span>{product.unit}</span>
                    </span>
                  </div>
                </td>
                <td>{formatPrice(product.price)}</td>
                <td>{product.category}</td>
                <td>{product.available ? "На витрине" : "Скрыт"}</td>
                <td>
                  <div className="admin-table__actions">
                    <button
                      type="button"
                      className="linkish"
                      onClick={() => startEdit(product)}
                    >
                      Изменить
                    </button>
                    <button
                      type="button"
                      className="linkish"
                      onClick={() => removeProduct(product.id)}
                    >
                      Удалить
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
