import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import type { User as SupabaseUser } from '@supabase/supabase-js';

interface User {
  id: string;
  email: string;
  username: string;
  level: string;
  is2FAEnabled: boolean;
  balance: number;
  currentPlan: string;
  lastUpdate: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string) => Promise<{ error: any }>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  toggle2FA: () => void;
  isLoading: boolean;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProfile = async (sbUser: SupabaseUser) => {
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', sbUser.id)
      .single();
    
    if (profile) {
      setUser({
        id: sbUser.id,
        email: sbUser.email || '',
        username: profile.username || sbUser.email?.split('@')[0] || 'User',
        level: profile.level || 'Basic',
        is2FAEnabled: sbUser.user_metadata?.is2FAEnabled || false,
        balance: Number(profile.balance) || 0,
        currentPlan: profile.current_plan || 'Free',
        lastUpdate: profile.last_update || new Date().toISOString(),
      });
    } else {
      // Fallback if profile not created yet
      setUser({
        id: sbUser.id,
        email: sbUser.email || '',
        username: sbUser.email?.split('@')[0] || 'User',
        level: 'Basic',
        is2FAEnabled: false,
        balance: 0,
        currentPlan: 'Free',
        lastUpdate: new Date().toISOString(),
      });
    }
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        fetchProfile(session.user);
      }
      setIsLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        fetchProfile(session.user);
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    // Real-time profile updates
    let profileSubscription: any;
    if (user?.id) {
       profileSubscription = supabase
        .channel(`public:profiles:id=eq.${user.id}`)
        .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'profiles', filter: `id=eq.${user.id}` }, (payload) => {
           setUser(prev => prev ? {
             ...prev,
             balance: Number(payload.new.balance),
             currentPlan: payload.new.current_plan,
             level: payload.new.level,
             username: payload.new.username,
             lastUpdate: payload.new.last_update
           } : null);
        })
        .subscribe();
    }

    return () => {
      subscription.unsubscribe();
      if (profileSubscription) profileSubscription.unsubscribe();
    };
  }, [user?.id]);

  const refreshUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      await fetchProfile(session.user);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      setIsLoading(false);
      return { error };
    } catch (err: any) {
      setIsLoading(false);
      return { error: { message: err.message } };
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: {
            username: email.split('@')[0],
          }
        }
      });
      setIsLoading(false);
      return { error };
    } catch (err: any) {
      setIsLoading(false);
      return { error: { message: err.message } };
    }
  };

  const loginWithGoogle = async () => {
    setIsLoading(true);
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin }
    });
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const toggle2FA = () => {
    // Logic for toggling 2FA
  };

  return (
    <AuthContext.Provider value={{ user, login, signUp, loginWithGoogle, logout, toggle2FA, isLoading, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
