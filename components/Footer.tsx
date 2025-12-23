
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
            <div className="flex items-center group cursor-pointer">
              <span className="bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 w-12 h-12 flex items-center justify-center rounded-[1.25rem] font-black text-xl mr-4 transform transition-all group-hover:rotate-[15deg] group-hover:bg-primary-600 group-hover:text-white shadow-xl">S</span>
              <h2 className="text-3xl font-black text-neutral-900 dark:text-white tracking-tighter italic uppercase">
                SAGFOFITNESS
              </h2>
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
          <div className="space-y-10">
            <h3 className="font-black text-neutral-900 dark:text-white tracking-[0.4em] uppercase text-[10px] italic border-l-4 border-primary-600 pl-6">Support Hub</h3>
            <ul className="space-y-8">
              {[
                { icon: MapPin, text: "Calle 4 #3-17, Barrio La Victoria", subtext: "Sede Principal, Colombia" },
                { icon: Phone, text: "310 393 6762", subtext: "Línea Directa" },
                { icon: Mail, text: "contact@sagfo.com", subtext: "Atención 24/7" }
              ].map((item, idx) => (
                <li key={idx} className="flex items-start group">
                  <div className="w-10 h-10 rounded-xl bg-neutral-200 dark:bg-white/5 flex items-center justify-center text-primary-600 mr-5 group-hover:bg-primary-600 group-hover:text-white transition-all duration-500">
                    <item.icon size={18} strokeWidth={2.5} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-black text-neutral-900 dark:text-white transition-colors group-hover:text-primary-600">{item.text}</span>
                    <span className="text-[10px] font-bold text-neutral-400 dark:text-neutral-600 uppercase tracking-widest mt-1">{item.subtext}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Quality Certification */}
          <div className="space-y-10">
            <h3 className="font-black text-neutral-900 dark:text-white tracking-[0.4em] uppercase text-[10px] italic border-l-4 border-primary-600 pl-6">Certification</h3>
            <div className="relative group p-8 bg-white dark:bg-white/5 rounded-[3rem] border border-neutral-200 dark:border-white/10 shadow-3xl text-center overflow-hidden">
              <div className="absolute inset-0 bg-primary-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              {sealUrl ? (
                <img src={sealUrl} alt="Sello de Calidad" className="w-32 h-32 object-contain mx-auto drop-shadow-4xl relative z-10 transform transition-transform duration-700 group-hover:scale-110 group-hover:rotate-12" />
              ) : (
                <div className="w-24 h-24 mx-auto border-4 border-dotted border-neutral-300 dark:border-white/10 rounded-full flex items-center justify-center">
                  <Award className="w-10 h-10 text-neutral-300 dark:text-neutral-700" />
                </div>
              )}
              <div className="mt-8 relative z-10">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary-600 mb-2 italic">Standard Elite</p>
                <p className="text-xs font-bold text-neutral-400 dark:text-neutral-500 px-4">Biomecánica Avanzada Certificada para Alto Tráfico</p>
              </div>
            </div>
          </div>

          {/* Legal Hub & Entities */}
          <div className="space-y-10">
            <h3 className="font-black text-neutral-900 dark:text-white tracking-[0.4em] uppercase text-[10px] italic border-l-4 border-primary-600 pl-6">Compliance</h3>
            <div className="grid grid-cols-2 gap-4">
              {['RUES', 'MinTrabajo', 'SIC', 'DIAN'].map((label) => (
                <div key={label} className="group bg-white dark:bg-white/5 hover:bg-neutral-900 dark:hover:bg-white p-5 rounded-2xl flex items-center justify-center transition-all duration-500 border border-neutral-200 dark:border-white/10 hover:border-transparent h-16 shadow-lg">
                  <span className="text-[11px] font-black text-neutral-400 group-hover:text-white dark:group-hover:text-neutral-900 transition-colors tracking-widest">{label}</span>
                </div>
              ))}
            </div>
            <div className="pt-6 border-t border-neutral-200 dark:border-white/5 space-y-4">
              <p className="text-[9px] font-black uppercase tracking-[0.4em] text-neutral-400 text-center italic flex items-center justify-center gap-2">
                <ShieldCheck className="w-3 h-3 text-primary-600" />
                Garantía de Origen Controlada
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar Content */}
        <div className="mt-24 pt-12 border-t border-neutral-200 dark:border-white/5 flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex flex-col items-center md:items-start space-y-3">
            <div className="flex items-center space-x-6 text-[10px] font-black uppercase tracking-[0.5em] text-neutral-900 dark:text-white italic">
              <span>Legal</span>
              <span className="w-1 h-1 bg-primary-600 rounded-full"></span>
              <span>Privacy</span>
              <span className="w-1 h-1 bg-primary-600 rounded-full"></span>
              <span>Service</span>
            </div>
            <p className="text-[10px] font-bold text-neutral-400 dark:text-neutral-600 uppercase tracking-widest">
              &copy; {new Date().getFullYear()} SAGFOFITNESS & BULLS EQUIPMENT. R-PB-02 V2.0
            </p>
          </div>

          <div className="flex flex-col items-center md:items-end space-y-3">
            <div className="flex items-center gap-2 text-primary-600 font-black italic uppercase text-[10px] tracking-widest group cursor-pointer hover:translate-x-1 transition-transform">
              <span>Visit Elite HQ</span>
              <ExternalLink size={12} strokeWidth={3} />
            </div>
            <p className="text-[10px] font-medium text-neutral-400">
              Premium Development by <span className="font-black text-neutral-900 dark:text-white italic uppercase group hover:text-primary-600 transition-all cursor-pointer">Ryan Pedraza</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
