import React from 'react';
import { Check } from 'lucide-react';

const DifferentialsSection = () => {
  const differentials = [
    "Desde 1998 no mesmo endereço – tradição e confiança.",
    "Sem limite de quantidade – atendemos desde pequenas até grandes demandas",
    "Atendimento expresso – urgência? Fale conosco!",
    "Qualidade garantida – materiais e acabamentos de alto padrão.",
    "Atendimento humanizado – você fala direto com especialistas."
  ];

  return (
    <div className="bg-white py-16 lg:py-24">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 lg:mb-16">
          <p className="text-sm text-gray-400 uppercase tracking-wider mb-4">
            Diferenciais
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 leading-tight">
            Por que escolher a Personalize Curitiba?
          </h2>
        </div>

        {/* Differentials List */}
        <div className="max-w-4xl mx-auto space-y-4">
          {differentials.map((differential, index) => (
            <div 
              key={index}
              className="bg-[#00A859] rounded-[var(--radius-lg)] p-4 lg:p-6 flex items-center gap-4 text-white hover:bg-[#007A43] transition-colors duration-300"
            >
              <div className="flex-shrink-0">
                <Check className="w-6 h-6 text-white" strokeWidth={3} />
              </div>
              <p className="text-lg lg:text-xl font-medium">
                {differential}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DifferentialsSection;