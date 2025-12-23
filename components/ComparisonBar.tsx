import React from 'react';
import { EquipmentItem } from '../types';

interface ComparisonBarProps {
  items: EquipmentItem[];
  onCompare: () => void;
  onClear: () => void;
}

const ComparisonBar: React.FC<ComparisonBarProps> = ({ items, onCompare, onClear }) => {
  if (items.length === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-10 inset-x-0 z-50 flex justify-center pointer-events-none px-4">
      <div className="pointer-events-auto bg-white/80 dark:bg-zinc-900/80 backdrop-blur-2xl rounded-full shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] p-2 pl-8 pr-2 flex items-center gap-8 border border-white/20 dark:border-white/5 transform transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] animate-in slide-in-from-bottom-20 zoom-in-95">

        <div className="flex items-center gap-6">
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary-600 leading-tight">SAGA</span>
            <span className="text-[11px] font-black uppercase tracking-[0.1em] text-neutral-400 leading-tight">Comparativa</span>
          </div>

          <div className="flex -space-x-3">
            {items.map((item, index) => (
              <div
                key={item.id}
                className="relative w-12 h-12 rounded-full ring-4 ring-white dark:ring-zinc-900 overflow-hidden bg-white dark:bg-zinc-800 shadow-xl transition-transform hover:scale-110 hover:z-10 cursor-pointer group"
                style={{ zIndex: items.length - index }}
              >
                <img
                  src={item.imageUrls[0]}
                  alt={item.name}
                  className="w-full h-full object-cover transition-transform group-hover:scale-110"
                />
              </div>
            ))}

            {Array.from({ length: Math.max(0, 2 - items.length) }).map((_, index) => (
              <div
                key={`placeholder-${index}`}
                className="w-12 h-12 rounded-full ring-4 ring-white dark:ring-zinc-900 bg-neutral-100/50 dark:bg-zinc-800/50 border-2 border-dashed border-neutral-300 dark:border-zinc-700 flex items-center justify-center transition-all opacity-40"
              >
                <span className="text-neutral-400 dark:text-neutral-600 text-sm font-black">+</span>
              </div>
            ))}
          </div>
        </div>

        <div className="h-10 w-px bg-neutral-200 dark:bg-white/10 hidden sm:block"></div>

        <div className="flex items-center gap-3">
          <button
            onClick={onCompare}
            disabled={items.length < 2}
            className="bg-neutral-900 dark:bg-white text-white dark:text-black font-black uppercase tracking-[0.2em] text-[10px] py-4 px-8 rounded-full hover:scale-105 active:scale-95 transition-all duration-500 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-2xl shadow-neutral-500/10"
          >
            Analizar ({items.length})
          </button>

          <button
            onClick={onClear}
            className="w-12 h-12 flex items-center justify-center rounded-full bg-neutral-100 dark:bg-zinc-800/80 text-neutral-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-300"
            aria-label="Limpiar comparación"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ComparisonBar;