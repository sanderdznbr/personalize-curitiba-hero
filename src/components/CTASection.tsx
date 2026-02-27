import React from 'react';
import { Button } from '@/components/ui/button';
import { openWhatsAppWithTracking } from '@/lib/gtag';

const CTASection = () => {
  return (
    <div className="bg-white py-16 lg:py-24">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="bg-[#00A859] rounded-[var(--radius-xl)] p-8 md:p-12 lg:p-16 text-center">
          {/* Main Heading */}
          <h2 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-white leading-tight mb-6">
            Quer dar mais visibilidade à sua marca com uniformes e peças personalizadas de qualidade?
          </h2>
          
          {/* Subtext */}
          <p className="text-lg md:text-xl lg:text-2xl text-[#6FFF00] font-medium mb-8 lg:mb-10">
            Fale agora mesmo com nossa equipe e receba seu orçamento sem compromisso.
          </p>
          
          {/* CTA Button */}
          <Button 
            className="bg-white text-[#00A859] hover:bg-gray-100 font-semibold text-lg px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
            onClick={() => openWhatsAppWithTracking()}
          >
            Entrar em contato
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CTASection;