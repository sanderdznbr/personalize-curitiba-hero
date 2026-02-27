import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { openWhatsAppWithTracking } from '@/lib/gtag';

interface Product {
  id: string;
  name: string;
  image_url: string | null;
  order_index: number;
  active: boolean;
}

const ProductsSection = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from('product_categories')
      .select('*')
      .eq('active', true)
      .order('order_index');

    if (!error && data && data.length > 0) {
      setProducts(data);
    } else {
      // Fallback to default products
      setProducts([
        { id: '1', name: "Camisas Polo", image_url: null, order_index: 1, active: true },
        { id: '2', name: "Camisetas", image_url: null, order_index: 2, active: true },
        { id: '3', name: "Jaquetas", image_url: null, order_index: 3, active: true },
        { id: '4', name: "Corta Vento", image_url: null, order_index: 4, active: true },
        { id: '5', name: "Bonés", image_url: null, order_index: 5, active: true },
        { id: '6', name: "Uniformes", image_url: null, order_index: 6, active: true },
      ]);
    }
    setLoading(false);
  };

  const handleProductClick = (productName: string) => {
    openWhatsAppWithTracking();
  };

  if (loading) {
    return (
      <div className="bg-white py-16 lg:py-24">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00A859]"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white py-16 lg:py-24">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        {/* Title */}
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#00A859] mb-4">
            O que personalizamos para você?
          </h2>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto mb-12">
          {products.map((product) => (
            <div 
              key={product.id}
              onClick={() => handleProductClick(product.name)}
              className="bg-white rounded-[var(--radius-xl)] p-6 lg:p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer"
            >
              {/* Product Image */}
              <div className="aspect-square bg-gray-100 rounded-[var(--radius-lg)] mb-6 overflow-hidden">
                {product.image_url ? (
                  <img 
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    <div className="text-center">
                      <div className="w-16 h-16 mx-auto mb-2 bg-gray-300 rounded-lg"></div>
                      <p className="text-sm">Sem imagem</p>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Product Title */}
              <h3 className="text-xl lg:text-2xl font-bold text-gray-800 text-center">
                {product.name}
              </h3>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <div className="text-center">
          <Button 
            className="btn-hero btn-secondary border-2 border-[#00A859] text-[#00A859] bg-transparent hover:bg-[#00A859] hover:text-white px-8 py-3 text-lg"
            onClick={() => openWhatsAppWithTracking()}
          >
            Entrar em contato
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductsSection;