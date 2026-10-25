'use client';

import React, { useState, useEffect, useRef, useId } from 'react';
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useMotionValue,
  useAnimationFrame,
  useMotionValueEvent,
  useReducedMotion,
  AnimatePresence,
} from 'motion/react';
import {
  Sliders,
  ToggleLeft,
  Layers,
  Sparkles,
  Activity,
  ShieldCheck,
  Cpu,
  Radio,
  Palette,
  Check,
  Play,
  Volume2,
} from 'lucide-react';
import { ValoriaPrimitiveButton } from './valoria-primitive-button';
import { EASE_OUT } from './intro-provider';
import { cn } from '@/lib/utils';

// ============================================================================
// CONSTANTS & GEOMETRY
// ============================================================================
const CARD_WIDTH = 300;
const CARD_HEIGHT = 188;
const GAP = 16;
const COLUMNS = 3;
const ROWS = 3;
const TOTAL_CARDS = 9;

interface CardMeta {
  id: string;
  badge: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  renderVignette: (isHovered: boolean) => React.ReactNode;
}

// ============================================================================
// INTERACTIVE MINI-COMPONENT VIGNETTES
// ============================================================================

// 1. Fluid Switch Vignette
function SwitchVignette({ isHovered }: { isHovered: boolean }) {
  const [active, setActive] = useState(true);

  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      setActive((prev) => !prev);
    }, 2800);
    return () => clearInterval(interval);
  }, [isHovered]);

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        setActive((prev) => !prev);
      }}
      className="flex flex-col items-center justify-center h-full w-full select-none cursor-pointer group/switch"
    >
      <div className="flex items-center gap-3">
        <span
          className={cn(
            'text-[11px] font-mono transition-colors duration-300',
            active ? 'text-foreground font-medium' : 'text-muted-foreground'
          )}
        >
          {active ? 'Physics: ON' : 'Physics: OFF'}
        </span>
        <div
          className={cn(
            'relative h-7 w-12 rounded-full p-0.5 transition-colors duration-300 border border-white/10',
            active ? 'bg-foreground' : 'bg-white/10'
          )}
        >
          <motion.div
            layout
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            className={cn(
              'h-5.5 w-5.5 rounded-full shadow-md transition-colors',
              active ? 'bg-background' : 'bg-muted-foreground'
            )}
          />
        </div>
      </div>
      <div className="mt-3 flex items-center gap-1.5 text-[10px] text-muted-foreground font-mono">
        <span
          className={cn(
            'size-1.5 rounded-full',
            active ? 'bg-emerald-400 animate-pulse' : 'bg-muted-foreground'
          )}
        />
        <span>{active ? 'Sub-pixel dampening' : 'Rigid static mode'}</span>
      </div>
    </div>
  );
}

// 2. Dynamics Range Slider Vignette
function SliderVignette({ isHovered }: { isHovered: boolean }) {
  const [val, setVal] = useState(68);

  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      setVal((v) => (v >= 85 ? 35 : v + 17));
    }, 2400);
    return () => clearInterval(interval);
  }, [isHovered]);

  return (
    <div className="flex flex-col justify-center h-full w-full px-2 select-none">
      <div className="flex items-center justify-between text-[11px] font-mono text-muted-foreground mb-2">
        <span>Stiffness</span>
        <span className="text-foreground font-semibold">{val * 2} N/m</span>
      </div>
      <div
        className="relative h-2 w-full rounded-full bg-white/10 overflow-hidden cursor-pointer"
        onClick={(e) => {
          e.stopPropagation();
          const rect = e.currentTarget.getBoundingClientRect();
          const pct = Math.round(((e.clientX - rect.left) / rect.width) * 100);
          setVal(Math.max(15, Math.min(95, pct)));
        }}
      >
        <motion.div
          className="h-full bg-foreground rounded-full"
          animate={{ width: `${val}%` }}
          transition={{ type: 'spring', stiffness: 350, damping: 28 }}
        />
      </div>
      <div className="mt-3 flex justify-between text-[10px] text-muted-foreground/70 font-mono">
        <span>0</span>
        <span className="text-foreground/70">Critical Damping: 0.82</span>
        <span>200</span>
      </div>
    </div>
  );
}

// 3. Segmented Control Tabs Vignette
function TabsVignette({ isHovered }: { isHovered: boolean }) {
  const tabId = useId();
  const tabs = ['Spring', 'Decay', 'Keyframes'];
  const [selected, setSelected] = useState(0);

  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      setSelected((prev) => (prev + 1) % tabs.length);
    }, 2600);
    return () => clearInterval(interval);
  }, [isHovered, tabs.length]);

  return (
    <div className="flex flex-col items-center justify-center h-full w-full select-none">
      <div className="flex p-1 rounded-xl bg-white/[0.04] border border-white/10">
        {tabs.map((tab, i) => {
          const isActive = selected === i;
          return (
            <button
              key={tab}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setSelected(i);
              }}
              className={cn(
                'relative px-3 py-1 text-xs font-mono transition-colors focus:outline-none',
                isActive ? 'text-background font-medium' : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {isActive && (
                <motion.div
                  layoutId={`pill-${tabId}`}
                  transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                  className="absolute inset-0 rounded-lg bg-foreground"
                />
              )}
              <span className="relative z-10">{tab}</span>
            </button>
          );
        })}
      </div>
      <span className="mt-3 text-[10px] font-mono text-muted-foreground">
        mode: <code className="text-foreground">{tabs[selected]?.toLowerCase()}</code>
      </span>
    </div>
  );
}

// 4. Haptic Button Morph Vignette
function ButtonMorphVignette({ isHovered }: { isHovered: boolean }) {
  const [state, setState] = useState<'idle' | 'running' | 'success'>('idle');

  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      setState('running');
      setTimeout(() => {
        setState('success');
        setTimeout(() => setState('idle'), 1200);
      }, 1000);
    }, 3800);
    return () => clearInterval(interval);
  }, [isHovered]);

  const trigger = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (state !== 'idle') return;
    setState('running');
    setTimeout(() => {
      setState('success');
      setTimeout(() => setState('idle'), 1400);
    }, 1000);
  };

  return (
    <div className="flex flex-col items-center justify-center h-full w-full select-none">
      <motion.button
        type="button"
        onClick={trigger}
        whileTap={{ scale: 0.94 }}
        className={cn(
          'flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-medium font-mono border transition-all duration-300 focus:outline-none',
          state === 'success'
            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
            : state === 'running'
            ? 'bg-white/10 text-foreground border-white/20'
            : 'bg-foreground text-background border-transparent hover:bg-white/90 shadow-lg'
        )}
      >
        <AnimatePresence mode="wait">
          {state === 'running' ? (
            <motion.div
              key="running"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-1.5"
            >
              <div className="size-3.5 border-2 border-foreground border-t-transparent rounded-full animate-spin" />
              <span>Simulating...</span>
            </motion.div>
          ) : state === 'success' ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-1.5 text-emerald-400"
            >
              <Check className="size-3.5 stroke-[3]" />
              <span>Calibrated</span>
            </motion.div>
          ) : (
            <motion.div
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-1.5"
            >
              <Play className="size-3 fill-current" />
              <span>Trigger Impulse</span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
      <span className="mt-2 text-[10px] text-muted-foreground font-mono">
        mass: 0.40 • stiffness: 160
      </span>
    </div>
  );
}

// 5. Physics Elastic Trampoline Vignette
function ElasticBounceVignette({ isHovered }: { isHovered: boolean }) {
  const [bounceKey, setBounceKey] = useState(0);

  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      setBounceKey((k) => k + 1);
    }, 2200);
    return () => clearInterval(interval);
  }, [isHovered]);

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        setBounceKey((k) => k + 1);
      }}
      className="flex flex-col items-center justify-center h-full w-full select-none cursor-pointer"
    >
      <div className="relative h-12 w-28 flex items-center justify-center">
        {/* Trampoline line */}
        <div className="absolute bottom-2 w-full h-[1.5px] bg-gradient-to-r from-transparent via-white/30 to-transparent" />
        {/* Bouncing ball */}
        <motion.div
          key={bounceKey}
          initial={{ y: -20, scaleY: 1.1, scaleX: 0.9 }}
          animate={{
            y: [ -20, 0, -12, 0, -4, 0 ],
            scaleY: [ 1.1, 0.7, 1.05, 0.85, 1.0, 1 ],
            scaleX: [ 0.9, 1.3, 0.95, 1.15, 1.0, 1 ],
          }}
          transition={{
            duration: 1.6,
            times: [0, 0.25, 0.48, 0.7, 0.86, 1],
            ease: 'easeOut',
          }}
          className="size-7 rounded-full bg-gradient-to-br from-white to-neutral-400 shadow-[0_0_15px_rgba(255,255,255,0.4)]"
        />
      </div>
      <span className="mt-2 text-[10px] text-muted-foreground font-mono">
        restitution: 0.74 • click to bounce
      </span>
    </div>
  );
}

// 6. Live Telemetry Stream Vignette
function TelemetryVignette({ isHovered }: { isHovered: boolean }) {
  const [fps, setFps] = useState(60);

  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      setFps(Math.floor(59 + Math.random() * 2));
    }, 1200);
    return () => clearInterval(interval);
  }, [isHovered]);

  return (
    <div className="flex flex-col justify-center h-full w-full px-2 select-none">
      <div className="flex items-center justify-between text-[11px] font-mono text-muted-foreground mb-1">
        <span className="flex items-center gap-1.5">
          <Activity className="size-3 text-emerald-400" />
          <span>Frame Budget</span>
        </span>
        <span className="text-emerald-400 font-semibold">{fps} FPS</span>
      </div>
      <div className="relative h-10 w-full overflow-hidden flex items-end">
        <svg viewBox="0 0 100 30" className="w-full h-full stroke-emerald-400 fill-none overflow-visible">
          <motion.path
            d="M 0 15 Q 12 5, 25 15 T 50 15 T 75 15 T 100 15"
            strokeWidth="2"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
          />
        </svg>
      </div>
      <div className="mt-1 flex items-center justify-between text-[10px] font-mono text-muted-foreground/80">
        <span>16.6ms / frame</span>
        <span>0 drops</span>
      </div>
    </div>
  );
}

// 7. Biometric Auth Ring Vignette
function AuthRingVignette({ isHovered }: { isHovered: boolean }) {
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      setPulse((p) => !p);
    }, 2000);
    return () => clearInterval(interval);
  }, [isHovered]);

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        setPulse((p) => !p);
      }}
      className="flex flex-col items-center justify-center h-full w-full select-none cursor-pointer"
    >
      <div className="relative size-12 flex items-center justify-center">
        {/* Outer dashed ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-0 rounded-full border border-dashed border-white/20"
        />
        {/* Expanding pulse */}
        <motion.div
          animate={{ scale: pulse ? [1, 1.35, 1] : 1, opacity: pulse ? [0.6, 0, 0.6] : 0.4 }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute inset-1 rounded-full bg-foreground/10"
        />
        <ShieldCheck className="relative z-10 size-5 text-foreground stroke-[2]" />
      </div>
      <span className="mt-2 text-[10px] text-muted-foreground font-mono">
        cryptographic token: verified
      </span>
    </div>
  );
}

// 8. Dynamic Island Capsule Vignette
function IslandCapsuleVignette({ isHovered }: { isHovered: boolean }) {
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      setExpanded((e) => !e);
    }, 2600);
    return () => clearInterval(interval);
  }, [isHovered]);

  const isPillExpanded = isHovered || expanded;

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        setExpanded((e) => !e);
      }}
      className="flex flex-col items-center justify-center h-full w-full select-none cursor-pointer"
    >
      <motion.div
        layout
        transition={{ type: 'spring', stiffness: 420, damping: 28 }}
        className={cn(
          'flex items-center gap-2 rounded-full bg-neutral-900 border border-white/15 px-3 py-1.5 shadow-xl',
          isPillExpanded ? 'w-48 justify-between' : 'w-24 justify-center'
        )}
      >
        <div className="flex items-center gap-1.5">
          <div className="size-2 rounded-full bg-amber-400 animate-ping" />
          <Volume2 className="size-3 text-muted-foreground" />
        </div>
        {isPillExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-1 text-[11px] font-mono text-foreground truncate"
          >
            <span>Spring Engine</span>
          </motion.div>
        )}
        <div className="flex items-end gap-0.5 h-3">
          <motion.span
            animate={{ height: ['30%', '100%', '40%'] }}
            transition={{ duration: 0.6, repeat: Infinity }}
            className="w-0.5 bg-emerald-400 rounded-full"
          />
          <motion.span
            animate={{ height: ['70%', '30%', '90%'] }}
            transition={{ duration: 0.7, repeat: Infinity }}
            className="w-0.5 bg-emerald-400 rounded-full"
          />
          <motion.span
            animate={{ height: ['40%', '80%', '20%'] }}
            transition={{ duration: 0.5, repeat: Infinity }}
            className="w-0.5 bg-emerald-400 rounded-full"
          />
        </div>
      </motion.div>
      <span className="mt-2 text-[10px] text-muted-foreground font-mono">
        island layout morphing
      </span>
    </div>
  );
}

// 9. OKLCH Color Palette Token Vignette
function ColorTokenVignette({ isHovered }: { isHovered: boolean }) {
  const swatches = [
    { name: 'Charcoal', hex: '#121212', oklch: '0.145' },
    { name: 'Surface', hex: '#242424', oklch: '0.269' },
    { name: 'Accent', hex: '#FAFAFA', oklch: '0.985' },
  ];
  const [activeIdx, setActiveIdx] = useState(2);

  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % swatches.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [isHovered, swatches.length]);

  return (
    <div className="flex flex-col items-center justify-center h-full w-full select-none px-2">
      <div className="flex items-center gap-2 mb-2">
        {swatches.map((swatch, idx) => (
          <button
            key={swatch.name}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setActiveIdx(idx);
            }}
            className={cn(
              'size-6 rounded-full border transition-all cursor-pointer',
              activeIdx === idx
                ? 'scale-125 border-foreground shadow-md'
                : 'border-white/20 hover:scale-110 opacity-70'
            )}
            style={{ backgroundColor: swatch.hex }}
            title={swatch.name}
          />
        ))}
      </div>
      <div className="text-center font-mono text-[10px] text-muted-foreground">
        <span>oklch({swatches[activeIdx]?.oklch} 0 0)</span>
      </div>
    </div>
  );
}

// ============================================================================
// CARDS REGISTRY
// ============================================================================
const CARDS: CardMeta[] = [
  {
    id: 'switch',
    badge: 'Fluid Switch',
    icon: ToggleLeft,
    title: 'Autonomic Gate',
    renderVignette: (hovered) => <SwitchVignette isHovered={hovered} />,
  },
  {
    id: 'slider',
    badge: 'Spring Slider',
    icon: Sliders,
    title: 'Stiffness Dynamic',
    renderVignette: (hovered) => <SliderVignette isHovered={hovered} />,
  },
  {
    id: 'tabs',
    badge: 'Segmented Control',
    icon: Layers,
    title: 'Shared LayoutId',
    renderVignette: (hovered) => <TabsVignette isHovered={hovered} />,
  },
  {
    id: 'button',
    badge: 'Haptic Button',
    icon: Sparkles,
    title: 'Press Morph',
    renderVignette: (hovered) => <ButtonMorphVignette isHovered={hovered} />,
  },
  {
    id: 'elastic',
    badge: 'Physics Trampoline',
    icon: Radio,
    title: 'Elastic Momentum',
    renderVignette: (hovered) => <ElasticBounceVignette isHovered={hovered} />,
  },
  {
    id: 'telemetry',
    badge: 'Telemetry Stream',
    icon: Activity,
    title: '60 FPS Budget',
    renderVignette: (hovered) => <TelemetryVignette isHovered={hovered} />,
  },
  {
    id: 'auth',
    badge: 'Biometric Ring',
    icon: ShieldCheck,
    title: 'Security Token',
    renderVignette: (hovered) => <AuthRingVignette isHovered={hovered} />,
  },
  {
    id: 'island',
    badge: 'Island Capsule',
    icon: Cpu,
    title: 'FLIP Dynamic Morph',
    renderVignette: (hovered) => <IslandCapsuleVignette isHovered={hovered} />,
  },
  {
    id: 'palette',
    badge: 'OKLCH Palette',
    icon: Palette,
    title: 'Perceptual Harmony',
    renderVignette: (hovered) => <ColorTokenVignette isHovered={hovered} />,
  },
];

// ============================================================================
// CARD COMPONENT BODY (Shared for Desktop Orbit and Mobile Bento)
// ============================================================================
function CardBody({
  card,
  isHovered,
  className,
}: {
  card: CardMeta;
  isHovered: boolean;
  className?: string;
}) {
  const Icon = card.icon;

  return (
    <div
      className={cn(
        'group relative flex h-full w-full flex-col rounded-xl bg-accent/40 border border-white/[0.08] p-1 shadow-2xl backdrop-blur-md transition-all duration-300 hover:border-white/20 hover:bg-accent/60',
        className
      )}
    >
      <div className="relative flex flex-1 flex-col rounded-lg bg-background p-4 pt-7 overflow-hidden border border-white/[0.04]">
        {/* Header Badge */}
        <div className="absolute top-2.5 left-3.5 flex items-center gap-1.5 text-xs font-medium text-muted-foreground tracking-tight">
          <Icon className="size-3 text-foreground/70" />
          <span>{card.badge}</span>
        </div>

        {/* Mini Component Vignette */}
        <div className="flex-1 flex items-center justify-center w-full">
          {card.renderVignette(isHovered)}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// INDIVIDUAL ORBIT-TO-GRID CARD WITH HIGH-PERFORMANCE DIRECT GPU BINDINGS
// ============================================================================
interface OrbitCardProps {
  card: CardMeta;
  index: number;
  total: number;
  smoothProgress: ReturnType<typeof useSpring>;
  drift: ReturnType<typeof useMotionValue<number>>;
}

function OrbitCard({
  card,
  index,
  total,
  smoothProgress,
  drift,
}: OrbitCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Target 3-column Grid Coordinates:
  // col = index % 3 (0, 1, 2) -> (col - 1) * (300 + 16)
  // row = Math.floor(index / 3) (0, 1, 2) -> (row - 1) * (188 + 16) + 40
  const col = index % COLUMNS;
  const row = Math.floor(index / COLUMNS);
  const slotX = (col - (COLUMNS - 1) / 2) * (CARD_WIDTH + GAP);
  const slotY = (row - (ROWS - 1) / 2) * (CARD_HEIGHT + GAP) + 40;

  // Function to apply GPU coordinates directly to the DOM element
  const updateTransform = () => {
    const el = cardRef.current;
    if (!el) return;

    const p = smoothProgress.get();
    const driftVal = drift.get();

    // Settle factor: 0.86 to 0.98
    const settle = Math.min(1, Math.max(0, (p - 0.86) / 0.12));
    // Smoothstep: k = settle * settle * (3 - 2 * settle)
    const k = settle * settle * (3 - 2 * settle);

    // Scroll turn rotation
    const turn = Math.min(1, Math.max(0, p / 0.86)) * Math.PI * 1.1;
    // Continuous drift reduces to 0 as cards settle
    const angle = (index / total) * Math.PI * 2 + turn + driftVal * (1 - settle);

    // Depth factor from sin(angle)
    const depth = (Math.sin(angle) + 1) / 2;

    // Orbit Coordinates
    const orbitX = Math.cos(angle) * 400;
    const orbitY = Math.sin(angle) * 240 + 30;
    const orbitScale = 0.7 + 0.3 * depth;
    const orbitBlur = (1 - depth) * 1.6;
    const orbitOpacity = 0.55 + 0.45 * depth;
    const orbitRotateY = -Math.cos(angle) * 24;

    // Settle interpolation
    const x = orbitX + (slotX - orbitX) * k;
    const y = orbitY + (slotY - orbitY) * k;
    const scale = k > 0.5 ? 1 : orbitScale + (1 - orbitScale) * k;
    const opacity = orbitOpacity + (1 - orbitOpacity) * k;
    const rotateY = k > 0.5 ? 0 : orbitRotateY * (1 - k);
    const blur = k > 0.5 ? 0 : orbitBlur * (1 - k);
    const zIndex = k > 0.8 ? 10 + index : Math.round(depth * 100);

    // High performance GPU transform
    el.style.transform = `perspective(900px) translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0px) scale(${scale.toFixed(4)}) rotateY(${rotateY.toFixed(2)}deg)`;
    el.style.opacity = opacity.toFixed(3);
    el.style.filter = blur > 0.05 ? `blur(${blur.toFixed(2)}px)` : 'none';
    el.style.zIndex = String(zIndex);
    el.style.pointerEvents = k > 0.8 ? 'auto' : 'none';
  };

  // Bind to smoothProgress changes
  useMotionValueEvent(smoothProgress, 'change', updateTransform);

  // Bind to drift continuous animation
  useMotionValueEvent(drift, 'change', updateTransform);

  // Initial calculation on mount
  useEffect(() => {
    updateTransform();
  });

  return (
    <div
      ref={cardRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginTop: -CARD_HEIGHT / 2,
        marginLeft: -CARD_WIDTH / 2,
        willChange: 'transform, opacity, filter',
      }}
    >
      <CardBody card={card} isHovered={isHovered} />
    </div>
  );
}

// ============================================================================
// MAIN ORBIT SHOWCASE COMPONENT
// ============================================================================
export function OrbitShowcase() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [stageScale, setStageScale] = useState(1);
  const prefersReduced = useReducedMotion();

  // Scroll tracking across h-[300vh]
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end end'],
  });

  // Spring-smoothed scroll progress
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 160,
    damping: 32,
    mass: 0.4,
  });

  // Idle continuous drift
  const drift = useMotionValue(0);
  useAnimationFrame((_, delta) => {
    // Continuous drift is active while in orbit
    if (smoothProgress.get() < 0.98) {
      drift.set(drift.get() + delta * 0.00008);
    }
  });

  // Responsive stage scaler: maintain virtual 1200x780 stage
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) {
        const scale = Math.min(1, window.innerWidth / 1200, (window.innerHeight - 80) / 780);
        setStageScale(scale);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // --------------------------------------------------------------------------
  // HEADLINE TRANSFORM MAPPINGS (Crossfade with Gaussian Deblur)
  // --------------------------------------------------------------------------
  // Headline 1: "Every primitive, alive."
  // Visible from 0.0 to 0.78, exits y: -24, opacity: 0, blur: 8px between 0.78 and 0.87
  const h1Opacity = useTransform(smoothProgress, [0, 0.78, 0.87], [1, 1, 0]);
  const h1Y = useTransform(smoothProgress, [0, 0.78, 0.87], [0, 0, -24]);
  const h1Blur = useTransform(
    smoothProgress,
    [0, 0.78, 0.87],
    ['blur(0px)', 'blur(0px)', 'blur(8px)']
  );

  // Headline 2: "Go ahead, play with them."
  // Enters y: 24 -> 0, opacity: 0 -> 1, blur: 8px -> 0px between 0.90 and 0.97
  const h2Opacity = useTransform(smoothProgress, [0.89, 0.90, 0.97, 1], [0, 0, 1, 1]);
  const h2Y = useTransform(smoothProgress, [0.89, 0.90, 0.97, 1], [24, 24, 0, 0]);
  const h2Blur = useTransform(
    smoothProgress,
    [0.89, 0.90, 0.97, 1],
    ['blur(8px)', 'blur(8px)', 'blur(0px)', 'blur(0px)']
  );

  // --------------------------------------------------------------------------
  // CENTRAL 3D TUMBLING LOGO & AMBIENT AURA MAPPINGS
  // --------------------------------------------------------------------------
  // Aura glow maps from 0.5 to 1.0, fading to 0 as grid settles (0.86 to 0.94)
  const auraOpacity = useTransform(smoothProgress, [0, 0.45, 0.86, 0.94], [0.5, 1.0, 1.0, 0]);

  // Logo scale: [0.8, 1, 1, 0.3] over [0, 0.3, 0.86, 0.95]
  const logoScale = useTransform(smoothProgress, [0, 0.3, 0.86, 0.95], [0.8, 1, 1, 0.3]);
  // Logo opacity: fades out completely 0.86 -> 0.94
  const logoOpacity = useTransform(smoothProgress, [0, 0.86, 0.94], [1, 1, 0]);
  // 3D Rotation: rotate -60deg to 240deg
  const logoRotate = useTransform(smoothProgress, [0, 0.9], [-60, 240]);
  // RotateX tilt: 24deg to -12deg to 24deg
  const logoRotateX = useTransform(smoothProgress, [0, 0.45, 0.9], [24, -12, 24]);
  // Pointer events gate: clickable when visible, non-blocking when docked
  const buttonPointerEvents = useTransform(smoothProgress, (v) => (v > 0.86 ? 'none' : 'auto'));

  // --------------------------------------------------------------------------
  // MOBILE FALLBACK OR REDUCED MOTION BYPASS
  // --------------------------------------------------------------------------
  if (isMobile || prefersReduced) {
    return (
      <section id="primitives" className="relative w-full py-28 px-6 max-w-[1100px] mx-auto text-left">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-medium tracking-tight text-balance text-foreground"
          >
            Every primitive, alive.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-3 text-sm md:text-base text-muted-foreground"
          >
            Go ahead, play with them.
          </motion.p>
          <div className="mt-8 flex justify-center">
            <ValoriaPrimitiveButton width={180} height={168} interactive />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {CARDS.map((card, idx) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 24, filter: 'blur(6px)' }}
              whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.6, delay: idx * 0.08, ease: EASE_OUT }}
              className="h-[190px] w-full"
            >
              <CardBody card={card} isHovered={false} />
            </motion.div>
          ))}
        </div>
      </section>
    );
  }

  // --------------------------------------------------------------------------
  // DESKTOP SCROLL-DRIVEN 3D ORBIT-TO-GRID SHOWCASE
  // --------------------------------------------------------------------------
  return (
    <section
      ref={containerRef}
      id="primitives"
      className="relative h-[300vh] w-full"
    >
      {/* Viewport Lock: Sticky Container */}
      <div className="sticky top-20 h-[calc(100dvh-5rem)] flex items-center justify-center overflow-hidden">
        {/* Virtual 1200x780 Scaled Stage */}
        <div
          style={{
            width: 1200,
            height: 780,
            transform: `scale(${stageScale})`,
            transformOrigin: 'center center',
          }}
          className="relative flex items-center justify-center select-none"
        >
          {/* Top Sticky Titles Crossfade Zone */}
          <div className="absolute top-10 left-0 right-0 z-30 pointer-events-none flex items-center justify-center text-center">
            {/* Headline 1 */}
            <motion.h2
              style={{
                opacity: h1Opacity,
                y: h1Y,
                filter: h1Blur,
              }}
              className="absolute text-4xl md:text-5xl font-medium tracking-tight text-balance text-foreground whitespace-nowrap"
            >
              Every primitive, alive.
            </motion.h2>

            {/* Headline 2 */}
            <motion.h2
              style={{
                opacity: h2Opacity,
                y: h2Y,
                filter: h2Blur,
              }}
              className="absolute text-4xl md:text-5xl font-medium tracking-tight text-balance text-foreground whitespace-nowrap"
            >
              Go ahead, play with them.
            </motion.h2>
          </div>

          {/* Central Ambient Aura Glow */}
          <motion.div
            style={{ opacity: auraOpacity }}
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 left-1/2 size-[480px] -mt-[240px] -ml-[240px] rounded-full bg-foreground/10 blur-3xl"
          />

          {/* Central 3D Tumbling Primitive Delta Emblem (matching sample video) */}
          <motion.div
            style={{
              scale: logoScale,
              opacity: logoOpacity,
              rotate: logoRotate,
              rotateX: logoRotateX,
              transformPerspective: 1200,
              pointerEvents: buttonPointerEvents,
            }}
            className="absolute top-1/2 left-1/2 -mt-[120px] -ml-[128px] w-[256px] h-[240px] z-20 flex items-center justify-center"
          >
            <ValoriaPrimitiveButton width={256} height={240} interactive />
          </motion.div>

          {/* 3D Orbit-to-Grid Cards Constellation */}
          {CARDS.map((card, index) => (
            <OrbitCard
              key={card.id}
              card={card}
              index={index}
              total={TOTAL_CARDS}
              smoothProgress={smoothProgress}
              drift={drift}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
