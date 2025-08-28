import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Banner {
  id: string;
  title: string;
  subtitle: string | null;
  image_url: string | null;
  button_text: string | null;
  button_link: string | null;
}

const HeroSection = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBanners();
  }, []);

  useEffect(() => {
    if (banners.length > 1) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % banners.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [banners.length]);

  const fetchBanners = async () => {
    const { data, error } = await supabase
      .from('banners')
      .select('*')
      .eq('active', true)
      .order('order_index');

    if (!error && data && data.length > 0) {
      setBanners(data);
    } else {
      // Fallback to default banner content
      setBanners([{
        id: 'default',
        title: 'Seu uniforme, sua marca, sua identidade!',
        subtitle: 'Desde 1999, produzindo camisas, jaquetas, bonés e uniformes personalizados com qualidade, rapidez e confiança.',
        image_url: null,
        button_text: 'Saiba mais',
        button_link: '#about',
      }]);
    }
    setLoading(false);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % banners.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const handleWhatsApp = () => {
    const message = "Olá! Gostaria de saber mais sobre os uniformes personalizados.";
    const whatsappUrl = `https://wa.me/5541999999999?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#00C563]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  const currentBanner = banners[currentSlide];

  return (
    <section className="min-h-screen relative overflow-hidden bg-[#00C563]">
      {/* Slider Controls */}
      {banners.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-black/20 hover:bg-black/40 text-white p-3 rounded-full transition-all"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-black/20 hover:bg-black/40 text-white p-3 rounded-full transition-all"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
          
          {/* Slide indicators */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex gap-2">
            {banners.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentSlide ? 'bg-white' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        </>
      )}

      {/* Background Image (if exists) */}
      {currentBanner.image_url && (
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
          style={{ backgroundImage: `url(${currentBanner.image_url})` }}
        />
      )}

      {/* Content */}
      <div className="container mx-auto px-6 relative z-10 flex items-center min-h-screen">
        <div className="w-full max-w-4xl">
          {/* Logo/Brand */}
          <div className="mb-8">
            <h2 className="text-white text-lg font-normal mb-1">
              Personalize
            </h2>
            <h2 className="text-white text-lg font-normal mb-2">
              Curitiba
            </h2>
            <p className="text-white text-sm font-light tracking-wider">
              DESDE 1999
            </p>
          </div>

          {/* Main heading */}
          <h1 className="text-white text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            {currentBanner.title}
          </h1>
          
          {/* Subtitle */}
          {currentBanner.subtitle && (
            <p className="text-white text-lg md:text-xl mb-8 max-w-2xl leading-relaxed">
              {currentBanner.subtitle.split('rapidez e confiança').map((part, index, array) => (
                <span key={index}>
                  {part}
                  {index < array.length - 1 && (
                    <span className="text-[#9FFF00] font-medium">rapidez e confiança</span>
                  )}
                </span>
              ))}
            </p>
          )}
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            {currentBanner.button_text && (
              <Button 
                variant="outline"
                className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-[#00C563] font-medium px-8 py-3 rounded-lg text-base transition-all duration-300"
                onClick={() => {
                  if (currentBanner.button_link?.startsWith('#')) {
                    document.querySelector(currentBanner.button_link)?.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
              >
                {currentBanner.button_text}
              </Button>
            )}
            <Button 
              className="bg-white text-[#00C563] hover:bg-gray-100 font-medium px-8 py-3 rounded-lg text-base transition-all duration-300"
              onClick={handleWhatsApp}
            >
              Entrar em contato
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;