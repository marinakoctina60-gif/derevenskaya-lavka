import type { Metadata } from "next";
import { Literata, Manrope } from "next/font/google";
import { Providers } from "@/components/Providers";
import { getAvailableProducts, getSettings } from "@/lib/store";
import "./globals.css";

export const dynamic = "force-dynamic";

const literata = Literata({
  variable: "--font-display",
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

const manrope = Manrope({
  variable: "--font-body",
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  return {
    title: `${settings.brandName} — домашняя продукция с нашего двора`,
    description: settings.heroLead,
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [products, settings] = await Promise.all([
    getAvailableProducts(),
    getSettings(),
  ]);

  return (
    <html lang="ru" className={`${literata.variable} ${manrope.variable} h-full`}>
      <body className="min-h-full antialiased">
        <Providers products={products} settings={settings}>
          {children}
        </Providers>
      </body>
    </html>
  );
}
