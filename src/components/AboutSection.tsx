import React from 'react';
import { Button } from '@/components/ui/button';
import { Play } from 'lucide-react';

const AboutSection = () => {
  return (
    <div className="min-h-screen bg-white p-4 md:p-6 lg:p-8">
      <section className="container mx-auto py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#00A859] leading-tight">
              Sobre a Personalize
            </h2>
            
            <div className="space-y-6 text-gray-700 text-lg lg:text-xl leading-relaxed">
              <p>
                Há mais de 25 anos em curitiba, a Personalize é referência em personalização de roupas para empresas, times e eventos.
              </p>
              
              <p>
                Com experiência, credibilidade e tecnologia, entregamos uniformes e produtos personalizados que reforçam sua marca e sua identidade visual.
              </p>
            </div>
            
            <div className="pt-4">
              <Button className="btn-hero btn-secondary">
                Entrar em contato
              </Button>
            </div>
          </div>
          
          {/* Right Video Player */}
          <div className="relative">
            {/* Background Accent */}
            <div className="absolute -top-8 -right-8 w-full h-full bg-[#6FFF00] rounded-[var(--radius-xl)] -z-10"></div>
            
            {/* Video Container */}
            <div className="relative bg-gray-100 rounded-[var(--radius-xl)] overflow-hidden aspect-video shadow-lg">
              <img 
                src="/lovable-uploads/50a14c22-60c3-4b63-8db6-d5ce35348e72.png" 
                alt="Personalize workspace with sewing machine"
                className="w-full h-full object-cover"
              />
              
              {/* Play Button Overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <button className="bg-[#00A859] hover:bg-[#008A4A] text-white rounded-full p-6 shadow-lg transition-all duration-300 hover:scale-110 active:scale-95">
                  <Play className="w-8 h-8 ml-1" fill="currentColor" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutSection;