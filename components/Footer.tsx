
import React from 'react';
import { Instagram, Facebook, Twitter, Mail, Phone, MapPin, ShieldCheck, Award, Globe, ExternalLink } from 'lucide-react';

interface FooterProps {
  sealUrl?: string;
}

const Footer: React.FC<FooterProps> = ({ sealUrl }) => {
  return (
    <footer className="bg-neutral-50 dark:bg-[#050505] text-neutral-500 dark:text-neutral-400 border-t border-neutral-200 dark:border-neutral-900 relative z-10 overflow-hidden">
      {/* Decorative Gradient Overlay */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary-500/50 to-transparent"></div>

      <div className="container mx-auto px-6 lg:px-12 py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 md:gap-24">

          {/* Brand Identity */}
          <div className="space-y-10">
            <div className="flex items-center group cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <img src="/logo-light.png" alt="Logo" className="h-10 w-auto object-contain dark:hidden transition-transform duration-500 group-hover:scale-110" />
              <img src="/logo-sf.png" alt="Logo" className="h-10 w-auto object-contain hidden dark:block transition-transform duration-500 group-hover:scale-110" />
            </div>
            <p className="text-base leading-relaxed text-neutral-500 dark:text-neutral-400 font-medium italic">
              Engineering for the elite. Equipamiento de alto rendimiento diseñado para transformar la biomecánica en potencia pura.
            </p>
            <div className="flex space-x-6">
              {[
                { icon: Instagram, href: "#", color: "hover:bg-pink-600" },
                { icon: Facebook, href: "#", color: "hover:bg-blue-600" },
                { icon: Twitter, href: "#", color: "hover:bg-sky-500" }
              ].map((social, idx) => (
                <a
                  key={idx}
                  href={social.href}
                  className={`w-12 h-12 rounded-2xl bg-neutral-200 dark:bg-white/5 flex items-center justify-center text-neutral-700 dark:text-white transition-all duration-500 hover:-translate-y-2 hover:text-white shadow-lg ${social.color}`}
                >
                  <social.icon size={20} strokeWidth={2.5} />
                </a>
              ))}
            </div>
          </div>

          {/* Contact Core */}
          <div className="space-y-8">
            <h3 className="font-black text-neutral-900 dark:text-white tracking-[0.3em] uppercase text-[9px] italic border-l-2 border-primary-600 pl-4 opacity-80">Centro de Soporte</h3>
            <ul className="space-y-6">
              {[
                { icon: MapPin, text: "Calle 4 #3-17, Barrio La Victoria", subtext: "Sede Principal, Colombia" },
                { icon: Phone, text: "310 393 6762", subtext: "Línea Directa" },
                { icon: Mail, text: "contact@sagfo.com", subtext: "Atención 24/7" }
              ].map((item, idx) => (
                <li key={idx} className="flex items-start group">
                  <div className="w-9 h-9 rounded-xl bg-neutral-200 dark:bg-white/5 flex items-center justify-center text-primary-600 mr-4 group-hover:bg-primary-600 group-hover:text-white transition-all duration-500">
                    <item.icon size={16} strokeWidth={2.5} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-black text-neutral-900 dark:text-white transition-colors group-hover:text-primary-600">{item.text}</span>
                    <span className="text-[9px] font-bold text-neutral-400 dark:text-neutral-600 uppercase tracking-widest mt-0.5">{item.subtext}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Quality Certification */}
          <div className="space-y-8">
            <h3 className="font-black text-neutral-900 dark:text-white tracking-[0.3em] uppercase text-[9px] italic border-l-2 border-primary-600 pl-4 opacity-80">Certificación</h3>
            <div className="relative group p-6 bg-white dark:bg-white/5 rounded-[2.5rem] border border-neutral-200 dark:border-white/10 shadow-2xl text-center overflow-hidden">
              <div className="absolute inset-0 bg-primary-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              {sealUrl ? (
                <img src={sealUrl} alt="Sello de Calidad" className="w-28 h-28 object-contain mx-auto drop-shadow-4xl relative z-10 transform transition-transform duration-700 group-hover:scale-110 group-hover:rotate-12" />
              ) : (
                <div className="w-20 h-20 mx-auto border-4 border-dotted border-neutral-300 dark:border-white/10 rounded-full flex items-center justify-center">
                  <Award className="w-8 h-8 text-neutral-300 dark:text-neutral-700" />
                </div>
              )}
              <div className="mt-6 relative z-10">
                <p className="text-[9px] font-black uppercase tracking-[0.3em] text-primary-600 mb-1 italic">Standard Elite</p>
                <p className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 px-4">Biomecánica Avanzada Certificada para Alto Tráfico</p>
              </div>
            </div>
          </div>
          {/* Legal Hub & Entities */}
          <div className="space-y-8">
            <h3 className="font-black text-neutral-900 dark:text-white tracking-[0.3em] uppercase text-[9px] italic border-l-2 border-primary-600 pl-4 opacity-80">Cumplimiento</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'RUES', url: 'https://www.rues.org.co/' },
                { label: 'MinTrabajo', url: 'https://www.mintrabajo.gov.co/' },
                { label: 'SIC', url: 'https://www.sic.gov.co/' },
                { label: 'DIAN', url: 'https://www.dian.gov.co/' }
              ].map((item) => (
                <a
                  key={item.label}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group bg-white dark:bg-white/5 hover:bg-neutral-900 dark:hover:bg-white p-4 rounded-xl flex items-center justify-center transition-all duration-500 border border-neutral-200 dark:border-white/10 hover:border-transparent h-14 shadow-lg cursor-pointer"
                >
                  <span className="text-[10px] font-black text-neutral-400 group-hover:text-white dark:group-hover:text-neutral-900 transition-colors tracking-widest">{item.label}</span>
                </a>
              ))}
            </div>
            <div className="pt-4 border-t border-neutral-200 dark:border-white/5">
              <p className="text-[8px] font-black uppercase tracking-[0.4em] text-neutral-400 text-center italic flex items-center justify-center gap-2">
                <ShieldCheck className="w-2.5 h-2.5 text-primary-600" />
                Garantía de Origen Controlada
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar Content */}
        <div className="mt-16 pt-8 border-t border-neutral-200 dark:border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col items-center md:items-start">
            <p className="text-[9px] font-black text-neutral-400 dark:text-neutral-600 uppercase tracking-[0.3em] italic">
              © {new Date().getFullYear()} SAGFO FITNESS & BULLS EQUIPMENT. TODOS LOS DERECHOS RESERVADOS.
            </p>
          </div>

          <div className="flex flex-col items-center md:items-end">
            <p className="text-[9px] font-medium text-neutral-400 tracking-widest uppercase">
              Premium Development by <span className="font-black text-neutral-900 dark:text-white italic cursor-default">Ryan Pedraza</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
