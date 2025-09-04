import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

export const useAdminAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const checkAdminStatus = async (userId: string) => {
      try {
        const { data: adminData } = await supabase
          .from('admin_users')
          .select('*')
          .eq('id', userId)
          .single();

        if (!adminData) {
          // Auto-create admin user if doesn't exist
          await supabase
            .from('admin_users')
            .insert({
              id: userId,
              email: '',
              role: 'admin',
            });
          return true;
        }
        return !!adminData;
      } catch (error) {
        console.error('Admin check error:', error);
        return false;
      }
    };

    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        
        if (mounted) {
          if (currentSession?.user) {
            const adminStatus = await checkAdminStatus(currentSession.user.id);
            setSession(currentSession);
            setUser(currentSession.user);
            setIsAdmin(adminStatus);
          } else {
            setSession(null);
            setUser(null);
            setIsAdmin(false);
          }
          setLoading(false);
        }
      } catch (error) {
        console.error('Session init error:', error);
        if (mounted) {
          setLoading(false);
        }
      }
    };

    // Auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!mounted) return;

        if (session?.user) {
          // Use setTimeout to avoid blocking the auth state change
          setTimeout(async () => {
            if (mounted) {
              const adminStatus = await checkAdminStatus(session.user.id);
              setSession(session);
              setUser(session.user);
              setIsAdmin(adminStatus);
              setLoading(false);
            }
          }, 0);
        } else {
          setSession(null);
          setUser(null);
          setIsAdmin(false);
          setLoading(false);
        }
      }
    );

    getInitialSession();

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
    loading,
    signIn,
    signOut,
  };
};