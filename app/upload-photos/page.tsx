'use client';
import { DashboardLayout } from '@/components/dashboard-layout';
import { useMemo, useState } from 'react';
import { uploadPhotos } from '@/lib/api-client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { DashboardCard } from '@/components/dashboard-card';
import {
  CalendarDays,
  Image as ImageIcon,
  Search,
  Users,
  PlusCircle,
  UploadCloud,
  BarChart3,
  Share2,
  ArrowRight,
  FolderPlus,
} from 'lucide-react';

const events = [
  {
    id: '1',
    name: 'Summer Launch Party',
    date: 'June 12, 2026',
    cover: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1000&q=80',
    photos: 128,
    searches: 74,
    attendees: 560,
  },
  {
    id: '2',
    name: 'City Marathon 2026',
    date: 'July 8, 2026',
    cover: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1000&q=80',
    photos: 212,
    searches: 98,
    attendees: 1_230,
  },
  {
    id: '3',
    name: 'Rooftop Awards Gala',
    date: 'August 21, 2026',
    cover: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1000&q=80',
    photos: 84,
    searches: 45,
    attendees: 320,
  },
];

const stats = [
  {
    title: 'Total Events',
    value: 18,
    icon: <CalendarDays size={22} className="text-primary" />,
    trend: { value: 12, isPositive: true },
  },
  {
    title: 'Total Photos',
    value: '4.2K',
    icon: <ImageIcon size={22} className="text-primary" />,
    trend: { value: 8, isPositive: true },
  },
  {
    title: 'Faces Indexed',
    value: 3_450,
    icon: <Users size={22} className="text-primary" />,
    trend: { value: 6, isPositive: true },
  },
  {
    title: 'Total Searches',
    value: 1_120,
    icon: <Search size={22} className="text-primary" />,
    trend: { value: 18, isPositive: true },
  },
];

export default function CreatorDashboardPage() {
  const [uploadOpen, setUploadOpen] = useState(false);
  const [activeEvent, setActiveEvent] = useState<typeof events[number] | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadState, setUploadState] = useState<'idle' | 'uploading' | 'success'>('idle');
  const [dragActive, setDragActive] = useState(false);

  const totalFiles = selectedFiles.length;

  const quickActions = useMemo(
    () => [
      {
        title: 'Create Event',
        description: 'Launch a new event and invite attendees.',
        icon: <PlusCircle size={24} className="text-primary" />,
      },
      {
        title: 'Upload Photos',
        description: 'Add new images to your event galleries.',
        icon: <UploadCloud size={24} className="text-primary" />,
      },
      {
        title: 'View Analytics',
        description: 'Track engagement and search trends.',
        icon: <BarChart3 size={24} className="text-primary" />,
      },
      {
        title: 'Share Event',
        description: 'Send event links to your attendees.',
        icon: <Share2 size={24} className="text-primary" />,
      },
    ],
    [],
  );

  const openUpload = (event: typeof events[number]) => {
    setActiveEvent(event);
    setUploadOpen(true);
    setSelectedFiles([]);
    setUploadProgress(0);
    setUploadState('idle');
  };

  const onFilesAdded = (files: FileList | File[]) => {
    const array = Array.isArray(files) ? files : Array.from(files);
    const images = array.filter((file) => file.type.startsWith('image/'));
    setSelectedFiles((current) => [...current, ...images]);
  };

  const startUpload = () => {
    if (!selectedFiles.length) return;
    (async () => {
      setUploadState('uploading');
      setUploadProgress(0);

      try {
        // Start a simple progress animation while upload is in-flight
        const interval = window.setInterval(() => {
          setUploadProgress((current) => Math.min(95, current + Math.ceil(100 / selectedFiles.length / 4)));
        }, 200);

        // Call API to upload photos (client converts files to base64)
        await uploadPhotos(activeEvent?.name || 'Event', new Date().toISOString().split('T')[0], '', selectedFiles);

        window.clearInterval(interval);
        setUploadProgress(100);
        setUploadState('success');
      } catch (err) {
        console.error('Upload failed', err);
        setUploadState('idle');
        setUploadProgress(0);
      }
    })();
  };

  const closeUpload = () => {
    setUploadOpen(false);
    setActiveEvent(null);
    setUploadState('idle');
    setUploadProgress(0);
    setDragActive(false);
  };

  return (
    <main className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="mx-auto max-w-7xl space-y-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-3">
            <p className="text-sm uppercase tracking-[0.24em] text-muted-foreground">Dashboard</p>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900">
              Creator dashboard
            </h1>
            <p className="max-w-2xl text-base text-muted-foreground">
              Manage your events, uploads, and photo searches.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button className="rounded-full px-5 py-3" size="lg">
              Create Event
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {stats.map((item) => (
            <DashboardCard key={item.title} {...item} />
          ))}
        </div>

        <section className="space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-muted-foreground">Recent Events</p>
              <h2 className="text-2xl font-semibold text-slate-900">Your most active events</h2>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button variant="outline">View all events</Button>
              <Button onClick={() => openUpload(events[0])}>Upload Photos</Button>
            </div>
          </div>

          <div className="grid gap-4 xl:grid-cols-3">
            {events.map((event) => (
              <Card key={event.id} className="overflow-hidden border-0 bg-white shadow-sm">
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={event.cover}
                    alt={event.name}
                    className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                </div>
                <div className="space-y-4 p-6">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-semibold text-slate-900">{event.name}</h3>
                      <p className="text-sm text-muted-foreground">{event.date}</p>
                    </div>
                    <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                      {event.attendees.toLocaleString()} attendees
                    </span>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-lg bg-slate-50 p-4">
                      <p className="text-sm text-muted-foreground">Uploaded photos</p>
                      <p className="mt-2 text-lg font-semibold text-slate-900">{event.photos}</p>
                    </div>
                    <div className="rounded-lg bg-slate-50 p-4">
                      <p className="text-sm text-muted-foreground">Searches</p>
                      <p className="mt-2 text-lg font-semibold text-slate-900">{event.searches}</p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <Button variant="outline" className="flex-1">
                      Manage Event
                    </Button>
                    <Button className="flex-1" onClick={() => openUpload(event)}>
                      Upload Photos
                    </Button>
                    <Button variant="secondary" className="flex-1">
                      Share Event
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        <section className="space-y-6">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-muted-foreground">Quick Actions</p>
            <h2 className="text-2xl font-semibold text-slate-900">Fast access to the tools you need</h2>
          </div>

          <div className="grid gap-4 xl:grid-cols-4">
            {quickActions.map((action) => (
              <Card key={action.title} className="group cursor-pointer border-0 bg-white p-6 transition hover:-translate-y-1 hover:shadow-lg">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary transition group-hover:bg-primary/20">
                  {action.icon}
                </div>
                <div className="mt-5 space-y-3">
                  <h3 className="text-lg font-semibold text-slate-900">{action.title}</h3>
                  <p className="text-sm leading-6 text-muted-foreground">{action.description}</p>
                </div>
                <div className="mt-6 flex items-center gap-2 text-sm font-medium text-primary">
                  <span>Go to action</span>
                  <ArrowRight size={16} />
                </div>
              </Card>
            ))}
          </div>
        </section>
      </div>

      <Dialog open={uploadOpen} onOpenChange={setUploadOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Upload photos to {activeEvent?.name || 'event'}</DialogTitle>
            <DialogDescription>
              Add multiple images and track upload progress for this event. Supported formats: JPG, PNG, WEBP.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-6 space-y-6">
            <div
              onDragOver={(event) => {
                event.preventDefault();
                setDragActive(true);
              }}
              onDragLeave={() => setDragActive(false)}
              onDrop={(event) => {
                event.preventDefault();
                setDragActive(false);
                onFilesAdded(event.dataTransfer.files);
              }}
              className={`rounded-3xl border-2 border-dashed p-10 text-center transition ${
                dragActive ? 'border-primary bg-primary/5' : 'border-slate-200 bg-white'
              }`}
            >
              <div className="mx-auto max-w-xs space-y-3">
                <UploadCloud size={32} className="mx-auto text-primary" />
                <p className="text-xl font-semibold text-slate-900">Drag & drop photos here</p>
                <p className="text-sm text-muted-foreground">
                  Upload multiple images for {activeEvent?.name || 'your event'}.
                </p>
                <label className="inline-flex cursor-pointer rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-900 transition hover:border-primary hover:bg-primary/5">
                  Select files
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    hidden
                    onChange={(event) => {
                      if (event.target.files) onFilesAdded(event.target.files);
                    }}
                  />
                </label>
              </div>
            </div>

            {totalFiles > 0 && (
              <div className="space-y-4 rounded-3xl border border-slate-200 bg-white p-5">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-slate-900">Selected files</p>
                    <p className="text-sm text-muted-foreground">{totalFiles} image(s) ready to upload</p>
                  </div>
                  <p className="text-sm text-muted-foreground">{selectedFiles.map((file) => file.name).join(', ')}</p>
                </div>
                <div className="space-y-3">
                  <Progress value={uploadProgress} />
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>Status</span>
                    <span>{uploadState === 'success' ? 'Upload complete' : `${uploadProgress}%`}</span>
                  </div>
                </div>
              </div>
            )}

            {uploadState === 'success' && (
              <div className="rounded-3xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
                Your photos were uploaded successfully and are now available in the event gallery.
              </div>
            )}
          </div>

          <DialogFooter className="mt-6">
            <Button variant="outline" onClick={closeUpload}>
              Close
            </Button>
            <Button
              onClick={startUpload}
              disabled={!selectedFiles.length || uploadState === 'uploading' || uploadState === 'success'}
            >
              {uploadState === 'uploading' ? 'Uploading...' : uploadState === 'success' ? 'Done' : 'Start Upload'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}
