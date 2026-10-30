import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import { trackWhatsAppConversion } from '@/lib/gtag';

const Navbar = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsVisible(scrollPosition > window.innerHeight * 0.8);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const WhatsAppIcon = () => (
    <svg width="20" height="20" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clipPath="url(#clip0_3_123)">
        <path d="M0.0522461 22L1.59866 16.3506C0.644413 14.6969 0.142996 12.8223 0.143913 10.9001C0.146663 4.89042 5.03708 0 11.0458 0C13.9617 0.000916667 16.6989 1.13667 18.7577 3.19733C20.8157 5.258 21.9487 7.997 21.9477 10.9102C21.945 16.9208 17.0546 21.8112 11.0458 21.8112C9.22166 21.8102 7.42408 21.3528 5.83183 20.4838L0.0522461 22ZM6.0995 18.5103C7.63583 19.4223 9.1025 19.9687 11.0422 19.9696C16.0362 19.9696 20.1043 15.9051 20.1071 10.9083C20.1089 5.9015 16.06 1.8425 11.0495 1.84067C6.05183 1.84067 1.98641 5.90517 1.98458 10.901C1.98366 12.9406 2.58133 14.4678 3.58508 16.0655L2.66933 19.4095L6.0995 18.5103ZM16.5376 13.5016C16.4697 13.3879 16.2882 13.3201 16.0151 13.1835C15.7428 13.0469 14.4036 12.3878 14.1533 12.2971C13.904 12.2063 13.7225 12.1605 13.5401 12.4337C13.3586 12.7059 12.8361 13.3201 12.6775 13.5016C12.5189 13.6831 12.3594 13.706 12.0872 13.5694C11.8149 13.4328 10.9367 13.1459 9.89633 12.2173C9.08691 11.495 8.53966 10.6031 8.38108 10.3299C8.2225 10.0577 8.36458 9.91008 8.50025 9.77442C8.62308 9.6525 8.7725 9.45633 8.90908 9.29683C9.0475 9.13917 9.09241 9.0255 9.18408 8.84308C9.27483 8.66158 9.22991 8.50208 9.16116 8.3655C9.09241 8.22983 8.54791 6.88875 8.3215 6.34333C8.09966 5.81258 7.87508 5.88408 7.70825 5.87583L7.18575 5.86667C7.00425 5.86667 6.70908 5.9345 6.45975 6.20767C6.21041 6.48083 5.50641 7.139 5.50641 8.48008C5.50641 9.82117 6.48266 11.1164 6.61833 11.2979C6.75491 11.4794 8.53875 14.2313 11.2713 15.411C11.9212 15.6915 12.4291 15.8593 12.8242 15.9848C13.4768 16.192 14.0708 16.1627 14.5402 16.093C15.0636 16.0151 16.1517 15.4339 16.379 14.7978C16.6063 14.1607 16.6063 13.6153 16.5376 13.5016Z" fill="currentColor"/>
      </g>
      <defs>
        <clipPath id="clip0_3_123">
          <rect width="22" height="22" fill="white"/>
        </clipPath>
      </defs>
    </svg>
  );

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 bg-white shadow-lg transition-transform duration-300 ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <span className="text-[#00A859] text-xl font-bold">PERSONALIZE</span>
          </div>
          <div className="hidden md:flex space-x-8">
            <button onClick={() => scrollToSection('about')} className="text-[#007A42] hover:text-green-600 transition-colors font-medium">Quem somos</button>
            <button onClick={() => scrollToSection('products')} className="text-[#007A42] hover:text-green-600 transition-colors font-medium">Produtos</button>
            <button onClick={() => scrollToSection('differentials')} className="text-[#007A42] hover:text-green-600 transition-colors font-medium">Diferenciais</button>
            <button onClick={() => scrollToSection('contact')} className="text-[#007A42] hover:text-green-600 transition-colors font-medium">Contato</button>
          </div>
          <div className="flex items-center gap-3">
            <Link 
              to="/admin/login"
              className="flex items-center justify-center w-10 h-10 bg-white/10 backdrop-blur-sm text-[#00A859] rounded-full hover:bg-gray-200 transition-all duration-300 border border-[#007A42]"
              title="Login Administrativo"
            >
              <LogIn className="w-5 h-5" />
            </Link>
            <a 
              href="https://api.whatsapp.com/send?phone=5541991332936&text=Ol%C3%A1%20Personalize%20Curitiba%2C%20encontrei%20seu%20site%20no%20Google%20e%20gostaria%20de%20informa%C3%A7%C3%B5es%20sobre%20%20"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackWhatsAppConversion()}
              className="flex items-center gap-2 bg-[#00A859] text-white px-4 py-2 rounded-full font-medium hover:bg-green-600 transition-colors"
            >
              {WhatsAppIcon()}
              <span className="hidden sm:inline">Entrar em contato</span>
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;