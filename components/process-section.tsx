import { Upload, Zap, Image } from 'lucide-react';
import { Card } from '@/components/ui/card';

const steps = [
  {
    step: 1,
    title: 'Upload Your Selfie',
    description: 'Take a photo of yourself or choose from your device. Any clear selfie works best.',
    icon: Upload,
  },
  {
    step: 2,
    title: 'AI Searches Your Face',
    description: 'Our advanced AI searches through millions of event photos in seconds.',
    icon: Zap,
  },
  {
    step: 3,
    title: 'View & Download',
    description: 'Browse all the photos where you appear and download them instantly.',
    icon: Image,
  },
];

export function ProcessSection() {
  return (
    <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background to-card relative overflow-hidden">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 animated-gradient-bg opacity-10 blur-3xl"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16 slide-up">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Three simple steps to find yourself in event photos
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((item, index) => {
            const Icon = item.icon;
            return (
              <Card
                key={item.step}
                className="p-8 border-0 bg-background hover:shadow-2xl smooth-transition hover-lift"
                style={{
                  animation: `slide-up 0.6s ease-out ${index * 0.1}s forwards`,
                  opacity: 0,
                }}
              >
                {/* Step Number */}
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-accent text-primary-foreground font-bold text-lg mb-4 glow-effect">
                  {item.step}
                </div>

                {/* Icon */}
                <Icon className="w-10 h-10 text-primary mb-4 float-animation" />

                {/* Title */}
                <h3 className="text-xl font-semibold mb-3">{item.title}</h3>

                {/* Description */}
                <p className="text-muted-foreground">{item.description}</p>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
