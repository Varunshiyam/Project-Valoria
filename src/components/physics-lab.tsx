'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Sliders, Play, RotateCcw, Copy, Check } from 'lucide-react';
import { ValoriaLogo } from './valoria-logo';
import { cn } from '@/lib/utils';

export function PhysicsLab() {
  const [stiffness, setStiffness] = useState(150);
  const [damping, setDamping] = useState(24);
  const [mass, setMass] = useState(0.9);
  const [mode, setMode] = useState<'scale' | 'translate' | 'tilt'>('translate');
  const [animState, setAnimState] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  const triggerAnim = () => {
    setAnimState(!animState);
  };

  const resetDefaults = () => {
    setStiffness(150);
    setDamping(24);
    setMass(0.9);
    setAnimState(false);
  };

  const codeSnippet = `transition={{
  type: 'spring',
  stiffness: ${stiffness},
  damping: ${damping},
  mass: ${mass},
}}`;

  const copyConfig = () => {
    navigator.clipboard.writeText(codeSnippet);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <section id="primitives" className="relative mx-auto max-w-[1240px] px-6 py-24 text-left">
      <div className="flex flex-col items-center text-center mb-16">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-mono uppercase tracking-wider text-muted-foreground">
          <Sliders className="size-3 text-foreground" />
          Interactive Physics Lab
        </span>
        <h2 className="mt-4 text-3xl sm:text-5xl font-semibold tracking-tight text-foreground max-w-2xl text-balance">
          Tune your spring dynamics in real time.
        </h2>
        <p className="mt-4 max-w-xl text-muted-foreground text-sm sm:text-base leading-relaxed">
          Calibrate inertial velocity, oscillation decay, and spring firmness directly
          against the Valoria emblem vector.
        </p>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 items-center rounded-3xl border border-white/[0.1] bg-oklch(0.18_0_0) p-8 sm:p-12 shadow-2xl backdrop-blur-xl">
        {/* Controls Column */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
            <span className="text-sm font-semibold text-foreground uppercase tracking-wider font-mono">
              Spring Tokens
            </span>
            <button
              type="button"
              onClick={resetDefaults}
              className="flex items-center gap-1 text-xs font-mono text-muted-foreground hover:text-foreground transition-colors"
            >
              <RotateCcw className="size-3" />
              Reset
            </button>
          </div>

          {/* Stiffness Slider */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-muted-foreground">stiffness</span>
              <span className="text-foreground font-semibold">{stiffness}</span>
            </div>
            <input
              type="range"
              min={50}
              max={400}
              step={5}
              value={stiffness}
              onChange={(e) => setStiffness(Number(e.target.value))}
              className="accent-foreground w-full cursor-pointer"
            />
            <span className="text-[10px] text-muted-foreground/60">
              Affects spring snap velocity (Default: 150)
            </span>
          </div>

          {/* Damping Slider */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-muted-foreground">damping</span>
              <span className="text-foreground font-semibold">{damping}</span>
            </div>
            <input
              type="range"
              min={10}
              max={60}
              step={1}
              value={damping}
              onChange={(e) => setDamping(Number(e.target.value))}
              className="accent-foreground w-full cursor-pointer"
            />
            <span className="text-[10px] text-muted-foreground/60">
              Frictional resistance preventing endless oscillation (Default: 24)
            </span>
          </div>

          {/* Mass Slider */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-muted-foreground">mass</span>
              <span className="text-foreground font-semibold">{mass}</span>
            </div>
            <input
              type="range"
              min={0.2}
              max={3.0}
              step={0.1}
              value={mass}
              onChange={(e) => setMass(Number(e.target.value))}
              className="accent-foreground w-full cursor-pointer"
            />
            <span className="text-[10px] text-muted-foreground/60">
              Inertial payload weight (Default: 0.9)
            </span>
          </div>

          {/* Modes */}
          <div className="flex items-center gap-2 pt-2">
            {(['translate', 'scale', 'tilt'] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMode(m)}
                className={cn(
                  'flex-1 py-1.5 rounded-lg text-xs font-mono capitalize transition-all border',
                  mode === m
                    ? 'border-white/20 bg-white/10 text-foreground font-medium'
                    : 'border-white/[0.06] bg-white/[0.02] text-muted-foreground hover:text-foreground'
                )}
              >
                {m}
              </button>
            ))}
          </div>

          {/* Action Trigger Button */}
          <button
            type="button"
            onClick={triggerAnim}
            className="flex h-11 items-center justify-center gap-2 rounded-xl bg-foreground text-background font-semibold text-sm transition-all hover:bg-white/90 active:scale-95 shadow-[0_0_24px_rgba(255,255,255,0.15)]"
          >
            <Play className="size-4 fill-background" />
            <span>Simulate Motion Impulse</span>
          </button>
        </div>

        {/* Visual Stage Column */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <div className="relative h-[320px] rounded-2xl border border-white/[0.08] bg-black/40 flex items-center justify-center overflow-hidden bg-grid-dots">
            {/* Visual Spring Target */}
            <motion.div
              animate={
                mode === 'translate'
                  ? { x: animState ? 120 : -120 }
                  : mode === 'scale'
                  ? { scale: animState ? 1.35 : 0.75 }
                  : { rotate: animState ? 24 : -24, scale: animState ? 1.15 : 0.9 }
              }
              transition={{
                type: 'spring',
                stiffness,
                damping,
                mass,
              }}
              className="w-[200px] text-foreground select-none cursor-pointer"
              onClick={triggerAnim}
            >
              <ValoriaLogo />
            </motion.div>

            <span className="absolute bottom-3 left-4 text-[10px] font-mono text-muted-foreground/60">
              Click stage or button to toggle impulse
            </span>
            <span className="absolute bottom-3 right-4 text-[10px] font-mono text-emerald-400">
              Spring Physics Active
            </span>
          </div>

          {/* Live Code Snippet */}
          <div className="relative rounded-xl border border-white/[0.08] bg-black/50 p-4 font-mono text-xs">
            <button
              type="button"
              onClick={copyConfig}
              className="absolute top-3 right-3 flex size-7 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-muted-foreground hover:text-foreground hover:bg-white/10 transition-all"
              title="Copy code snippet"
            >
              {copiedCode ? (
                <Check className="size-3.5 text-emerald-400 stroke-[2.5]" />
              ) : (
                <Copy className="size-3.5" />
              )}
            </button>
            <pre className="text-muted-foreground overflow-x-auto pr-10">
              <span className="text-foreground">{codeSnippet}</span>
            </pre>
          </div>
        </div>
      </div>
    </section>
  );
}
