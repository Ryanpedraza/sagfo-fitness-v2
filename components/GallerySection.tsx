
import React, { useState, useRef, useEffect } from 'react';
import { GalleryImage } from '../types';
import { X, Trash2, Maximize2, Camera, Play, Pause, ChevronRight, ChevronLeft } from 'lucide-react';

interface GallerySectionProps {
  images: GalleryImage[];
  isAdmin: boolean;
  onDeleteImage: (imageId: string) => void;
}

const GallerySection: React.FC<GallerySectionProps> = ({ images, isAdmin, onDeleteImage }) => {
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Ref to track precise scroll position for sub-pixel movement
  const scrollPosRef = useRef(0);

  const openLightbox = (image: GalleryImage) => {
    setIsPlaying(false);
    setSelectedImage(image);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setSelectedImage(null);
    document.body.style.overflow = 'auto';
  };

  // Ultra-Smooth & Slow Auto-Scroll
  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer || !isPlaying || images.length === 0) return;

    let lastTime = performance.now();

    const animate = (time: number) => {
      if (!isPlaying) return;

      const deltaTime = time - lastTime;
      lastTime = time;

      // Extremely slow speed: 30 pixels per second (0.5px per frame approx)
      const speed = 0.3;
      scrollPosRef.current += speed;

      if (scrollPosRef.current >= (scrollContainer.scrollWidth - scrollContainer.clientWidth)) {
        scrollPosRef.current = 0;
      }

      scrollContainer.scrollLeft = scrollPosRef.current;
      requestAnimationFrame(animate);
    };

    const animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, [isPlaying, images.length]);

  const manualScroll = (direction: 'left' | 'right') => {
    setIsPlaying(false);
    if (scrollRef.current) {
      const amount = 400; // Fixed amount for consistency
      const sign = direction === 'left' ? -1 : 1;
      const target = scrollRef.current.scrollLeft + (sign * amount);
      scrollRef.current.scrollTo({ left: target, behavior: 'smooth' });
      scrollPosRef.current = target;
    }
  };

  return (
    <section id="gallery" className="py-24 md:py-32 bg-white dark:bg-[#0a0a0a] border-t border-neutral-100 dark:border-white/5 relative">
      <div className="container mx-auto px-6 lg:px-12 mb-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-[2px] bg-primary-600 rounded-full" />
              <span className="text-[10px] font-black text-primary-600 uppercase tracking-[0.5em] italic">Exposición Uniforme</span>
            </div>
            <h2 className="text-5xl md:text-7xl font-black text-neutral-900 dark:text-white uppercase italic tracking-tighter leading-none">
              Galería <span className="text-primary-600">Élite</span>
            </h2>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-4">
            <div className="flex bg-neutral-100 dark:bg-white/5 rounded-2xl p-1 border border-neutral-200 dark:border-white/5 shadow-inner">
              <button onClick={() => manualScroll('left')} className="w-12 h-12 rounded-xl flex items-center justify-center hover:bg-white dark:hover:bg-neutral-800 transition-all text-neutral-500 hover:text-primary-600">
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-12 h-12 rounded-xl flex items-center justify-center bg-white dark:bg-neutral-800 text-primary-600 shadow-sm"
              >
                {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-0.5" />}
              </button>
              <button onClick={() => manualScroll('right')} className="w-12 h-12 rounded-xl flex items-center justify-center hover:bg-white dark:hover:bg-neutral-800 transition-all text-neutral-500 hover:text-primary-600">
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Uniform Grid Flow */}
      <div
        ref={scrollRef}
        className="flex gap-6 md:gap-10 overflow-x-auto scrollbar-hide px-6 md:px-12 py-4"
      >
        {images.length === 0 ? (
          <div className="w-full flex items-center justify-center py-20 bg-neutral-50 dark:bg-white/3 rounded-[3rem] border-2 border-dashed border-neutral-200 dark:border-white/10">
            <Camera size={40} className="text-neutral-300 mr-4" />
            <p className="text-neutral-400 font-bold uppercase italic tracking-widest text-xs">Aún no hay material visual</p>
          </div>
        ) : (
          /* Images with FIXED size for uniformity */
          images.map((image) => (
            <div
              key={image.id}
              className="flex-none w-[320px] md:w-[500px] h-[240px] md:h-[375px] relative rounded-[2.5rem] md:rounded-[4rem] overflow-hidden group shadow-xl transition-all duration-700 hover:-translate-y-2 bg-neutral-100 dark:bg-zinc-900 border border-neutral-100 dark:border-white/5"
            >
              <div className="w-full h-full cursor-pointer" onClick={() => openLightbox(image)}>
                <img
                  src={image.imageUrl}
                  alt={image.caption}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100 duration-500">
                  <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white">
                    <Maximize2 size={24} />
                  </div>
                </div>
              </div>

              {isAdmin && (
                <button
                  onClick={(e) => { e.stopPropagation(); onDeleteImage(image.id); }}
                  className="absolute top-6 right-6 w-10 h-10 bg-red-600 text-white rounded-xl shadow-xl flex items-center justify-center hover:bg-red-700 transition-all"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          ))
        )}
      </div>

      {/* HUGE Cinematic Lightbox */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-[500] bg-black/95 backdrop-blur-2xl flex items-center justify-center transition-all animate-fadeIn"
          onClick={closeLightbox}
        >
          {/* Close Action */}
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