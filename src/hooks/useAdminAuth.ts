import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

export const useAdminAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  const checkAdminStatus = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('admin_users')
        .select('*')
        .eq('id', userId)
        .single();
      
      return !error && !!data;
    } catch (error) {
      console.error('Error checking admin status:', error);
      return false;
    }
  };

  useEffect(() => {
    let isSubscribed = true;

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!isSubscribed) return;

        console.log('Auth state changed:', event, session?.user?.email);
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          const adminStatus = await checkAdminStatus(session.user.id);
          if (isSubscribed) {
            setIsAdmin(adminStatus);
            setLoading(false);
          }
        } else {
          if (isSubscribed) {
            setIsAdmin(false);
            setLoading(false);
          }
        }
      }
    );

    // Check for existing session
    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (!isSubscribed) return;
        
        if (error) {
          console.error('Error getting session:', error);
          setLoading(false);
          return;
        }

        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          const adminStatus = await checkAdminStatus(session.user.id);
          if (isSubscribed) {
            setIsAdmin(adminStatus);
          }
        }
        
        if (isSubscribed) {
          setLoading(false);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        if (isSubscribed) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    return () => {
      isSubscribed = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setLoading(false);
        return { error };
      }

      // Check admin status immediately after successful login
      if (data.user) {
        const adminStatus = await checkAdminStatus(data.user.id);
        setIsAdmin(adminStatus);
        setUser(data.user);
        setSession(data.session);
        
        // If user is not an admin, return a specific error
        if (!adminStatus) {
          setLoading(false);
          return { 
            error: { 
              message: "Acesso negado. Esta conta não possui permissões administrativas." 
            } 
          };
        }
      }

      setLoading(false);
      return { error: null };
    } catch (error) {
      setLoading(false);
      return { error: error as any };
    }
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      setUser(null);
      setSession(null);
      setIsAdmin(false);
    }
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