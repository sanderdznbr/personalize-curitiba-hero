
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import ProductsSection from "@/components/ProductsSection";
import DifferentialsSection from "@/components/DifferentialsSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <AboutSection />
      <ProductsSection />
      <DifferentialsSection />
      <CTASection />
      <Footer />
    </div>
  );
};

export default Index;
