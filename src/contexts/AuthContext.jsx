import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import {
  DEMO_ADMIN_EMAIL,
  DEMO_ADMIN_PASSWORD,
  DEMO_SESSION_KEY,
  createDemoUser,
} from '@/lib/siteConfig';
import { useToast } from '@/components/ui/use-toast';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

const isDemoCredentials = (email, password) =>
  email.trim().toLowerCase() === DEMO_ADMIN_EMAIL &&
  password === DEMO_ADMIN_PASSWORD;

const restoreDemoSession = () => {
  if (sessionStorage.getItem(DEMO_SESSION_KEY) === 'true') {
    return createDemoUser();
  }
  return null;
};

const ensureSupabaseAdminUser = async (email, password) => {
  const signIn = await supabase.auth.signInWithPassword({ email, password });
  if (!signIn.error) {
    return signIn;
  }

  if (!isDemoCredentials(email, password)) {
    return signIn;
  }

  const signUp = await supabase.auth.signUp({ email, password });
  if (signUp.error) {
    return signIn;
  }

  if (signUp.data.session) {
    return { data: signUp.data, error: null };
  }

  return supabase.auth.signInWithPassword({ email, password });
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (!supabase) {
      const demoUser = restoreDemoSession();
      setUser(demoUser);
      setLoading(false);
      return;
    }

    sessionStorage.removeItem(DEMO_SESSION_KEY);

    const checkUser = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Error fetching session:', error);
        }
        setUser(session?.user ?? null);
      } catch (err) {
        console.error('Unexpected error checking session:', err);
      } finally {
        setLoading(false);
      }
    };

    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email, password) => {
    const normalizedEmail = email.trim().toLowerCase();

    if (!supabase) {
      if (isDemoCredentials(normalizedEmail, password)) {
        const demoUser = createDemoUser();
        sessionStorage.setItem(DEMO_SESSION_KEY, 'true');
        setUser(demoUser);

        toast({
          title: 'Login successful',
          description: 'Tryb demo bez bazy — skonfiguruj Supabase w .env.local.',
        });

        return { data: { user: demoUser }, error: null };
      }

      toast({
        title: 'Login failed',
        description: 'Skonfiguruj VITE_SUPABASE_URL i VITE_SUPABASE_ANON_KEY w .env.local.',
        variant: 'destructive',
      });
      return { data: null, error: new Error('Supabase not configured') };
    }

    try {
      const { data, error } = await ensureSupabaseAdminUser(normalizedEmail, password);

      if (error) throw error;

      setUser(data.user);

      toast({
        title: 'Login successful',
        description: 'Zalogowano — panel admin korzysta z Supabase.',
      });

      return { data, error: null };
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: 'Login failed',
        description:
          error.message ||
          'Nie udało się zalogować. Utwórz użytkownika admin@admin.pl w Supabase → Authentication → Users.',
        variant: 'destructive',
      });
      return { data: null, error };
    }
  };

  const signup = async (email, password) => {
    if (!supabase) return { error: new Error('Supabase not initialized') };

    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
      });

      if (error) throw error;

      toast({
        title: 'Signup successful',
        description: 'Sprawdź skrzynkę e-mail z linkiem potwierdzającym.',
      });

      return { data, error: null };
    } catch (error) {
      console.error('Signup error:', error);
      toast({
        title: 'Signup failed',
        description: error.message,
        variant: 'destructive',
      });
      return { data: null, error };
    }
  };

  const logout = async () => {
    sessionStorage.removeItem(DEMO_SESSION_KEY);
    setUser(null);

    if (supabase) {
      try {
        await supabase.auth.signOut();
      } catch (error) {
        console.error('Logout error:', error);
      }
    }

    toast({
      title: 'Logged out',
      description: 'Wylogowano pomyślnie.',
    });

    return { error: null };
  };

  const value = {
    user,
    loading,
    login,
    signup,
    logout,
    usesSupabase: Boolean(supabase),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
