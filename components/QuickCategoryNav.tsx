
import React from 'react';
import { Dumbbell, Activity, Disc, Combine, Package, Trophy, Zap, Shield, Target, Compass, ChevronRight } from 'lucide-react';
import { MuscleFilter } from '../types';
import ScrollReveal from './ScrollReveal';

interface QuickCategoryNavProps {
    onSelectCategory: (category: MuscleFilter) => void;
}

const quickCats: { label: string; value: MuscleFilter; icon: any; color: string; desc: string }[] = [
    {
        label: 'Mancuernas',
        value: 'Mancuernas',
        icon: Dumbbell,
        color: 'from-orange-500 to-red-600',
        desc: 'Carga Pro'
    },
    {
        label: 'Cardio',
        value: 'Cardio',
        icon: Activity,
        color: 'from-blue-500 to-indigo-600',
        desc: 'Alto Flujo'
    },
    {
        label: 'Discos',
        value: 'Discos',
        icon: Disc,
        color: 'from-zinc-500 to-zinc-900',
        desc: 'Sólido Elite'
    },
    {
        label: 'Barras',
        value: 'Barras',
        icon: Combine,
        color: 'from-emerald-500 to-teal-600',
        desc: 'Acero Puro'
    },
    {
        label: 'Bancos',
        value: 'Bancos',
        icon: Trophy,
        color: 'from-amber-400 to-orange-600',
        desc: 'Estabilidad'
    },
    {
        label: 'Funcional',
        value: 'Funcional',
        icon: Package,
        color: 'from-purple-500 to-pink-600',
        desc: 'Versatilidad'
    },
];

const QuickCategoryNav: React.FC<QuickCategoryNavProps> = ({ onSelectCategory }) => {
    return (
        <section className="relative py-32 md:py-48 overflow-hidden bg-white dark:bg-[#0a0a0a]">
            {/* Background Decorative Gradient */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary-600/5 blur-[120px] rounded-full pointer-events-none" />

            <div className="container mx-auto px-6 lg:px-12 relative z-10">
                <div className="flex flex-col items-center mb-32 space-y-8">
                    <ScrollReveal direction="up">
                        <div className="flex items-center gap-6">
                            <div className="w-12 h-[2px] bg-primary-600 rounded-full" />
                            <div className="p-3 bg-neutral-100 dark:bg-white/5 rounded-2xl">
                                <Compass className="w-6 h-6 text-primary-600" />
                            </div>
                            <div className="w-12 h-[2px] bg-primary-600 rounded-full" />
                        </div>
                    </ScrollReveal>

                    <ScrollReveal direction="up" delay={0.2}>
                        <h2 className="text-6xl md:text-9xl font-black text-center text-neutral-900 dark:text-white uppercase italic tracking-tighter leading-[0.85] flex flex-col">
                            <span>SAGA</span>
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-primary-400">ESPECIALIDADES</span>
                        </h2>
                    </ScrollReveal>

                    <ScrollReveal direction="up" delay={0.3}>
                        <p className="text-neutral-400 font-bold italic text-xl max-w-2xl text-center uppercase tracking-widest opacity-60">
                            Ingeniería diseñada para el dominio absoluto del gimnasio.
                        </p>
                    </ScrollReveal>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
                    {quickCats.map((cat, index) => (
                        <ScrollReveal key={cat.label} direction="up" delay={index * 0.1}>
                            <button
                                onClick={() => onSelectCategory(cat.value)}
                                className="group relative flex items-center p-10 rounded-[3rem] bg-neutral-50 dark:bg-white/[0.03] border border-neutral-100 dark:border-white/5 transition-all duration-1000 hover:shadow-[0_40px_100px_-30px_rgba(0,0,0,0.1)] hover:-translate-y-4 hover:bg-white dark:hover:bg-black w-full text-left"
                            >
                                {/* Icon Container with Dynamic Color */}
                                <div className="relative w-24 h-24 rounded-3xl bg-white dark:bg-white/5 flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-700 mr-8 flex-shrink-0">
                                    <cat.icon
                                        size={40}
                                        strokeWidth={1.5}
                                        className="text-neutral-900 dark:text-neutral-200 group-hover:text-primary-600 transition-colors"
                                    />
                                    {/* Corner Accent */}
                                    <div className={`absolute -top-1 -right-1 w-4 h-4 rounded-full bg-gradient-to-br ${cat.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500 shadow-lg`} />
                                </div>

                                <div className="space-y-1">
                                    <span className="block text-3xl font-black text-neutral-900 dark:text-white uppercase italic tracking-tighter leading-none group-hover:text-primary-600 transition-colors">
                                        {cat.label}
                                    </span>
                                    <span className="block text-[11px] font-black text-primary-600 uppercase tracking-[0.3em] italic">
                                        {cat.desc}
                                    </span>
                                </div>

                                {/* Link Arrow - Ultra clean */}
                                <div className="ml-auto opacity-0 group-hover:opacity-100 transition-all duration-700 translate-x-4 group-hover:translate-x-0">
                                    <div className="w-10 h-10 rounded-full border border-primary-500/30 text-primary-600 flex items-center justify-center">
                                        <ChevronRight size={18} strokeWidth={3} />
                                    </div>
                                </div>
                            </button>
                        </ScrollReveal>
                    ))}
                </div>

                {/* Bottom Elite Pillars */}
                <div className="mt-40 flex flex-wrap justify-center gap-12 md:gap-24">
                    {[
                        { icon: Shield, text: "Garantía Blindada" },
                        { icon: Zap, text: "Logística Relámpago" },
                        { icon: Target, text: "Precisión Mecánica" }
                    ].map((item, i) => (
                        <div key={i} className="flex items-center gap-4 group cursor-default">
                            <div className="w-12 h-12 rounded-2xl bg-neutral-100 dark:bg-white/5 flex items-center justify-center text-neutral-400 group-hover:text-primary-600 transition-all duration-500 group-hover:scale-110 group-hover:bg-white dark:group-hover:bg-black group-hover:shadow-2xl">
                                <item.icon size={22} strokeWidth={2.5} />
                            </div>
                            <span className="text-[11px] font-black uppercase tracking-[0.4em] italic text-neutral-400 dark:text-neutral-500 group-hover:text-neutral-900 dark:group-hover:text-white transition-colors">
                                {item.text}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default QuickCategoryNav;
