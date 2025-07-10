import { create } from 'zustand';
import { supabase } from '../services/supabaseClient';

const useEventStore = create((set, get) => ({
  events: [],
  loading: false,
  error: null,
  hasMore: true,
  currentPage: 0,
  pageSize: 10,

  fetchEvents: async (page = 0, reset = false) => {
    const { currentPage, pageSize, events } = get();
    
    if (!reset && page <= currentPage && events.length > 0) {
      return; 
    }

    set({ loading: true, error: null });

    try {
      const from = page * pageSize;
      const to = from + pageSize - 1;

      const { data, error, count } = await supabase
        .from('events')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(from, to);

      if (error) throw error;

      const newEvents = reset ? data : [...events, ...data];
      const hasMore = count > newEvents.length;

      set({
        events: newEvents,
        currentPage: page,
        hasMore,
        loading: false,
      });
    } catch (error) {
      console.error('Fetch events error:', error);
      set({ error: error.message, loading: false });
    }
  },

  createEvent: async (eventData) => {
    set({ loading: true, error: null });

    try {
      const { data, error } = await supabase
        .from('events')
        .insert([eventData])
        .select()
        .single();

      if (error) throw error;

      const { events } = get();
      set({
        events: [data, ...events],
        loading: false,
      });

      return { success: true, data };
    } catch (error) {
      console.error('Create event error:', error);
      set({ error: error.message, loading: false });
      return { success: false, error: error.message };
    }
  },

  getEventById: async (id) => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Get event error:', error);
      return { success: false, error: error.message };
    }
  },

  updateEvent: async (id, updates) => {
    set({ loading: true, error: null });

    try {
      const { data, error } = await supabase
        .from('events')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      const { events } = get();
      const updatedEvents = events.map(event => 
        event.id === id ? data : event
      );

      set({
        events: updatedEvents,
        loading: false,
      });

      return { success: true, data };
    } catch (error) {
      console.error('Update event error:', error);
      set({ error: error.message, loading: false });
      return { success: false, error: error.message };
    }
  },

  deleteEvent: async (id) => {
    set({ loading: true, error: null });

    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', id);

      if (error) throw error;

      const { events } = get();
      const filteredEvents = events.filter(event => event.id !== id);

      set({
        events: filteredEvents,
        loading: false,
      });

      return { success: true };
    } catch (error) {
      console.error('Delete event error:', error);
      set({ error: error.message, loading: false });
      return { success: false, error: error.message };
    }
  },

  reset: () => {
    set({
      events: [],
      loading: false,
      error: null,
      hasMore: true,
      currentPage: 0,
    });
  },

  loadMore: async () => {
    const { currentPage, hasMore, loading } = get();
    if (!hasMore || loading) return;
    
    await get().fetchEvents(currentPage + 1);
  },
}));

export default useEventStore;
