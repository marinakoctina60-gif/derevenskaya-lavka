"use client";

import {
  createContext,
  useContext,
  useMemo,
  type ReactNode,
} from "react";
import type { Product, SiteSettings } from "@/lib/types";

type SiteDataValue = {
  products: Product[];
  availableProducts: Product[];
  settings: SiteSettings;
  getProduct: (id: string) => Product | undefined;
};

const SiteDataContext = createContext<SiteDataValue | null>(null);

export function SiteDataProvider({
  products,
  settings,
  children,
}: {
  products: Product[];
  settings: SiteSettings;
  children: ReactNode;
}) {
  const value = useMemo<SiteDataValue>(
    () => ({
      products,
      availableProducts: products.filter((p) => p.available),
      settings,
      getProduct: (id: string) => products.find((p) => p.id === id),
    }),
    [products, settings],
  );

  return (
    <SiteDataContext.Provider value={value}>{children}</SiteDataContext.Provider>
  );
}

export function useSiteData() {
  const ctx = useContext(SiteDataContext);
  if (!ctx) throw new Error("useSiteData must be used within SiteDataProvider");
  return ctx;
}
