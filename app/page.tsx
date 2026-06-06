import { HeroSection } from '@/components/hero-section';
import { ProcessSection } from '@/components/process-section';
import { GallerySection } from '@/components/gallery-section';
import { Navbar } from '@/components/navbar';
export default function HomePage() {
  return (
    <main>
      <Navbar />
      <HeroSection />
      <ProcessSection />
      <GallerySection />
    </main>
  );
}
