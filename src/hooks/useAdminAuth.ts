import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

export const useAdminAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    let mounted = true;

    const initAuth = async () => {
      try {
        // Get current session
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        
        if (!mounted) return;

        if (currentSession?.user) {
          // Check if user is admin
          const { data: adminData } = await supabase
            .from('admin_users')
            .select('*')
            .eq('id', currentSession.user.id)
            .single();

          if (mounted) {
            setSession(currentSession);
            setUser(currentSession.user);
            setIsAdmin(!!adminData);
            setLoading(false);
            setInitialized(true);
          }
        } else {
          if (mounted) {
            setSession(null);
            setUser(null);
            setIsAdmin(false);
            setLoading(false);
            setInitialized(true);
          }
        }
      } catch (error) {
        console.error('Auth init error:', error);
        if (mounted) {
          setLoading(false);
          setInitialized(true);
        }
      }
    };

    // Auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;

        console.log('Auth event:', event);

        if (session?.user) {
          const { data: adminData } = await supabase
            .from('admin_users')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (mounted) {
            setSession(session);
            setUser(session.user);
            setIsAdmin(!!adminData);
            setLoading(false);
          }
        } else {
          if (mounted) {
            setSession(null);
            setUser(null);
            setIsAdmin(false);
            setLoading(false);
          }
        }
      }
    );

    initAuth();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { error };
      }

      return { error: null };
    } catch (error) {
      return { error: error as any };
    }
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  };

  return {
    user,
    session,
    isAdmin,
    loading: loading || !initialized,
    signIn,
    signOut,
  };
};