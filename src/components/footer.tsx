'use client';

import React from 'react';
import { ValoriaLogo } from './valoria-logo';
import { ArrowUpRight } from 'lucide-react';
import { GithubIcon, TwitterIcon, DiscordIcon } from './icons';

export function Footer() {
  return (
    <footer className="border-t border-white/[0.08] bg-black/40 text-muted-foreground">
      <div className="mx-auto max-w-[1240px] px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          {/* Brand info */}
          <div className="col-span-2 flex flex-col gap-4">
            <div className="w-[120px] text-foreground">
              <ValoriaLogo />
            </div>
            <p className="max-w-xs text-xs leading-relaxed text-muted-foreground/80">
              Autonomous motion engineering for high-velocity interfaces.
              Calibrated in OKLCH dark luxury aesthetics.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <span className="relative flex size-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
              </span>
              <span className="font-mono text-xs text-foreground">All systems operational</span>
            </div>
          </div>

          {/* Column 1 */}
          <div className="flex flex-col gap-3 text-xs">
            <span className="font-semibold text-foreground uppercase tracking-wider font-mono">
              Platform
            </span>
            <a href="#platform" className="hover:text-foreground transition-colors">
              Choreography
            </a>
            <a href="#primitives" className="hover:text-foreground transition-colors">
              Physics Lab
            </a>
            <a href="#console" className="hover:text-foreground transition-colors">
              Live Console
            </a>
            <a href="#primitives" className="hover:text-foreground transition-colors">
              Shared LayoutId
            </a>
          </div>

          {/* Column 2 */}
          <div className="flex flex-col gap-3 text-xs">
            <span className="font-semibold text-foreground uppercase tracking-wider font-mono">
              Ecosystem
            </span>
            <a href="https://nextjs.org" target="_blank" rel="noreferrer" className="hover:text-foreground transition-colors">
              Next.js App Router
            </a>
            <a href="https://motion.dev" target="_blank" rel="noreferrer" className="hover:text-foreground transition-colors">
              Motion React
            </a>
            <a href="https://tailwindcss.com" target="_blank" rel="noreferrer" className="hover:text-foreground transition-colors">
              Tailwind CSS
            </a>
            <a href="https://radix-ui.com" target="_blank" rel="noreferrer" className="hover:text-foreground transition-colors">
              Radix Primitives
            </a>
          </div>

          {/* Column 3 */}
          <div className="flex flex-col gap-3 text-xs">
            <span className="font-semibold text-foreground uppercase tracking-wider font-mono">
              Community
            </span>
            <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-foreground transition-colors flex items-center gap-1.5">
              <GithubIcon className="size-3.5" /> GitHub <ArrowUpRight className="size-3 text-muted-foreground/60" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:text-foreground transition-colors flex items-center gap-1.5">
              <TwitterIcon className="size-3.5" /> Twitter / X <ArrowUpRight className="size-3 text-muted-foreground/60" />
            </a>
            <a href="https://discord.com" target="_blank" rel="noreferrer" className="hover:text-foreground transition-colors flex items-center gap-1.5">
              <DiscordIcon className="size-3.5" /> Discord <ArrowUpRight className="size-3 text-muted-foreground/60" />
            </a>
          </div>
        </div>

        <div className="pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground/60 font-mono">
          <p>© 2026 Valoria Motion Systems Inc. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-foreground transition-colors cursor-pointer">Privacy</span>
            <span className="hover:text-foreground transition-colors cursor-pointer">Terms</span>
            <span className="hover:text-foreground transition-colors cursor-pointer">Security</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
