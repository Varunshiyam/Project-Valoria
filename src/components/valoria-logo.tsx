'use client';

import { motion } from 'motion/react';
import { cn } from '@/lib/utils';
import { VALORIA_GLYPHS, VALORIA_FULL_PATH, VALORIA_VIEWBOX } from './valoria-logo-data';

interface ValoriaLogoProps {
  draw?: boolean;
  className?: string;
}

export function ValoriaLogo({ draw = false, className }: ValoriaLogoProps) {
  if (!draw) {
    return (
      <svg
        viewBox={VALORIA_VIEWBOX}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn('block w-full h-auto select-none overflow-visible', className)}
        role="img"
        aria-label="Valoria logo"
      >
        <path
          d={VALORIA_FULL_PATH}
          fill="currentColor"
          fillRule="evenodd"
        />
      </svg>
    );
  }

  return (
    <svg
      viewBox={VALORIA_VIEWBOX}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('block w-full h-auto select-none overflow-visible', className)}
      role="img"
      aria-label="Valoria logo"
    >
      {VALORIA_GLYPHS.map((glyph) => (
        <motion.path
          key={glyph.id}
          d={glyph.d}
          stroke="currentColor"
          strokeWidth={8}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="currentColor"
          fillRule="evenodd"
          initial={{ pathLength: 0, fillOpacity: 0 }}
          animate={{ pathLength: 1, fillOpacity: 1 }}
          transition={{
            pathLength: {
              duration: 1.3,
              ease: [0.77, 0, 0.175, 1],
            },
            fillOpacity: {
              duration: 0.45,
              delay: 1.15,
              ease: [0.23, 1, 0.32, 1],
            },
          }}
        />
      ))}
    </svg>
  );
}
