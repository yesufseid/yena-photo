import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles } from 'lucide-react';

export function HeroSection() {
  return (
    <section   style={{
      backgroundImage: "url('bg5.jpg')",
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
    }}  className="min-h-[calc(100vh-64px)]  flex items-center justify-center relative py-12 md:py-20 overflow-hidden">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 animated-gradient-bg opacity-30 blur-3xl"></div>
      
      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-primary/15 border border-primary/30 slide-up backdrop-blur-sm">
          <Sparkles size={16} className="text-primary animate-spin" style={{ animationDuration: '3s' }} />
          <span className="text-sm font-semibold text-primary">AI-Powered Face Recognition</span>
        </div>

        {/* Headline */}
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 slide-up-delay-1">
          <span className="gradient-text">Find Your Photos Instantly</span>
        </h1>

        {/* Subheadline */}
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 slide-up-delay-2">
          Upload your selfie and discover yourself in event photo collections. No more scrolling through hundreds of photos—our AI finds you in seconds.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 slide-up-delay-3">
          <Button
            asChild
            size="lg"
            className="bg-gradient-to-r from-primary to-accent hover:from-accent hover:to-primary text-primary-foreground smooth-transition hover-lift shadow-lg"
          >
            <Link href="/find-photos" className="gap-2">
              Find My Photos
              <ArrowRight size={20} />
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="smooth-transition hover-lift"
          >
            <Link href="/upload-photos">
              Upload Event Photos
            </Link>
          </Button>
        </div>

        {/* Social Proof */}
        <div className="text-sm text-muted-foreground">
          Join thousands of event photographers and attendees
        </div>
      </div>
    </section>
  );
}
