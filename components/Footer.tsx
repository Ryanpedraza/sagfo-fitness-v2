
import React from 'react';
import { Instagram, Facebook, Twitter, Mail, Phone, MapPin, ShieldCheck, Award } from 'lucide-react';

interface FooterProps {
  sealUrl?: string;
}

const Footer: React.FC<FooterProps> = ({ sealUrl }) => {
  return (
    <footer className="bg-neutral-100 dark:bg-neutral-950 border-t border-neutral-200 dark:border-neutral-800">
      <div className="container mx-auto px-6 lg:px-16 relative z-10">
        {/* Main Footer Grid */}
        <div className="py-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16">

          {/* Column 1: Brand */}
          <div className="space-y-6">
            <div className="cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <img src="/logo-light.png" alt="SAGFO" className="h-8 w-auto object-contain dark:hidden" />
              <img src="/logo-sf.png" alt="SAGFO" className="h-8 w-auto object-contain hidden dark:block" />
            </div>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Ingeniería de alto rendimiento. Equipamiento diseñado con los más altos estándares de calidad para transformar tu espacio fitness.
            </p>
            <div className="flex gap-3 pt-2">
              {[
                { icon: Instagram, href: '#' },
                { icon: Facebook, href: '#' },
                { icon: Twitter, href: '#' },
              ].map((social, idx) => (
                <a
                  key={idx}
                  href={social.href}
                  className="w-10 h-10 rounded-full bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center text-neutral-600 dark:text-neutral-400 hover:bg-primary-600 hover:text-white transition-all duration-300"
                >
                  <social.icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Contacto */}
          <div className="space-y-6">
            <h4 className="text-sm font-bold text-neutral-900 dark:text-white uppercase tracking-wider">Contacto</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-primary-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">Calle 4 #3-17, Barrio La Victoria</p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-500">Bogotá, Colombia</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Phone size={18} className="text-primary-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">310 393 6762</p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-500">Línea Directa</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Mail size={18} className="text-primary-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">contact@sagfo.com</p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-500">Atención 24/7</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Column 3: Certificación */}
          <div className="space-y-6">
            <h4 className="text-sm font-bold text-neutral-900 dark:text-white uppercase tracking-wider">Certificación</h4>
            <div className="bg-white dark:bg-neutral-900 rounded-2xl p-6 border border-neutral-200 dark:border-neutral-800 flex flex-col items-center text-center shadow-sm">
              {sealUrl ? (
                <img src={sealUrl} alt="Sello de Calidad" className="w-20 h-20 object-contain mb-4" />
              ) : (
                <div className="w-20 h-20 rounded-full border-2 border-dashed border-neutral-300 dark:border-neutral-700 flex items-center justify-center mb-4">
                  <Award className="w-8 h-8 text-neutral-400 dark:text-neutral-600" />
                </div>
              )}
              <p className="text-xs font-bold text-primary-600 uppercase tracking-wider mb-1">Standard Elite</p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">Certificación de Calidad Internacional</p>
            </div>
          </div>

          {/* Column 4: Cumplimiento */}
          <div className="space-y-6">
            <h4 className="text-sm font-bold text-neutral-900 dark:text-white uppercase tracking-wider">Cumplimiento</h4>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: 'RUES', url: 'https://www.rues.org.co/' },
                { label: 'MinTrabajo', url: 'https://www.mintrabajo.gov.co/' },
                { label: 'SIC', url: 'https://www.sic.gov.co/' },
                { label: 'DIAN', url: 'https://www.dian.gov.co/' },
              ].map((item) => (
                <a
                  key={item.label}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-12 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg flex items-center justify-center text-xs font-bold text-neutral-600 dark:text-neutral-400 hover:border-primary-600 hover:text-primary-600 transition-all"
                >
                  {item.label}
                </a>
              ))}
            </div>
            <div className="flex items-center justify-center gap-2 pt-2">
              <ShieldCheck size={14} className="text-emerald-600" />
              <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">Garantía de Origen</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-8 border-t border-neutral-200 dark:border-neutral-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-neutral-500 dark:text-neutral-500">
            © {new Date().getFullYear()} SAGFO FITNESS & BULLS EQUIPMENT. Todos los derechos reservados.
          </p>
          <p className="text-xs text-neutral-400 dark:text-neutral-600">
            Desarrollado por <span className="font-bold text-neutral-600 dark:text-neutral-400">Ryan Pedraza</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
