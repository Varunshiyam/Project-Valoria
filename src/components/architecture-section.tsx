'use client';

import React from 'react';
import { motion } from 'motion/react';
import { Layers, Sliders, Shield, Eye, Compass } from 'lucide-react';
import { EASE_OUT } from './intro-provider';

const PILLARS = [
  {
    icon: Layers,
    title: 'Shared LayoutId Morphing',
    tag: 'Core Primitive',
    description:
      'Seamlessly glide components across viewports and parent trees with automatic FLIP coordinate geometry and zero DOM recalculation overhead.',
    metric: '0.00 CLS',
  },
  {
    icon: Sliders,
    title: 'Calibrated Spring Physics',
    tag: 'Dynamics',
    description:
      'Physics-based mass, damping, and stiffness curves that mirror real-world inertial momentum rather than synthetic cubic-bezier approximations.',
    metric: '150/24/0.9',
  },
  {
    icon: Eye,
    title: 'OKLCH Luxury Palette',
    tag: 'Color Science',
    description:
      'Engineered in perceptual OKLCH color space for deep charcoal backgrounds and crisp white typography with zero muddy gradient bandings.',
    metric: 'ΔE < 0.1',
  },
  {
    icon: Shield,
    title: 'Accessibility Autonomic Gate',
    tag: 'Standard',
    description:
      'Strict adherence to prefers-reduced-motion: instantaneous state bypasses without flash of unstyled content or awkward layout pop-ins.',
    metric: 'WCAG AAA',
  },
];

export function ArchitectureSection() {
  return (
    <section id="platform" className="relative mx-auto max-w-[1240px] px-6 py-28 text-left">
      {/* Background ambient glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/3 right-10 size-[500px] rounded-full bg-white/[0.02] blur-3xl"
      />

      {/* Header */}
      <div className="flex flex-col items-center text-center mb-16">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-mono uppercase tracking-wider text-muted-foreground">
          <Compass className="size-3 text-foreground" />
          Architecture & Primitives
        </span>
        <h2 className="mt-4 text-3xl sm:text-5xl font-semibold tracking-tight text-foreground max-w-2xl text-balance">
          Every micro-interaction crafted with physical intent.
        </h2>
        <p className="mt-4 max-w-xl text-muted-foreground text-sm sm:text-base leading-relaxed">
          Valoria merges cinematic choreographies with deterministic engineering.
          Zero bundle bloat, zero frame stutter.
        </p>
      </div>

      {/* Bento Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        {PILLARS.map((pillar, i) => {
          const Icon = pillar.icon;
          return (
            <motion.div
              key={pillar.title}
              initial={{ opacity: 0, y: 24, filter: 'blur(8px)' }}
              whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, ease: EASE_OUT, delay: i * 0.1 }}
              className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.02] p-8 transition-all duration-300 hover:border-white/20 hover:bg-white/[0.04]"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex size-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.05] text-foreground transition-transform group-hover:scale-105">
                  <Icon className="size-5" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-0.5 text-[10px] font-mono text-muted-foreground">
                    {pillar.tag}
                  </span>
                  <span className="rounded-full bg-foreground/10 px-2 py-0.5 text-[11px] font-mono text-foreground font-semibold">
                    {pillar.metric}
                  </span>
                </div>
              </div>

              <h3 className="text-xl font-semibold text-foreground tracking-tight mb-2">
                {pillar.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {pillar.description}
              </p>

              {/* Decorative corner hairline */}
              <div className="pointer-events-none absolute -bottom-px -right-px h-16 w-16 bg-gradient-to-tl from-white/10 to-transparent" />
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
