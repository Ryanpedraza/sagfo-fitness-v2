
import React from 'react';

interface WhatsAppButtonProps {
  phoneNumber: string;
}

const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({ phoneNumber }) => {
  const message = encodeURIComponent("¡Hola SAGFO! Me interesa recibir asesoría personalizada sobre sus equipos de gimnasio de élite. ¿Podrían darme más información?");
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

  return (
    <div className="fixed bottom-8 right-8 z-[200]">
      {/* Simple, clean but premium pulse */}
      <div className="absolute inset-0 bg-[#25D366] rounded-full animate-ping opacity-20" />

      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="relative flex items-center justify-center w-16 h-16 bg-[#25D366] text-white rounded-full shadow-[0_20px_40px_rgba(37,211,102,0.3)] hover:shadow-[0_25px_50px_rgba(37,211,102,0.4)] hover:scale-110 active:scale-95 transition-all duration-300 group"
        aria-label="Contactar por WhatsApp"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-9 w-9 group-hover:rotate-12 transition-transform"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M19.05 4.94A9.96 9.96 0 0 0 12 2C6.48 2 2 6.48 2 12c0 1.77.46 3.42 1.27 4.94L2 22l5.06-1.27c1.52.81 3.17 1.27 4.94 1.27h.01c5.52 0 10-4.48 10-10 0-2.76-1.12-5.26-2.95-7.06zM12 20.13h-.01c-1.63 0-3.18-.48-4.5-1.36l-.32-.19-3.34.84.86-3.26-.21-.33c-.88-1.32-1.36-2.87-1.36-4.51 0-4.41 3.59-8 8-8s8 3.59 8 8-3.59 8-8 8zM16.47 13.99c-.19-.1-1.15-.57-1.33-.63s-.31-.1-.44.1-.5.63-.61.76-.23.15-.42.05c-1.02-.48-1.93-1.07-2.68-1.82-.59-.59-1.07-1.32-1.2-1.55s-.01-.35.09-.46l.31-.36c.1-.12.16-.2.23-.34.07-.14.04-.27-.01-.38-.05-.1-.44-1.05-.6-1.44s-.32-.32-.44-.33c-.12-.01-.26-.01-.39-.01s-.36.05-.54.24-.7.68-.7 1.67c0 .98.72 1.94.82 2.09s1.41 2.15 3.42 3.01c.45.2.8.32 1.07.41.48.15.91.13 1.25.08.38-.06 1.15-.47 1.31-.92s.16-.83.11-.92c-.05-.08-.19-.13-.38-.23z" />
        </svg>
      </a>
    </div>
  );
};

export default WhatsAppButton;
