import { HeroSection } from '@/components/hero-section';
import { ProcessSection } from '@/components/process-section';
import { GallerySection } from '@/components/gallery-section';

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <ProcessSection />
      <GallerySection />
    </main>
  );
}
