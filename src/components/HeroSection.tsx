import React from 'react';
import { Button } from '@/components/ui/button';

const HeroSection = () => {
  const Logo = () => (
    <div className="animate-fade-in">
      <div className="text-white">
        <h1 className="text-2xl lg:text-3xl font-bold">Personalize Curitiba</h1>
        <p className="text-sm lg:text-base opacity-90 mt-1">DESDE 1999</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white p-4 md:p-6 lg:p-8">
      <section className="h-[650px] hero-gradient relative overflow-hidden rounded-[var(--radius-xl)] flex items-center">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] bg-[size:50px_50px]" />
        </div>
        
        <div className="container mx-auto px-6 lg:px-8 relative z-10">
          <div className="flex justify-center items-center h-full">
            {/* Content Centered */}
            <div className="text-center space-y-6 animate-slide-in max-w-3xl">
              {/* Logo */}
              <Logo />
              
              {/* Main Heading */}
              <div className="space-y-4">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
                  Seu uniforme, sua marca, sua identidade!
                </h1>
                
                <p className="text-base md:text-lg lg:text-xl text-white/90 max-w-2xl mx-auto">
                  Desde 1999, produzindo camisas, jaquetas, bonés e uniformes personalizados com qualidade, <span className="text-[#6FFF00] font-semibold">rapidez e confiança</span>.
                </p>
              </div>
              
              {/* Call to Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6 justify-center">
                <Button className="btn-hero btn-primary text-lg px-8 py-4">
                  Saiba mais
                </Button>
                <Button className="btn-hero btn-secondary text-lg px-8 py-4">
                  Entrar em contato
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HeroSection;