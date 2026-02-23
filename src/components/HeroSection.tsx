import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Banner {
  id: string;
  title: string;
  subtitle: string | null;
  image_url: string | null;
  image_tablet_url: string | null;
  image_mobile_url: string | null;
  button_text: string | null;
  button_link: string | null;
  overlay_color: string | null;
  overlay_opacity: number | null;
  image_fit: string | null;
  slide_duration: number | null;
}

const HeroSection = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1024);
    };
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  useEffect(() => {
    fetchBanners();
  }, []);

  useEffect(() => {
    if (banners.length > 1) {
      const currentBanner = banners[currentSlide];
      const duration = currentBanner?.slide_duration ?? 5000;
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % banners.length);
      }, duration);
      return () => clearInterval(interval);
    }
  }, [banners.length, currentSlide, banners]);

  const fetchBanners = async () => {
    const { data, error } = await supabase
      .from('banners')
      .select('*')
      .eq('active', true)
      .order('order_index');

    if (!error && data && data.length > 0) {
      setBanners(data);
    } else {
      setBanners([{
        id: 'default',
        title: '',
        subtitle: null,
        image_url: null,
        image_tablet_url: null,
        image_mobile_url: null,
        button_text: null,
        button_link: null,
        overlay_color: '#00C563',
        overlay_opacity: 1,
        image_fit: 'cover',
        slide_duration: 5000,
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

  if (loading) {
    return (
      <div className="h-[500px] md:h-[800px] flex items-center justify-center bg-muted">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const currentBanner = banners[currentSlide];
  const overlayColor = currentBanner.overlay_color || '#00C563';
  const overlayOpacity = currentBanner.overlay_opacity ?? 1;
  const imageFit = currentBanner.image_fit || 'cover';

  const getImageUrl = () => {
    if (isMobile && currentBanner.image_mobile_url) {
      return currentBanner.image_mobile_url;
    }
    if (isTablet && currentBanner.image_tablet_url) {
      return currentBanner.image_tablet_url;
    }
    return currentBanner.image_url;
  };
  const imageUrl = getImageUrl();

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 0, g: 198, b: 99 };
  };

  const rgb = hexToRgb(overlayColor);

  return (
    <section className="relative overflow-hidden bg-white md:px-6">
      {/* Banner container with fixed height */}
      <div
        className="relative h-[500px] md:h-[800px] md:rounded-3xl overflow-hidden bg-muted"
      >
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
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20 flex gap-2">
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

        {/* Background Image */}
        {imageUrl && (
          <div
            className="absolute inset-0 md:rounded-3xl"
            style={{
              backgroundImage: `url(${imageUrl})`,
              backgroundSize: imageFit,
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
            }}
          />
        )}

        {/* Overlay */}
        {imageUrl && overlayOpacity > 0 && overlayOpacity < 1 && (
          <div
            className="absolute inset-0 md:rounded-3xl"
            style={{ backgroundColor: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${overlayOpacity})` }}
          />
        )}
      </div>
    </section>
  );
};

export default HeroSection;
