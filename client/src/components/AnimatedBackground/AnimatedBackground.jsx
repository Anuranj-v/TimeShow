import React, { useMemo } from 'react';
import './AnimatedBackground.css';

/**
 * AnimatedBackground
 * 
 * Minimal, elegant cinematic animated background for TimeShow.
 * Features:
 * - Pure CSS animations with GPU acceleration (transform3d)
 * - Dark black base (#07070a) with subtle deep-red ambient lighting
 * - Two soft glowing red orbs slowly drifting across the screen
 * - Subtle floating particles mimicking cinematic dust/light specks
 * - pointer-events: none and behind all interactive content
 * - Full support for prefers-reduced-motion
 */
const AnimatedBackground = () => {
    // Fixed deterministic set of floating particles to avoid re-renders and layout shifts
    const particles = useMemo(() => [
        { id: 1, left: '8%', top: '78%', size: 3, delay: '0s', duration: '18s', opacity: 0.5 },
        { id: 2, left: '22%', top: '88%', size: 2.5, delay: '3.5s', duration: '22s', opacity: 0.4 },
        { id: 3, left: '35%', top: '65%', size: 3.5, delay: '1.2s', duration: '19s', opacity: 0.55 },
        { id: 4, left: '48%', top: '82%', size: 2, delay: '5.2s', duration: '25s', opacity: 0.35 },
        { id: 5, left: '60%', top: '72%', size: 3, delay: '2.8s', duration: '21s', opacity: 0.45 },
        { id: 6, left: '74%', top: '86%', size: 2.5, delay: '4.6s', duration: '24s', opacity: 0.4 },
        { id: 7, left: '88%', top: '68%', size: 3.5, delay: '6.4s', duration: '20s', opacity: 0.5 },
        { id: 8, left: '16%', top: '42%', size: 2.5, delay: '7.8s', duration: '23s', opacity: 0.35 },
        { id: 9, left: '30%', top: '35%', size: 3, delay: '9.2s', duration: '26s', opacity: 0.45 },
        { id: 10, left: '68%', top: '40%', size: 2.5, delay: '10.5s', duration: '22s', opacity: 0.4 },
        { id: 11, left: '52%', top: '92%', size: 3, delay: '1.8s', duration: '17s', opacity: 0.55 },
        { id: 12, left: '84%', top: '32%', size: 2, delay: '8.1s', duration: '24s', opacity: 0.35 },
        { id: 13, left: '44%', top: '24%', size: 2.5, delay: '11.2s', duration: '21s', opacity: 0.4 },
        { id: 14, left: '92%', top: '52%', size: 3, delay: '4.0s', duration: '23s', opacity: 0.45 },
        { id: 15, left: '6%', top: '28%', size: 2, delay: '12.4s', duration: '27s', opacity: 0.35 },
        { id: 16, left: '78%', top: '16%', size: 2.5, delay: '6.0s', duration: '25s', opacity: 0.4 },
    ], []);

    return (
        <div className="cinematic-bg-container" aria-hidden="true">
            {/* Deep dark cinematic base with subtle deep-red gradient */}
            <div className="cinematic-gradient-base" />

            {/* Subtle vignette for theatrical depth */}
            <div className="cinematic-vignette" />

            {/* Soft glowing light orb 1 (top-left slow drift) */}
            <div className="cinematic-orb cinematic-orb-1" />

            {/* Soft glowing light orb 2 (bottom-right slow drift) */}
            <div className="cinematic-orb cinematic-orb-2" />

            {/* Tiny floating red cinematic dust particles */}
            <div className="cinematic-particles-layer">
                {particles.map((p) => (
                    <span
                        key={p.id}
                        className="cinematic-particle"
                        style={{
                            left: p.left,
                            top: p.top,
                            width: `${p.size}px`,
                            height: `${p.size}px`,
                            animationDelay: p.delay,
                            animationDuration: p.duration,
                            '--base-opacity': p.opacity,
                        }}
                    />
                ))}
            </div>
        </div>
    );
};

export default AnimatedBackground;
