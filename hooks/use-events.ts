'use client';

import { useEffect, useState } from 'react';
import { getEvents, type EventItem } from '@/lib/api-client';

export type { EventItem } from '@/lib/api-client';

const EVENTS_STORAGE_KEY = 'yena_events_cache';
let cachedEvents: EventItem[] | null = null;
let fetchPromise: Promise<EventItem[] | null> | null = null;

export async function fetchEvents(): Promise<EventItem[] | null> {
  if (cachedEvents) {
    return cachedEvents;
  }

  if (fetchPromise) {
    return fetchPromise;
  }

  fetchPromise = (async () => {
    try {
      const events = await getEvents();
      cachedEvents = events;
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(events));
      }
      return events;
    } catch (error) {
      console.error('Failed to fetch events from API', error);
      return null;
    } finally {
      fetchPromise = null;
    }
  })();

  return fetchPromise;
}

export function useEvents() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const restoreEvents = async () => {
      if (typeof window === 'undefined') {
        return;
      }

      const cached = window.localStorage.getItem(EVENTS_STORAGE_KEY);
      if (cached) {
        try {
          const parsed = JSON.parse(cached) as EventItem[];
          if (Array.isArray(parsed)) {
            setEvents(parsed);
          }
        } catch (error) {
          console.warn('Failed to parse cached events', error);
          window.localStorage.removeItem(EVENTS_STORAGE_KEY);
        }
      }

      const freshEvents = await fetchEvents();
      if (!mounted) {
        return;
      }

      if (freshEvents) {
        setEvents(freshEvents);
      }
      setLoading(false);
    };

    restoreEvents();

    return () => {
      mounted = false;
    };
  }, []);

  return {
    events,
    loading,
    refresh: fetchEvents,
  };
}
