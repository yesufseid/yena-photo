'use client';
import { DashboardLayout } from '@/components/dashboard-layout';
import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CreateEventDialog } from '@/components/create-event-dialog';
import { CalendarDays, Image as ImageIcon, Plus } from 'lucide-react';

interface Event {
  id: string;
  name: string;
  event_date: string;
  description?: string;
  cover_photo?: string;
  cover_photo_data?: string;
  created_at: string;
}

const EVENTS_STORAGE_KEY = 'yena_events_cache';

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);

  const loadEventsFromAPI = async () => {
    try {
      const res = await fetch('/api/events');
      const data = await res.json();
      if (data.success && data.events) {
        setEvents(data.events);
        window.localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(data.events));
        return data.events;
      }
    } catch (err) {
      console.error('Failed to load events', err);
    }
    return null;
  };

  useEffect(() => {
    const loadEvents = async () => {
      // Try to load from cache first
      const cached = window.localStorage.getItem(EVENTS_STORAGE_KEY);
      if (cached) {
        try {
          const parsed = JSON.parse(cached) as Event[];
          setEvents(parsed);
          setLoading(false);
        } catch (err) {
          console.warn('Failed to parse cached events', err);
          window.localStorage.removeItem(EVENTS_STORAGE_KEY);
        }
      }

      // Fetch fresh data from API
      await loadEventsFromAPI();
      setLoading(false);
    };

    loadEvents();
  }, []);

  const handleEventCreated = async () => {
    // Refresh events from API after creation
    await loadEventsFromAPI();
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
                {events.map((event) => {
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
                        <div>
                          <h3 className="text-xl font-semibold text-slate-900">{event.name}</h3>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                            <CalendarDays size={16} />
                            {formatDate(event.event_date)}
                          </div>
                        </div>

                        {event.description && (
                          <p className="text-sm text-muted-foreground line-clamp-2">{event.description}</p>
                        )}

                        <div className="flex flex-col gap-3 sm:flex-row">
                          <Button variant="outline" className="flex-1">
                            Manage
                          </Button>
                          <Button className="flex-1">
                            <ImageIcon size={16} className="mr-2" />
                            Upload Photos
                          </Button>
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
