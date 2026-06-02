import { EventUploadForm } from '@/components/event-upload-form';

export default function UploadPhotosPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <main className="min-h-screen py-12 md:py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">Upload Event Photos</h1>
          <p className="text-lg text-muted-foreground">
            Add your event photos to our collection so attendees can find themselves
          </p>
        </div>

        {/* Form */}
        <EventUploadForm  id={params.id} />
      </div>
    </main>
  );
}
