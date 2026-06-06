'use client';

import { useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Trash2, CheckCircle2 } from 'lucide-react';
import { EventUploadForm } from '@/components/event-upload-form';
import { DashboardLayout } from '@/components/dashboard-layout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const DEFAULT_COVER = 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80';
const PAGE_SIZE = 6;

export default function UploadPhotosPage() {
  const searchParams = useSearchParams();

  const id = searchParams.get('id') ?? '';
  const name = searchParams.get('name') ?? 'Event';
  const description = searchParams.get('description') ?? 'Manage your event gallery and upload more images.';
  const coverImage = searchParams.get('coverImage') ?? DEFAULT_COVER;
  const date = searchParams.get('date') ?? 'TBD';
  const photoCount = Number(searchParams.get('photoCount') ?? 0);

  const [status, setStatus] = useState<'Draft' | 'Published' | 'Archived'>('Published');
  const [selectedPhotoIds, setSelectedPhotoIds] = useState<string[]>([]);
  const [page, setPage] = useState(1);

  const galleryPhotos = useMemo(() =>
    Array.from({ length: Math.max(photoCount, 4) }, (_, index) => ({
      id: `${id || 'event'}-${index + 1}`,
      label: `Photo ${index + 1}`,
      src: coverImage,
    })),
    [coverImage, id, photoCount]
  );

  const totalPages = Math.max(1, Math.ceil(galleryPhotos.length / PAGE_SIZE));
  const visiblePhotos = galleryPhotos.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const togglePhoto = (photoId: string) => {
    setSelectedPhotoIds((prev) =>
      prev.includes(photoId) ? prev.filter((item) => item !== photoId) : [...prev, photoId]
    );
  };

  const selectAll = () => {
    setSelectedPhotoIds(visiblePhotos.map((photo) => photo.id));
  };

  const clearSelection = () => setSelectedPhotoIds([]);
  const removeSelected = () => {
    if (selectedPhotoIds.length === 0) return;
    setSelectedPhotoIds([]);
  };

  return (
    <DashboardLayout>
      <main className="min-h-screen bg-slate-50  ">
        <div className=" flex max-w-7xl flex-col">
            <Card className="relative rounded-0 overflow-hidden border-0 bg-white p-0 ">
              <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${coverImage})` }} />
              <div className="absolute inset-0 bg-linear-to-t from-slate-950/85 via-slate-900/45 to-slate-900/20" />
              <div className="relative flex  flex-col justify-between text-white">
                <div className="space-y-3">
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-200">Event overview</p>
                  <h2 className="text-3xl font-semibold text-white">{name}</h2>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm">
                    <p className="text-[11px] uppercase tracking-[0.24em] text-slate-200">Date</p>
                    <p className="mt-2 text-lg font-semibold text-white">{date}</p>
                  </div>
                  <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm">
                    <p className="text-[11px] uppercase tracking-[0.24em] text-slate-200">Photos</p>
                    <p className="mt-2 text-lg font-semibold text-white">{photoCount}</p>
                  </div>
                </div>
              </div>
            </Card>

          <section className="flex">

            <Card className="border-0 bg-white p-6 shadow-sm">
              <div className="space-y-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.24em] text-muted-foreground">Upload</p>
                  <h2 className="mt-2 text-2xl font-semibold">Add more photos</h2>
                  <p className="text-sm text-muted-foreground">The upload summary only shows how many photos are queued, keeping the action area clean.</p>
                </div>
                <EventUploadForm id={id || 'event'} />
              </div>
            </Card>
            <Card className="border-0 bg-white p-6 shadow-sm">
              <div className="space-y-5">
                <div>
                  <p className="text-sm uppercase tracking-[0.24em] text-muted-foreground">Control center</p>
                  <h2 className="mt-2 text-2xl font-semibold">Selected photos</h2>
                  <p className="text-sm text-muted-foreground">Choose what to do with the images currently highlighted in the gallery.</p>
                </div>

                <div className="rounded-xl border border-border bg-muted/50 p-4">
                  <p className="text-sm font-semibold">Bulk actions</p>
                  <p className="mt-1 text-sm text-muted-foreground">{selectedPhotoIds.length} photo(s) currently selected.</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Button size="sm" variant="outline" onClick={selectAll}>Select visible</Button>
                    <Button size="sm" variant="outline" onClick={clearSelection}>Clear</Button>
                    <Button size="sm" className="bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={removeSelected} disabled={selectedPhotoIds.length === 0}>
                      <Trash2 size={14} className="mr-2" />Remove selected
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
              

          </section>

          <section className="flex w-full">
            <Card className="border-0 bg-white p-1 shadow-sm">
              <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
                <div>
                  <p className="text-sm uppercase tracking-[0.24em] text-muted-foreground">Gallery</p>
                  <h2 className="mt-2 text-2xl font-semibold">Event photos</h2>
                </div>
                <div className="rounded-full bg-muted px-3 py-1 text-sm text-muted-foreground">Page {page} of {totalPages}</div>
              </div>

              <div className="flex">
                {visiblePhotos.map((photo) => {
                  const isSelected = selectedPhotoIds.includes(photo.id);
                  return (
                    <article key={photo.id} className="group relative overflow-hidden rounded-3xl border border-border bg-slate-100 shadow-sm">
                      <img src={photo.src} alt={photo.label} className="h-40 w-full object-cover" />
                      <div className="absolute inset-0 bg-linear-to-t from-slate-950/30 to-transparent" />
                      <button
                        type="button"
                        onClick={() => togglePhoto(photo.id)}
                        className={`absolute left-3 top-3 flex h-6 w-6 items-center justify-center rounded-full border shadow-sm ${isSelected ? 'border-primary bg-primary text-primary-foreground' : 'border-white/80 bg-white/90 text-slate-700'}`}
                        aria-label={`Select ${photo.label}`}
                      >
                        {isSelected ? <CheckCircle2 size={12} /> : <span className="h-2 w-2 rounded-full bg-current" />}
                      </button>
                    </article>
                  );
                })}
              </div>

              <div className="mt-6 flex items-center justify-between gap-3">
                <Button variant="outline" size="sm" onClick={() => setPage((prev) => Math.max(1, prev - 1))} disabled={page === 1}>Previous</Button>
                <div className="flex items-center gap-2">
                  {Array.from({ length: totalPages }, (_, index) => index + 1).map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setPage(item)}
                      className={`h-9 w-9 rounded-full text-sm ${page === item ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
                <Button variant="outline" size="sm" onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))} disabled={page === totalPages}>Next</Button>
              </div>
            </Card>

          
          </section>
        </div>
      </main>
    </DashboardLayout>
  );
}
