
import React, { useState } from 'react';
import { EquipmentItem } from '../types';
import { Plus, Check, Edit3, ArrowUpRight } from 'lucide-react';

interface ProductCardProps {
  product: EquipmentItem;
  onClick: () => void;
  onToggleCompare: () => void;
  isComparing: boolean;
  isAdmin: boolean;
  onEdit: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onClick, onToggleCompare, isComparing, isAdmin, onEdit }) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const hasDiscount = product.isPromotion && product.promotionalPrice && product.promotionalPrice < product.price;
  const currentPrice = hasDiscount ? product.promotionalPrice! : product.price;

  return (
    <div
      onClick={onClick}
      className="group cursor-pointer bg-white dark:bg-neutral-900 rounded-[2.5rem] overflow-hidden transition-all duration-700 hover:shadow-premium border border-neutral-100 dark:border-white/5 flex flex-col h-full relative"
    >
      {/* Visual Hub */}
      <div className="relative w-full aspect-square bg-neutral-50 dark:bg-black/40 overflow-hidden flex items-center justify-center p-12 transition-all duration-700">

        <img
          src={(product.imageUrls && product.imageUrls.length > 0) ? product.imageUrls[0] : 'https://placehold.co/400x300?text=SAGFO'}
          alt={product.name}
          className={`w-full h-full object-contain transition-[transform,opacity] duration-[1000ms] ease-out group-hover:scale-110 group-hover:rotate-2 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setImageLoaded(true)}
          loading="lazy"
        />

        {!imageLoaded && <div className="absolute inset-0 bg-neutral-100 dark:bg-zinc-800 animate-pulse" />}

        {/* Floating Badges */}
        <div className="absolute top-8 left-8 z-20 flex flex-col gap-3">
          {hasDiscount && (
            <div className="px-5 py-2.5 rounded-full bg-primary-600 text-white text-[9px] font-black uppercase tracking-[0.3em] italic shadow-2xl border border-white/20 animate-fadeIn">
              Oferta Limitada
            </div>
          )}

          {product.availabilityStatus === 'in-stock' && (
            <div className="px-5 py-2.5 rounded-full bg-emerald-500 text-white text-[9px] font-black uppercase tracking-[0.3em] border border-emerald-400 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              Disponible
            </div>
          )}
        </div>

        {/* Quick View Signal */}
        <div className="absolute bottom-8 right-8 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
          <div className="w-14 h-14 rounded-full bg-white dark:bg-primary-600 shadow-2xl flex items-center justify-center text-black dark:text-white">
            <ArrowUpRight size={24} strokeWidth={2.5} />
          </div>
        </div>
      </div>

      {/* Content Architecture */}
      <div className="p-6 flex flex-col flex-grow">
        <div className="mb-2">
          <div className="flex items-center gap-3 mb-2 flex-wrap">
            <span className="text-[10px] md:text-[11px] font-black text-primary-500 uppercase tracking-[0.3em] italic leading-none">{product.category}</span>
            <div className="w-1 h-1 rounded-full bg-neutral-200 dark:bg-white/10" />
            <span className="text-[10px] md:text-[11px] font-bold text-neutral-500 uppercase tracking-[0.2em]">{product.muscleGroup}</span>

            {/* Color Indicators ONLY for Made-to-order (Production) products */}
            {product.availabilityStatus === 'made-to-order' && product.availableColors && product.availableColors.length > 0 && (
              <>
                <div className="w-1 h-1 rounded-full bg-neutral-200 dark:bg-white/10" />
                <div className="flex items-center gap-1.5 align-middle">
                  {product.availableColors.slice(0, 3).map((color, idx) => {
                    const c = color.toLowerCase();
                    const hex = (() => {
                      if (c.includes('rojo')) return '#ef4444';
                      if (c.includes('azul')) return '#3b82f6';
                      if (c.includes('negro')) return '#171717';
                      if (c.includes('blanco')) return '#ffffff';
                      if (c.includes('amarillo')) return '#eab308';
                      if (c.includes('verde')) return '#22c55e';
                      if (c.includes('naranja')) return '#f97316';
                      if (c.includes('plata') || c.includes('gris')) return '#9ca3af';
                      return '#d4d4d4';
                    })();

                    return (
                      <div
                        key={idx}
                        className={`w-2 h-2 rounded-full shadow-sm border ${c.includes('blanco') ? 'border-neutral-200' : 'border-transparent'}`}
                        style={{ backgroundColor: hex }}
                        title={color}
                      />
                    );
                  })}
                  {product.availableColors.length > 3 && (
                    <span className="text-[9px] font-black text-neutral-300 pointer-events-none leading-none">+</span>
                  )}
                </div>
              </>
            )}
          </div>

          <h3 className="text-lg md:text-xl font-black text-neutral-900 dark:text-white uppercase italic tracking-tighter leading-[0.85] line-clamp-2 pr-1">
            {product.name}
          </h3>
        </div>

        <div className="mt-auto flex items-end justify-between gap-2">
          <div className="flex flex-col flex-1 min-w-0">
            <span className="text-2xl font-black text-neutral-900 dark:text-white italic tracking-tighter leading-none mb-1 truncate">
              {formatCurrency(currentPrice)}
            </span>
            {hasDiscount && (
              <span className="text-[10px] font-bold text-neutral-500 line-through italic opacity-50 tracking-widest truncate">
                {formatCurrency(product.price)}
              </span>
            )}
          </div>

          <div className="flex gap-2 flex-shrink-0">
            {isAdmin && (
              <button
                onClick={(e) => { e.stopPropagation(); onEdit(); }}
                className="w-11 h-11 rounded-2xl bg-neutral-100 dark:bg-white/5 text-neutral-500 hover:text-primary-500 transition-all flex items-center justify-center"
              >
                <Edit3 size={16} strokeWidth={2.5} />
              </button>
            )}
            <button
              onClick={(e) => { e.stopPropagation(); onToggleCompare(); }}
              className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-700 shadow-2xl ${isComparing ? 'bg-primary-600 text-white' : 'bg-black dark:bg-white text-white dark:text-black group-hover:rotate-[-5deg] group-hover:scale-110'}`}
            >
              {isComparing ? <Check size={20} strokeWidth={3} /> : <Plus size={20} strokeWidth={3} />}
            </button>
          </div>
        </div>
      </div>
    </div >
  );
};

export default ProductCard;