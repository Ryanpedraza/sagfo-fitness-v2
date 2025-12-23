
import React, { useRef, useState, useEffect } from 'react';
import { SortOrder, CategoryFilter, MuscleFilter } from '../types';
import { Layers, Package, SlidersHorizontal, ChevronDown } from 'lucide-react';

interface ProductListHeaderProps {
  sortOrder: SortOrder;
  onSortChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  categoryFilter: CategoryFilter;
  onCategoryFilterChange: (category: CategoryFilter) => void;
  searchTerm: string;
  onSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  muscleFilter: MuscleFilter;
  onMuscleFilterChange: (muscle: MuscleFilter) => void;
}

const ProductListHeader: React.FC<ProductListHeaderProps> = ({ sortOrder, onSortChange, categoryFilter, onCategoryFilterChange, searchTerm, onSearchChange, muscleFilter, onMuscleFilterChange }) => {
  const categories: CategoryFilter[] = ['Maquinaria', 'Accesorios'];
  const machinerySubFilters: MuscleFilter[] = ['Todos', 'Pecho', 'Espalda', 'Pierna', 'Brazo', 'Hombro', 'Cardio', 'Abdomen'];
  const accessorySubFilters: MuscleFilter[] = ['Todos', 'Peso Libre', 'Funcional', 'Barras', 'Discos', 'Mancuernas', 'Bancos', 'Agarres', 'Soportes'];

  const currentSubFilters = categoryFilter === 'Maquinaria' ? machinerySubFilters : accessorySubFilters;
  const activeIndex = categories.indexOf(categoryFilter);
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const [sliderStyle, setSliderStyle] = useState({});

  useEffect(() => {
    const setSlider = () => {
      const activeTabNode = tabsRef.current[activeIndex];
      if (activeTabNode) {
        setSliderStyle({
          width: `${activeTabNode.offsetWidth}px`,
          transform: `translateX(${activeTabNode.offsetLeft}px)`,
        });
      }
    };
    setSlider();
    window.addEventListener('resize', setSlider);
    return () => window.removeEventListener('resize', setSlider);
  }, [activeIndex]);

  return (
    <div className="mb-24 space-y-16 animate-fadeIn">
      {/* Search & Tool Hub */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-10">

        {/* Elite Category Switcher */}
        <div className="w-full md:w-auto">
          <div className="relative inline-flex items-center p-2 bg-neutral-100 dark:bg-white/[0.03] backdrop-blur-2xl rounded-[2.5rem] border border-neutral-200 dark:border-white/5 shadow-inner">
            <span
              className="absolute top-2 h-[calc(100%-16px)] bg-neutral-900 dark:bg-white rounded-[1.75rem] shadow-2xl transition-all duration-700 cubic-bezier(0.23, 1, 0.32, 1)"
              style={sliderStyle}
              aria-hidden="true"
            />
            {categories.map((category, index) => (
              <button
                key={category}
                ref={el => { tabsRef.current[index] = el; }}
                onClick={() => onCategoryFilterChange(category)}
                className={`relative z-10 px-12 py-4 text-[11px] font-black uppercase tracking-[0.3em] rounded-2xl transition-all duration-700 flex items-center gap-3 italic ${categoryFilter === category
                  ? 'text-white dark:text-neutral-900'
                  : 'text-neutral-400 dark:text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
                  }`}
              >
                {category === 'Maquinaria' ? <Layers size={16} strokeWidth={3} /> : <Package size={16} strokeWidth={3} />}
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Catalog Search (Boutique Style) */}
        <div className="flex-grow max-w-2xl w-full hidden lg:block">
          <div className="relative group">
            <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none group-focus-within:text-primary-600 transition-colors">
              <SlidersHorizontal size={18} strokeWidth={3} className="opacity-40" />
            </div>
            <input
              type="text"
              placeholder="EXPLORAR INGENIERÍA SAGFO..."
              value={searchTerm}
              onChange={onSearchChange}
              className="w-full h-16 pl-16 pr-8 bg-neutral-50 dark:bg-white/[0.03] border border-neutral-100 dark:border-white/5 rounded-[2rem] text-xs font-black uppercase tracking-widest placeholder:text-neutral-300 dark:placeholder:text-neutral-700 focus:outline-none focus:ring-4 focus:ring-primary-600/5 focus:bg-white dark:focus:bg-black transition-all duration-500 shadow-sm"
            />
          </div>
        </div>

        {/* Global Catalog Filter */}
        <div className="relative group w-full md:w-auto">
          <select
            value={sortOrder}
            onChange={onSortChange}
            className="w-full md:min-w-[280px] h-16 appearance-none bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 border-none rounded-[1.75rem] pl-8 pr-14 text-[11px] font-black uppercase tracking-[0.2em] italic focus:outline-none focus:ring-4 focus:ring-primary-500/10 cursor-pointer shadow-2xl transition-all hover:scale-105 active:scale-95"
          >
            <option value="default">Prioridad Elite</option>
            <option value="price-asc">Menor Inversión</option>
            <option value="price-desc">Mayor Inversión</option>
          </select>
          <div className="absolute inset-y-0 right-6 flex items-center pointer-events-none text-white/40 dark:text-neutral-900/40">
            <ChevronDown size={20} strokeWidth={3} />
          </div>
        </div>
      </div>

      {/* Specialty Navigation Hub */}
      <div className="pt-12 border-t border-neutral-100 dark:border-white/5">
        <div className="flex flex-col items-center gap-10">
          <div className="flex items-center gap-6">
            <div className="h-[1px] w-24 bg-gradient-to-r from-transparent to-neutral-200 dark:to-white/10" />
            <span className="text-[10px] font-black uppercase tracking-[0.6em] italic text-primary-600">
              {categoryFilter === 'Maquinaria' ? 'Arquitectura Muscular' : 'Ecosistema de Entrenamiento'}
            </span>
            <div className="h-[1px] w-24 bg-gradient-to-l from-transparent to-neutral-200 dark:to-white/10" />
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            {currentSubFilters.map((sub) => (
              <button
                key={sub}
                onClick={() => onMuscleFilterChange(sub)}
                className={`px-10 py-4 rounded-[1.75rem] text-[11px] font-black uppercase tracking-[0.3em] italic transition-all duration-700 ${muscleFilter === sub
                  ? 'bg-primary-600 text-white shadow-xl shadow-black/20 scale-110'
                  : 'bg-white dark:bg-white/5 border border-neutral-100 dark:border-white/10 text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:border-primary-500/50 hover:scale-105'
                  }`}
              >
                {sub}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductListHeader;
