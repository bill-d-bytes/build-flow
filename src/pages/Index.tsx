import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Modules } from "@/components/Modules";
import { Features } from "@/components/Features";
import { CTA } from "@/components/CTA";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <Modules />
        <Features />
        <CTA />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
