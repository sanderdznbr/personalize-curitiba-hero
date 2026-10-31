import React from 'react';
import { trackWhatsAppConversion } from '@/lib/gtag';

const Footer = () => {
  const WhatsAppIcon = () => (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
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

  const PhoneIcon = () => (
    <svg width="20" height="18" viewBox="0 0 20 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M18.9836 12.8138C19.4771 13.053 19.805 13.1718 19.9275 13.3708C20.0517 13.5699 20.0517 14.5251 19.641 15.6408C19.2304 16.7549 17.2648 17.7726 16.3192 17.9091C15.4714 18.0311 14.3983 18.0825 13.2193 17.7197C12.5056 17.4997 11.5882 17.206 10.4142 16.7147C5.47783 14.6487 2.25538 9.82945 2.00865 9.51159L2.00281 9.50403C1.73691 9.15932 0 6.90759 0 4.5768C0 2.2282 1.27176 1.07557 1.72217 0.597184C2.17258 0.118795 2.7058 0 3.03367 0L3.97755 0.0160534C4.27893 0.0305014 4.68464 -0.0947142 5.08537 0.834773C5.49439 1.78995 6.47801 4.13855 6.60221 4.37614C6.7264 4.61533 6.80754 4.89466 6.6436 5.21251C6.47801 5.53198 6.39687 5.73104 6.14682 6.00716C5.90009 6.28648 5.63017 6.63002 5.40828 6.84353C5.1632 7.08112 4.90653 7.33958 5.19301 7.81636C5.47948 8.29475 6.46807 9.85674 7.93026 11.1217C9.80975 12.7479 11.3961 13.2504 11.8879 13.4896C12.3798 13.7288 12.6679 13.6887 12.9544 13.3708C13.2408 13.053 14.1847 11.9774 14.5126 11.5006C14.8421 11.0222 15.17 11.1025 15.6204 11.2614C16.0725 11.4203 18.4918 12.5746 18.9836 12.8138Z" fill="currentColor"/>
    </svg>
  );

  return (
    <footer className="bg-gradient-to-b from-white via-green-50 to-green-100 py-16">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-[#00A859]">
          {/* Logo Section */}
          <div className="lg:col-span-1">
            <div className="mb-4">
              <Logo />
            </div>
          </div>

          {/* Sessões Section */}
          <div className="lg:col-span-1">
            <h4 className="text-lg font-semibold mb-4">Sessões</h4>
            <nav className="space-y-2">
              <a href="#about" className="block hover:text-[#007A42] transition-colors">
                Quem somos
              </a>
              <a href="#products" className="block hover:text-[#007A42] transition-colors">
                Produtos
              </a>
              <a href="#differentials" className="block hover:text-[#007A42] transition-colors">
                Diferenciais
              </a>
              <a href="#contact" className="block hover:text-[#007A42] transition-colors">
                Contato
              </a>
            </nav>
          </div>

          {/* Contato Section */}
          <div className="lg:col-span-1">
            <h4 className="text-lg font-semibold mb-4">Contato</h4>
            <div className="space-y-3">
              <a href="https://api.whatsapp.com/send?phone=5541991332936&text=Ol%C3%A1%20Personalize%20Curitiba%2C%20encontrei%20seu%20site%20no%20Google%20e%20gostaria%20de%20informa%C3%A7%C3%B5es%20sobre%20%20" target="_blank" rel="noopener noreferrer" onClick={() => trackWhatsAppConversion()} className="flex items-center gap-3 hover:text-[#007A42] transition-colors">
                {WhatsAppIcon()}
                <span>(41) 99133-2936</span>
              </a>
              <a href="tel:+5541309578190" className="flex items-center gap-3 hover:text-[#007A42] transition-colors">
                {PhoneIcon()}
                <span>(41) 3095-7819</span>
              </a>
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
      <div className="mt-8 text-center text-gray-600">
        <p>Teste Buffy</p>
      </div>
    </footer>
  );
};

export default Footer;
