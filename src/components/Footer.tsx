import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-[#00A859] py-12">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-white">
          {/* Logo Section */}
          <div className="lg:col-span-1">
            <div className="mb-4">
              <h3 className="text-2xl font-bold">Personalize</h3>
              <h3 className="text-2xl font-bold">Curitiba</h3>
              <p className="text-sm font-medium mt-1">DESDE 1998</p>
            </div>
          </div>

          {/* Sessões Section */}
          <div className="lg:col-span-1">
            <h4 className="text-lg font-semibold mb-4">Sessões</h4>
            <nav className="space-y-2">
              <a href="#" className="block hover:text-[#6FFF00] transition-colors">
                Quem somos
              </a>
              <a href="#" className="block hover:text-[#6FFF00] transition-colors">
                Produtos
              </a>
              <a href="#" className="block hover:text-[#6FFF00] transition-colors">
                Diferenciais
              </a>
              <a href="#" className="block hover:text-[#6FFF00] transition-colors">
                Contato
              </a>
            </nav>
          </div>

          {/* Contato Section */}
          <div className="lg:col-span-1">
            <h4 className="text-lg font-semibold mb-4">Contato</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span>📞</span>
                <span>(41) 99133-2936</span>
              </div>
              <div className="flex items-center gap-2">
                <span>📞</span>
                <span>(41) 3363-7542</span>
              </div>
            </div>
          </div>

          {/* Endereço Section */}
          <div className="lg:col-span-1">
            <h4 className="text-lg font-semibold mb-4">Endereço</h4>
            <address className="not-italic">
              Av. Sete de Setembro, 474 - Alto da XV, Curitiba - PR, 80050-100
            </address>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;