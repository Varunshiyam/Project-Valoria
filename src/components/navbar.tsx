'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import {
  Home,
  FlaskConical,
  Rocket,
  MessageSquareText,
  X,
  Send,
  Sparkles,
  Check,
} from 'lucide-react';
import { ValoriaLogo } from './valoria-logo';
import { useIntro, LOGO_SPRING, EASE_OUT } from './intro-provider';
import { cn } from '@/lib/utils';

// Bespoke Terminal Icon matching the exact [>_] shape in the reference image
function TerminalPromptIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect width="18" height="14" x="3" y="5" rx="2.5" />
      <path d="m7 10 2 2-2 2" />
      <path d="M12 14h4" />
    </svg>
  );
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  href: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'home', label: 'Home', icon: Home, href: '#' },
  { id: 'build', label: 'Build', icon: TerminalPromptIcon, href: '#console' },
  { id: 'lab', label: 'Lab', icon: FlaskConical, href: '#primitives' },
  { id: 'launch', label: 'Launch', icon: Rocket, href: '#platform' },
  { id: 'connect', label: "Let's Connect", icon: MessageSquareText, href: '#connect' },
];

export function Navbar() {
  const { playing } = useIntro();
  const [activeTab, setActiveTab] = useState<string>('home');
  const [isConnectOpen, setIsConnectOpen] = useState(false);
  const [connectEmail, setConnectEmail] = useState('');
  const [connectMessage, setConnectMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleNavClick = (item: NavItem, e: React.MouseEvent) => {
    setActiveTab(item.id);
    if (item.id === 'connect') {
      e.preventDefault();
      setIsConnectOpen(true);
    }
  };

  const handleConnectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!connectEmail) return;
    setSubmitted(true);
    setTimeout(() => {
      setIsConnectOpen(false);
      setSubmitted(false);
      setConnectEmail('');
      setConnectMessage('');
    }, 1800);
  };

  return (
    <>
      <header
        data-slot="valoria-floating-navbar"
        className="fixed top-5 sm:top-6 inset-x-0 z-50 flex items-center justify-center px-4 pointer-events-none"
      >
        {/* Floating Glassmorphic Capsule */}
        <div className="pointer-events-auto relative flex items-center gap-3 sm:gap-4 rounded-full border border-white/[0.14] bg-[#0c0d12]/75 backdrop-blur-2xl px-4 sm:px-6 py-2 shadow-[0_12px_40px_rgba(0,0,0,0.65),0_0_30px_rgba(180,160,255,0.08),inset_0_1px_1px_rgba(255,255,255,0.18)] transition-all duration-300">
          {/* Subtle top rim light */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent"
          />

          {/* Left: Brand Logo (Glide Target) */}
          <Link
            href="/"
            aria-label="Valoria Home"
            onClick={() => setActiveTab('home')}
            className="group relative flex items-center pr-1 focus:outline-none shrink-0"
          >
            {!playing && (
              <motion.div
                layoutId="brand-logo"
                transition={LOGO_SPRING}
                className="w-[105px] sm:w-[125px] text-foreground transition-opacity hover:opacity-90"
              >
                <ValoriaLogo />
              </motion.div>
            )}
          </Link>

          {/* Vertical Divider Line */}
          <div
            aria-hidden="true"
            className="h-5 w-px bg-white/[0.18] shrink-0 mx-0.5 sm:mx-1"
          />

          {/* Right: Nav items with Slide + Deblur Reveal */}
          <motion.nav
            className="flex items-center gap-1 sm:gap-1.5"
            initial={false}
            animate={
              playing
                ? { opacity: 0, x: 20, filter: 'blur(6px)' }
                : { opacity: 1, x: 0, filter: 'blur(0px)' }
            }
            transition={{ duration: 0.6, ease: EASE_OUT, delay: 0.25 }}
          >
            {NAV_ITEMS.map((item) => {
              const isActive = activeTab === item.id;
              const Icon = item.icon;

              return (
                <a
                  key={item.id}
                  href={item.href}
                  onClick={(e) => handleNavClick(item, e)}
                  className={cn(
                    'relative flex items-center gap-2 rounded-full px-3 sm:px-4 py-1.5 text-xs sm:text-sm font-medium transition-colors select-none focus:outline-none',
                    isActive
                      ? 'text-black'
                      : 'text-neutral-400 hover:text-white'
                  )}
                >
                  {/* Sliding solid white pill background for active tab */}
                  {isActive && (
                    <motion.div
                      layoutId="active-nav-pill"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      className="absolute inset-0 rounded-full bg-white shadow-[0_2px_12px_rgba(255,255,255,0.3)]"
                    />
                  )}

                  <span className="relative z-10 flex items-center gap-1.5 sm:gap-2">
                    <Icon className="size-3.5 sm:size-4 shrink-0" strokeWidth={2} />
                    <span className="whitespace-nowrap">{item.label}</span>
                  </span>
                </a>
              );
            })}
          </motion.nav>
        </div>
      </header>

      {/* "Let's Connect" Modal Dialog */}
      <AnimatePresence>
        {isConnectOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsConnectOpen(false)}
              className="absolute inset-0 bg-black/70 backdrop-blur-md"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              transition={{ type: 'spring', stiffness: 300, damping: 28 }}
              className="relative w-full max-w-lg rounded-3xl border border-white/15 bg-[#0e0f14]/90 p-6 sm:p-8 shadow-[0_24px_80px_rgba(0,0,0,0.8),0_0_40px_rgba(180,160,255,0.1)] backdrop-blur-2xl"
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setIsConnectOpen(false)}
                className="absolute top-5 right-5 flex size-8 items-center justify-center rounded-full border border-white/10 bg-white/5 text-muted-foreground transition-colors hover:bg-white/10 hover:text-foreground"
              >
                <X className="size-4" />
              </button>

              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-muted-foreground mb-3">
                <Sparkles className="size-3.5 text-foreground" />
                <span>Valoria Direct Channel</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
                Let&apos;s build together.
              </h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                Connect with the engineering team behind Valoria. We collaborate with teams building cutting-edge animated web platforms.
              </p>

              {submitted ? (
                <div className="mt-8 flex flex-col items-center justify-center py-8 text-center">
                  <div className="flex size-12 items-center justify-center rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 mb-3">
                    <Check className="size-6 stroke-[2.5]" />
                  </div>
                  <h4 className="text-lg font-medium text-foreground">Message Received</h4>
                  <p className="mt-1 text-xs text-muted-foreground">
                    We will get back to you within 24 hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleConnectSubmit} className="mt-6 flex flex-col gap-4">
                  <div>
                    <label htmlFor="email" className="block text-xs font-mono text-muted-foreground mb-1.5">
                      Your Email Address
                    </label>
                    <input
                      id="email"
                      type="email"
                      required
                      value={connectEmail}
                      onChange={(e) => setConnectEmail(e.target.value)}
                      placeholder="alex@company.com"
                      className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/40 focus:border-white/30 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-xs font-mono text-muted-foreground mb-1.5">
                      How can we collaborate?
                    </label>
                    <textarea
                      id="message"
                      rows={3}
                      value={connectMessage}
                      onChange={(e) => setConnectMessage(e.target.value)}
                      placeholder="Tell us about your product or motion requirements…"
                      className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/40 focus:border-white/30 focus:outline-none resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="mt-2 flex h-11 items-center justify-center gap-2 rounded-xl bg-foreground font-semibold text-sm text-background transition-all hover:bg-white/90 active:scale-98 shadow-[0_0_24px_rgba(255,255,255,0.2)]"
                  >
                    <Send className="size-4" />
                    <span>Send Connection Request</span>
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
