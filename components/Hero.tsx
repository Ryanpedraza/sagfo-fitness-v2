import React, { useState, useEffect } from 'react';
import { HeroSlide } from '../types';
import { ChevronLeft, ChevronRight } from 'lucide-react';

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
    <div className="relative bg-[#050505] text-white h-[600px] md:h-[750px] overflow-hidden group rounded-b-[3rem] shadow-2xl">
      {isAdmin && (
        <button
          onClick={onEdit}
          className="absolute top-10 right-10 z-[60] bg-white/10 hover:bg-white/20 backdrop-blur-md text-white font-bold uppercase tracking-widest text-[10px] py-3 px-6 rounded-xl transition-all border border-white/20"
        >
          Configurar Banners
        </button>
      )}

      {/* Slides Loop */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
        >
          {/* Background Image & Overlay */}
          <div className="absolute inset-0 z-0">
            <img
              src={slide.imageUrl}
              alt="Hero Background"
              className={`w-full h-full object-cover transition-transform duration-[10s] ease-out ${index === currentSlide ? 'scale-105' : 'scale-100'}`}
              loading={index === 0 ? "eager" : "lazy"}
            />
            {/* Soft Gradient for text readability only - preventing 'blackout' */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent z-[1]"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent opacity-60 z-[1]"></div>
          </div>

          {/* Content Container */}
          {index === currentSlide && (
            <div className="relative z-20 container mx-auto px-6 sm:px-12 lg:px-24 h-full flex flex-col justify-center items-start text-left pt-12">
              <div className="max-w-4xl space-y-8 animate-fadeIn">

                {/* Brand Badge - Clean & Premium */}
                <div className="flex items-center space-x-4 mb-2 animate-slideInRight" style={{ animationDelay: '0.1s' }}>
                  <div className="w-12 h-[2px] bg-primary-500 shadow-[0_0_15px_rgba(14,165,233,0.6)]"></div>
                  <span className="text-xs font-bold tracking-[0.3em] text-white/90 uppercase">Elite Series</span>
                </div>

                {/* Main Title - Bold & Professional */}
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold text-white leading-[1.1] tracking-tight animate-slideInUp" style={{ animationDelay: '0.2s' }}>
                  {slide.titleLine1}
                  <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-primary-600">{slide.titleLine2}</span>
                </h1>

                {/* Subtitle */}
                <p className="max-w-xl text-lg md:text-2xl text-white font-medium leading-relaxed drop-shadow-md animate-slideInUp" style={{ animationDelay: '0.3s' }}>
                  {slide.subtitle}
                </p>

                {/* Action Buttons - Elegant Pills */}
                <div className="pt-8 flex flex-col sm:flex-row gap-5 animate-slideInUp" style={{ animationDelay: '0.4s' }}>
                  <button
                    onClick={onCartClick}
                    className="bg-white text-black text-sm font-bold uppercase tracking-widest py-4 px-10 rounded-full hover:bg-neutral-100 transition-all shadow-lg hover:scale-105 active:scale-95"
                  >
                    Comenzar Pedido
                  </button>

                  <button
                    onClick={onPromosClick}
                    className="bg-black/30 backdrop-blur-md border border-white/30 text-white text-sm font-bold uppercase tracking-widest py-4 px-10 rounded-full hover:bg-white/10 hover:border-white transition-all active:scale-95"
                  >
                    Ver Promociones
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}

      {/* Navigation Controls */}
      {slides.length > 1 && (
        <>
          {/* Arrows */}
          <div className="hidden md:flex absolute right-12 bottom-12 z-[50] space-x-4">
            <button
              onClick={prevSlide}
              className="w-14 h-14 rounded-full border border-white/10 bg-white/5 text-white flex items-center justify-center hover:bg-primary-600 hover:border-primary-600 transition-all duration-300 backdrop-blur-md group"
            >
              <ChevronLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
            </button>
            <button
              onClick={nextSlide}
              className="w-14 h-14 rounded-full border border-white/10 bg-white/5 text-white flex items-center justify-center hover:bg-primary-600 hover:border-primary-600 transition-all duration-300 backdrop-blur-md group"
            >
              <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Indicators */}
          <div className="absolute left-8 md:left-24 bottom-16 z-[50] flex items-center space-x-3">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`h - 1.5 rounded - full transition - all duration - 500 ${index === currentSlide ? 'bg-primary-500 w-12 shadow-[0_0_10px_rgba(14,165,233,0.5)]' : 'bg-white/20 w-8 hover:bg-white/40'} `}
              />
            ))}
          </div>
        </>
      )}

      {/* Smooth Animations */}
      <style>{`
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes slideInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
@keyframes slideInRight { from { opacity: 0; transform: translateX(-20px); } to { opacity: 1; transform: translateX(0); } }
        .animate - fadeIn { animation: fadeIn 1s ease - out forwards; }
        .animate - slideInUp { animation: slideInUp 0.8s cubic - bezier(0.16, 1, 0.3, 1) forwards; opacity: 0; }
        .animate - slideInRight { animation: slideInRight 0.8s cubic - bezier(0.16, 1, 0.3, 1) forwards; opacity: 0; }
`}</style>
    </div>
  );
};

export default Hero;
