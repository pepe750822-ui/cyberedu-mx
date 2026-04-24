import React, { useState, useEffect } from 'react';
import ShieldCheck from 'lucide-react/dist/esm/icons/shield-check';
import ArrowLeft from 'lucide-react/dist/esm/icons/arrow-left';
import RefreshCw from 'lucide-react/dist/esm/icons/refresh-cw';
import Ticket from 'lucide-react/dist/esm/icons/ticket';
import Zap from 'lucide-react/dist/esm/icons/zap';
import Crown from 'lucide-react/dist/esm/icons/crown';
import Sparkles from 'lucide-react/dist/esm/icons/sparkles';
import Megaphone from 'lucide-react/dist/esm/icons/megaphone';
import Trash2 from 'lucide-react/dist/esm/icons/trash-2';
import Bell from 'lucide-react/dist/esm/icons/bell';
import Users from 'lucide-react/dist/esm/icons/users';
import Activity from 'lucide-react/dist/esm/icons/activity';
import CalendarCheck from 'lucide-react/dist/esm/icons/calendar-check';
import { Link, useNavigate } from 'react-router-dom';
import { Send } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

const AdminMonitoring = () => {
  const { user, profile, session, isLoading } = useAuth();
  const navigate = useNavigate();
  const [activeUsers, setActiveUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<'all' | 'week' | 'premium' | 'sessions' | 'ai' | 'telegram'>('all');
  const [tgStats, setTgStats] = useState<any[]>([]);
  const [loadingTg, setLoadingTg] = useState(false);
  
  // Announcements state
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [newAnnouncement, setNewAnnouncement] = useState('');
  const [announcementType, setAnnouncementType] = useState('info');
  const [isSavingAnn, setIsSavingAnn] = useState(false);

  const fetchTgStats = async () => {
    setLoadingTg(true);
    try {
      const resp = await fetch('/api/admin/telegram-stats', {
        headers: { 'Authorization': `Bearer ${session?.access_token ?? ''}` },
      });
      const data = await resp.json();
      setTgStats(data.stats || []);
    } catch (err: any) {
      console.error("Error fetching TG stats:", err);
    } finally {
      setLoadingTg(false);
    }
  };

  const fetchActiveUsers = async () => {
    setLoading(true);
    try {
      const resp = await fetch('/api/admin/active-users', {
        headers: { 'Authorization': `Bearer ${session?.access_token ?? ''}` },
      });
      const data = await resp.json();
      if (data.error) throw new Error(data.error);
      setActiveUsers(data.users || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchAnnouncements = async () => {
    try {
        const resp = await fetch('/api/admin/announcements');
        const data = await resp.json();
        setAnnouncements(data.announcements || []);
    } catch (e) {
        console.error("Error fetching announcements", e);
    }
  };

  const saveAnnouncement = async () => {
    if (!newAnnouncement.trim()) return;
    setIsSavingAnn(true);
    try {
        await fetch('/api/admin/announcements', {
            method: 'POST',
            body: JSON.stringify({ content: newAnnouncement, type: announcementType }),
            headers: { 'Content-Type': 'application/json' }
        });
        setNewAnnouncement('');
        fetchAnnouncements();
    } catch (e) {
        console.error(e);
    } finally {
        setIsSavingAnn(false);
    }
  };

  const deleteAnnouncement = async (id: string) => {
    if (!confirm('¿Borrar anuncio?')) return;
    try {
        await fetch(`/api/admin/announcements?id=${id}`, { method: 'DELETE' });
        fetchAnnouncements();
    } catch (e) {
        console.error(e);
    }
  };

  const toggleAnnouncement = async (ann: any) => {
    try {
        await fetch('/api/admin/announcements', {
            method: 'POST',
            body: JSON.stringify({ ...ann, is_active: !ann.is_active }),
            headers: { 'Content-Type': 'application/json' }
        });
        fetchAnnouncements();
    } catch (e) {
        console.error(e);
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
        fetchAnnouncements();
        fetchTgStats();
        const timer = setInterval(() => {
          fetchActiveUsers();
          fetchTgStats();
        }, 30000);
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

  const now = Date.now();
  const ONE_WEEK = 7 * 24 * 60 * 60 * 1000;

  const stats = {
    total: activeUsers.length,
    activeToday: activeUsers.filter(u => (u.todayCount || 0) > 0).length,
    premium: activeUsers.filter(u => u.is_premium || u.subscription_status === 'active').length,
    totalSessions: activeUsers.reduce((acc, u) => acc + (u.totalCount || 0), 0),
  };

  const filteredUsers = activeUsers.filter(u => {
    if (filter === 'week') {
      const t = u.last_sign_in_at ? new Date(u.last_sign_in_at).getTime() : 0;
      return now - t < ONE_WEEK;
    }
    if (filter === 'premium') return u.is_premium || u.subscription_status === 'active';
    if (filter === 'sessions') return !!u.last_sign_in_at;
    if (filter === 'ai') return (u.totalCount || 0) > 0;
    return true;
  });

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

        {/* Summary cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Total usuarios',    value: stats.total,        icon: Users,         color: 'text-blue-400',    bg: 'bg-blue-500/10 border-blue-500/20' },
            { label: 'Activos hoy',       value: stats.activeToday,  icon: Activity,      color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
            { label: 'Total premium',     value: stats.premium,      icon: Crown,         color: 'text-amber-400',   bg: 'bg-amber-500/10 border-amber-500/20' },
            { label: 'Sesiones totales',  value: stats.totalSessions, icon: CalendarCheck, color: 'text-primary',     bg: 'bg-primary/10 border-primary/20' },
          ].map(({ label, value, icon: Icon, color, bg }) => (
            <div key={label} className={`flex items-center gap-4 p-5 rounded-2xl border ${bg} bg-white/[0.03]`}>
              <div className={`p-2.5 rounded-xl border ${bg}`}>
                <Icon className={`h-5 w-5 ${color}`} />
              </div>
              <div>
                <p className={`text-2xl font-black ${color}`}>{value.toLocaleString('es-MX')}</p>
                <p className="text-[9px] font-black uppercase tracking-widest text-white/30 mt-0.5">{label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Quick filters */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {([
            { key: 'all',      label: 'Todos',                count: null },
            { key: 'week',     label: 'Activos esta semana',   count: activeUsers.filter(u => now - (u.last_sign_in_at ? new Date(u.last_sign_in_at).getTime() : 0) < ONE_WEEK).length },
            { key: 'premium',  label: 'Premium',               count: stats.premium },
            { key: 'sessions', label: 'Con sesiones',          count: activeUsers.filter(u => !!u.last_sign_in_at).length },
            { key: 'ai',       label: 'Usaron AITutor',        count: activeUsers.filter(u => (u.totalCount || 0) > 0).length },
            { key: 'telegram', label: 'Telegram Bot',          count: tgStats.length },
          ] as const).map(({ key, label, count }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={cn(
                "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all",
                filter === key
                  ? "bg-primary text-white border-primary shadow-lg shadow-primary/20"
                  : "bg-white/5 border-white/10 text-white/40 hover:bg-white/10 hover:text-white/70"
              )}
            >
              {label}
              {count !== null && (
                <span className="ml-1.5 opacity-60">({count})</span>
              )}
            </button>
          ))}
        </div>

        <div className="grid gap-4">
          <div className="grid grid-cols-12 px-6 py-3 text-[10px] font-black uppercase tracking-widest text-white/30">
             <div className="col-span-3">Usuario</div>
             <div className="col-span-1 text-center">Status</div>
             <div className="col-span-2 text-center">Total</div>
             <div className="col-span-1 text-center">Tokens</div>
             <div className="col-span-2 text-center">Registro</div>
             <div className="col-span-3 text-right">Última Sesión</div>
          </div>

          <div className="flex flex-col gap-3">
            {filter === 'telegram' ? (
              tgStats.length === 0 && !loadingTg ? (
                <div className="p-12 text-center bg-white/5 rounded-3xl border border-white/10">
                  <p className="text-white/40 font-bold">No hay usuarios de Telegram registrados.</p>
                </div>
              ) : (
                tgStats.map((u) => (
                  <div key={u.id} className="grid grid-cols-12 items-center px-6 py-5 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/[0.08] transition-all group">
                    <div className="col-span-3 flex items-center gap-3">
                       <div className="h-10 w-10 rounded-full bg-sky-500/20 border border-sky-500/30 flex items-center justify-center font-black text-xs text-sky-400 shrink-0">
                          <Send className="h-4 w-4" />
                       </div>
                       <div className="min-w-0 pr-2">
                          <p className="font-bold text-sm truncate">{u.first_name || 'Invitado'}</p>
                          <p className="text-[10px] text-sky-400 truncate">@{u.username || 'sin_username'}</p>
                       </div>
                    </div>
                    <div className="col-span-2 text-center">
                       {u.user_id ? (
                         <span className="px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-[9px] font-black uppercase border border-emerald-500/20">Vinculado</span>
                       ) : (
                         <span className="px-2 py-1 rounded-full bg-slate-800 text-white/40 text-[9px] font-black uppercase border border-white/5">Invitado</span>
                       )}
                    </div>
                    <div className="col-span-4 text-center">
                      <div className="flex flex-col items-center gap-0.5">
                        <span className="text-sm font-black text-white">{u.total_questions || 0} preguntas</span>
                        {u.today_questions > 0 && <span className="text-[9px] text-sky-400 font-bold">+{u.today_questions} hoy</span>}
                      </div>
                    </div>
                    <div className="col-span-3 text-right">
                       <span className="text-[10px] text-white/20 font-medium">Chat ID: {u.chat_id}</span>
                       <p className="text-[9px] text-white/40">{u.profiles?.email || 'No vinculado'}</p>
                    </div>
                  </div>
                ))
              )
            ) : (
              <>
                {filteredUsers.length === 0 && !loading && (
                  <div className="p-12 text-center bg-white/5 rounded-3xl border border-white/10">
                    <p className="text-white/40 font-bold">No hay usuarios para este filtro.</p>
                  </div>
                )}

                {filteredUsers.map((u) => {
                  if (!u || !u.id) return null;
                  
                  const lastSignIn = u.last_sign_in_at ? new Date(u.last_sign_in_at) : null;
                  const isLastSignInValid = lastSignIn && !isNaN(lastSignIn.getTime());
                  const isRecentLogin = isLastSignInValid && (Date.now() - lastSignIn!.getTime()) < 300000;

                  const createdAt = u.created_at ? new Date(u.created_at) : null;
                  const isCreatedValid = createdAt && !isNaN(createdAt.getTime());

                  return (
                    <div key={u.id} className={cn(
                      "grid grid-cols-12 items-center px-6 py-5 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/[0.08] transition-all group",
                      isRecentLogin && "bg-primary/5 border-primary/20 shadow-lg"
                    )}>
                      <div className="col-span-3 flex items-center gap-3">
                         <div className="h-10 w-10 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center font-black text-xs text-primary shrink-0">
                            {(u.name?.charAt(0) || u.email?.charAt(0) || '?').toUpperCase()}
                         </div>
                         <div className="min-w-0 pr-2">
                            <p className="font-bold text-sm truncate">{u.name || 'Sin nombre'}</p>
                            <p className="text-[10px] text-white/40 truncate">{u.email || 'Sin email'}</p>
                         </div>
                      </div>

                      <div className="col-span-1 flex justify-center">
                        {(u.is_premium || u.subscription_status === 'active') ? (
                          <span className="px-2 py-1 rounded-full bg-amber-500/10 text-amber-500 text-[9px] font-black uppercase border border-amber-500/20 flex items-center gap-1">
                            <Crown className="h-2.5 w-2.5 fill-amber-500" />
                          </span>
                        ) : (
                          <span className="px-2 py-1 rounded-full bg-slate-800 text-white/40 text-[9px] font-black uppercase border border-white/5">
                            Free
                          </span>
                        )}
                      </div>

                      <div className="col-span-2 text-center">
                        <div className="flex flex-col items-center gap-0.5">
                          <span className={cn(
                            "text-sm font-black",
                            (u.totalCount || 0) > 0 ? "text-emerald-400" : "text-white/20"
                          )}>
                            {u.totalCount || 0}
                          </span>
                          {(u.todayCount || 0) > 0 && (
                            <span className="text-[9px] text-primary font-bold">+{u.todayCount} hoy</span>
                          )}
                        </div>
                      </div>

                      <div className="col-span-1 text-center">
                        <span className="text-sm font-black text-amber-500 flex items-center justify-center gap-1">
                           <Ticket className="h-3 w-3" /> {u.tokens || 0}
                        </span>
                      </div>

                      <div className="col-span-2 text-center">
                        <div className="flex flex-col items-center">
                          <span className="text-[10px] font-bold text-white/50">
                            {isCreatedValid ? createdAt!.toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: '2-digit' }) : '—'}
                          </span>
                        </div>
                      </div>

                      <div className="col-span-3 text-right">
                        <div className="flex flex-col items-end">
                           <span className={cn(
                             "text-xs font-bold",
                             isRecentLogin ? "text-emerald-400" : "text-white/60"
                           )}>
                             {isRecentLogin
                               ? 'Ahora mismo'
                               : isLastSignInValid
                                 ? lastSignIn!.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })
                                 : '--:--'}
                           </span>
                           <span className="text-[10px] text-white/20 font-medium whitespace-nowrap">
                             {isLastSignInValid ? lastSignIn!.toLocaleDateString('es-MX') : 'Sin sesión registrada'}
                           </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </>
            )}
          </div>
        </div>

        {/* Sección de Anuncios Globales */}
        <div className="mt-12 bg-slate-900/40 rounded-3xl border border-white/5 overflow-hidden">
            <div className="px-8 py-6 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/20">
                        <Megaphone className="h-5 w-5 text-amber-500" />
                    </div>
                    <div>
                        <h2 className="text-sm font-black uppercase tracking-widest text-white">Anuncios Globales</h2>
                        <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Enviar avisos a todos los alumnos</p>
                    </div>
                </div>
            </div>

            <div className="p-8">
                <div className="flex flex-col md:flex-row gap-4 mb-8">
                    <div className="flex-1 space-y-2">
                        <label className="text-[10px] font-black uppercase text-white/30 tracking-widest ml-1">Nuevo Mensaje</label>
                        <textarea 
                            value={newAnnouncement}
                            onChange={(e) => setNewAnnouncement(e.target.value)}
                            placeholder="Ej: ¡Nuevo video de Historia disponible!"
                            className="w-full h-24 px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-sm focus:outline-none focus:border-amber-500/50 transition-all placeholder:text-white/10"
                        />
                    </div>
                    <div className="w-full md:w-64 space-y-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-white/30 tracking-widest ml-1">Tipo de Alerta</label>
                            <select 
                                value={announcementType}
                                onChange={(e) => setAnnouncementType(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-xs font-bold uppercase tracking-wider focus:outline-none"
                            >
                                <option value="info">ℹ️ Información (Azul)</option>
                                <option value="warning">⚠️ Advertencia (Naranja)</option>
                                <option value="success">✅ Éxito (Verde)</option>
                            </select>
                        </div>
                        <button 
                            onClick={saveAnnouncement}
                            disabled={isSavingAnn || !newAnnouncement.trim()}
                            className="w-full py-3.5 rounded-xl bg-amber-500 text-slate-950 text-xs font-black uppercase tracking-widest hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-amber-500/20"
                        >
                            {isSavingAnn ? 'Publicando...' : 'Publicar Anuncio'}
                        </button>
                    </div>
                </div>

                <div className="space-y-3">
                    <h3 className="text-[10px] font-black uppercase text-white/20 tracking-widest ml-1 mb-2">Historial de Anuncios</h3>
                    {announcements.length === 0 ? (
                        <div className="p-12 text-center rounded-2xl bg-white/[0.02] border border-dashed border-white/5">
                            <Bell className="h-8 w-8 text-white/5 mx-auto mb-3" />
                            <p className="text-xs font-bold text-white/20 uppercase tracking-widest">No hay anuncios registrados</p>
                        </div>
                    ) : (
                        announcements.map((ann) => (
                            <div key={ann.id} className={cn(
                                "p-4 rounded-2xl border transition-all flex items-center gap-4",
                                ann.is_active ? "bg-white/[0.03] border-white/10" : "bg-white/[0.01] border-white/5 opacity-50"
                            )}>
                                <div className={cn(
                                    "p-2 rounded-xl border",
                                    ann.type === 'warning' ? "bg-amber-500/10 border-amber-500/20 text-amber-500" :
                                    ann.type === 'success' ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500" :
                                    "bg-blue-500/10 border-blue-500/20 text-blue-500"
                                )}>
                                    <Bell className="h-4 w-4" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-bold text-white mb-0.5">{ann.content}</p>
                                    <p className="text-[9px] font-black uppercase tracking-widest text-white/30">
                                        {new Date(ann.created_at).toLocaleDateString()} • {ann.type}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button 
                                        onClick={() => toggleAnnouncement(ann)}
                                        className={cn(
                                            "px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border transition-all",
                                            ann.is_active ? "bg-emerald-500/20 border-emerald-500/30 text-emerald-400" : "bg-white/5 border-white/10 text-white/30"
                                        )}
                                    >
                                        {ann.is_active ? 'Activo' : 'Inactivo'}
                                    </button>
                                    <button 
                                        onClick={() => deleteAnnouncement(ann.id)}
                                        className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-500 hover:bg-rose-500/20 transition-all"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
      </main>
    </div>
  );
};

export default AdminMonitoring;
