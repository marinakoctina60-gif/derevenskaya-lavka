import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { HowItWorks } from "@/components/HowItWorks";
import { Catalog } from "@/components/Catalog";
import { About } from "@/components/About";
import { Footer } from "@/components/Footer";
import { CartDrawer } from "@/components/CartDrawer";

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <HowItWorks />
        <Catalog />
        <About />
      </main>
      <Footer />
      <CartDrawer />
    </>
  );
}
