
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

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {quickCats.map((cat, index) => (
                        <motion.button
                            key={cat.label}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                            onClick={() => onSelectCategory(cat.value)}
                            className="group relative h-[520px] rounded-[3.5rem] bg-white dark:bg-[#0a0a0a] border border-neutral-100 dark:border-white/5 overflow-hidden transition-all duration-700 hover:shadow-[0_80px_100px_-30px_rgba(0,0,0,0.2)] hover:-translate-y-2"
                        >
                            {/* Product Glow Layer */}
                            <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                            {/* Product Image Layer */}
                            <div className="absolute inset-x-0 top-0 h-[70%] flex items-center justify-center p-12">
                                <motion.div
                                    className="relative w-full h-full"
                                    whileHover={{ scale: 1.15, rotate: -3 }}
                                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                                >
                                    <img
                                        src={cat.image}
                                        alt={cat.label}
                                        className="w-full h-full object-contain filter drop-shadow-[0_30px_60px_rgba(0,0,0,0.15)] group-hover:drop-shadow-[0_40px_80px_rgba(0,0,0,0.3)] dark:mix-blend-normal transition-all duration-1000"
                                    />
                                    <div className="absolute -inset-16 bg-primary-500/10 blur-[120px] opacity-0 group-hover:opacity-40 transition-opacity duration-1000 rounded-full" />
                                </motion.div>
                            </div>

                            {/* Info Section - "The Window" Design */}
                            <div className="absolute inset-x-0 bottom-0 p-10 flex flex-col items-center text-center">
                                {/* Glass Label */}
                                <div className="mb-4 backdrop-blur-md bg-neutral-100/50 dark:bg-white/5 border border-white/20 dark:border-white/10 px-4 py-1.5 rounded-full opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-700">
                                    <p className="text-[9px] font-black uppercase tracking-[0.3em] text-primary-500 italic">
                                        {cat.desc}
                                    </p>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="text-5xl font-black text-neutral-900 dark:text-white uppercase tracking-tighter leading-none group-hover:scale-110 transition-transform duration-700">
                                        {cat.label}
                                    </h3>

                                    {/* Action Indicator */}
                                    <div className="flex flex-col items-center gap-4 opacity-40 group-hover:opacity-100 transition-all duration-700">
                                        <div className="w-px h-8 bg-gradient-to-b from-primary-500 to-transparent group-hover:h-12 transition-all duration-700" />
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-neutral-400 group-hover:text-primary-500 transition-colors">DESCUBRIR</span>
                                            <ArrowUpRight size={14} className="text-primary-500 translate-y-0.5 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Background Serial Number */}
                            <div className="absolute top-12 left-12 text-[80px] font-black text-black/[0.02] dark:text-white/[0.02] uppercase italic pointer-events-none tracking-tighter rotate-[-90deg] origin-left">
                                SERIE-{index + 1}
                            </div>
                        </motion.button>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default QuickCategoryNav;
