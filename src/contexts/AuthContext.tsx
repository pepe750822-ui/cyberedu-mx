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
  is_admin?: boolean;
  tokens?: number;
  trial_used?: boolean;
  last_daily_free?: string | null;
  daily_questions_count?: number;
  onboarding_completed?: boolean | null;
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
  const isLoadingRef = useRef(isLoading);
  const isSigningOut = useRef(false);
  const fetchingProfileForId = useRef<string | null>(null);

  // Mantener la ref sincronizada para evitar cierres obsoletos en timeouts
  useEffect(() => {
    isLoadingRef.current = isLoading;
  }, [isLoading]);

  const fetchProfile = async (userId: string, retryCount = 0) => {
    if (fetchingProfileForId.current === userId && retryCount === 0) {
      console.log("[Auth] fetchProfile ya en curso para:", userId, "- ignorando duplicado");
      return;
    }
    
    fetchingProfileForId.current = userId;
    console.log(`[Auth] Iniciando fetchProfile (intento ${retryCount + 1}) para:`, userId);
    
    try {
      // Timeout de 8s para la consulta a Supabase
      const supabaseQuery = supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();
        
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error("Supabase Timeout")), 8000)
      );

      const { data, error } = await Promise.race([supabaseQuery, timeoutPromise]) as any;
      
      if (data) {
        console.log("[Auth] Perfil cargado con éxito para:", userId);
        setProfile(data as UserProfile);
      } else if (error && (error.code === 'PGRST116' || error.message.includes('No rows'))) {
        console.log("[Auth] Perfil no encontrado, creando uno nuevo...");
        const { data: sessionData } = await supabase.auth.getSession();
        const currentUser = sessionData?.session?.user;
        
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
            console.error("[Auth] Error al crear perfil:", insertError);
          } else if (newProfile) {
            setProfile(newProfile as UserProfile);
          }
        }
      } else if (error) {
        console.error("[Auth] Error al cargar perfil:", error);
      }
    } catch (e: any) {
      console.error(`[Auth] Error en fetchProfile (intento ${retryCount + 1}):`, e.message);
      
      if (e.message === "Supabase Timeout" && retryCount < 1) {
        console.log("[Auth] Reintentando fetchProfile...");
        fetchingProfileForId.current = null; // Limpiar para permitir el reintento
        return fetchProfile(userId, retryCount + 1);
      }
      // Si falla después del reintento, permitimos que continúe con perfil null
    } finally {
      // No reseteamos inmediatamente para evitar ráfagas en el mismo ciclo, 
      // pero permitimos futuras recargas si es necesario (ej. refreshProfile)
      setTimeout(() => {
        if (fetchingProfileForId.current === userId) {
          fetchingProfileForId.current = null;
        }
      }, 2000);
    }
  };

  const refreshProfile = async () => {
    if (user?.id) {
      fetchingProfileForId.current = null; // Forzar recarga
      await fetchProfile(user.id);
    }
  };

  useEffect(() => {
    let mounted = true;

    // Detect if we're in the middle of a redirect from OAuth
    const isAuthRedirect = window.location.hash.includes('access_token=') || 
                           window.location.hash.includes('type=recovery') ||
                           window.location.search.includes('code=');

    console.log("[Auth] Context Mount - Redirect detected:", isAuthRedirect);

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;
        if (isSigningOut.current) return;
        
        console.log("[Auth] Evento de Auth:", event, session?.user?.email);
        
        // Sesión inicial nula -> desbloquear inmediatamente
        if (event === 'INITIAL_SESSION' && !session) {
           setIsLoading(false);
           return;
        }

        // Actualizar user/session INMEDIATAMENTE (no esperar perfil)
        setSession(session);
        setUser(session?.user ?? null);
        setIsLoading(false); // <-- Liberar la app de inmediato
        
        // Cargar perfil en BACKGROUND (no bloqueante)
        if (session?.user) {
          fetchProfile(session.user.id); // sin await
        } else if (event === 'SIGNED_OUT') {
          setProfile(null);
        }
      }
    );

    // Initial session check — desbloquear UI tan pronto como se conozca la sesión
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        
        if (mounted && session) {
          setSession(session);
          setUser(session.user);
          // Liberar loading ANTES de cargar el perfil
          if (!isAuthRedirect) setIsLoading(false);
          // Perfil en background
          fetchProfile(session.user.id); // sin await
        }
      } catch (error) {
        console.error("[Auth] Error inicial en checkSession:", error);
      } finally {
        if (mounted && !isAuthRedirect) {
          setIsLoading(false); // garantizar que siempre se desbloquee
        }
      }
    };

    // Initial session check
    checkSession();

    // Safety timeout: 5s máximo para desbloquear la app en Android/redes lentas
    const safetyTimeoutId = setTimeout(() => {
      if (mounted && isLoadingRef.current) {
        console.warn("[Auth] Safety timeout (5s) - forcing stop loading.");
        setIsLoading(false);
      }
    }, 5000);

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

    // 4. Redirección final al home (accesible sin login)
    console.log('[signOut] Redirigiendo a /...');
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
