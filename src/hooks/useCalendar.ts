import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export interface CalendarEvent {
  id: string;
  projectId: string;
  date: string;
  // Add other event fields as needed
}

export function useCalendar() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { data, error } = await supabase
          .from('events')
          .select('*');

        if (error) {
          throw error;
        }

        setEvents(data || []);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        setLoading(false);
      }
    };

    fetchEvents();

    // Optional: Set up real-time subscription
    const subscription = supabase
      .channel('events')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'events' }, (payload) => {
        switch (payload.eventType) {
          case 'INSERT':
            setEvents(prev => [...prev, payload.new as CalendarEvent]);
            break;
          case 'UPDATE':
            setEvents(prev => prev.map(event => 
              event.id === payload.new.id ? payload.new as CalendarEvent : event
            ));
            break;
          case 'DELETE':
            setEvents(prev => prev.filter(event => event.id !== payload.old.id));
            break;
        }
      })
      .subscribe();

    // Cleanup subscription
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return { events, loading, error };
}
