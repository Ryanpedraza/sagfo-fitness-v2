
import React, { useState, useRef, useEffect } from 'react';
import { GalleryImage } from '../types';
import { X, Maximize2, Camera } from 'lucide-react';

interface GallerySectionProps {
  images: GalleryImage[];
  isAdmin: boolean;
}

const GallerySection: React.FC<GallerySectionProps> = ({ images, isAdmin }) => {
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollPosRef = useRef(0);

  const openLightbox = (image: GalleryImage) => {
    setSelectedImage(image);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setSelectedImage(null);
    document.body.style.overflow = 'auto';
  };

  // Duplicamos las imágenes para el efecto de loop infinito sin saltos
  const displayImages = [...images, ...images];

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer || images.length === 0) return;

    let lastTime = performance.now();
    let animationId: number;

    const animate = (time: number) => {
      const deltaTime = time - lastTime;
      lastTime = time;

      const speed = 0.6;
      scrollPosRef.current += speed;

      // Si llegamos a la mitad del scroll (donde empiezan las duplicadas), reseteamos al inicio discretamente
      const halfWidth = scrollContainer.scrollWidth / 2;
      if (scrollPosRef.current >= halfWidth) {
        scrollPosRef.current = 0;
      }

      scrollContainer.scrollLeft = scrollPosRef.current;
      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationId);
  }, [images.length]);

  return (
    <section id="gallery" className="py-24 md:py-32 bg-white dark:bg-[#0a0a0a] border-t border-neutral-100 dark:border-white/5 relative overflow-hidden">
      <div className="container mx-auto px-6 lg:px-12 mb-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-[2px] bg-primary-600 rounded-full" />
              <span className="text-[10px] font-black text-primary-600 uppercase tracking-[0.5em] italic">Exposición Continua</span>
            </div>
            <h2 className="text-5xl md:text-7xl font-black text-neutral-900 dark:text-white uppercase italic tracking-tighter leading-none">
              Galería <span className="text-primary-600">Élite</span>
            </h2>
          </div>
        </div>
      </div>

      {/* Marquee sin controles para un look más limpio y premium */}
      <div
        ref={scrollRef}
        className="flex gap-6 md:gap-10 overflow-hidden whitespace-nowrap px-6 md:px-12 py-4 cursor-default select-none marquee-mask"
      >
        {images.length === 0 ? (
          <div className="w-full flex items-center justify-center py-20 bg-neutral-50 dark:bg-white/3 rounded-[3rem] border-2 border-dashed border-neutral-200 dark:border-white/10">
            <Camera size={40} className="text-neutral-300 mr-4" />
            <p className="text-neutral-400 font-bold uppercase italic tracking-widest text-xs">Aún no hay material visual</p>
          </div>
        ) : (
          displayImages.map((image, idx) => (
            <div
              key={`${image.id}-${idx}`}
              className="flex-none w-[320px] md:w-[500px] h-[240px] md:h-[375px] relative rounded-[2.5rem] md:rounded-[4rem] overflow-hidden group shadow-xl transition-all duration-700 hover:-translate-y-2 bg-neutral-100 dark:bg-zinc-900 border border-neutral-100 dark:border-white/5"
            >
              <div className="w-full h-full cursor-pointer" onClick={() => openLightbox(image)}>
                <img
                  src={image.imageUrl}
                  alt={image.caption}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 pointer-events-none"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100 duration-500">
                  <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white">
                    <Maximize2 size={24} />
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal de Lightbox Cinematográfico */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-[500] bg-black/95 backdrop-blur-2xl flex items-center justify-center transition-all animate-fadeIn"
          onClick={closeLightbox}
        >
          <button
            onClick={closeLightbox}
            className="absolute top-6 right-6 md:top-12 md:right-12 w-14 h-14 md:w-20 md:h-20 flex items-center justify-center text-white bg-white/10 hover:bg-primary-600 rounded-full transition-all z-[510] border border-white/20"
          >
            <X size={32} />
          </button>

          <div className="relative w-full h-full flex flex-col items-center justify-center p-4 md:p-12" onClick={(e) => e.stopPropagation()}>
            <img
              src={selectedImage.imageUrl}
              alt={selectedImage.caption}
              className="w-auto h-auto max-w-[95vw] max-h-[85vh] object-contain rounded-2xl md:rounded-[2rem] shadow-[0_0_100px_rgba(0,0,0,0.8)] animate-scaleIn"
            />
            {selectedImage.caption && (
              <div className="mt-8 bg-white dark:bg-zinc-900 px-8 py-3 rounded-full shadow-2xl animate-fadeInUp">
                <p className="font-black italic uppercase tracking-widest text-xs text-neutral-900 dark:text-white">
                  {selectedImage.caption}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export default GallerySection;