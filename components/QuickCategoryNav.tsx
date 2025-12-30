
import React, { useState, useEffect } from 'react';
import { LayoutGrid, ArrowUpRight } from 'lucide-react';
import { MuscleFilter, GalleryImage } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

interface QuickCategoryNavProps {
    onSelectCategory: (category: MuscleFilter) => void;
    galleryImages?: GalleryImage[];
}

const catData: { label: string; value: MuscleFilter; image: string; side: 'left' | 'right'; tag: string }[] = [
    { label: 'Mancuernas', value: 'Mancuernas', image: '/categories/mancuernas.png', side: 'left', tag: 'EQUIPAMIENTO' },
    { label: 'Discos', value: 'Discos', image: '/categories/discos.png', side: 'left', tag: 'EQUIPAMIENTO' },
    { label: 'Barras', value: 'Barras', image: '/categories/barras.png', side: 'left', tag: 'EQUIPAMIENTO' },
    { label: 'Bancos', value: 'Bancos', image: '/categories/bancos.png', side: 'right', tag: 'EQUIPAMIENTO' },
    { label: 'Cardio', value: 'Cardio', image: '/categories/cardio.png', side: 'right', tag: 'EQUIPAMIENTO' },
    { label: 'Funcional', value: 'Funcional', image: '/categories/funcional.png', side: 'right', tag: 'EQUIPAMIENTO' },
];

const QuickCategoryNav: React.FC<QuickCategoryNavProps> = ({ onSelectCategory, galleryImages = [] }) => {
    const [currentImg, setCurrentImg] = useState(0);

    const machineryImages = galleryImages.length > 0
        ? galleryImages
        : [{ imageUrl: '/categories/cardio.png' }];

    useEffect(() => {
        if (machineryImages.length <= 1) return;
        const interval = setInterval(() => {
            setCurrentImg((prev) => (prev + 1) % machineryImages.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [machineryImages]);

    const v = Date.now() + 4000;

    return (
        <section className="relative py-28 bg-white dark:bg-[#050505] overflow-hidden">
            {/* Soft Engineering Grid */}
            <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none"
                style={{
                    backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)',
                    backgroundSize: '80px 80px'
                }}
            />

            <div className="container mx-auto px-6 relative z-10 max-w-7xl">
                <div className="flex flex-col xl:flex-row items-center justify-between gap-16">

                    {/* LEFT SIDE - CLEAN ASSETS */}
                    <div className="flex flex-wrap lg:grid grid-cols-3 xl:grid-cols-1 gap-12 order-2 xl:order-1">
                        {catData.filter(c => c.side === 'left').map((cat, idx) => (
                            <motion.button
                                key={cat.label}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                whileHover={{ scale: 1.1, x: 10 }}
                                onClick={() => onSelectCategory(cat.value)}
                                className="group flex items-center gap-6"
                            >
                                <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-full bg-white border border-neutral-100 flex items-center justify-center overflow-hidden transition-all duration-500 group-hover:border-primary-500">
                                    <img
                                        src={`${cat.image}?v=${v}`}
                                        alt={cat.label}
                                        className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-700"
                                    />
                                </div>
                                <div className="text-left hidden xl:block">
                                    <p className="text-[10px] font-black text-primary-500 uppercase tracking-widest leading-none mb-1.5">{cat.tag}</p>
                                    <h4 className="text-xl font-black text-neutral-900 dark:text-white uppercase italic tracking-tighter leading-none group-hover:text-primary-600 transition-colors">
                                        {cat.label}
                                    </h4>
                                </div>
                            </motion.button>
                        ))}
                    </div>

                    {/* CENTRAL PORTAL - PERFECT FOCUS */}
                    <div className="relative order-1 xl:order-2">
                        {/* Thin Orbit Ring */}
                        <div className="absolute inset-0 -m-8 border border-neutral-100 dark:border-white/5 rounded-full pointer-events-none" />

                        <motion.button
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            whileHover={{ scale: 1.02 }}
                            onClick={() => onSelectCategory('Todos')}
                            className="group relative"
                        >
                            {/* PERFECT CIRCLE FRAME */}
                            <div className="relative w-80 h-80 sm:w-[500px] sm:h-[500px] md:w-[600px] md:h-[600px] rounded-full overflow-hidden bg-neutral-900 border-[15px] border-white dark:border-neutral-800 flex items-center justify-center transition-all duration-1000">

                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={currentImg}
                                        initial={{ opacity: 0, scale: 1.05 }}
                                        animate={{ opacity: 0.9, scale: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 1.5 }}
                                        className="absolute inset-0"
                                    >
                                        <img
                                            src={machineryImages[currentImg]?.imageUrl}
                                            alt="Equipamiento"
                                            className="w-full h-full object-cover"
                                        />
                                    </motion.div>
                                </AnimatePresence>

                                {/* Stronger Contrast Overlay for Text Readability - SOLID BLACK BASE */}
                                <div className="absolute inset-0 bg-neutral-900/40 z-10" />
                                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/90 z-10" />

                                <div className="relative z-20 flex flex-col items-center justify-center px-10 pt-12">
                                    <div className="text-center w-full">
                                        <p className="text-[11px] sm:text-[14px] font-black text-primary-400 uppercase tracking-[0.5em] mb-4">
                                            LÍNEA ÉLITE INDUSTRIAL
                                        </p>
                                        {/* TEXTO MAQUINARIA - REDUCED SIZE TO PREVENT CUTTING AND STRONGER SHADOW */}
                                        <h3 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white uppercase italic tracking-tighter leading-none [text-shadow:0_10px_30px_rgba(0,0,0,1),0_20px_60px_rgba(0,0,0,0.9)] px-4">
                                            Maquinaria
                                        </h3>

                                        <div className="inline-flex items-center gap-4 mt-16 bg-white/10 backdrop-blur-xl border border-white/20 px-12 py-5 rounded-full shadow-2xl hover:bg-white transition-all duration-500 hover:scale-105 active:scale-95 group/btn">
                                            <span className="text-[13px] font-black uppercase tracking-[0.3em] text-white group-hover/btn:text-neutral-900 transition-colors duration-500">
                                                EXPLORAR TODO
                                            </span>
                                            <ArrowUpRight size={20} strokeWidth={3} className="text-white group-hover/btn:text-neutral-900 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-all" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.button>
                    </div>

                    {/* RIGHT SIDE - CLEAN ASSETS */}
                    <div className="flex flex-wrap lg:grid grid-cols-3 xl:grid-cols-1 gap-12 order-3">
                        {catData.filter(c => c.side === 'right').map((cat, idx) => (
                            <motion.button
                                key={cat.label}
                                initial={{ opacity: 0, x: 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                whileHover={{ scale: 1.1, x: -10 }}
                                onClick={() => onSelectCategory(cat.value)}
                                className="group flex flex-row-reverse items-center gap-6"
                            >
                                <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-full bg-white border border-neutral-100 flex items-center justify-center overflow-hidden transition-all duration-500 group-hover:border-primary-500">
                                    <img
                                        src={`${cat.image}?v=${v}`}
                                        alt={cat.label}
                                        className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-700"
                                    />
                                </div>
                                <div className="text-right hidden xl:block">
                                    <p className="text-[10px] font-black text-primary-500 uppercase tracking-widest leading-none mb-1.5">{cat.tag}</p>
                                    <h4 className="text-xl font-black text-neutral-900 dark:text-white uppercase italic tracking-tighter leading-none group-hover:text-primary-600 transition-colors">
                                        {cat.label}
                                    </h4>
                                </div>
                            </motion.button>
                        ))}
                    </div>

                </div>
            </div>
        </section>
    );
};

export default QuickCategoryNav;
