import { ProductsManager } from "@/components/admin/ProductsManager";
import { getProducts } from "@/lib/store";

export const metadata = {
  title: "Товары — кабинет",
};

export default async function AdminProductsPage() {
  const products = await getProducts();
  return <ProductsManager initialProducts={products} />;
}
