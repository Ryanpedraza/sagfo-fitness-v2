import React, { useState } from 'react';
import { GalleryImage } from '../types';
import ScrollReveal from './ScrollReveal';

interface GallerySectionProps {
  images: GalleryImage[];
  isAdmin: boolean;
  onDeleteImage: (imageId: string) => void;
}

const GallerySection: React.FC<GallerySectionProps> = ({ images, isAdmin, onDeleteImage }) => {
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

  const openLightbox = (image: GalleryImage) => {
    setSelectedImage(image);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setSelectedImage(null);
    document.body.style.overflow = 'auto';
  };

  return (
    <>
      <div id="gallery" className="py-16 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 dark:text-white tracking-tight">Galería</h2>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-neutral-500 dark:text-neutral-400">
              Ve nuestro equipamiento en acción y descubre la calidad que nos define.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((image, i) => (
              <ScrollReveal key={image.id} delay={i * 0.05} className="h-full">
                <div className="group relative cursor-pointer overflow-hidden rounded-lg h-full" onClick={() => openLightbox(image)}>
                  <img
                    src={image.imageUrl}
                    alt={image.caption}
                    onError={(e) => {
                      e.currentTarget.src = 'https://placehold.co/400x400/e5e5e5/666?text=Imagen+No+Disponible';
                      e.currentTarget.onerror = null;
                    }}
                    className="w-full h-full object-cover aspect-square transform group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                    <p className="text-white text-sm">{image.caption}</p>
                    {isAdmin && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteImage(image.id);
                        }}
                        className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full hover:bg-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
                        aria-label="Eliminar imagen"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 10-2 0v10H6V6h1.382l.724 1.447A1 1 0 009 8h2a1 1 0 00.894-.553L12.618 6H14a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 009 2z" clipRule="evenodd" /></svg>
                      </button>
                    )}
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div className="fixed inset-0 z-[101] bg-black/90 backdrop-blur-sm flex items-center justify-center" onClick={closeLightbox}>
          <button onClick={closeLightbox} className="absolute top-5 right-5 text-white/70 hover:text-white transition-colors z-20"><svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg></button>
          <div className="relative max-w-4xl max-h-[90vh] w-full p-4" onClick={(e) => e.stopPropagation()}>
            <img
              src={selectedImage.imageUrl}
              alt={selectedImage.caption}
              onError={(e) => {
                e.currentTarget.src = 'https://placehold.co/800x600/1c1c1e/white?text=Imagen+No+Disponible';
                e.currentTarget.onerror = null;
              }}
              className="w-full h-full object-contain"
            />
            <p className="text-center text-white mt-4">{selectedImage.caption}</p>
          </div>
        </div>
      )}
    </>
  );
};

export default GallerySection;