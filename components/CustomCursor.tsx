
import React, { useEffect, useRef, useState } from 'react';

const CustomCursor: React.FC = () => {
    const cursorRef = useRef<HTMLDivElement>(null);
    const [isHovering, setIsHovering] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
        const cursor = cursorRef.current;
        if (!cursor) return;

        let mouseX = -100;
        let mouseY = -100;
        let frameId: number;

        const moveCursor = (e: MouseEvent) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            if (!isVisible) setIsVisible(true);
        };

        const updateCursor = () => {
            if (cursor) {
                cursor.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
            }
            frameId = requestAnimationFrame(updateCursor);
        };

        const handleMouseEnter = () => setIsVisible(true);
        const handleMouseLeave = () => setIsVisible(false);
        const handleMouseDown = () => setIsActive(true);
        const handleMouseUp = () => setIsActive(false);

        const handleHoverStart = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (target && target.closest('button, a, input, select, textarea, [role="button"], .group, [onclick]')) {
                setIsHovering(true);
            }
        };

        const handleHoverEnd = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (target && target.closest('button, a, input, select, textarea, [role="button"], .group, [onclick]')) {
                setIsHovering(false);
            }
        };

        window.addEventListener('mousemove', moveCursor, { passive: true });
        document.addEventListener('mouseenter', handleMouseEnter);
        document.addEventListener('mouseleave', handleMouseLeave);
        document.addEventListener('mousedown', handleMouseDown);
        document.addEventListener('mouseup', handleMouseUp);
        document.addEventListener('mouseover', handleHoverStart);
        document.addEventListener('mouseout', handleHoverEnd);

        frameId = requestAnimationFrame(updateCursor);

        return () => {
            window.removeEventListener('mousemove', moveCursor);
            document.removeEventListener('mouseenter', handleMouseEnter);
            document.removeEventListener('mouseleave', handleMouseLeave);
            document.removeEventListener('mousedown', handleMouseDown);
            document.removeEventListener('mouseup', handleMouseUp);
            document.removeEventListener('mouseover', handleHoverStart);
            document.removeEventListener('mouseout', handleHoverEnd);
            cancelAnimationFrame(frameId);
        };
    }, [isVisible]);

    return (
        <div
            className={`fixed inset-0 pointer-events-none z-[999999] hidden md:block transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
        >
            <div
                ref={cursorRef}
                className="absolute top-0 left-0 will-change-transform"
                style={{
                    transform: 'translate3d(-100px, -100px, 0)',
                }}
            >
                <div className={`relative flex items-center justify-center transition-transform duration-75 ${isActive ? 'scale-75' : 'scale-100'}`}>
                    {/* Outer Frame (Diamond) */}
                    <div className={`
                        absolute w-5 h-5 border-[3px] transition-all duration-200 ease-out border-primary-500
                        ${isHovering
                            ? 'scale-125 rotate-[135deg] opacity-100 shadow-[0_0_15px_rgba(14,165,233,0.5)]'
                            : 'opacity-70 rotate-45 shadow-[0_0_10px_rgba(14,165,233,0.4)]'}
                    `} />

                    {/* Inner Core */}
                    <div className={`
                        w-2 h-2 bg-primary-500 transition-all duration-150 ease-out
                        ${isHovering
                            ? 'scale-0'
                            : 'scale-100 rotate-45'}
                    `} />

                    {/* Crosshair */}
                    <div className={`
                        absolute transition-all duration-300
                        ${isHovering ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}
                    `}>
                        <div className="absolute w-[2px] h-3 bg-primary-500 -top-5 left-0" />
                        <div className="absolute w-[2px] h-3 bg-primary-500 top-2 left-0" />
                        <div className="absolute h-[2px] w-3 bg-primary-500 -left-5 top-0" />
                        <div className="absolute h-[2px] w-3 bg-primary-500 left-2 top-0" />
                    </div>
                </div>
            </div>

            <style>{`
                @media (min-width: 768px) {
                    html, body, *, button, a {
                        cursor: none !important;
                    }
                }
            `}</style>
        </div>
    );
};

export default CustomCursor;
