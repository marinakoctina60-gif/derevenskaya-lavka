"use client";

import type { ReactNode } from "react";
import { SiteDataProvider } from "@/context/SiteDataContext";
import { CartProvider } from "@/context/CartContext";
import type { Product, SiteSettings } from "@/lib/types";

export function Providers({
  products,
  settings,
  children,
}: {
  products: Product[];
  settings: SiteSettings;
  children: ReactNode;
}) {
  return (
    <SiteDataProvider products={products} settings={settings}>
      <CartProvider>{children}</CartProvider>
    </SiteDataProvider>
  );
}
