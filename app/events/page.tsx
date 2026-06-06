'use client';
import { DashboardLayout } from '@/components/dashboard-layout';
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CreateEventDialog } from '@/components/create-event-dialog';
import { CalendarDays, Image as ImageIcon, Plus } from 'lucide-react';
import { useEvents, EventItem } from '@/hooks/use-events';
import Link from 'next/link';

export default function EventsPage() {
  const { events, loading, refresh } = useEvents();
  const [createOpen, setCreateOpen] = useState(false);

  const handleEventCreated = async () => {
    await refresh();
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  return (
    <DashboardLayout>
      <main className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="mx-auto max-w-7xl space-y-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-3">
              <p className="text-sm uppercase tracking-[0.24em] text-muted-foreground">Events</p>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900">
                Your Events
              </h1>
              <p className="max-w-2xl text-base text-muted-foreground">
                Create and manage your photo events.
              </p>
            </div>

            <Button className="rounded-full px-5 py-3" size="lg" onClick={() => setCreateOpen(true)}>
              <Plus size={18} className="mr-2" />
              Create Event
            </Button>
          </div>

          <section className="space-y-6">
            {loading ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Loading events...</p>
              </div>
            ) : events.length === 0 ? (
              <Card className="p-8 text-center border-0 bg-background card-shadow">
                <CalendarDays size={48} className="mx-auto mb-4 text-muted-foreground" />
                <h2 className="text-2xl font-bold mb-2">No events yet</h2>
                <p className="text-muted-foreground mb-6">
                  Create your first event to start uploading photos.
                </p>
                <Button onClick={() => setCreateOpen(true)}>Create Event</Button>
              </Card>
            ) : (
              <div className="grid gap-4 xl:grid-cols-3">
                {events.map((event: EventItem) => {
                  const coverImage = event.cover_photo_data
                    ? `data:image/jpeg;base64,${event.cover_photo_data}`
                    : 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1000&q=80';

                  return (
                    <Card key={event.id} className="overflow-hidden border-0 bg-white shadow-sm hover:shadow-md transition-shadow">
                      <div className="relative h-56 overflow-hidden bg-slate-100">
                        <img
                          src={coverImage}
                          alt={event.name}
                          className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                        />
                      </div>
                      <div className="space-y-4 p-6">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div>
                            <h3 className="text-xl font-semibold text-slate-900">{event.name}</h3>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                              <CalendarDays size={16} />
                              {formatDate(event.event_date)}
                            </div>
                          </div>
                          <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                            {event.photoCount ?? 1} photo{event.photoCount === 1 ? '' : 's'}
                          </div>
                        </div>

                        {event.description && (
                          <p className="text-sm text-muted-foreground line-clamp-2">{event.description}</p>
                        )}

                        <div className="flex flex-col gap-3 sm:flex-row">
                          <Link
                            href={{
                              pathname: `/events/${event.id}`,
                              query: {
                                id: event.id,
                                name: event.name,
                                description: event.description ?? '',
                                // coverImage: coverImage,
                                date: event.event_date,
                                photoCount: event.photoCount ?? 0,
                              },
                            }}
                            className="flex flex-1 items-center justify-center gap-2 rounded-md bg-muted px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted/80"
                                        
                                      >Manage</Link>
                      
                          {/* <Link
                            href={{
                              pathname: `/events/${event.id}`,
                              query: {
                                id: event.id,
                                name: event.name,
                                description: event.description ?? '',
                                coverImage: coverImage,
                                date: event.event_date,
                                photoCount: event.photoCount ?? 0,
                              },
                            }}
                            className="flex flex-1 items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                          >
                            <ImageIcon size={16} />
                            Upload Photos
                          </Link> */}
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </section>
        </div>

        <CreateEventDialog open={createOpen} onOpenChange={setCreateOpen} onEventCreated={handleEventCreated} />
      </main>
    </DashboardLayout>
  );
}
