import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Play } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface AboutContent {
  id: string;
  title: string;
  description1: string | null;
  description2: string | null;
  video_web_url: string | null;
  video_mobile_url: string | null;
  button_text: string | null;
}

const AboutSection = () => {
  const [content, setContent] = useState<AboutContent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    const { data, error } = await supabase
      .from('about_content')
      .select('*')
      .single();

    if (!error && data) {
      setContent(data);
    } else {
      // Fallback to default content
      setContent({
        id: 'default',
        title: 'Sobre a Personalize',
        description1: 'Há mais de 25 anos em curitiba, a Personalize é referência em personalização de roupas para empresas, times e eventos.',
        description2: 'Com experiência, credibilidade e tecnologia, entregamos uniformes e produtos personalizados que reforçam sua marca e sua identidade visual.',
        video_web_url: null,
        video_mobile_url: null,
        button_text: 'Entrar em contato',
      });
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="bg-white p-4 md:p-6 lg:p-8">
        <section className="container mx-auto py-8 lg:py-12">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00A859]"></div>
          </div>
        </section>
      </div>
    );
  }

  if (!content) return null;

  return (
    <div className="bg-white p-4 md:p-6 lg:p-8">
      <section className="container mx-auto py-8 lg:py-12">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#00A859] leading-tight">
              {content.title}
            </h2>
            
            <div className="space-y-6 text-gray-700 text-lg lg:text-xl leading-relaxed">
              {content.description1 && (
                <p>{content.description1}</p>
              )}
              
              {content.description2 && (
                <p>{content.description2}</p>
              )}
            </div>
            
            {content.button_text && (
              <div className="pt-4">
              <Button 
                className="btn-hero btn-secondary"
                onClick={() => window.open('https://api.whatsapp.com/send?phone=5541991332936&text=Ol%C3%A1%20Personalize%20Curitiba%2C%20encontrei%20seu%20site%20no%20Google%20e%20gostaria%20de%20informa%C3%A7%C3%B5es%20sobre%20%20', '_blank')}
              >
                  {content.button_text}
                </Button>
              </div>
            )}
          </div>
          
          {/* Right Video Player */}
          <div className="relative">
            {/* Background Accent */}
            <div className="absolute -top-8 -right-8 w-full h-full bg-[#6FFF00] rounded-[var(--radius-xl)] -z-10"></div>
            
            {/* Video Container */}
            <div className="relative bg-black rounded-[var(--radius-xl)] overflow-hidden shadow-lg">
              {/* Desktop: 16:9, Mobile: 9:16 */}
              <div className="aspect-video md:aspect-video sm:aspect-[9/16]">
                {content.video_web_url || content.video_mobile_url ? (
                  <>
                    {/* Show mobile video on small screens */}
                    <video
                      className="w-full h-full object-cover block md:hidden"
                      controls
                      poster=""
                    >
                      <source src={content.video_mobile_url || content.video_web_url || ''} type="video/mp4" />
                      Seu navegador não suporta vídeos.
                    </video>
                    
                    {/* Show web video on medium screens and up */}
                    <video
                      className="w-full h-full object-cover hidden md:block"
                      controls
                      poster=""
                    >
                      <source src={content.video_web_url || content.video_mobile_url || ''} type="video/mp4" />
                      Seu navegador não suporta vídeos.
                    </video>
                  </>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <button className="bg-black hover:bg-gray-800 text-white rounded-full p-6 shadow-lg transition-all duration-300 hover:scale-110 active:scale-95">
                      <Play className="w-8 h-8 ml-1" fill="currentColor" />
                    </button>
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

export default AboutSection;