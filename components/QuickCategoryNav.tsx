
import React from 'react';
import { ChevronRight, ArrowUpRight } from 'lucide-react';
import { MuscleFilter } from '../types';
import { motion } from 'framer-motion';

interface QuickCategoryNavProps {
    onSelectCategory: (category: MuscleFilter) => void;
}

const quickCats: { label: string; value: MuscleFilter; image: string; desc: string }[] = [
    { label: 'Mancuernas', value: 'Mancuernas', image: '/categories/mancuernas.png', desc: 'CARGA DE PRECISIÓN' },
    { label: 'Cardio', value: 'Cardio', image: '/categories/cardio.png', desc: 'RESISTENCIA ÉLITE' },
    { label: 'Discos', value: 'Discos', image: '/categories/discos.png', desc: 'PESO OLÍMPICO' },
    { label: 'Barras', value: 'Barras', image: '/categories/barras.png', desc: 'ACERO DE GRADO' },
    { label: 'Bancos', value: 'Bancos', image: '/categories/bancos.png', desc: 'ESTABILIDAD PRO' },
    { label: 'Funcional', value: 'Funcional', image: '/categories/funcional.png', desc: 'AGILIDAD TOTAL' },
];

const QuickCategoryNav: React.FC<QuickCategoryNavProps> = ({ onSelectCategory }) => {
    return (
        <section className="relative py-40 md:py-60 bg-[#fcfcfc] dark:bg-[#050505] overflow-hidden">
            {/* Engineering Grid Overlay */}
            <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none"
                style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

            <div className="container mx-auto px-6 lg:px-12 relative z-10">
                <div className="flex flex-col items-center text-center mb-24 space-y-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="flex items-center gap-4 bg-primary-500/5 px-6 py-2 rounded-full border border-primary-500/10"
                    >
                        <span className="w-2 h-2 rounded-full bg-primary-500 animate-pulse" />
                        <span className="text-[10px] font-black text-primary-600 dark:text-primary-400 uppercase tracking-[0.4em] italic">Catálogo de Especialistas</span>
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        className="text-6xl md:text-8xl font-black text-neutral-900 dark:text-white uppercase tracking-tighter leading-[0.85]"
                    >
                        EL PODER DEL <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-neutral-400 to-neutral-200 dark:from-neutral-600 dark:to-neutral-400">DISEÑO ÉLITE</span>
                    </motion.h2>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-x-4 gap-y-16">
                    {quickCats.map((cat, index) => (
                        <motion.button
                            key={cat.label}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                            onClick={() => onSelectCategory(cat.value)}
                            className="group relative flex flex-col items-center"
                        >
                            {/* Circular Image Container */}
                            <div className="relative z-10">
                                <div className="relative w-36 h-36 sm:w-44 sm:h-44 md:w-52 md:h-52 rounded-full overflow-hidden border-[6px] border-white dark:border-neutral-800 transition-all duration-700 group-hover:scale-105">
                                    <img
                                        src={cat.image}
                                        alt={cat.label}
                                        className="w-full h-full object-cover transition-transform duration-1000"
                                    />
                                </div>

                                {/* Desc Badge Floating - Pill shape from image */}
                                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 bg-white dark:bg-neutral-800 shadow-xl px-4 py-2 rounded-2xl border border-neutral-100 dark:border-white/5 whitespace-nowrap z-20 min-w-[80px]">
                                    <span className="text-[7px] font-black text-primary-500 dark:text-primary-400 uppercase tracking-widest italic leading-none">
                                        {cat.desc.split(' ')[0]}
                                    </span>
                                </div>
                            </div>

                            {/* Info Section - matching the image */}
                            <div className="mt-14 flex flex-col items-center">
                                <h3 className="text-xl md:text-2xl font-black text-neutral-900 dark:text-white uppercase tracking-tighter">
                                    {cat.label}
                                </h3>
                            </div>
                        </motion.button>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default QuickCategoryNav;
