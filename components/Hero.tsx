
import React, { useState, useEffect } from 'react';
import { HeroSlide } from '../types';
import ScrollReveal from './ScrollReveal';

interface HeroProps {
  onCartClick: () => void;
  slides: HeroSlide[];
  isAdmin: boolean;
  onEdit: () => void;
  onPromosClick: () => void;
}

const Hero: React.FC<HeroProps> = ({ onCartClick, slides, isAdmin, onEdit, onPromosClick }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-rotate slides every 6 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  if (slides.length === 0) return null;

  return (
    <div className="relative bg-[#0a0a0a] text-white h-[750px] md:h-[850px] overflow-hidden group rounded-b-[4rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)]">
      {isAdmin && (
        <button
          onClick={onEdit}
          className="absolute top-10 right-10 z-[60] bg-white/10 hover:bg-white/20 backdrop-blur-md text-white font-black uppercase tracking-[0.2em] text-[10px] py-4 px-8 rounded-2xl transition-all duration-500 flex items-center space-x-3 border border-white/20 shadow-2xl"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" /></svg>
          <span>Configurar Banners</span>
        </button>
      )}

      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-all duration-[1500ms] cubic-bezier(0.4, 0, 0.2, 1) ${index === currentSlide ? 'opacity-100 scale-100 z-10' : 'opacity-0 scale-110 z-0'
            }`}
        >
          <div className="absolute inset-0">
            <img
              src={slide.imageUrl}
              alt="Hero Background"
              className={`w-full h-full object-cover transition-transform duration-[10s] ease-out ${index === currentSlide ? 'scale-110' : 'scale-100'}`}
              loading={index === 0 ? "eager" : "lazy"}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/40 to-transparent"></div>
            <div className="absolute inset-0 bg-black/20"></div>
          </div>

          <div className="relative container mx-auto px-6 sm:px-12 lg:px-24 h-full flex flex-col justify-center items-start text-left pt-20">
            <div className="max-w-4xl space-y-8">
              <ScrollReveal direction="left" distance={100} delay={0.3}>
                <div className="flex items-center space-x-4 mb-4">
                  <div className="h-[2px] w-12 bg-primary-600"></div>
                  <span className="text-[10px] font-black uppercase tracking-[0.5em] text-primary-500 italic">Saga Elite Performance</span>
                </div>
                <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-white uppercase italic leading-[0.95] drop-shadow-2xl">
                  {slide.titleLine1}
                  <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-primary-600">{slide.titleLine2}</span>
                </h1>
              </ScrollReveal>

              <ScrollReveal delay={0.5} direction="left" distance={80}>
                <p className="max-w-xl text-xl md:text-2xl text-neutral-300 font-light leading-relaxed opacity-80 border-l-4 border-white/10 pl-8">
                  {slide.subtitle}
                </p>
              </ScrollReveal>

              <div className="pt-8 flex flex-col sm:flex-row gap-6">
                <ScrollReveal delay={0.7} direction="up" distance={50}>
                  <button
                    onClick={onCartClick}
                    className="group relative overflow-hidden bg-white text-black font-black uppercase tracking-[0.2em] text-[11px] py-6 px-12 rounded-[2rem] transition-all duration-500 hover:scale-105 active:scale-95 shadow-[0_20px_40px_-10px_rgba(255,255,255,0.3)]"
                  >
                    <span className="relative z-10">Comenzar Pedido</span>
                    <div className="absolute inset-0 bg-primary-600 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                  </button>
                </ScrollReveal>

                <ScrollReveal delay={0.8} direction="up" distance={50}>
                  <button
                    onClick={onPromosClick}
                    className="group bg-white/5 backdrop-blur-2xl text-white border border-white/20 font-black uppercase tracking-[0.2em] text-[11px] py-6 px-12 rounded-[2rem] transition-all duration-500 hover:bg-white/10 hover:border-white/40 hover:scale-105 active:scale-95 shadow-2xl"
                  >
                    Explorar Promociones
                  </button>
                </ScrollReveal>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows - Elite Stealth UI */}
      {slides.length > 1 && (
        <>
          <div className="absolute right-10 bottom-24 z-[50] flex flex-col space-y-4">
            <button
              onClick={prevSlide}
              className="p-4 rounded-full bg-white/5 hover:bg-primary-600 backdrop-blur-md text-white transition-all duration-500 border border-white/10 hover:border-transparent group"
              aria-label="Anterior"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 group-hover:-translate-y-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
              </svg>
            </button>
            <button
              onClick={nextSlide}
              className="p-4 rounded-full bg-white/5 hover:bg-primary-600 backdrop-blur-md text-white transition-all duration-500 border border-white/10 hover:border-transparent group"
              aria-label="Siguiente"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 group-hover:translate-y-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>

          {/* Indicators - Timeline Style */}
          <div className="absolute left-10 md:left-24 bottom-12 z-[50] flex items-center space-x-6">
            <span className="text-[10px] font-black text-white/40 tracking-[0.3em]">0{currentSlide + 1}</span>
            <div className="flex space-x-3">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`h-[3px] rounded-full transition-all duration-1000 ${index === currentSlide ? 'bg-primary-600 w-16' : 'bg-white/20 w-8 hover:bg-white/40'
                    }`}
                  aria-label={`Ir a slide ${index + 1}`}
                />
              ))}
            </div>
            <span className="text-[10px] font-black text-white/40 tracking-[0.3em]">0{slides.length}</span>
          </div>
        </>
      )}
    </div>
  );
};

export default Hero;
