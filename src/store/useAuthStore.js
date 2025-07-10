import { create } from 'zustand';
import { supabase } from '../services/supabaseClient';

const useAuthStore = create((set, get) => ({
  user: null,
  session: null,
  loading: false, 

  checkAuth: async () => {
    try {
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Auth check timeout')), 5000)
      );
      
      const authPromise = supabase.auth.getSession();
      
      const { data: { session }, error } = await Promise.race([
        authPromise,
        timeoutPromise
      ]);
      
      if (error) {
        console.error('Auth session error:', error);
        set({ session: null, user: null, loading: false });
        return;
      }
      set({ session, user: session?.user || null, loading: false });
    } catch (error) {
      console.error('Auth check error:', error);
      set({ session: null, user: null, loading: false });
    }
  },

  signIn: async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      set({ session: data.session, user: data.user });
      return { success: true };
    } catch (error) {
      console.error('Sign in error:', error);
      return { success: false, error: error.message };
    }
  },

  signUp: async (email, password, userData) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData
        }
      });
      
      if (error) throw error;
      
      return { success: true, data };
    } catch (error) {
      console.error('Sign up error:', error);
      return { success: false, error: error.message };
    }
  },

  signOut: async () => {
    try {
      await supabase.auth.signOut();
      set({ session: null, user: null });
    } catch (error) {
      console.error('Sign out error:', error);
    }
  },

  initAuthListener: () => {
    supabase.auth.onAuthStateChange((event, session) => {
      set({ session, user: session?.user || null, loading: false });
    });
  },
}));

export default useAuthStore;
