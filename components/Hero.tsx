import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight, Edit3 } from 'lucide-react';
import { HeroSlide } from '../types';

interface HeroProps {
  onCartClick: () => void;
  slides: HeroSlide[];
  isAdmin: boolean;
  onEdit: () => void;
  onPromosClick: () => void;
  isLoggedIn: boolean;
}

const Hero: React.FC<HeroProps> = ({ onCartClick, slides, isAdmin, onEdit, onPromosClick, isLoggedIn }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [slides.length]);

  if (slides.length === 0) return null;

  return (
    <div className="px-4 md:px-6 pb-6">
      <div className="relative h-[80vh] sm:h-[85vh] md:h-[85vh] w-full overflow-hidden bg-black rounded-[2.5rem] md:rounded-[3.5rem] shadow-2xl border border-neutral-200 dark:border-white/5">
        {/* Admin Edit Button */}
        {isAdmin && (
          <button
            onClick={onEdit}
            className="absolute top-20 right-4 md:top-24 md:right-8 z-50 bg-black/60 hover:bg-black p-2 md:p-3 rounded-full text-white border border-white/20 transition-all font-bold"
          >
            <Edit3 size={18} />
          </button>
        )}

        {/* Main Slide Content - Simple Fade */}
        <div className="relative h-full w-full">
          {slides.map((slide, index) => (
            <div
              key={slide.id || index}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
            >
              {/* Background Image */}
              <div className="absolute inset-0 flex items-center justify-center bg-black">
                <img
                  src={slide.imageUrl}
                  alt={slide.titleLine1}
                  className="w-full h-full object-cover"
                  style={{ objectPosition: 'center' }}
                />
              </div>
              {/* Dark Overlay - More contrast for mobile readability */}
              <div className="absolute inset-0 bg-black/65 md:bg-black/50" />

              {/* Text Overlay */}
              <div className="absolute inset-0 flex items-center pt-0 pb-32 md:pb-40">
                <div className="w-full px-6 md:px-8 lg:px-12 xl:px-16">
                  <div className="max-w-4xl text-white">
                    <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-6">
                      <div className="w-8 md:w-10 h-[2px] bg-primary-500" />
                      <span className="text-primary-500 font-bold uppercase tracking-widest text-[8px] md:text-sm">
                        SAGFO Fitness Excellence
                      </span>
                    </div>

                    <h1 className="text-3xl sm:text-5xl md:text-7xl font-black uppercase leading-[0.9] mb-3 md:mb-6 tracking-tighter">
                      <span className="block">{slide.titleLine1}</span>
                      <span className="text-primary-500 italic block mt-1">{slide.titleLine2}</span>
                    </h1>

                    {slide.subtitle && (
                      <p className="text-[10px] md:text-xl text-zinc-300 mb-4 md:mb-10 max-w-2xl font-bold leading-relaxed">
                        {slide.subtitle}
                      </p>
                    )}

                    <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
                      <button
                        onClick={onCartClick}
                        className="bg-primary-600 hover:bg-primary-700 text-white px-8 md:px-10 py-3 md:py-4 rounded-xl font-black uppercase tracking-widest text-[10px] md:text-sm transition-all shadow-lg shadow-primary-600/20 active:scale-95"
                      >
                        {isLoggedIn ? 'Ver Catálogo' : 'Regístrate'}
                      </button>
                      <button
                        onClick={onPromosClick}
                        className="bg-white/20 hover:bg-white/30 text-white border-2 border-white/50 hover:border-white px-8 md:px-10 py-3 md:py-4 rounded-xl font-black uppercase tracking-widest text-[10px] md:text-sm transition-all backdrop-blur-sm shadow-lg"
                      >
                        Ofertas Especiales
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Control Group: Arrows & Pagination Indicators */}
        {slides.length > 1 && (
          <div className="absolute bottom-6 right-6 md:bottom-12 md:right-12 z-20 flex flex-col items-end gap-6 md:gap-10">
            {/* Pagination Indicators - Now more visible and elegant */}
            <div className="flex gap-2 md:gap-3 px-4 py-2 bg-black/20 backdrop-blur-md rounded-full border border-white/5">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`h-1.5 md:h-2 rounded-full transition-all duration-700 ${idx === currentSlide ? 'w-10 md:w-16 bg-primary-500 shadow-[0_0_15px_rgba(14,165,233,0.6)]' : 'w-4 md:w-6 bg-white/20 hover:bg-white/40'}`}
                  aria-label={`Ir al slide ${idx + 1}`}
                />
              ))}
            </div>

            {/* Manual Navigation Arrows */}
            <div className="flex gap-2 md:gap-4">
              <button
                onClick={() => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)}
                className="bg-black/40 hover:bg-primary-600 p-4 md:p-5 rounded-2xl text-white transition-all border border-white/10 backdrop-blur-md hover:scale-110 active:scale-90 group"
              >
                <ChevronLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
                className="bg-black/40 hover:bg-primary-600 p-4 md:p-5 rounded-2xl text-white transition-all border border-white/10 backdrop-blur-md hover:scale-110 active:scale-90 group"
              >
                <ChevronRight size={24} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        )}

        {/* Subtle Grid Overlay */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03] z-10 bg-[radial-gradient(circle,white_1px,transparent_1px)] bg-[size:32px_32px]" />
      </div>
    </div>
  );
};

export default Hero;
