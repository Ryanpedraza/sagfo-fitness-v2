import React, { useEffect, useState } from 'react';

interface IntroAnimationProps {
    onComplete: () => void;
    onStartExit?: () => void;
}

const IntroAnimation: React.FC<IntroAnimationProps> = ({ onComplete, onStartExit }) => {
    const [progress, setProgress] = useState(0);
    const [isExiting, setIsExiting] = useState(false);
    const [time, setTime] = useState('');

    // --- Clock Logic (Manteniendo lo que funcionaba bien) ---
    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            return now.toLocaleTimeString('es-CO', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
        };
        setTime(updateTime());
        const timer = setInterval(() => setTime(updateTime()), 1000);
        return () => clearInterval(timer);
    }, []);

    // --- Animation Sequence ---
    useEffect(() => {
        const duration = 800; // Ultra-rápido: 0.8s
        const steps = 30;
        const intervalTime = duration / steps;

        const loader = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(loader);
                    return 100;
                }
                const remaining = 100 - prev;
                return prev + (remaining * 0.25) + 2;
            });
        }, intervalTime);

        const exitTimer = setTimeout(() => {
            setIsExiting(true);
            if (onStartExit) onStartExit();
        }, 1000);

        const completeTimer = setTimeout(onComplete, 1600);

        return () => {
            clearInterval(loader);
            clearTimeout(exitTimer);
            clearTimeout(completeTimer);
        };
    }, [onComplete, onStartExit]);

    return (
        <div className={`fixed inset-0 z-[9999] bg-[#050505] text-white flex flex-col justify-between p-6 md:p-12 transition-all duration-800 ease-[cubic-bezier(0.76,0,0.24,1)] ${isExiting ? 'translate-y-[-100%]' : 'translate-y-0 opacity-100'
            }`}>
            {/* Grid Background */}
            <div className="absolute inset-0 z-0 pointer-events-none opacity-20">
                <div
                    className="w-full h-full"
                    style={{
                        backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)`,
                        backgroundSize: '100px 100px',
                        maskImage: 'radial-gradient(circle at center, black 40%, transparent 100%)'
                    }}
                />
            </div>

            {/* Header Info */}
            <div className={`relative z-10 flex justify-between items-start text-[10px] md:text-xs font-mono font-medium tracking-[0.2em] uppercase transition-all duration-500 delay-100 ${isExiting ? 'opacity-0 -translate-y-4' : 'opacity-100'}`}>
                <div className="flex flex-col gap-1">
                    <span className="text-neutral-500 font-bold">Origen</span>
                    <span className="text-white">BOGOTÁ, D.C.</span>
                </div>
                <div className="flex flex-col gap-1 text-right">
                    <span className="text-neutral-500 font-bold">Sistema Local</span>
                    <span className="tabular-nums text-primary-400">{time}</span>
                </div>
            </div>

            {/* --- CORE BRANDING (Volviendo a lo sólido pero limpio) --- */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10">
                <div className="overflow-hidden relative flex flex-col items-center">
                    {/* Texto masivo, sin efectos de scan confusos, solo poder puro */}
                    <h1 className={`text-[9vw] leading-[0.8] font-black tracking-tighter text-white transition-transform duration-[1s] ease-out ${progress > 5 ? 'translate-y-0 opacity-100' : 'translate-y-[110%] opacity-0'
                        }`}>
                        SAGFOFITNESS
                    </h1>

                    {/* Etiqueta de categoría limpia */}
                    <div className={`mt-4 overflow-hidden transition-all duration-700 delay-300 ${progress > 20 ? 'opacity-100' : 'opacity-0'}`}>
                        <span className="inline-block px-3 py-1 border border-white/20 rounded-full text-[10px] md:text-xs uppercase tracking-[0.3em] font-medium text-neutral-400 backdrop-blur-md">
                            Catálogo de Fitness
                        </span>
                    </div>
                </div>
            </div>

            {/* Center Line Animation */}
            <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-white/5 -translate-y-1/2 scale-x-0 animate-[grow-x_0.8s_ease-out_forwards_0.2s]" />

            {/* Footer Loader */}
            <div className={`relative z-10 flex justify-between items-end text-[10px] md:text-xs font-mono tracking-widest uppercase transition-all duration-500 delay-100 ${isExiting ? 'opacity-0 translate-y-4' : 'opacity-100'}`}>
                <div className="flex flex-col gap-2">
                    <span className="text-neutral-600 animate-pulse uppercase tracking-[0.2em]">Inicializando Catálogo...</span>
                    <div className="w-32 md:w-48 h-[1px] bg-neutral-900 overflow-hidden relative">
                        <div
                            className="absolute inset-0 bg-white transition-transform duration-100 ease-linear"
                            style={{ transform: `translateX(${progress - 100}%)` }}
                        />
                    </div>
                </div>

                <div className="flex items-baseline gap-1">
                    <span className="text-5xl md:text-7xl font-light tabular-nums leading-none tracking-tighter">
                        {Math.floor(progress).toString().padStart(2, '0')}
                    </span>
                    <span className="text-sm md:text-xl text-neutral-500 font-bold">%</span>
                </div>
            </div>

            <style>{`
                @keyframes grow-x {
                    to { transform: scaleX(1); }
                }
            `}</style>
        </div >
    );
};

export default IntroAnimation;
