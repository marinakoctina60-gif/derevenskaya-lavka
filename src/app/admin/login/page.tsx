import { Suspense } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/admin/LoginForm";
import { isAuthenticated } from "@/lib/auth";

export const metadata = {
  title: "Вход в кабинет — Деревенская лавка",
};

export default async function AdminLoginPage() {
  if (await isAuthenticated()) {
    redirect("/admin");
  }

  return (
    <main className="admin-login">
      <div className="admin-login__card">
        <p className="admin-login__eyebrow">Кабинет владельца</p>
        <h1>Вход</h1>
        <p className="admin-muted">
          Здесь можно менять товары, цены и тексты на сайте.
        </p>
        <Suspense fallback={<p>Загрузка…</p>}>
          <LoginForm />
        </Suspense>
        <p className="admin-login__hint">
          По умолчанию: логин <code>admin</code>, пароль <code>lavka2026</code>
        </p>
        <Link href="/" className="linkish">
          ← На сайт
        </Link>
      </div>
    </main>
  );
}
