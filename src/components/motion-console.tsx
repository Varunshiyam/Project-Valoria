'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  CheckCircle2,
  Loader2,
  Sparkles,
  Terminal,
  Save,
  Check,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { EASE_OUT } from './intro-provider';

interface ConsoleTab {
  id: string;
  label: string;
  prompt: string;
  steps: string[];
  result: string;
}

const TABS: ConsoleTab[] = [
  {
    id: 'save-button',
    label: 'Smart Button',
    prompt: "Make my save button show a fluid spring press, loading state, then 'Saved'.",
    steps: [
      'Loaded physics tokens: stiffness: 240, damping: 20',
      'Orchestrated layout morphing on label & icon swap',
      'Configured Gaussian deblur on label entrance',
      'Verified zero cumulative layout shift (CLS: 0.00)',
    ],
    result: 'Optimized `components/save-button.tsx` in 12ms',
  },
  {
    id: 'fluid-island',
    label: 'Dynamic Island',
    prompt: 'Create a floating status pill that morphs smoothly into an expanded preview.',
    steps: [
      'Applied shared layoutId="dynamic-island"',
      'Spring transition: stiffness: 180, damping: 22',
      'Added backdrop-filter: blur(16px) with hairline border',
      'Handled mobile gesture dismiss and touch targets',
    ],
    result: 'Created `components/dynamic-island.tsx`',
  },
  {
    id: 'task-stream',
    label: 'Layout Stream',
    prompt: 'Animate a real-time list where deleted items fade and remaining items glide up.',
    steps: [
      'Mounted AnimatePresence with mode="popLayout"',
      'Reflow spring damping: 24, mass: 0.85',
      'Subtle surface blur on items entering view',
      'Automatic reduced-motion graceful fallback',
    ],
    result: 'Updated `components/task-stream.tsx`',
  },
  {
    id: 'audit',
    label: 'Motion Audit',
    prompt: 'Audit current animations for 60fps frame drops and redundant repaints.',
    steps: [
      'Inspected 18 transform & opacity layers',
      'Confirmed zero non-composite property mutations',
      'Eliminated layout recalculations during glides',
      'All 4 audit checks passed successfully',
    ],
    result: 'Audit completed: 60fps stable, 0 jank detected',
  },
];

// Interactive Sandbox 1: Save Button
function InteractiveSaveButton() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'saved'>('idle');

  const handleClick = () => {
    if (status !== 'idle') return;
    setStatus('loading');
    setTimeout(() => {
      setStatus('saved');
      setTimeout(() => {
        setStatus('idle');
      }, 2000);
    }, 1200);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <motion.button
        type="button"
        whileTap={{ scale: 0.96 }}
        onClick={handleClick}
        disabled={status !== 'idle'}
        className={cn(
          'relative flex h-11 min-w-[170px] items-center justify-center gap-2 rounded-xl px-5 text-sm font-medium transition-colors select-none',
          status === 'saved'
            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
            : 'bg-foreground text-background hover:bg-white/90 shadow-[0_0_24px_rgba(255,255,255,0.15)]'
        )}
      >
        <AnimatePresence mode="popLayout" initial={false}>
          {status === 'idle' && (
            <motion.span
              key="idle"
              initial={{ opacity: 0, y: 8, filter: 'blur(4px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -8, filter: 'blur(4px)' }}
              transition={{ duration: 0.2, ease: EASE_OUT }}
              className="inline-flex items-center gap-2"
            >
              <Save className="size-4" />
              <span>Save changes</span>
            </motion.span>
          )}

          {status === 'loading' && (
            <motion.span
              key="loading"
              initial={{ opacity: 0, y: 8, filter: 'blur(4px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -8, filter: 'blur(4px)' }}
              transition={{ duration: 0.2, ease: EASE_OUT }}
              className="inline-flex items-center gap-2"
            >
              <Loader2 className="size-4 animate-spin text-background" />
              <span>Saving…</span>
            </motion.span>
          )}

          {status === 'saved' && (
            <motion.span
              key="saved"
              initial={{ opacity: 0, scale: 0.85, filter: 'blur(4px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, scale: 0.85, filter: 'blur(4px)' }}
              transition={{ duration: 0.25, ease: EASE_OUT }}
              className="inline-flex items-center gap-2"
            >
              <Check className="size-4 stroke-[2.5]" />
              <span>Saved!</span>
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
      <span className="text-[11px] text-muted-foreground/70 font-mono">
        Click to test interactive state transition
      </span>
    </div>
  );
}

// Interactive Sandbox 2: Dynamic Island
function InteractiveDynamicIsland() {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="flex flex-col items-center gap-4">
      <motion.div
        layout
        onClick={() => setExpanded(!expanded)}
        transition={{ type: 'spring', stiffness: 260, damping: 25 }}
        className={cn(
          'cursor-pointer border border-white/10 bg-black/80 backdrop-blur-xl shadow-2xl transition-colors hover:border-white/20 select-none overflow-hidden',
          expanded
            ? 'w-[280px] rounded-3xl p-4'
            : 'w-[160px] h-10 rounded-full px-4 flex items-center justify-between'
        )}
      >
        <motion.div layout className="flex items-center gap-2.5">
          <div className="size-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-medium text-foreground tracking-tight">
            Valoria Engine
          </span>
        </motion.div>

        {expanded ? (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-3 pt-3 border-t border-white/10 flex flex-col gap-2"
          >
            <div className="flex justify-between text-[11px] text-muted-foreground">
              <span>Status</span>
              <span className="text-emerald-400 font-mono">Optimal (60fps)</span>
            </div>
            <div className="flex justify-between text-[11px] text-muted-foreground">
              <span>Layout Spring</span>
              <span className="text-foreground font-mono">Mass 0.9 · Damp 24</span>
            </div>
            <button
              type="button"
              className="mt-1 w-full rounded-lg bg-white/10 py-1.5 text-center text-[11px] font-medium text-foreground hover:bg-white/15"
            >
              Minimize
            </button>
          </motion.div>
        ) : (
          <motion.span layout className="text-[11px] font-mono text-muted-foreground">
            Live
          </motion.span>
        )}
      </motion.div>
      <span className="text-[11px] text-muted-foreground/70 font-mono">
        Click pill to expand / collapse
      </span>
    </div>
  );
}

// Interactive Sandbox 3: Task Stream
function InteractiveTaskStream() {
  const [tasks, setTasks] = useState([
    { id: '1', title: 'Compile layoutId choreography' },
    { id: '2', title: 'Calibrate OKLCH dark palette' },
    { id: '3', title: 'Verify reduced-motion compliance' },
  ]);

  const removeTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const resetTasks = () => {
    setTasks([
      { id: '1', title: 'Compile layoutId choreography' },
      { id: '2', title: 'Calibrate OKLCH dark palette' },
      { id: '3', title: 'Verify reduced-motion compliance' },
    ]);
  };

  return (
    <div className="flex flex-col items-center gap-3 w-full max-w-[280px]">
      <ul className="flex flex-col gap-2 w-full">
        <AnimatePresence mode="popLayout" initial={false}>
          {tasks.map((task) => (
            <motion.li
              key={task.id}
              layout
              initial={{ opacity: 0, y: 12, filter: 'blur(6px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, scale: 0.95, filter: 'blur(6px)' }}
              transition={{
                layout: { type: 'spring', stiffness: 280, damping: 25 },
                duration: 0.25,
              }}
              onClick={() => removeTask(task.id)}
              className="group flex cursor-pointer items-center justify-between rounded-xl border border-white/[0.08] bg-white/[0.03] px-3.5 py-2.5 text-xs text-foreground transition-all hover:border-white/20 hover:bg-white/[0.07]"
            >
              <div className="flex items-center gap-2.5">
                <span className="size-3.5 rounded-[4px] border border-muted-foreground/50 group-hover:border-foreground transition-colors" />
                <span className="truncate">{task.title}</span>
              </div>
              <span className="text-[10px] text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                dismiss
              </span>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>

      {tasks.length < 3 && (
        <button
          type="button"
          onClick={resetTasks}
          className="text-[11px] font-mono text-muted-foreground hover:text-foreground underline underline-offset-4"
        >
          Reset list items
        </button>
      )}
      <span className="text-[11px] text-muted-foreground/70 font-mono">
        Click any task to see shared layout reflow
      </span>
    </div>
  );
}

// Interactive Sandbox 4: Audit Diagnostics
function InteractiveAudit() {
  return (
    <div className="flex flex-col gap-2 w-full max-w-[300px]">
      <div className="flex items-center justify-between text-xs text-muted-foreground pb-1 px-1">
        <span>Layer Diagnostics</span>
        <span className="text-emerald-400 font-mono">100% Score</span>
      </div>
      {[
        { name: 'Hardware Acceleration', value: 'GPU Active', status: 'optimal' },
        { name: 'Composite-only Props', value: 'transform, opacity', status: 'optimal' },
        { name: 'Reduced Motion Gate', value: 'Bypassed on query', status: 'optimal' },
        { name: 'Paint Invalidation', value: '0 rects repainted', status: 'optimal' },
      ].map((item) => (
        <div
          key={item.name}
          className="flex items-center justify-between rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2 text-xs"
        >
          <span className="font-medium text-foreground">{item.name}</span>
          <span className="font-mono text-[11px] text-emerald-400">{item.value}</span>
        </div>
      ))}
    </div>
  );
}

export function MotionConsole() {
  const [activeTab, setActiveTab] = useState<string>(TABS[0]!.id);
  const [stepIndex, setStepIndex] = useState<number>(0);

  const currentTab = TABS.find((t) => t.id === activeTab) || TABS[0]!;

  // Step progression animation per tab change
  useEffect(() => {
    const intervals: NodeJS.Timeout[] = [];
    currentTab.steps.forEach((_, idx) => {
      intervals.push(
        setTimeout(() => {
          setStepIndex(idx + 1);
        }, (idx + 1) * 350)
      );
    });
    return () => {
      intervals.forEach(clearTimeout);
    };
  }, [activeTab, currentTab]);

  return (
    <div className="w-full max-w-[1100px] mx-auto text-left">
      {/* Tab Switcher Pills */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
        {TABS.map((tab) => {
          const isActive = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                setActiveTab(tab.id);
                setStepIndex(0);
              }}
              className={cn(
                'relative px-4 py-1.5 rounded-full text-xs font-medium transition-all select-none focus:outline-none',
                isActive
                  ? 'text-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-white/[0.04]'
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="active-console-tab"
                  transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  className="absolute inset-0 rounded-full bg-accent border border-white/10"
                />
              )}
              <span className="relative z-10">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* macOS Window Shell */}
      <div className="relative overflow-hidden rounded-2xl border border-white/[0.1] bg-oklch(0.18_0_0) shadow-[0_24px_80px_rgba(0,0,0,0.8)] backdrop-blur-xl">
        {/* Title Bar */}
        <div className="flex h-11 items-center justify-between border-b border-white/[0.08] bg-black/40 px-4">
          <div className="flex items-center gap-2">
            <span className="size-3 rounded-full bg-[#FF5F56] border border-[#E0443E]/50" />
            <span className="size-3 rounded-full bg-[#FFBD2E] border border-[#DEA123]/50" />
            <span className="size-3 rounded-full bg-[#27C93F] border border-[#1AAB29]/50" />
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
            <Terminal className="size-3.5" />
            <span>~/valoria-orchestrator</span>
          </div>
          <div className="w-12 text-right">
            <span className="size-2 inline-block rounded-full bg-emerald-400" />
          </div>
        </div>

        {/* Console Body Grid */}
        <div className="grid md:grid-cols-[1.1fr_1fr] min-h-[380px] divide-y md:divide-y-0 md:divide-x divide-white/[0.08]">
          {/* Left Column: Command & Execution Steps */}
          <div className="p-6 flex flex-col justify-between bg-black/30">
            <div>
              {/* Prompt box */}
              <div className="flex items-start gap-2.5 rounded-xl border border-white/[0.08] bg-white/[0.03] p-3.5 mb-5">
                <span className="mt-0.5 text-muted-foreground font-mono text-xs select-none">
                  &gt;
                </span>
                <p className="text-xs sm:text-sm font-medium text-foreground leading-relaxed">
                  {currentTab.prompt}
                </p>
              </div>

              {/* Steps List */}
              <ol className="space-y-3">
                {currentTab.steps.map((step, idx) => {
                  const isDone = stepIndex > idx;
                  const isRunning = stepIndex === idx;

                  return (
                    <motion.li
                      key={step}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.25 }}
                      className={cn(
                        'flex items-start gap-3 text-xs leading-5 transition-colors',
                        isDone ? 'text-foreground' : isRunning ? 'text-muted-foreground' : 'text-muted-foreground/40'
                      )}
                    >
                      <span className="mt-0.5 shrink-0">
                        {isDone ? (
                          <CheckCircle2 className="size-4 text-emerald-400" />
                        ) : isRunning ? (
                          <Loader2 className="size-4 text-foreground animate-spin" />
                        ) : (
                          <span className="size-4 inline-block rounded-full border border-white/20" />
                        )}
                      </span>
                      <span>{step}</span>
                    </motion.li>
                  );
                })}
              </ol>
            </div>

            {/* Bottom Result Pill */}
            <div className="mt-6 pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <Sparkles className="size-3.5 text-amber-400" />
                <span className="font-mono text-[11px] text-foreground/90">{currentTab.result}</span>
              </div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground/60">
                Verified
              </span>
            </div>
          </div>

          {/* Right Column: Live Interactive Sandbox */}
          <div className="relative p-6 flex flex-col justify-between bg-grid-dots bg-black/20">
            {/* Localhost Header Badge */}
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 rounded-md border border-white/[0.08] bg-black/60 px-2 py-0.5 font-mono text-[11px] text-muted-foreground">
                <span className="size-1.5 rounded-full bg-emerald-400" />
                localhost:3000
              </span>
              <span className="text-[10px] font-mono text-muted-foreground/70 uppercase tracking-wider">
                Live Sandbox
              </span>
            </div>

            {/* Component Stage */}
            <div className="my-auto py-12 flex items-center justify-center">
              {activeTab === 'save-button' && <InteractiveSaveButton />}
              {activeTab === 'fluid-island' && <InteractiveDynamicIsland />}
              {activeTab === 'task-stream' && <InteractiveTaskStream />}
              {activeTab === 'audit' && <InteractiveAudit />}
            </div>

            {/* Bottom Controls */}
            <div className="flex items-center justify-between text-[11px] text-muted-foreground/70 pt-2 border-t border-white/[0.06]">
              <span>Spring Mass: 0.9 · Damping: 24</span>
              <span>100% GPU Rendered</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
