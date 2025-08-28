
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import ProductsSection from "@/components/ProductsSection";
import DifferentialsSection from "@/components/DifferentialsSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <div id="hero">
        <HeroSection />
      </div>
      <div id="about">
        <AboutSection />
      </div>
      <div id="products">
        <ProductsSection />
      </div>
      <div id="differentials">
        <DifferentialsSection />
      </div>
      <div id="contact">
        <CTASection />
      </div>
      <Footer />
    </div>
  );
};

export default Index;
