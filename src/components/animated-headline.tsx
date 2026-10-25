'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion, useInView } from 'motion/react';
import { cn } from '@/lib/utils';
import { useIntroDone } from './intro-provider';

export const ROTATING_WORDS = [
  'Salesforce Development',
  'Slack Integrations',
  'AI Workflows',
  'Custom SAAS',
  'Tableau Reports',
];

const EASE_CUBIC = [0.23, 1, 0.32, 1] as const;

const WORD_IN = {
  initial: { opacity: 0, y: 24, filter: 'blur(12px)' },
  animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
  transition: { duration: 0.7, ease: EASE_CUBIC },
};

interface RotatingTextProps {
  words?: string[];
  duration?: number;
  initialDelay?: number;
  className?: string;
  done?: boolean;
}

export function RotatingText({
  words = ROTATING_WORDS,
  duration = 2600,
  initialDelay = 1400,
  className,
  done = true,
}: RotatingTextProps) {
  const prefersReduced = useReducedMotion();
  const containerRef = useRef<HTMLSpanElement>(null);
  const inView = useInView(containerRef, { margin: '-40px', once: false });
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (prefersReduced || !done) {
      return;
    }

    let timeoutId: NodeJS.Timeout;
    let intervalId: NodeJS.Timeout;

    const startTicker = () => {
      // Initial delay before starting the first rotation
      timeoutId = setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % words.length);

        // Subsequent rotations every duration (2600ms)
        intervalId = setInterval(() => {
          setCurrentIndex((prev) => (prev + 1) % words.length);
        }, duration);
      }, initialDelay);
    };

    const clearTimers = () => {
      clearTimeout(timeoutId);
      clearInterval(intervalId);
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        clearTimers();
      } else if (inView) {
        startTicker();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    if (inView && !document.hidden) {
      startTicker();
    }

    return () => {
      clearTimers();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [inView, done, prefersReduced, words.length, duration, initialDelay]);

  const activeWord = (!done || prefersReduced) ? words[0] : (words[currentIndex] ?? words[0]);

  return (
    <motion.span
      ref={containerRef}
      layout={prefersReduced ? false : 'size'}
      transition={{ layout: { duration: 0.35, ease: EASE_CUBIC } }}
      data-slot="rotating-ticker"
      className={cn(
        'relative inline-grid overflow-hidden align-baseline text-left leading-[1.12]',
        className
      )}
      style={{
        display: 'inline-grid',
        gridTemplateColumns: '1fr',
        overflow: 'hidden',
        paddingBlock: '0.2rem',
        verticalAlign: 'baseline',
      }}
    >
      {/* Sizing placeholder for active word guaranteeing layout reservation and baseline alignment */}
      <span
        aria-hidden="true"
        className="invisible whitespace-nowrap select-none pointer-events-none"
        style={{
          gridArea: '1 / 1',
          visibility: 'hidden',
          whiteSpace: 'nowrap',
        }}
      >
        {activeWord}
      </span>

      {/* Active animated word in the exact same grid slot */}
      <AnimatePresence mode="wait">
        <motion.span
          key={activeWord}
          initial={prefersReduced ? false : { opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={prefersReduced ? undefined : { opacity: 0, y: 50 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="whitespace-nowrap text-neutral-500 dark:text-neutral-400 font-medium"
          style={{ gridArea: '1 / 1', whiteSpace: 'nowrap' }}
        >
          {activeWord}
        </motion.span>
      </AnimatePresence>

      {/* Screen reader full accessibility */}
      <span className="sr-only">shadcn/ui, Radix UI, Base UI, React Aria</span>
    </motion.span>
  );
}

interface AnimatedWordProps {
  word: string;
  delay: number;
  done: boolean;
  className?: string;
}

function AnimatedWord({ word, delay, done, className }: AnimatedWordProps) {
  const prefersReduced = useReducedMotion();

  if (prefersReduced) {
    return <span className={cn('inline-block', className)}>{word}</span>;
  }

  return (
    <motion.span
      className={cn('inline-block', className)}
      initial={WORD_IN.initial}
      animate={done ? WORD_IN.animate : WORD_IN.initial}
      transition={{
        ...WORD_IN.transition,
        delay,
      }}
    >
      {word}
    </motion.span>
  );
}

export function AnimatedHeadline({
  words = ROTATING_WORDS,
  className,
}: {
  words?: string[];
  className?: string;
} = {}) {
  const done = useIntroDone();
  const prefersReduced = useReducedMotion();
  const sectionRef = useRef<HTMLHeadingElement>(null);
  const inView = useInView(sectionRef, { margin: '-60px', once: true });

  // Entrance is active when intro is done AND section is in view
  const isEntranceActive = done && inView;

  // Line 1: "We Engineer [Rotating Word]"
  const line1Words = ['We', 'Engineer'];
  // Line 2: "Where Vision becomes Technology"
  const line2Words = ['Where', 'Vision', 'becomes', 'Technology'];

  const STAGGER = 0.07;
  const LINE_2_OFFSET = 0.3; // 300ms delay relative to Line 1

  return (
    <h1
      ref={sectionRef}
      className={cn(
        'z-10 mt-2 flex flex-col items-center justify-center text-center font-medium tracking-tight text-foreground text-balance text-4xl sm:text-5xl md:text-6xl leading-[1.12]',
        className
      )}
    >
      {/* Line 1: "We Engineer [Rotating Word]" */}
      <span className="inline-flex flex-wrap items-baseline justify-center gap-x-[0.28em] gap-y-1">
        {line1Words.map((word, index) => (
          <AnimatedWord
            key={`l1-${word}-${index}`}
            word={word}
            delay={index * STAGGER}
            done={isEntranceActive}
          />
        ))}

        {/* Inline Vertical Rotating Text Ticker */}
        <motion.span
          className="inline-block"
          initial={prefersReduced ? false : WORD_IN.initial}
          animate={isEntranceActive ? WORD_IN.animate : WORD_IN.initial}
          transition={{
            ...WORD_IN.transition,
            delay: line1Words.length * STAGGER,
          }}
        >
          <RotatingText
            words={words}
            duration={2600}
            initialDelay={1400}
            done={isEntranceActive}
          />
        </motion.span>
      </span>

      {/* Line 2: "Where Vision becomes Technology" (delayed by 300ms relative to Line 1) */}
      <span className="mt-1 inline-flex flex-wrap items-baseline justify-center gap-x-[0.28em] gap-y-1">
        {line2Words.map((word, index) => (
          <AnimatedWord
            key={`l2-${word}-${index}`}
            word={word}
            delay={LINE_2_OFFSET + index * STAGGER}
            done={isEntranceActive}
          />
        ))}
      </span>
    </h1>
  );
}
