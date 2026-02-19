import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GraduationCap, Mail, Lock, User, Chrome, ArrowRight, Sparkles, ShieldCheck, Eye, EyeOff, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import Footer from "@/components/Footer";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isRecovering, setIsRecovering] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    // Detect password recovery mode from URL hash/supabase session
    const checkRecovery = async () => {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event) => {
        if (event === "PASSWORD_RECOVERY") {
          setIsResettingPassword(true);
          setIsLogin(false);
          setIsRecovering(false);
        }
      });
      return () => subscription.unsubscribe();
    };
    checkRecovery();

    if (user && !isResettingPassword) navigate("/", { replace: true });
  }, [user, navigate, isResettingPassword]);

  const passwordsMatch = isLogin || isRecovering || password === confirmPassword;

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth`,
      });
      if (error) throw error;
      toast({
        title: "Correo enviado",
        description: "Revisa tu bandeja de entrada para restablecer tu contraseña.",
      });
      setIsRecovering(false);
    } catch (error: any) {
      toast({
        title: "Error de recuperación",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast({ title: "Error", description: "Las contraseñas no coinciden", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      toast({ title: "Contraseña actualizada", description: "Ya puedes iniciar sesión con tu nueva clave." });
      setIsResettingPassword(false);
      setIsLogin(true);
      navigate("/auth");
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isResettingPassword) return handleUpdatePassword(e);
    if (isRecovering) return handlePasswordReset(e);

    if (!isLogin && password !== confirmPassword) {
      toast({
        title: "Error de validación",
        description: "Las contraseñas no coinciden.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate("/");
        toast({ title: "¡Bienvenido de nuevo!", description: "Sesión iniciada correctamente." });
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin,
            data: { full_name: name },
          },
        });
        if (error) throw error;
        toast({
          title: "¡Registro exitoso!",
          description: "Revisa tu correo para confirmar tu cuenta y empezar a estudiar.",
          variant: "default"
        });
      }
    } catch (error: any) {
      toast({
        title: isLogin ? "Error al iniciar sesión" : "Error al registrarse",
        description: error.message || "Ocurrió un error inesperado.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      const { error } = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: window.location.origin,
      });
      if (error) throw error;
    } catch (error: any) {
      toast({
        title: "Error con Google",
        description: error.message || String(error),
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex flex-col items-center justify-center p-4 cyber-grid">
      {/* Decorative Blur Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/20 rounded-full blur-[120px] animate-pulse" />

      <div className="w-full max-w-[440px] z-10 space-y-8 animate-in fade-in zoom-in duration-500">
        {/* Branding Area */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center p-4 rounded-2xl bg-gradient-to-br from-primary via-primary/50 to-secondary card-shadow animate-float">
            <GraduationCap className="h-10 w-10 text-white" />
          </div>
          <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-white">
              CyberEdu <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary italic">MX</span>
            </h1>
            <p className="text-slate-400 font-medium tracking-wide flex items-center justify-center gap-2">
              <Sparkles className="h-4 w-4 text-emerald-400" />
              Plataforma de Alto Rendimiento 2026
            </p>
          </div>
        </div>

        {/* Auth Card */}
        <div className="glass-card-premium rounded-[2rem] p-8 md:p-10 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          <div className="relative z-10 space-y-6">
            <div className="space-y-2 text-center">
              <h2 className="text-2xl font-bold text-white uppercase tracking-tight">
                {isResettingPassword ? "Nueva Contraseña" : isRecovering ? "Recuperar Acceso" : isLogin ? "Bienvenido Guerrero" : "Inicia tu Camino"}
              </h2>
              <p className="text-slate-400 text-sm">
                {isResettingPassword
                  ? "Crea una nueva clave segura para tu cuenta."
                  : isRecovering
                    ? "Ingresa tu email para recibir un enlace de restauración."
                    : isLogin
                      ? "Accede a tu arsenal de estudio y simuladores."
                      : "Únete a la nueva generación de estudiantes."}
              </p>
            </div>

            {!isRecovering && !isResettingPassword && (
              <>
                <Button
                  variant="outline"
                  className="w-full h-12 rounded-xl bg-white/5 border-white/10 hover:bg-white/10 hover:border-primary/50 transition-all font-bold text-slate-200"
                  onClick={handleGoogleLogin}
                  disabled={loading}
                >
                  <Chrome className="h-5 w-5 mr-3 text-red-500" />
                  Continuar con Google
                </Button>

                <div className="relative flex items-center py-2">
                  <div className="flex-grow border-t border-white/10"></div>
                  <span className="flex-shrink mx-4 text-[10px] font-black uppercase tracking-widest text-slate-500">
                    o vía protocolo email
                  </span>
                  <div className="flex-grow border-t border-white/10"></div>
                </div>
              </>
            )}

            <form onSubmit={handleEmailAuth} className="space-y-4">
              {!isLogin && !isRecovering && !isResettingPassword && (
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1">Nombre Completo</Label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                    <Input
                      id="name"
                      placeholder="Ej. Juan Pérez"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="h-12 pl-12 rounded-xl bg-black/40 border-white/10 focus:border-primary/50 focus:ring-primary/20 transition-all text-white placeholder:text-slate-600"
                      required
                      maxLength={100}
                    />
                  </div>
                </div>
              )}

              {!isResettingPassword && (
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1">Terminal de Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="aspirante@cyberedu.mx"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-12 pl-12 rounded-xl bg-black/40 border-white/10 focus:border-primary/50 focus:ring-primary/20 transition-all text-white placeholder:text-slate-600"
                      required
                    />
                  </div>
                </div>
              )}

              {(!isRecovering || isResettingPassword) && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between ml-1">
                    <Label htmlFor="password" className="text-xs font-bold uppercase tracking-wider text-slate-400">{isResettingPassword ? "Nueva Clave" : "Clave de Acceso"}</Label>
                    {isLogin && !isResettingPassword && (
                      <button
                        type="button"
                        onClick={() => setIsRecovering(true)}
                        className="text-[10px] font-bold uppercase tracking-tight text-primary hover:underline underline-offset-2"
                      >
                        ¿Olvidaste tu clave?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-12 pl-12 pr-12 rounded-xl bg-black/40 border-white/10 focus:border-primary/50 focus:ring-primary/20 transition-all text-white placeholder:text-slate-600"
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
              )}

              {(!isLogin || isResettingPassword) && !isRecovering && (
                <div className="space-y-2 animate-in slide-in-from-top-2 duration-300">
                  <Label htmlFor="confirmPassword" className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1">Confirmar Nueva Clave</Label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                    <Input
                      id="confirmPassword"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className={`h-12 pl-12 rounded-xl bg-black/40 border-white/10 focus:ring-primary/20 transition-all text-white placeholder:text-slate-600 ${!passwordsMatch && confirmPassword !== "" ? "border-red-500/50 focus:border-red-500" : "focus:border-primary/50"
                        }`}
                      required
                      minLength={6}
                    />
                  </div>
                  {!passwordsMatch && confirmPassword !== "" && (
                    <p className="text-[10px] text-red-400 font-bold uppercase tracking-widest ml-1 flex items-center gap-1 animate-pulse">
                      <AlertCircle className="h-3 w-3" /> Las contraseñas no coinciden
                    </p>
                  )}
                </div>
              )}

              <Button
                type="submit"
                className={`w-full h-12 rounded-xl font-black uppercase tracking-widest text-xs group transition-all ${(!passwordsMatch && !isLogin) || (!passwordsMatch && isResettingPassword) ? "bg-slate-700 cursor-not-allowed" : "bg-primary hover:bg-primary/80 text-white"
                  }`}
                disabled={loading || (!passwordsMatch && !isLogin) || (!passwordsMatch && isResettingPassword)}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Sincronizando...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    {isResettingPassword ? "Actualizar Contraseña" : isRecovering ? "Enviar Enlace de Restauración" : isLogin ? "Desbloquear Dashboard" : "Inicializar Cuenta"}
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                )}
              </Button>
            </form>

            <div className="pt-2 text-center">
              {isRecovering || isResettingPassword ? (
                <button
                  type="button"
                  onClick={() => { setIsRecovering(false); setIsResettingPassword(false); setIsLogin(true); }}
                  className="text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-primary transition-colors flex items-center justify-center gap-2 mx-auto"
                >
                  <span className="text-primary hover:underline underline-offset-4 font-black">
                    Volver al Inicio de Sesión
                  </span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-primary transition-colors flex items-center justify-center gap-2 mx-auto"
                >
                  {isLogin ? "¿Nuevo aspirante?" : "¿Ya tienes credenciales?"}
                  <span className="text-primary hover:underline underline-offset-4">
                    {isLogin ? "Acceso al Registro" : "Ir al Login"}
                  </span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Security Badge */}
        <div className="flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-600">
          <ShieldCheck className="h-3 w-3" />
          Conexión Segura vía Supabase Cloud
        </div>
      </div>

      <div className="w-full mt-auto pt-8">
        <Footer />
      </div>
    </div>
  );
};

export default Auth;
