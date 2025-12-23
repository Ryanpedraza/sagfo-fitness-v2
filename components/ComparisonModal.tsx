import React from 'react';
import { EquipmentItem } from '../types';

interface ComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: EquipmentItem[];
}

const ComparisonModal: React.FC<ComparisonModalProps> = ({ isOpen, onClose, items }) => {

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const allSpecs = [...new Set(items.flatMap(item => Object.keys(item.specifications)))];
  const allFeatures = [...new Set(items.flatMap(item => item.features))];

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center transition-all duration-500 ease-out ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      onClick={onClose}
    >
      <div className="fixed inset-0 bg-black/60 backdrop-blur-2xl transition-opacity duration-500" />
      <div
        className={`relative bg-white/90 dark:bg-zinc-900/90 backdrop-blur-3xl rounded-[3.5rem] w-full h-[100dvh] md:w-[94vw] md:h-[90vh] flex flex-col overflow-hidden transform transition-all duration-700 cubic-bezier(0.2, 0.8, 0.2, 1) shadow-[0_100px_200px_-50px_rgba(0,0,0,0.5)] border border-white/20 dark:border-white/5 ${isOpen ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 translate-y-20'}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-10 border-b border-neutral-100 dark:border-white/5 flex-shrink-0">
          <div className="flex flex-col">
            <h2 className="text-4xl font-black text-neutral-900 dark:text-white uppercase italic tracking-tighter">Análisis de Ingeniería</h2>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary-600 mt-2">Saga Premium Equipment Comparison</p>
          </div>
          <button
            onClick={onClose}
            className="p-4 rounded-full bg-neutral-100 dark:bg-white/5 text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-all hover:scale-110 active:scale-95 border border-white/20"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <div className="flex-grow overflow-x-auto overflow-y-auto no-scrollbar">
          <table className="w-full min-w-[900px] text-left border-collapse">
            <thead className="sticky top-0 z-20 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md">
              <tr>
                <th className="p-10 w-1/4">
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] text-neutral-400">Especificación</span>
                </th>
                {items.map(item => (
                  <th key={item.id} className="p-10 w-1/4 border-l border-neutral-100 dark:border-white/5">
                    <div className="flex flex-col items-center text-center space-y-4">
                      <div className="w-40 h-40 bg-white dark:bg-zinc-800 rounded-[2rem] p-4 border border-neutral-100 dark:border-white/5 shadow-xl transition-transform hover:scale-105 duration-500">
                        <img src={item.imageUrls[0]} alt={item.name} className="w-full h-full object-contain drop-shadow-xl" />
                      </div>
                      <h3 className="font-black text-lg text-neutral-900 dark:text-white uppercase italic tracking-tight">{item.name}</h3>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-white/5">
              <tr className="bg-neutral-50/50 dark:bg-white/5 group">
                <td className="p-8 px-10">
                  <span className="text-xs font-black uppercase tracking-widest text-neutral-500">Valor Inversión</span>
                </td>
                {items.map(item => (
                  <td key={item.id} className="p-8 border-l border-neutral-100 dark:border-white/5 text-center">
                    <span className="text-3xl font-black text-primary-600 dark:text-primary-500 italic">{formatCurrency(item.price)}</span>
                  </td>
                ))}
              </tr>

              <tr>
                <td className="p-8 px-10">
                  <span className="text-xs font-black uppercase tracking-widest text-neutral-500">Visión Técnica</span>
                </td>
                {items.map(item => (
                  <td key={item.id} className="p-8 border-l border-neutral-100 dark:border-white/5">
                    <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400 leading-relaxed max-w-xs mx-auto text-center">{item.description}</p>
                  </td>
                ))}
              </tr>

              <tr className="bg-neutral-900 dark:bg-white">
                <td colSpan={items.length + 1} className="p-4 px-10">
                  <span className="text-[9px] font-black uppercase tracking-[0.5em] text-white dark:text-black italic">Arquitectura y Especificaciones</span>
                </td>
              </tr>

              {allSpecs.map(specKey => (
                <tr key={specKey as string} className="hover:bg-neutral-50 dark:hover:bg-white/5 transition-colors group">
                  <td className="p-6 px-10">
                    <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400 group-hover:text-primary-600 transition-colors">{specKey as string}</span>
                  </td>
                  {items.map(item => (
                    <td key={item.id} className="p-6 border-l border-neutral-100 dark:border-white/5 text-center">
                      <span className="text-xs font-black text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">
                        {item.specifications[specKey as string] || '---'}
                      </span>
                    </td>
                  ))}
                </tr>
              ))}

              <tr className="bg-neutral-900 dark:bg-white">
                <td colSpan={items.length + 1} className="p-4 px-10">
                  <span className="text-[9px] font-black uppercase tracking-[0.5em] text-white dark:text-black italic">Ventajas Competitivas</span>
                </td>
              </tr>

              {allFeatures.map(feature => (
                <tr key={feature as string} className="hover:bg-neutral-50 dark:hover:bg-white/5 transition-colors group">
                  <td className="p-6 px-10">
                    <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400 group-hover:text-primary-600 transition-colors">{feature as string}</span>
                  </td>
                  {items.map(item => (
                    <td key={item.id} className="p-6 border-l border-neutral-100 dark:border-white/5 text-center">
                      {item.features.includes(feature as string) ?
                        (<div className="flex justify-center">
                          <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 ring-4 ring-emerald-50 dark:ring-emerald-900/10">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        </div>) :
                        (<div className="w-8 h-[2px] bg-neutral-200 dark:bg-white/10 mx-auto" />)
                      }
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ComparisonModal;
