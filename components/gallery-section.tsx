import { Card } from '@/components/ui/card';
import Image from 'next/image';

const samplePhotos = [
  { id: 1, aspect: 'portrait', title: 'Festival 2024', image: 'images.jpg' },
  { id: 2, aspect: 'landscape', title: 'Wedding Reception', image: 'download (2).jpg' },
  { id: 3, aspect: 'square', title: 'Concert Night', image: 'download (3).jpg' },
  { id: 4, aspect: 'square', title: 'Beach Party', image: 'download.jpg' },
  { id: 5, aspect: 'landscape', title: 'Corporate Event', image: 'images (1).jpg' },
  { id: 6, aspect: 'portrait', title: 'Birthday Bash', image: 'download (1).jpg ' },
];
export function GallerySection() {
  return (
    <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Sample Events</h2>
          <p className="text-lg text-muted-foreground">
            Browse through event collections and find yourself
          </p>
        </div>

        {/* Photo Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {samplePhotos.map((photo) => (
            <Card
              key={photo.id}
              className={`overflow-hidden cursor-pointer group border-0 card-shadow ${
                photo.aspect === 'portrait' ? 'lg:col-span-1 row-span-2' : 'lg:col-span-2'
              }`}
            >
              {/* Placeholder Image */}
              <div
  className={`relative w-full overflow-hidden ${
    photo.aspect === 'portrait'
      ? 'aspect-[3/4]'
      : photo.aspect === 'landscape'
      ? 'aspect-[4/3]'
      : 'aspect-square'
  }`}
>
  <Image
    src={photo.image}
    alt={photo.title}
    fill
    sizes="(max-width:768px) 50vw, (max-width:1024px) 33vw, 16vw"
    className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
  />

  <div className="absolute inset-0 bg-black/30 flex items-end">
    <p className="p-4 text-white font-semibold">
      {photo.title}
    </p>
  </div>
</div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
