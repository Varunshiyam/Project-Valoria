'use client';

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { ValoriaLogo } from './valoria-logo';

export const LOGO_SPRING = {
  type: 'spring',
  stiffness: 150,
  damping: 24,
  mass: 0.9,
  layout: {
    type: 'spring',
    stiffness: 150,
    damping: 24,
    mass: 0.9,
  },
} as const;

export const EASE_OUT = [0.23, 1, 0.32, 1] as const;

interface IntroContextType {
  playing: boolean;
  done: boolean;
  replay: () => void;
}

const IntroContext = createContext<IntroContextType>({
  playing: false,
  done: true,
  replay: () => {},
});

export function useIntro() {
  return useContext(IntroContext);
}

export function useIntroDone() {
  return useContext(IntroContext).done;
}

export function useIntroPlaying() {
  return useContext(IntroContext).playing;
}

interface IntroProviderProps {
  children: ReactNode;
}

export function IntroProvider({ children }: IntroProviderProps) {
  const prefersReduced = useReducedMotion();
  const [playing, setPlaying] = useState(true);
  const [done, setDone] = useState(prefersReduced ? true : false);
  const [replayKey, setReplayKey] = useState(0);

  const startIntro = useCallback(() => {
    if (prefersReduced) {
      return;
    }

    const root = document.documentElement;
    root.style.overflow = 'hidden';

    // Transition to navbar glide at t = 2.05s
    const glideTimer = setTimeout(() => {
      setPlaying(false);
    }, 2050);

    // Hero cascade reveal at t = 2.4s
    const doneTimer = setTimeout(() => {
      root.style.overflow = '';
      setDone(true);
    }, 2400);

    return () => {
      clearTimeout(glideTimer);
      clearTimeout(doneTimer);
      root.style.overflow = '';
    };
  }, [prefersReduced]);

  useEffect(() => {
    const cleanup = startIntro();
    return () => {
      cleanup?.();
    };
  }, [startIntro, replayKey]);

  const replay = useCallback(() => {
    setPlaying(true);
    setDone(false);
    setReplayKey((k) => k + 1);
  }, []);

  const showIntro = playing && !prefersReduced;

  return (
    <IntroContext.Provider
      value={{
        playing: showIntro,
        done: done || Boolean(prefersReduced),
        replay,
      }}
    >
      {/* 1. Fullscreen Overlay with Ambient Pulsing Radial Glow */}
      <AnimatePresence>
        {showIntro && (
          <motion.div
            key={`intro-overlay-${replayKey}`}
            aria-hidden="true"
            data-slot="valoria-intro-overlay"
            className="fixed inset-0 z-[60] flex items-center justify-center bg-background pointer-events-none motion-reduce:hidden"
            exit={{
              opacity: 0,
              transition: { duration: 0.6, ease: EASE_OUT },
            }}
          >
            {/* Pulsing radial glow behind logo */}
            <motion.div
              className="size-[60vmin] rounded-full bg-foreground/10 blur-3xl pointer-events-none"
              initial={{ scale: 0.4, opacity: 0 }}
              animate={{
                scale: [0.4, 0.4, 1.1, 1],
                opacity: [0, 0, 1, 0.6],
              }}
              transition={{
                duration: 2.05,
                times: [0, 0.4, 0.85, 1],
                ease: EASE_OUT,
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. Dead-center massive SVG logo during initial state */}
      {showIntro && (
        <div
          key={`intro-logo-container-${replayKey}`}
          aria-hidden="true"
          className="fixed inset-0 z-[61] flex items-center justify-center pointer-events-none motion-reduce:hidden"
        >
          <motion.div
            layoutId="brand-logo"
            transition={LOGO_SPRING}
            className="w-[min(78vw,640px)] text-foreground flex items-center justify-center"
          >
            <ValoriaLogo draw />
          </motion.div>
        </div>
      )}

      {children}
    </IntroContext.Provider>
  );
}
