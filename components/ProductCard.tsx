
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
      className="group cursor-pointer bg-white dark:bg-[#111] rounded-[3rem] overflow-hidden transition-all duration-700 hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)] border border-neutral-100 dark:border-white/5 flex flex-col h-full relative"
    >
      {/* Visual Container - Fixed aspect ratio to ensure ALL cards have the same image area */}
      <div className="relative w-full aspect-square bg-neutral-50 dark:bg-black/20 overflow-hidden flex items-center justify-center p-8 group-hover:bg-white dark:group-hover:bg-black transition-colors duration-700">

        <img
          src={(product.imageUrls && product.imageUrls.length > 0) ? product.imageUrls[0] : 'https://placehold.co/400x300?text=SAGFO'}
          alt={product.name}
          className={`w-full h-full object-contain transition-all duration-1000 group-hover:scale-110 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setImageLoaded(true)}
        />

        {!imageLoaded && <div className="absolute inset-0 bg-neutral-100 dark:bg-zinc-800 animate-pulse" />}

        {/* Badges */}
        <div className="absolute top-6 left-6 z-20 flex flex-col gap-2">
          {hasDiscount && (
            <div className="px-4 py-2 rounded-full bg-primary-600/90 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-widest italic shadow-lg shadow-primary-600/20 border border-white/10">
              OFERTA
            </div>
          )}

          {product.availabilityStatus === 'in-stock' ? (
            <div className="px-4 py-2 rounded-full bg-emerald-500/90 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-widest italic shadow-lg shadow-emerald-500/20 border border-white/10 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              DISPONIBLE
            </div>
          ) : (
            <div className="px-4 py-2 rounded-full bg-amber-500/90 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-widest italic shadow-lg shadow-amber-500/20 border border-white/10 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-white/50" />
              SOBRE PEDIDO
            </div>
          )}
        </div>

        <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="w-10 h-10 rounded-full bg-white dark:bg-zinc-800 shadow-xl flex items-center justify-center text-primary-600">
            <ArrowUpRight size={20} />
          </div>
        </div>
      </div>

      {/* Content Area - Fixed heights to ensure identical card sizes */}
      <div className="p-8 flex flex-col flex-grow">
        {/* Category & Title with fixed min-height to prevent misalignment */}
        <div className="min-h-[100px] flex flex-col justify-start space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-black text-primary-600 uppercase tracking-widest italic">{product.category}</span>
            <div className="w-1 h-1 rounded-full bg-neutral-200 dark:bg-white/10" />
            <span className="text-[9px] font-bold text-neutral-400 dark:text-neutral-500 uppercase">{product.muscleGroup}</span>
          </div>
          <h3 className="text-xl md:text-2xl font-black text-neutral-900 dark:text-white uppercase italic tracking-tighter leading-none line-clamp-2 group-hover:text-primary-600 transition-colors">
            {product.name}
          </h3>
        </div>

        {/* Price & Actions aligned at the bottom */}
        <div className="mt-auto pt-6 border-t border-neutral-100 dark:border-white/10 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-2xl font-black text-neutral-900 dark:text-white italic tracking-tighter leading-none">{formatCurrency(currentPrice)}</span>
            {hasDiscount && <span className="text-[10px] font-bold text-neutral-400 line-through italic mt-1 opacity-50">{formatCurrency(product.price)}</span>}
          </div>

          <div className="flex gap-2">
            {isAdmin && (
              <button
                onClick={(e) => { e.stopPropagation(); onEdit(); }}
                className="w-10 h-10 rounded-xl bg-neutral-100 dark:bg-white/5 text-neutral-500 hover:text-primary-600 transition-colors flex items-center justify-center"
              >
                <Edit3 size={18} />
              </button>
            )}
            <button
              onClick={(e) => { e.stopPropagation(); onToggleCompare(); }}
              className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-500 shadow-lg ${isComparing ? 'bg-primary-600 text-white' : 'bg-neutral-950 dark:bg-white text-white dark:text-neutral-900 group-hover:bg-primary-600 group-hover:text-white group-hover:rotate-12'}`}
            >
              {isComparing ? <Check size={20} strokeWidth={3} /> : <Plus size={20} strokeWidth={3} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;