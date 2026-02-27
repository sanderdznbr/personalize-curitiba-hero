// Google Ads conversion tracking
export const trackWhatsAppConversion = () => {
  if (typeof window !== 'undefined' && typeof (window as any).gtag === 'function') {
    (window as any).gtag('event', 'conversion', {
      send_to: 'AW-17515386326/9kOgCPy33P4bENar_p9B',
    });
  }
};

export const openWhatsAppWithTracking = (customMessage?: string) => {
  trackWhatsAppConversion();
  const message = customMessage || 'Ol%C3%A1%20Personalize%20Curitiba%2C%20encontrei%20seu%20site%20no%20Google%20e%20gostaria%20de%20informa%C3%A7%C3%B5es%20sobre%20%20';
  window.open(`https://api.whatsapp.com/send?phone=5541991332936&text=${message}`, '_blank');
};
