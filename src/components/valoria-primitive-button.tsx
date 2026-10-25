'use client';

import React, { useState, useRef, useId } from 'react';
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  AnimatePresence,
  MotionValue,
} from 'motion/react';
import { Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

// ============================================================================
// EXACT ANIMATE-UI DELTA GLYPH PATH (viewBox: 0 0 840.21 783.54)
// ============================================================================
export const DELTA_SVG_VIEWBOX = '0 0 840.21 783.54';
export const DELTA_SVG_PATH =
  'M612.79 783.54H227.43c-41.6 0-82.15-11.19-117.26-32.37-32.96-19.88-60.58-48.18-79.88-81.85C10.99 635.66.52 597.52.02 559.03c-.54-41 10.29-81.64 31.32-117.54l192.67-329.07c20.81-35.55 50.62-64.69 86.19-84.28C343.64 9.73 381.64 0 420.11 0s76.47 9.73 109.9 28.14c35.57 19.59 65.38 48.73 86.19 84.28l192.68 329.07c21.02 35.9 31.85 76.55 31.31 117.54-.5 38.49-10.97 76.62-30.27 110.29s-46.92 61.97-79.88 81.85c-35.11 21.18-75.65 32.37-117.26 32.37ZM396.6 213.47 203.92 542.54c-6.59 11.26-3.71 21.06-.13 27.31s10.59 13.69 23.63 13.69h385.36c13.04 0 20.05-7.45 23.63-13.69 3.58-6.25 6.46-16.05-.12-27.31L443.61 213.47c-6.52-11.14-16.38-13.47-23.5-13.47s-16.98 2.34-23.5 13.47Z';

// ============================================================================
// VALORIA PRIMITIVE DELTA BUTTON (Standalone 3D Metallic Emblem with Chromatic Glow)
// ============================================================================
interface ValoriaPrimitiveButtonProps {
  className?: string;
  width?: number; // default 256
  height?: number; // default 240
  interactive?: boolean;
  onClick?: () => void;
  // External MotionValues when driven by scroll choreography
  scale?: MotionValue<number> | number;
  opacity?: MotionValue<number> | number;
  rotate?: MotionValue<number> | number;
  rotateX?: MotionValue<number> | number;
}

export function ValoriaPrimitiveButton({
  className,
  width = 256,
  height = 240,
  interactive = true,
  onClick,
  scale,
  opacity,
  rotate,
  rotateX,
}: ValoriaPrimitiveButtonProps) {
  const uniqueId = useId().replace(/:/g, '-');
  const clipId = `delta-clip-${uniqueId}`;
  const metallicGradId = `delta-metallic-${uniqueId}`;
  const chromaticGradId = `delta-chromatic-${uniqueId}`;

  const containerRef = useRef<HTMLDivElement>(null);
  const [clickCount, setClickCount] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);

  // 3D Magnetic cursor micro-tilt physics
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 20, stiffness: 220 };
  const tiltX = useSpring(useTransform(mouseY, [-0.5, 0.5], [14, -14]), springConfig);
  const tiltY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-14, 14]), springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!interactive || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!interactive) return;
    setClickCount((c) => c + 1);

    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const rx = e.clientX - rect.left;
      const ry = e.clientY - rect.top;
      const id = Date.now();
      setRipples((prev) => [...prev.slice(-3), { id, x: rx, y: ry }]);
      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== id));
      }, 900);
    }

    if (onClick) onClick();
  };

  // Base motion style props (supports scroll-driven values)
  const motionStyle: Record<string, unknown> = {};
  if (scale !== undefined) motionStyle.scale = scale;
  if (opacity !== undefined) motionStyle.opacity = opacity;
  if (rotate !== undefined) motionStyle.rotate = rotate;
  if (rotateX !== undefined) motionStyle.rotateX = rotateX;

  return (
    <motion.div
      style={motionStyle}
      className={cn('relative flex items-center justify-center select-none', className)}
    >
      {/* Dynamic Colored Ambient Aura Glow behind the Delta */}
      <motion.div
        aria-hidden="true"
        animate={{
          scale: isHovered ? [1, 1.15, 1.05] : [1, 1.08, 1],
          opacity: isHovered ? 0.75 : 0.45,
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        style={{
          width: width * 1.6,
          height: height * 1.6,
        }}
        className="pointer-events-none absolute -z-10 rounded-full blur-3xl bg-gradient-to-tr from-violet-600/30 via-cyan-500/25 to-pink-500/20"
      />

      {/* 3D Interactive Emblem Button Chassis */}
      <motion.div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        style={{
          width,
          height,
          rotateX: interactive ? tiltX : 0,
          rotateY: interactive ? tiltY : 0,
          transformStyle: 'preserve-3d',
        }}
        whileHover={interactive ? { scale: 1.05 } : undefined}
        whileTap={interactive ? { scale: 0.94 } : undefined}
        transition={{ type: 'spring', stiffness: 360, damping: 22 }}
        role={interactive ? 'button' : undefined}
        tabIndex={interactive ? 0 : undefined}
        aria-label="Animate UI Delta Primitive"
        className={cn(
          'group relative flex items-center justify-center cursor-pointer',
          // High-depth 3D shadow matching sample video: drop-shadow-[0_30px_60px_rgb(0_0_0/0.3)]
          'drop-shadow-[0_24px_48px_rgba(0,0,0,0.65)] hover:drop-shadow-[0_32px_64px_rgba(0,0,0,0.85)]',
          'transition-[filter] duration-300'
        )}
      >
        {/* SVG Rendered Standalone Delta Emblem with Colored Shimmer Animation */}
        <svg
          viewBox={DELTA_SVG_VIEWBOX}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full overflow-visible"
        >
          <defs>
            {/* Exact Delta Outline Clip */}
            <clipPath id={clipId}>
              <path d={DELTA_SVG_PATH} />
            </clipPath>

            {/* Base Sculpted Metallic Liquid Titanium Gradient */}
            <linearGradient id={metallicGradId} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity={1} />
              <stop offset="28%" stopColor="#f1f5f9" stopOpacity={1} />
              <stop offset="65%" stopColor="#cbd5e1" stopOpacity={0.96} />
              <stop offset="100%" stopColor="#94a3b8" stopOpacity={0.92} />
            </linearGradient>

            {/* Continuous Sweeping Chromatic/Colored Iridescent Animation Gradient */}
            <linearGradient id={chromaticGradId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ec4899" stopOpacity={0.7}>
                <animate
                  attributeName="stop-color"
                  values="#ec4899;#a855f7;#3b82f6;#06b6d4;#10b981;#f59e0b;#ec4899"
                  dur="8s"
                  repeatCount="indefinite"
                />
              </stop>
              <stop offset="25%" stopColor="#a855f7" stopOpacity={0.65}>
                <animate
                  attributeName="stop-color"
                  values="#a855f7;#3b82f6;#06b6d4;#10b981;#f59e0b;#ec4899;#a855f7"
                  dur="8s"
                  repeatCount="indefinite"
                />
              </stop>
              <stop offset="50%" stopColor="#06b6d4" stopOpacity={0.6}>
                <animate
                  attributeName="stop-color"
                  values="#06b6d4;#10b981;#f59e0b;#ec4899;#a855f7;#3b82f6;#06b6d4"
                  dur="8s"
                  repeatCount="indefinite"
                />
              </stop>
              <stop offset="75%" stopColor="#3b82f6" stopOpacity={0.65}>
                <animate
                  attributeName="stop-color"
                  values="#3b82f6;#06b6d4;#10b981;#f59e0b;#ec4899;#a855f7;#3b82f6"
                  dur="8s"
                  repeatCount="indefinite"
                />
              </stop>
              <stop offset="100%" stopColor="#ec4899" stopOpacity={0.7}>
                <animate
                  attributeName="stop-color"
                  values="#ec4899;#a855f7;#3b82f6;#06b6d4;#10b981;#f59e0b;#ec4899"
                  dur="8s"
                  repeatCount="indefinite"
                />
              </stop>
            </linearGradient>
          </defs>

          {/* Layer 1: Base Metallic Sculpted Body */}
          <path
            d={DELTA_SVG_PATH}
            fill={`url(#${metallicGradId})`}
            className="transition-colors duration-300"
          />

          {/* Layer 2: Clipped Animated Chromatic Overlay */}
          <g clipPath={`url(#${clipId})`}>
            {/* Animated Iridescent Fluid Sweep */}
            <motion.rect
              x="-50%"
              y="-50%"
              width="200%"
              height="200%"
              fill={`url(#${chromaticGradId})`}
              className="mix-blend-overlay opacity-80 group-hover:opacity-100 transition-opacity duration-300"
              animate={{
                rotate: [0, 360],
              }}
              transition={{
                duration: 16,
                repeat: Infinity,
                ease: 'linear',
              }}
              style={{
                transformOrigin: '420px 391px',
              }}
            />

            {/* Top Specular Glare Arc */}
            <path
              d="M 200 150 Q 420 50 640 150 L 600 250 Q 420 180 240 250 Z"
              fill="white"
              fillOpacity={0.28}
              className="pointer-events-none"
            />

            {/* Interactive Dynamic Mouse Spotlight */}
            {interactive && (
              <motion.circle
                r="180"
                fill="url(#mouse-spotlight)"
                className="pointer-events-none opacity-0 group-hover:opacity-90 transition-opacity duration-300 mix-blend-color-dodge"
                style={{
                  cx: useTransform(mouseX, [-0.5, 0.5], [260, 580]),
                  cy: useTransform(mouseY, [-0.5, 0.5], [200, 560]),
                }}
              />
            )}
          </g>

          {/* Layer 3: Razor Sharp Specular Bevel Border */}
          <path
            d={DELTA_SVG_PATH}
            fill="none"
            stroke="white"
            strokeWidth="3.5"
            strokeOpacity={0.35}
            className="group-hover:stroke-white/60 transition-colors duration-300"
          />
        </svg>

        {/* Click Shockwave Delta Ripples */}
        <AnimatePresence>
          {ripples.map((ripple) => (
            <motion.div
              key={ripple.id}
              initial={{ scale: 0.8, opacity: 0.8 }}
              animate={{ scale: 1.6, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
              style={{
                width,
                height,
              }}
              className="pointer-events-none absolute inset-0 -z-5 flex items-center justify-center"
            >
              <svg
                viewBox={DELTA_SVG_VIEWBOX}
                fill="none"
                className="w-full h-full text-cyan-400/50 blur-[2px]"
              >
                <path
                  d={DELTA_SVG_PATH}
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="rgba(6, 182, 212, 0.08)"
                />
              </svg>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Micro Pulse Badge on Click */}
        {clickCount > 0 && (
          <motion.div
            key={clickCount}
            initial={{ scale: 0.8, opacity: 0, y: 6 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="absolute -bottom-7 left-1/2 -translate-x-1/2 z-20 pointer-events-none flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-black/80 backdrop-blur-md border border-white/20 text-[10px] font-mono text-white/90 shadow-xl"
          >
            <Sparkles className="size-2.5 text-cyan-400" />
            <span>pulse {clickCount}</span>
          </motion.div>
        )}
      </motion.div>

      {/* Floating Micro Label underneath */}
      {interactive && (
        <motion.div
          animate={{ opacity: isHovered ? 1 : 0.5, y: isHovered ? 8 : 4 }}
          transition={{ duration: 0.2 }}
          className="absolute -bottom-8 pointer-events-none flex items-center gap-1.5 text-[11px] font-mono text-muted-foreground whitespace-nowrap"
        >
          <span className="size-1.5 rounded-full bg-cyan-400 animate-pulse" />
          <span>Interactive Delta Primitive</span>
        </motion.div>
      )}
    </motion.div>
  );
}
