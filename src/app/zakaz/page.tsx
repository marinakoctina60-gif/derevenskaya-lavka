import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CartDrawer } from "@/components/CartDrawer";
import { CheckoutForm } from "@/components/CheckoutForm";

export const metadata = {
  title: "Оформить заявку — Деревенская лавка",
  description:
    "Оставьте заявку на домашнюю продукцию. Оплата при получении наличными или по терминалу.",
};

export default function CheckoutPage() {
  return (
    <>
      <Header />
      <main className="checkout-page">
        <div className="section-inner checkout-page__inner">
          <p className="breadcrumb">
            <Link href="/">Главная</Link>
            <span aria-hidden> / </span>
            <span>Заявка</span>
          </p>
          <h1>Оформить заявку</h1>
          <p className="checkout-page__lead">
            Проверьте корзину и отправьте заявку. Мы перезвоним для подтверждения.
            Оплата — только при получении.
          </p>
          <CheckoutForm />
        </div>
      </main>
      <Footer />
      <CartDrawer />
    </>
  );
}
