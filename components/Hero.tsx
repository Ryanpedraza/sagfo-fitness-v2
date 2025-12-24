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
    <div className="relative h-[60vh] sm:h-[70vh] md:h-screen w-full overflow-hidden bg-zinc-900">
      {/* Admin Edit Button */}
      {isAdmin && (
        <button
          onClick={onEdit}
          className="absolute top-20 right-4 md:top-24 md:right-8 z-50 bg-black/60 hover:bg-black p-2 md:p-3 rounded-full text-white border border-white/20 transition-all"
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
            {/* Background Image - Optimized for all screens */}
            <div className="absolute inset-0 flex items-center justify-center bg-black">
              <img
                src={slide.imageUrl}
                alt={slide.titleLine1}
                className="w-full h-full object-cover"
                style={{ objectPosition: 'center' }}
              />
            </div>
            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-black/50" />

            {/* Text Overlay */}
            <div className="absolute inset-0 flex items-center">
              <div className="container mx-auto px-6 md:px-12">
                <div className="max-w-4xl text-white">
                  <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
                    <div className="w-8 md:w-10 h-[2px] bg-primary-500" />
                    <span className="text-primary-500 font-bold uppercase tracking-widest text-[10px] md:text-sm">
                      SAGFO Fitness Excellence
                    </span>
                  </div>

                  <h1 className="text-3xl sm:text-5xl md:text-8xl font-black uppercase leading-none mb-4 md:mb-6 tracking-tighter">
                    {slide.titleLine1} <br />
                    <span className="text-primary-500 italic">{slide.titleLine2}</span>
                  </h1>

                  {slide.subtitle && (
                    <p className="text-sm md:text-xl text-zinc-300 mb-8 md:mb-10 max-w-2xl line-clamp-2 md:line-clamp-none">
                      {slide.subtitle}
                    </p>
                  )}

                  <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
                    <button
                      onClick={onCartClick}
                      className="bg-primary-600 hover:bg-primary-700 text-white px-8 md:px-10 py-3 md:py-4 rounded-xl font-bold uppercase tracking-wider text-xs md:text-base transition-all transform active:scale-95 shadow-lg shadow-primary-600/20"
                    >
                      {isLoggedIn ? 'Ver Catálogo' : 'Regístrate'}
                    </button>
                    <button
                      onClick={onPromosClick}
                      className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-8 md:px-10 py-3 md:py-4 rounded-xl font-bold uppercase tracking-wider text-xs md:text-base transition-all backdrop-blur-sm"
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

      {/* Manual Navigation Arrows - Repositioned for Mobile */}
      {slides.length > 1 && (
        <div className="absolute bottom-6 right-6 md:bottom-12 md:right-12 z-20 flex gap-2 md:gap-4">
          <button
            onClick={() => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)}
            className="bg-black/40 hover:bg-primary-600 p-3 md:p-4 rounded-xl text-white transition-all border border-white/10 backdrop-blur-md"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
            className="bg-black/40 hover:bg-primary-600 p-3 md:p-4 rounded-xl text-white transition-all border border-white/10 backdrop-blur-md"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}

      {/* Pagination Indicators */}
      {slides.length > 1 && (
        <div className="absolute bottom-6 left-6 md:bottom-12 md:left-12 z-20 flex gap-1.5 md:gap-2">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-1 rounded-full transition-all duration-300 ${idx === currentSlide ? 'w-8 md:w-12 bg-primary-500' : 'w-3 md:w-4 bg-white/20'}`}
            />
          ))}
        </div>
      )}

      {/* Subtle Grid Overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] z-10 bg-[radial-gradient(circle,white_1px,transparent_1px)] bg-[size:32px_32px]" />
    </div>
  );
};

export default Hero;
