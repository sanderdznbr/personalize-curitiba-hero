import React from 'react';
import { Button } from '@/components/ui/button';

const ProductsSection = () => {
  const products = [
    {
      id: 1,
      title: "Camisas Polo",
      image: "/placeholder.svg", // Placeholder for now
      alt: "Camisa polo azul"
    },
    {
      id: 2,
      title: "Camisetas", 
      image: "/placeholder.svg", // Placeholder for now
      alt: "Camiseta preta personalizada"
    },
    {
      id: 3,
      title: "Jaquetas",
      image: "/placeholder.svg", // Placeholder for now
      alt: "Jaqueta preta"
    },
    {
      id: 4,
      title: "Corta Vento",
      image: "/placeholder.svg", // Placeholder for now
      alt: "Jaqueta corta vento azul"
    },
    {
      id: 5,
      title: "Bonés",
      image: "/placeholder.svg", // Placeholder for now
      alt: "Boné preto personalizado"
    },
    {
      id: 6,
      title: "Uniformes",
      image: "/placeholder.svg", // Placeholder for now
      alt: "Uniformes personalizados"
    }
  ];

  return (
    <div className="relative bg-[#6FFF00] py-16 lg:py-24 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute left-0 top-0 w-32 h-full bg-[#00A859] rounded-r-[100px]"></div>
      <div className="absolute right-0 top-0 w-32 h-full bg-[#00A859] rounded-l-[100px]"></div>
      
      <div className="container mx-auto px-4 md:px-6 lg:px-8 relative z-10">
        {/* Title */}
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#00A859] mb-4">
            O que personalizamos para você?
          </h2>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12 max-w-6xl mx-auto mb-12">
          {products.map((product) => (
            <div 
              key={product.id}
              className="bg-white rounded-[var(--radius-xl)] p-6 lg:p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              {/* Product Image */}
              <div className="aspect-square bg-gray-100 rounded-[var(--radius-lg)] mb-6 overflow-hidden">
                <img 
                  src={product.image}
                  alt={product.alt}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Product Title */}
              <h3 className="text-xl lg:text-2xl font-bold text-gray-800 text-center">
                {product.title}
              </h3>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <div className="text-center">
          <Button className="btn-hero btn-secondary border-2 border-[#00A859] text-[#00A859] bg-transparent hover:bg-[#00A859] hover:text-white px-8 py-3 text-lg">
            Entrar em contato
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductsSection;