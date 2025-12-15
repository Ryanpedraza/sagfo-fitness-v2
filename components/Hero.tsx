
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
    <div className="relative bg-neutral-900 text-white h-[600px] md:h-[700px] overflow-hidden group rounded-b-[3rem]">
      {isAdmin && (
        <button
          onClick={onEdit}
          className="absolute top-4 right-4 z-[60] bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center space-x-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" /></svg>
          <span>Editar Banners</span>
        </button>
      )}

      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
        >
          <div className="absolute inset-0">
            <img
              src={slide.imageUrl}
              alt="Hero Background"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent"></div>
          </div>
          <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center items-center text-center pt-20">
            <ScrollReveal direction="down" distance={40}>
              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white drop-shadow-lg transition-transform duration-700 transform translate-y-0">
                {slide.titleLine1}
                <br />
                <span className="text-primary-400">{slide.titleLine2}</span>
              </h1>
            </ScrollReveal>

            <ScrollReveal delay={0.2} distance={30}>
              <p className="mt-6 max-w-2xl mx-auto text-lg md:text-xl text-neutral-300 drop-shadow-sm">
                {slide.subtitle}
              </p>
            </ScrollReveal>

            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <ScrollReveal delay={0.4} direction="up" distance={50}>
                <button
                  onClick={onCartClick}
                  className="bg-primary-600 text-white font-semibold py-4 px-10 rounded-full text-lg hover:bg-primary-700 transition-transform duration-300 transform hover:scale-105 shadow-lg"
                >
                  Comprar Ahora
                </button>
              </ScrollReveal>

              <ScrollReveal delay={0.5} direction="up" distance={50}>
                <button
                  onClick={onPromosClick}
                  className="bg-white/10 backdrop-blur-md text-white border border-white/30 font-semibold py-4 px-10 rounded-full text-lg hover:bg-white/20 transition-transform duration-300 transform hover:scale-105 shadow-lg"
                >
                  Ver Promociones
                </button>
              </ScrollReveal>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      {slides.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-[50] p-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-white transition-all border border-white/20"
            aria-label="Anterior"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-[50] p-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-white transition-all border border-white/20"
            aria-label="Siguiente"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Dots Indicators */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-[50] flex space-x-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${index === currentSlide ? 'bg-primary-500 w-8' : 'bg-white/50 hover:bg-white'
                  }`}
                aria-label={`Ir a slide ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Hero;
