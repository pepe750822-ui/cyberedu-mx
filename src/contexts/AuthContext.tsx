import { createContext, useContext, useEffect, useState, useMemo, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User, Session } from "@supabase/supabase-js";
import { trackLogout } from "@/hooks/useAnalytics";

interface UserProfile {
  id: string;
  email: string | null;
  name: string | null;
  avatar_url: string | null;
  provider: string | null;
  marketing_opt_in?: boolean;
  weekly_reminders?: boolean;
  newsletter_opt_in?: boolean;
  area_of_interest?: string[] | null;
  trial_started_at?: string | null;
  subscription_status?: string | null;
  subscription_plan?: string | null;
  subscription_expires_at?: string | null;
  is_premium?: boolean;
}

interface AuthContextValue {
  user: User | null;
  profile: UserProfile | null;
  session: Session | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
  isSubscriber: boolean;
  trialDaysRemaining: number;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  profile: null,
  session: null,
  isLoading: true,
  signOut: async () => { },
  isSubscriber: false,
  trialDaysRemaining: 0,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProfile = async (userId: string) => {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();
    if (data) setProfile(data as UserProfile);
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          setTimeout(() => fetchProfile(session.user.id), 0);
        } else {
          setProfile(null);
        }
        setIsLoading(false);
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      }
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    try {
      trackLogout();
      await supabase.auth.signOut();
      
      // Clear all local data to prevent session leakage between different accounts
      localStorage.clear();
      sessionStorage.clear();
      
      setUser(null);
      setProfile(null);
      setSession(null);
      
      // Force a full page reload to clear any remaining in-memory states
      window.location.href = "/auth";
    } catch (error) {
      console.error("Error during sign out:", error);
      // Fallback: still clear data even if Supabase call fails
      localStorage.clear();
      window.location.href = "/auth";
    }
  };

  const isSubscriber = profile?.subscription_status === 'active' || profile?.is_premium === true;

  const trialDaysRemaining = useMemo(() => {
    if (!profile?.trial_started_at) return 0;
    const started = new Date(profile.trial_started_at).getTime();
    const now = new Date().getTime();
    const diff = now - started;
    const daysPassed = Math.floor(diff / (1000 * 60 * 60 * 24));
    return Math.max(0, 7 - daysPassed);
  }, [profile?.trial_started_at]);

  return (
    <AuthContext.Provider value={{ 
      user, 
      profile, 
      session, 
      isLoading, 
      signOut,
      isSubscriber,
      trialDaysRemaining
    }}>
      {children}
    </AuthContext.Provider>
  );
};
