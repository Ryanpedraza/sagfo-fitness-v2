
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
        <section className="relative py-24 md:py-40 overflow-hidden">
            {/* Soft Engineering Grid Overlay */}
            <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.07] pointer-events-none"
                style={{
                    backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)',
                    backgroundSize: '80px 80px'
                }}
            />

            <div className="container mx-auto px-6 relative z-10 max-w-[1600px]">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 md:mb-24">
                    <div className="space-y-6">
                        <motion.span
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            className="text-[10px] font-black text-primary-500 uppercase tracking-[0.6em] italic block"
                        >
                            Ingeniería Deportiva de Grado Superior
                        </motion.span>
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            className="text-5xl md:text-8xl font-black text-neutral-900 dark:text-white uppercase italic tracking-tighter leading-[0.85]"
                        >
                            Selección <br /> <span className="text-primary-600">Premium</span>
                        </motion.h2>
                    </div>
                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        className="max-w-md text-neutral-500 dark:text-neutral-400 font-medium text-lg italic leading-relaxed text-right"
                    >
                        Configuramos ecosistemas de alto rendimiento con los más altos estándares de precisión biomecánica.
                    </motion.p>
                </div>

                {/* BENTO GRID ARCHITECTURE */}
                <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-12 gap-8 auto-rows-[320px] md:auto-rows-[400px]">

                    {/* PRIMARY BENTO: MAQUINARIA (Large Feature) */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        className="md:col-span-4 lg:col-span-6 lg:row-span-2 relative group cursor-pointer rounded-[4rem] overflow-hidden bg-neutral-900 border border-neutral-200 dark:border-white/10 shadow-2xl"
                        onClick={() => onSelectCategory('Todos')}
                    >
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentImg}
                                initial={{ opacity: 0, scale: 1.1 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 1.5, ease: "circOut" }}
                                className="absolute inset-0"
                            >
                                <img
                                    src={machineryImages[currentImg]?.imageUrl}
                                    alt="Elite Machinery"
                                    className="w-full h-full object-contain p-12 bg-neutral-100 group-hover:scale-105 transition-transform duration-[3s]"
                                />
                            </motion.div>
                        </AnimatePresence>
                        {/* More subtle bottom gradient to avoid covering the machine */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10" />

                        <div className="absolute inset-x-0 bottom-0 p-12 z-20">
                            <span className="text-[10px] font-black text-primary-400 uppercase tracking-[0.4em] mb-4 block">Serie Profesional S</span>
                            <h3 className="text-4xl sm:text-6xl font-black text-white uppercase italic tracking-tighter leading-none mb-10">Maquinaria <br /> Industrial</h3>
                            <div className="inline-flex items-center gap-4 bg-white text-black px-10 py-5 rounded-3xl font-black uppercase text-xs tracking-widest hover:bg-primary-500 hover:text-white transition-all transform group-hover:translate-x-2">
                                Ver Catálogo Completo <ArrowUpRight size={20} strokeWidth={3} />
                            </div>
                        </div>
                    </motion.div>

                    {/* BENTO: CARDIO (Long Rectangle) */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        className="md:col-span-2 lg:col-span-6 lg:row-span-1 bg-neutral-50 dark:bg-white/[0.03] rounded-[4rem] p-16 border border-neutral-100 dark:border-white/5 flex items-center justify-between group cursor-pointer hover:bg-white dark:hover:bg-white/[0.05] transition-all"
                        onClick={() => onSelectCategory('Cardio')}
                    >
                        <div className="space-y-6">
                            <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest italic">Aeróbico Elite</span>
                            <h3 className="text-5xl font-black text-neutral-900 dark:text-white uppercase italic tracking-tighter">Cardio</h3>
                            <p className="text-sm text-neutral-500 font-medium">Resistencia sin límites.</p>
                        </div>
                        <div className="w-64 h-64 relative bg-white dark:bg-zinc-900 rounded-[3rem] p-8 shadow-sm">
                            <img src="/categories/cardio.png" className="w-full h-full object-contain group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-700" alt="" />
                        </div>
                    </motion.div>

                    {/* BENTO: MANCUERNAS (Square) */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="md:col-span-2 lg:col-span-3 lg:row-span-1 bg-neutral-50 dark:bg-white/[0.03] rounded-[4rem] p-10 border border-neutral-100 dark:border-white/5 group cursor-pointer relative overflow-hidden flex flex-col justify-between hover:bg-white dark:hover:bg-white/[0.05] transition-all"
                        onClick={() => onSelectCategory('Mancuernas')}
                    >
                        <div className="relative z-10">
                            <span className="text-[10px] font-black text-primary-500 uppercase tracking-widest italic mb-2 block">Acero Forjado</span>
                            <h3 className="text-3xl font-black text-neutral-900 dark:text-white uppercase italic tracking-tighter">Mancuernas</h3>
                        </div>
                        <div className="h-40 w-full relative">
                            <img src="/categories/mancuernas.png" className="w-full h-full object-contain group-hover:scale-110 group-hover:rotate-12 transition-transform duration-700 filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.3)]" alt="" />
                        </div>
                    </motion.div>

                    {/* BENTO: DISCOS (Square) - REMOVED SOLID BLUE */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        className="md:col-span-2 lg:col-span-3 lg:row-span-1 bg-neutral-900 rounded-[4rem] p-10 border border-neutral-100 dark:border-white/5 group cursor-pointer relative overflow-hidden flex flex-col justify-between hover:shadow-[0_0_50px_rgba(14,165,233,0.15)] transition-all"
                        onClick={() => onSelectCategory('Discos')}
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-primary-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="relative z-10">
                            <span className="text-[10px] font-black text-primary-400 uppercase tracking-widest italic mb-2 block">Hierro Fundido</span>
                            <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter">Pesos <br /> Libres</h3>
                        </div>
                        <div className="h-40 w-full relative flex items-center justify-center">
                            <img src="/categories/discos.png" className="w-full h-full object-contain group-hover:rotate-45 group-hover:scale-110 transition-transform duration-[1.5s]" alt="" />
                        </div>
                    </motion.div>

                    {/* BENTO: FUNCIONAL (Square) */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        className="md:col-span-2 lg:col-span-3 lg:row-span-1 bg-neutral-50 dark:bg-white/[0.03] rounded-[4rem] p-12 border border-neutral-100 dark:border-white/5 group cursor-pointer hover:bg-white dark:hover:bg-white/[0.05] transition-all flex flex-col"
                        onClick={() => onSelectCategory('Funcional')}
                    >
                        <div className="mb-6">
                            <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest italic mb-1 block">Cross Training</span>
                            <h3 className="text-3xl font-black text-neutral-900 dark:text-white uppercase italic tracking-tighter">Funcional</h3>
                        </div>
                        <div className="flex-grow flex items-center justify-center p-4">
                            <img src="/categories/funcional.png" className="w-full h-full object-contain group-hover:scale-110 group-hover:-rotate-[25deg] transition-transform duration-700" alt="" />
                        </div>
                    </motion.div>

                    {/* BENTO: BANCOS (Square) */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="md:col-span-2 lg:col-span-3 lg:row-span-1 bg-neutral-50 dark:bg-white/[0.03] rounded-[4rem] p-12 border border-neutral-100 dark:border-white/5 group cursor-pointer hover:bg-white dark:hover:bg-white/[0.05] relative overflow-hidden flex flex-col transition-all"
                        onClick={() => onSelectCategory('Bancos')}
                    >
                        <div className="mb-6">
                            <span className="text-[10px] font-black text-primary-500 uppercase tracking-widest italic mb-1 block">Soporte Anatómico</span>
                            <h3 className="text-3xl font-black text-neutral-900 dark:text-white uppercase italic tracking-tighter">Bancos</h3>
                        </div>
                        <div className="flex-grow flex items-center justify-center p-4">
                            <img src="/categories/bancos.png" className="w-full h-full object-contain group-hover:translate-x-4 group-hover:-rotate-[15deg] group-hover:scale-110 transition-transform duration-700" alt="" />
                        </div>
                    </motion.div>

                </div>
            </div>
        </section>
    );
};

export default QuickCategoryNav;
