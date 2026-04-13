import { createContext, useContext, useEffect, useState, useMemo, ReactNode, useRef } from "react";
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
  tokens?: number;
  trial_used?: boolean;
  last_daily_free?: string | null;
  daily_questions_count?: number;
}

interface AuthContextValue {
  user: User | null;
  profile: UserProfile | null;
  session: Session | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  isSubscriber: boolean;
  hasTokens: boolean;
  trialDaysRemaining: number;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  profile: null,
  session: null,
  isLoading: true,
  signOut: async () => { },
  refreshProfile: async () => { },
  isSubscriber: false,
  hasTokens: false,
  trialDaysRemaining: 0,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const isSigningOut = useRef(false);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();
      
      if (data) {
        setProfile(data as UserProfile);
      } else if (error && (error.code === 'PGRST116' || error.message.includes('No rows'))) {
        console.log("Perfil no encontrado, creando uno nuevo para el usuario:", userId);
        // Intentar crear perfil si falta (común en OAuth)
        const { data: { session } } = await supabase.auth.getSession();
        const currentUser = session?.user;
        
        if (currentUser && currentUser.id === userId) {
          const { data: newProfile, error: insertError } = await supabase
            .from("profiles")
            .insert({
              id: userId,
              email: currentUser.email,
              name: currentUser.user_metadata?.full_name || currentUser.user_metadata?.name || currentUser.email?.split('@')[0],
              updated_at: new Date().toISOString()
            })
            .select()
            .single();
          
          if (insertError) {
            console.error("Error al crear perfil automático:", insertError);
          } else if (newProfile) {
            setProfile(newProfile as UserProfile);
          }
        }
      } else if (error) {
        console.error("Error al cargar perfil:", error);
      }
    } catch (e) {
      console.error("Error inesperado en fetchProfile:", e);
    }
  };

  const refreshProfile = async () => {
    if (user?.id) {
      await fetchProfile(user.id);
    }
  };

  useEffect(() => {
    let mounted = true;

    // Detect if we're in the middle of a redirect from OAuth
    const isAuthRedirect = window.location.hash.includes('access_token=') || 
                           window.location.hash.includes('type=recovery') ||
                           window.location.search.includes('code=');

    console.log("Auth Context Mount - Redirect detected:", isAuthRedirect);

    if (isAuthRedirect) {
      console.log("Auth redirect detected - waiting for session processing...");
    }

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;
        if (isSigningOut.current) return; // Ignorar eventos de auth si estamos cerrando sesión activamente
        
        console.log("Auth event:", event, session?.user?.email);
        
        // Evitarnos relogueos innecesarios si la sesión no ha cambiado realmente (prevención de loops)
        if (event === 'INITIAL_SESSION' && !session) {
           setIsLoading(false);
           return;
        }

        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          await fetchProfile(session.user.id);
        } else if (event === 'SIGNED_OUT') {
          setProfile(null);
        }
        
        console.log("Auth event processed - stopping loading");
        setIsLoading(false);
      }
    );

    // Initial session check
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        
        if (!mounted) return;
        
        if (session) {
          setSession(session);
          setUser(session.user);
          await fetchProfile(session.user.id);
        }
      } catch (error) {
        console.error("Error checking session:", error);
      } finally {
        // If we're in a redirect, wait a bit longer for the onAuthStateChange event
        // which is more reliable for OAuth hash processing.
        if (mounted && !isAuthRedirect) {
          setIsLoading(false);
        }
      }
    };

    // Initial session check
    checkSession();

    // Safety timeout: if after 7 seconds we're still loading, something went wrong
    // ESPECIALLY important for OAuth redirects that might hang.
    const safetyTimeoutId = setTimeout(() => {
      if (mounted && isLoading) {
        console.warn("Auth sync safety timeout reached - forcing stop loading");
        setIsLoading(false);
      }
    }, 7000);

    return () => {
      mounted = false;
      subscription.unsubscribe();
      clearTimeout(safetyTimeoutId);
    };
  }, []);

  const signOut = async () => {
    if (isSigningOut.current) return;
    isSigningOut.current = true;
    
    console.log('[signOut] Nuclear iniciado...');
    
    // 1. Limpieza inmediata del estado UI para que el usuario vea el cambio
    setUser(null);
    setProfile(null);
    setSession(null);

    // 2. Limpieza de TODO el localStorage relacionado con auth
    try {
      const keysToRemove = [
        'cyberedu_pending_question',
        'cyberedu_used_free_message', 
        'cyberedu_daily_limit_reached',
        'cyberedu_daily_limit_dismissed'
      ];
      keysToRemove.forEach(key => localStorage.removeItem(key));
      
      // Limpiar tokens de supabase manualmente por si acaso (para evitar restauraciones zombies)
      Object.keys(localStorage).forEach(key => {
        if (key.includes('sb-') && key.includes('-auth-token')) {
          localStorage.removeItem(key);
        }
      });
      console.log('[signOut] LocalStorage purgado.');
    } catch (e) {
      console.error("Error limpiando storage:", e);
    }

    // 3. Intento de cerrar sesión en servidor con Timeout de seguridad
    const signOutPromise = supabase.auth.signOut();
    const timeoutPromise = new Promise(resolve => setTimeout(resolve, 1500, 'timeout'));

    try {
      const result = await Promise.race([signOutPromise, timeoutPromise]);
      if (result === 'timeout') {
        console.warn('[signOut] El servidor de Supabase tardó demasiado, forzando salida local.');
      } else {
        console.log('[signOut] Servidor de Supabase respondió OK.');
      }
    } catch (error) {
      console.error('[signOut] Error en servidor, pero continuamos salida local:', error);
    }

    // Traqueo opcional (si falla no importa)
    try { trackLogout(); } catch (_) { }

    // 4. Redirección final garantizada a la raíz
    console.log('[signOut] Redirigiendo a home...');
    window.location.href = "/";
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
      refreshProfile,
      isSubscriber,
      hasTokens: (profile?.tokens || 0) > 0,
      trialDaysRemaining
    }}>
      {children}
    </AuthContext.Provider>
  );
};
