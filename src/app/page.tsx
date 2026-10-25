import { HeroSection } from '@/components/hero-section';
import { ArchitectureSection } from '@/components/architecture-section';
import { OrbitShowcase } from '@/components/orbit-showcase';
import { PhysicsLab } from '@/components/physics-lab';
import { Footer } from '@/components/footer';

export default function Home() {
  return (
    <main className="flex-1 flex flex-col w-full">
      <HeroSection />
      <ArchitectureSection />
      <OrbitShowcase />
      <PhysicsLab />
      <Footer />
    </main>
  );
}
