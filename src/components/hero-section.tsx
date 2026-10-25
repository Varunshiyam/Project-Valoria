'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  ArrowRight,
  Copy,
  Check,
  Layers,
  Zap,
  ShieldCheck,
  Cpu,
} from 'lucide-react';
import { useIntroDone, EASE_OUT } from './intro-provider';
import { AnimatedHeadline } from './animated-headline';
import { MotionConsole } from './motion-console';
import { cn } from '@/lib/utils';

const PACKAGES = [
  { name: 'npm', cmd: 'npx valoria@latest init' },
  { name: 'pnpm', cmd: 'pnpm dlx valoria@latest init' },
  { name: 'bun', cmd: 'bunx valoria@latest init' },
];

export function HeroSection() {
  const done = useIntroDone();
  const [selectedPkg, setSelectedPkg] = useState(0);
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(PACKAGES[selectedPkg]!.cmd);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const rise = (index: number) => ({
    initial: { opacity: 0, y: 20, filter: 'blur(10px)' },
    animate: done
      ? { opacity: 1, y: 0, filter: 'blur(0px)' }
      : { opacity: 0, y: 20, filter: 'blur(10px)' },
    transition: {
      duration: 0.7,
      ease: EASE_OUT,
      delay: 0.7 + index * 0.1,
    },
  });

  return (
    <section className="relative flex flex-col items-center px-6 pt-36 pb-24 text-center md:pt-44 overflow-hidden">
      {/* Ambient background blurred spheres */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 size-[650px] rounded-full bg-foreground/[0.04] blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/4 -translate-y-1/2 size-[450px] rounded-full bg-white/[0.02] blur-3xl"
      />

      {/* Ethereal glowing horizon curves matching reference style */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-[340px] sm:top-[360px] left-1/2 -translate-x-1/2 w-[1800px] h-[700px] rounded-[100%] border-t border-white/[0.18] bg-gradient-to-b from-white/[0.04] via-transparent to-transparent shadow-[0_-15px_60px_rgba(200,190,255,0.08)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-[410px] sm:top-[430px] left-1/2 -translate-x-1/2 w-[1500px] h-[600px] rounded-[100%] border-t border-white/[0.08]"
      />

      {/* 1. Animated Headline with Blur Cascade & Rotating Text Ticker */}
      <AnimatedHeadline />

      {/* 2. Subtitle Paragraph */}
      <motion.p
        initial={{ opacity: 0, y: 18, filter: 'blur(10px)' }}
        animate={
          done
            ? { opacity: 1, y: 0, filter: 'blur(0px)' }
            : { opacity: 0, y: 18, filter: 'blur(10px)' }
        }
        transition={{
          duration: 0.75,
          ease: EASE_OUT,
          delay: 0.55,
        }}
        className="z-10 mt-6 max-w-[680px] text-base sm:text-lg md:text-[19px] text-muted-foreground/90 font-normal leading-relaxed text-balance text-center"
      >
        We connect <span className="text-foreground/95 font-medium">data</span>,{' '}
        <span className="text-foreground/95 font-medium">AI models</span>, and{' '}
        <span className="text-foreground/95 font-medium">business workflows</span> to deliver
        smarter insights and practical solutions built around your goals.
      </motion.p>

      {/* 3. Interactive Package Command & CTAs */}
      <motion.div
        {...rise(1)}
        className="z-10 mt-8 flex w-full max-w-md flex-col items-center gap-4"
      >
        {/* Terminal copy box */}
        <div className="w-full rounded-2xl border border-white/[0.08] bg-white/[0.03] p-1.5 shadow-lg backdrop-blur-md">
          {/* Pkg tabs */}
          <div className="flex items-center justify-between px-3 pt-1 pb-1.5 border-b border-white/[0.04]">
            <div className="flex items-center gap-1">
              {PACKAGES.map((pkg, i) => (
                <button
                  key={pkg.name}
                  type="button"
                  onClick={() => setSelectedPkg(i)}
                  className={cn(
                    'px-2 py-0.5 rounded text-[11px] font-mono transition-colors',
                    selectedPkg === i
                      ? 'bg-white/10 text-foreground font-medium'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  {pkg.name}
                </button>
              ))}
            </div>
            <span className="text-[10px] font-mono text-muted-foreground/60 uppercase">CLI</span>
          </div>

          {/* Command line & copy button */}
          <div className="flex items-center justify-between px-3 py-2 font-mono text-xs">
            <div className="flex items-center gap-2 truncate text-foreground">
              <span className="text-muted-foreground select-none">$</span>
              <span className="truncate">{PACKAGES[selectedPkg]!.cmd}</span>
            </div>
            <button
              type="button"
              onClick={copyToClipboard}
              title="Copy to clipboard"
              aria-label="Copy to clipboard"
              className="ml-2 flex size-7 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-muted-foreground transition-all hover:bg-white/10 hover:text-foreground focus:outline-none"
            >
              {copied ? (
                <Check className="size-3.5 text-emerald-400 stroke-[2.5]" />
              ) : (
                <Copy className="size-3.5" />
              )}
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 w-full">
          <a
            href="#console"
            className="group flex h-11 items-center justify-center gap-2 rounded-xl bg-foreground px-6 text-sm font-medium text-background transition-all hover:bg-white/90 hover:shadow-[0_0_30px_rgba(255,255,255,0.2)]"
          >
            <span>Explore Playground</span>
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </a>
          <a
            href="#primitives"
            className="flex h-11 items-center justify-center rounded-xl border border-white/[0.1] bg-white/[0.03] px-6 text-sm font-medium text-foreground transition-all hover:bg-white/[0.07] hover:border-white/20"
          >
            Browse Primitives
          </a>
        </div>
      </motion.div>

      {/* 4. Ecosystem & Performance Badges */}
      <motion.div
        {...rise(2)}
        className="z-10 mt-12 flex flex-wrap items-center justify-center gap-6 text-xs text-muted-foreground"
      >
        <span className="flex items-center gap-2">
          <Zap className="size-3.5 text-amber-400" />
          60 FPS Constant
        </span>
        <span className="flex items-center gap-2">
          <Layers className="size-3.5 text-foreground" />
          Shared LayoutId Springs
        </span>
        <span className="flex items-center gap-2">
          <Cpu className="size-3.5 text-foreground" />
          GPU Sub-pixel Transform
        </span>
        <span className="flex items-center gap-2">
          <ShieldCheck className="size-3.5 text-emerald-400" />
          Reduced-Motion Resilient
        </span>
      </motion.div>

      {/* 5. Interactive Terminal / Console Showcase */}
      <motion.div {...rise(3)} className="z-10 mt-16 w-full" id="console">
        <MotionConsole />
      </motion.div>
    </section>
  );
}
