import React, { useState, useEffect } from 'react';
import { ShieldCheck, ArrowLeft, RefreshCw, Ticket, Zap } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

const AdminMonitoring = () => {
  const { user, profile, isLoading } = useAuth();
  const navigate = useNavigate();
  const [activeUsers, setActiveUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchActiveUsers = async () => {
    setLoading(true);
    try {
      const resp = await fetch('/api/admin/active-users');
      const data = await resp.json();
      if (data.error) throw new Error(data.error);
      setActiveUsers(data.users || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const isAdminCheck = () => {
    const adminEmail = 'pepe750822@gmail.com';
    // Priorizar el email del usuario (user) sobre el perfil para mayor velocidad
    const userEmail = user?.email?.toLowerCase();
    const profileEmail = profile?.email?.toLowerCase();
    
    return userEmail === adminEmail || 
           profileEmail === adminEmail || 
           profile?.is_admin === true;
  };

  useEffect(() => {
    if (!isLoading) {
      if (isAdminCheck()) {
        fetchActiveUsers();
        const timer = setInterval(fetchActiveUsers, 30000);
        return () => clearInterval(timer);
      }
    }
  }, [profile, user, isLoading]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
        <div className="relative mb-6">
          <div className="h-20 w-20 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          <ShieldCheck className="h-10 w-10 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
        </div>
        <h2 className="text-xl font-black text-white mb-2 uppercase tracking-tighter">Sincronizando Identidad</h2>
        <p className="text-white/40 text-xs max-w-xs font-bold uppercase tracking-[0.2em] animate-pulse">Verificando estatus de administrador...</p>
      </div>
    );
  }

  if (!isAdminCheck()) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
         <div className="p-4 rounded-full bg-rose-500/10 border border-rose-500/20 mb-4">
            <ShieldCheck className="h-8 w-8 text-rose-500" />
         </div>
         <h1 className="text-xl font-black text-white mb-2 uppercase tracking-tighter">Acceso Denegado</h1>
         <p className="text-white/40 text-sm max-w-xs mb-6 font-medium">No tienes permisos para acceder al Monitor de Actividad con la cuenta actual ({user?.email || 'Sesión no iniciada'}).</p>
         <div className="flex flex-col gap-3">
            <Link to="/" className="px-6 py-3 rounded-2xl bg-white/5 border border-white/10 text-xs font-bold uppercase tracking-widest hover:bg-white/10 transition-all">
                Volver al Inicio
            </Link>
            <button 
                onClick={() => window.location.reload()} 
                className="text-[10px] font-black uppercase text-primary/60 hover:text-primary transition-colors"
            >
                Reintentar Autenticación
            </button>
         </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-primary/30">
      <div className="absolute inset-0 bg-gradient-radial from-primary/5 via-transparent to-transparent opacity-50" />
      
      <main className="relative z-10 max-w-5xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link to="/master-admin" className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div className="flex items-center gap-3">
               <div className="p-3 rounded-2xl bg-primary/10 border border-primary/20">
                  <Zap className="h-6 w-6 text-primary" />
               </div>
               <div>
                  <h1 className="text-3xl font-black tracking-tight leading-none">Monitor de Actividad</h1>
                  <p className="text-white/40 text-xs mt-1 font-bold uppercase tracking-[0.2em]">Sincronización en vivo cada 30s</p>
               </div>
            </div>
          </div>
          <button 
            onClick={fetchActiveUsers}
            className="p-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 active:scale-95 transition-all"
            title="Refrescar ahora"
          >
            <RefreshCw className={cn("h-5 w-5", loading && "animate-spin")} />
          </button>
        </div>

        {error && (
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 font-bold mb-6">
            Error: {error}
          </div>
        )}

        <div className="grid gap-4">
          <div className="grid grid-cols-12 px-6 py-3 text-[10px] font-black uppercase tracking-widest text-white/30">
             <div className="col-span-4">Usuario</div>
             <div className="col-span-2 text-center">Status</div>
             <div className="col-span-2 text-center">Interacciones Hoy</div>
             <div className="col-span-2 text-center">Tokens</div>
             <div className="col-span-2 text-right">Última Actividad</div>
          </div>

          <div className="flex flex-col gap-3">
            {activeUsers.length === 0 && !loading && (
              <div className="p-12 text-center bg-white/5 rounded-3xl border border-white/10">
                <p className="text-white/40 font-bold">No se detectó actividad reciente.</p>
              </div>
            )}

            {activeUsers.map((u) => {
              if (!u || !u.id) return null;
              
              const updated_at = u.updated_at || new Date().toISOString();
              const lastActive = new Date(updated_at);
              const isValidDate = !isNaN(lastActive.getTime());
              const isRecent = isValidDate && (Date.now() - lastActive.getTime()) < 300000; // < 5 min

              return (
                <div key={u.id} className={cn(
                  "grid grid-cols-12 items-center px-6 py-5 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/[0.08] transition-all group",
                  isRecent && "bg-primary/5 border-primary/20 shadow-lg"
                )}>
                  <div className="col-span-4 flex items-center gap-3">
                     <div className="h-10 w-10 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center font-black text-xs text-primary">
                        {(u.name?.charAt(0) || u.email?.charAt(0) || '?').toUpperCase()}
                     </div>
                     <div className="min-w-0 pr-2">
                        <p className="font-bold text-sm truncate">{u.name || 'Sin nombre'}</p>
                        <p className="text-[10px] text-white/40 truncate">{u.email || 'Sin email'}</p>
                     </div>
                  </div>

                  <div className="col-span-2 flex justify-center">
                    {(u.is_premium || u.subscription_status === 'active') ? (
                      <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-500 text-[10px] font-black uppercase tracking-widest border border-amber-500/20 flex items-center gap-1">
                        <Zap className="h-2.5 w-2.5 fill-amber-500" /> Premium
                      </span>
                    ) : (
                      <span className="px-3 py-1 rounded-full bg-slate-800 text-white/40 text-[10px] font-black uppercase tracking-widest border border-white/5">
                        Free
                      </span>
                    )}
                  </div>

                  <div className="col-span-2 text-center">
                    <span className={cn(
                      "text-sm font-black",
                      (u.todayCount || 0) > 0 ? "text-emerald-400" : "text-white/20"
                    )}>
                      {u.todayCount || 0}
                    </span>
                  </div>

                  <div className="col-span-2 text-center">
                    <span className="text-sm font-black text-amber-500 flex items-center justify-center gap-1.5">
                       <Ticket className="h-3.5 w-3.5" /> {u.tokens || 0}
                    </span>
                  </div>

                  <div className="col-span-2 text-right">
                    <div className="flex flex-col items-end">
                       <span className={cn(
                         "text-xs font-bold",
                         isRecent ? "text-emerald-400" : "text-white/60"
                       )}>
                         {isRecent ? 'Ahora mismo' : (isValidDate ? lastActive.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' }) : '--:--')}
                       </span>
                       <span className="text-[10px] text-white/20 font-medium whitespace-nowrap">
                         {isValidDate ? lastActive.toLocaleDateString('es-MX') : 'Desconocida'}
                       </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminMonitoring;
