"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const links = [
  { href: "/admin", label: "Обзор" },
  { href: "/admin/products", label: "Товары" },
  { href: "/admin/settings", label: "Тексты сайта" },
  { href: "/admin/orders", label: "Заявки" },
];

export function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch("/api/auth", { method: "DELETE" });
    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <header className="admin-nav">
      <div className="admin-nav__inner">
        <div className="admin-nav__brand">
          <strong>Кабинет лавки</strong>
          <Link href="/">На сайт</Link>
        </div>
        <nav>
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={pathname === link.href ? "is-active" : undefined}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <button type="button" className="btn btn--small" onClick={logout}>
          Выйти
        </button>
      </div>
    </header>
  );
}
