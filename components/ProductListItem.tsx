

import React from 'react';
import { EquipmentItem } from '../types';

interface ProductListItemProps {
    product: EquipmentItem;
    onAdd: (product: EquipmentItem) => void;
    isAdded: boolean;
}

const ProductListItem: React.FC<ProductListItemProps> = ({ product, onAdd, isAdded }) => {
    return (
        <div className="bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm rounded-[1.5rem] p-4 flex items-center gap-4 border border-neutral-100 dark:border-white/5 hover:border-primary-500/30 transition-all duration-300 group">
            <div className="w-16 h-16 bg-neutral-100 dark:bg-black/20 rounded-xl overflow-hidden p-2 flex-shrink-0">
                <img src={product.imageUrls[0]} alt={product.name} className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500" />
            </div>
            <div className="flex-grow min-w-0">
                <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-1 italic opacity-60">{product.category}</p>
                <h4 className="text-[11px] font-black text-neutral-900 dark:text-white uppercase italic truncate leading-tight">{product.name}</h4>
            </div>
            <button
                onClick={() => onAdd(product)}
                disabled={isAdded}
                className={`w-10 h-10 flex-shrink-0 rounded-xl flex items-center justify-center transition-all duration-300 ${isAdded
                    ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                    : 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 shadow-lg hover:scale-110 active:scale-90'
                    }`}
                aria-label={isAdded ? 'Añadido' : 'Añadir al paquete'}
            >
                {isAdded ? (
                    <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                ) : (
                    <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                )}
            </button>
        </div>
    );
};

export default ProductListItem;