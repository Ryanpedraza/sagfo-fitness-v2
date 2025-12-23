
import React from 'react';
import { Quote, Star } from 'lucide-react';
import ScrollReveal from './ScrollReveal';

const TestimonialsSection: React.FC = () => {
    const reviews = [
        {
            id: 1,
            name: "Andrés Rodriguez",
            role: "CrossFit Athlete",
            content: "La calidad de las mancuernas es impresionante. Se nota el acabado profesional y la durabilidad. 100% recomendados.",
            rating: 5,
            avatar: "AR"
        },
        {
            id: 2,
            name: "Gimnasio IronHouse",
            role: "Cliente Corporativo",
            content: "Equipamos todo nuestro gimnasio con SAGFO. La asesoría fue excelente y los equipos de cardio son de última generación.",
            rating: 5,
            avatar: "IH"
        },
        {
            id: 3,
            name: "Laura Martinez",
            role: "Entrenadora Personal",
            content: "Me encanta la estética de los equipos. No solo son funcionales, sino que hacen que mi estudio se vea increíble.",
            rating: 5,
            avatar: "LM"
        }
    ];

    return (
        <section className="py-32 md:py-48 bg-white dark:bg-[#0a0a0a] overflow-hidden relative">
            {/* Background Branding Elements */}
            <div className="absolute top-0 right-0 p-20 opacity-5 pointer-events-none hidden lg:block">
                <blockquote className="text-[15vw] font-black text-neutral-900 dark:text-white italic tracking-tighter uppercase leading-none">Trust</blockquote>
            </div>

            <div className="container mx-auto px-6 lg:px-12 relative z-10">
                <div className="flex flex-col items-center text-center mb-24 space-y-6">
                    <ScrollReveal direction="up">
                        <div className="flex items-center justify-center gap-4">
                            <div className="w-12 h-[2px] bg-primary-600 rounded-full" />
                            <span className="text-[11px] font-black uppercase tracking-[0.5em] text-primary-600 italic">Estatus & Prestigio</span>
                            <div className="w-12 h-[2px] bg-primary-600 rounded-full" />
                        </div>
                    </ScrollReveal>

                    <ScrollReveal direction="up" delay={0.2}>
                        <h2 className="text-6xl md:text-9xl font-black text-neutral-900 dark:text-white mb-6 tracking-tighter uppercase italic leading-[0.85]">
                            CONFIANZA <br /><span className="text-primary-600">PROFESIONAL</span>
                        </h2>
                    </ScrollReveal>

                    <ScrollReveal direction="up" delay={0.3}>
                        <div className="flex flex-col items-center gap-4">
                            <div className="flex text-amber-500 gap-1">
                                {[1, 2, 3, 4, 5].map((s) => <Star key={s} size={24} fill="currentColor" stroke="none" />)}
                            </div>
                            <span className="text-neutral-400 dark:text-neutral-500 font-bold tracking-[0.3em] text-[10px] uppercase italic">
                                4.9/5 Calificación Media por la Élite
                            </span>
                        </div>
                    </ScrollReveal>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-16">
                    {reviews.map((review, idx) => (
                        <ScrollReveal key={review.id} direction="up" delay={0.1 * idx} distance={50}>
                            <div className="group relative bg-neutral-50 dark:bg-white/[0.03] p-12 md:p-16 rounded-[4rem] md:rounded-[5rem] transition-all duration-1000 border border-neutral-100 dark:border-white/5 flex flex-col h-full hover:shadow-[0_40px_100px_-20px_rgba(0,0,0,0.1)] hover:-translate-y-4 hover:bg-white dark:hover:bg-black">

                                {/* Decorative Quote Icon */}
                                <div className="absolute top-12 right-12 text-primary-600/10 group-hover:text-primary-600/30 transition-colors">
                                    <Quote size={80} strokeWidth={2.5} />
                                </div>

                                <div className="flex gap-1 text-amber-500 mb-10">
                                    {[...Array(review.rating)].map((_, i) => <Star key={i} size={14} fill="currentColor" stroke="none" />)}
                                </div>

                                <p className="text-xl md:text-2xl font-bold text-neutral-800 dark:text-neutral-200 italic leading-relaxed mb-12 relative z-10">
                                    "{review.content}"
                                </p>

                                <div className="mt-auto flex items-center gap-6">
                                    <div className="w-16 h-16 rounded-[1.5rem] bg-neutral-900 dark:bg-white flex items-center justify-center text-white dark:text-neutral-900 font-black text-xl shadow-2xl transition-transform duration-700 group-hover:rotate-[15deg] group-hover:scale-110">
                                        {review.avatar}
                                    </div>
                                    <div className="space-y-1">
                                        <h4 className="font-black text-neutral-900 dark:text-white uppercase tracking-tighter italic text-xl leading-none">{review.name}</h4>
                                        <div className="flex items-center gap-2">
                                            <div className="w-4 h-[1px] bg-primary-600" />
                                            <span className="text-[10px] font-black text-primary-600 uppercase tracking-widest italic">{review.role}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </ScrollReveal>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TestimonialsSection;
