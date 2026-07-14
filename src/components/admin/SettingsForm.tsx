"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import type { SiteSettings } from "@/lib/types";

const fields: {
  key: Exclude<keyof SiteSettings, "heroImage">;
  label: string;
  multiline?: boolean;
}[] = [
  { key: "brandName", label: "Название лавки" },
  { key: "tagline", label: "Короткий слоган" },
  { key: "heroTitle", label: "Заголовок на главной" },
  { key: "heroLead", label: "Текст под заголовком", multiline: true },
  { key: "catalogIntro", label: "Текст над каталогом", multiline: true },
  { key: "aboutTitle", label: "Заголовок блока «О нас»" },
  { key: "aboutText1", label: "О нас — первый абзац", multiline: true },
  { key: "aboutText2", label: "О нас — второй абзац", multiline: true },
  { key: "phone", label: "Телефон для ссылки (tel:)" },
  { key: "phoneDisplay", label: "Телефон как на сайте" },
  { key: "hours", label: "Часы работы" },
  { key: "footerTagline", label: "Текст в подвале" },
];

export function SettingsForm({ initialSettings }: { initialSettings: SiteSettings }) {
  const router = useRouter();
  const [settings, setSettings] = useState(initialSettings);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);

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
      setSettings((prev) => ({ ...prev, heroImage: data.url! }));
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
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      const data = (await res.json()) as {
        settings?: SiteSettings;
        error?: string;
      };
      if (!res.ok) {
        setError(data.error ?? "Не удалось сохранить");
        setBusy(false);
        return;
      }
      if (data.settings) setSettings(data.settings);
      setMessage("Настройки сохранены — обновите главную страницу");
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
          <h1>Тексты и контакты</h1>
          <p>Баннер, тексты на главной и контакты в подвале.</p>
        </div>
      </div>

      {message && <p className="admin-ok">{message}</p>}
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}

      <form className="admin-form" onSubmit={onSubmit}>
        <div className="admin-hero-upload">
          <h2>Фото баннера</h2>
          <p className="admin-muted">
            Большое фото на первом экране. Лучше горизонтальное, не меньше
            1600px по ширине.
          </p>
          <div className="admin-photo">
            <div className="admin-photo__preview admin-photo__preview--wide">
              {settings.heroImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={settings.heroImage} alt="Баннер" />
              ) : (
                <span>Пока без фото</span>
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
              {settings.heroImage && (
                <button
                  type="button"
                  className="linkish"
                  onClick={() => setSettings({ ...settings, heroImage: "" })}
                >
                  Убрать фото
                </button>
              )}
              <p>JPG, PNG, WEBP или GIF до 5 МБ</p>
            </div>
          </div>
        </div>

        <div className="admin-form__stack">
          {fields.map((field) => (
            <label key={field.key}>
              {field.label}
              {field.multiline ? (
                <textarea
                  rows={3}
                  value={settings[field.key]}
                  onChange={(e) =>
                    setSettings({ ...settings, [field.key]: e.target.value })
                  }
                />
              ) : (
                <input
                  value={settings[field.key]}
                  onChange={(e) =>
                    setSettings({ ...settings, [field.key]: e.target.value })
                  }
                />
              )}
            </label>
          ))}
        </div>
        <div className="admin-form__actions">
          <button
            type="submit"
            className="btn btn--primary"
            disabled={busy || uploading}
          >
            {busy ? "Сохраняем…" : "Сохранить"}
          </button>
        </div>
      </form>
    </div>
  );
}
