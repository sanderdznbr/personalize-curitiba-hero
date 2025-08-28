import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import sewingImage from '@/assets/sewing-machine.jpg';

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const slides = [
    {
      image: sewingImage,
      alt: "Costura profissional - Personalize Curitiba"
    }
  ];

  // Auto-advance slides if there were multiple
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

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
      <section className="min-h-[calc(100vh-2rem)] md:min-h-[calc(100vh-3rem)] lg:min-h-[calc(100vh-4rem)] hero-gradient relative overflow-hidden rounded-[var(--radius-xl)] flex items-center">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] bg-[size:50px_50px]" />
        </div>
        
        <div className="container mx-auto px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Content Side */}
            <div className="space-y-8 animate-slide-in">
              {/* Logo */}
              <Logo />
              
              {/* Main Heading */}
              <div className="space-y-6">
                <h1 className="text-hero">
                  Seu uniforme, sua marca, sua identidade!
                </h1>
                
                <p className="text-hero-sub max-w-xl">
                  Desde 1999, produzindo camisas, jaquetas, bonés e uniformes personalizados com qualidade, <span className="text-[#6FFF00] font-semibold">rapidez e confiança</span>.
                </p>
              </div>
              
              {/* Call to Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button className="btn-hero btn-primary">
                  Saiba mais
                </Button>
                <Button className="btn-hero btn-secondary">
                  Entrar em contato
                </Button>
              </div>
            </div>
            
            {/* Slider Side */}
            <div className="relative animate-fade-in">
              <div className="relative rounded-[var(--radius-xl)] overflow-hidden slider-shadow bg-white/5 backdrop-blur-sm">
                <div 
                  className="flex transition-transform duration-500 ease-in-out"
                  style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                >
                  {slides.map((slide, index) => (
                    <div key={index} className="w-full flex-shrink-0">
                      <img
                        src={slide.image}
                        alt={slide.alt}
                        className="w-full h-96 lg:h-[500px] object-cover"
                        loading="lazy"
                      />
                    </div>
                  ))}
                </div>
                
                {/* Navigation dots (if there were multiple slides) */}
                {slides.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                    {slides.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${
                          index === currentSlide 
                            ? 'bg-white scale-110' 
                            : 'bg-white/50 hover:bg-white/70'
                        }`}
                        aria-label={`Go to slide ${index + 1}`}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HeroSection;