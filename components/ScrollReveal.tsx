import React, { useEffect, useRef, useState } from 'react';

interface ScrollRevealProps {
    children: React.ReactNode;
    delay?: number; // Retraso en segundos (0.1, 0.2, etc.)
    direction?: 'up' | 'down' | 'left' | 'right' | 'none'; // Dirección de entrada
    distance?: number; // Distancia de desplazamiento en px
    duration?: number; // Duración en segundos
    className?: string; // Clases adicionales
    threshold?: number; // Cuánto del elemento debe verse para activar (0 a 1)
}

const ScrollReveal: React.FC<ScrollRevealProps> = ({
    children,
    delay = 0,
    direction = 'up',
    distance = 30,
    duration = 0.6,
    className = '',
    threshold = 0.1
}) => {
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    // Una vez visible, dejamos de observar para ahorrar recursos
                    if (ref.current) observer.unobserve(ref.current);
                }
            },
            {
                threshold,
                rootMargin: '0px 0px -50px 0px' // Activa un poco antes de que entre del todo
            }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => {
            if (ref.current) observer.unobserve(ref.current);
        };
    }, [threshold]);

    // Calcular transformación inicial según la dirección
    const getInitialTransform = () => {
        switch (direction) {
            case 'up': return `translateY(${distance}px)`;
            case 'down': return `translateY(-${distance}px)`;
            case 'left': return `translateX(${distance}px)`;
            case 'right': return `translateX(-${distance}px)`;
            default: return 'none';
        }
    };

    const style: React.CSSProperties = {
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'none' : getInitialTransform(),
        transition: `opacity ${duration}s cubic-bezier(0.2, 0.8, 0.2, 1), transform ${duration}s cubic-bezier(0.2, 0.8, 0.2, 1)`,
        transitionDelay: `${delay}s`,
        willChange: 'opacity, transform',
    };

    return (
        <div ref={ref} style={style} className={className}>
            {children}
        </div>
    );
};

export default ScrollReveal;
