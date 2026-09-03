import React, { useState, useEffect } from 'react';
import {
  Search, User, Database, Plus, Minus, ShieldCheck,
  ArrowLeft, Zap, Flame, Trash2, Calendar, LayoutGrid,
  CheckCircle, List, BarChart3, TrendingUp, Target, PieChart,
  Video, Pencil, Eye, EyeOff
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const AdminPage = () => {
  const { user, profile, isLoading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'users' | 'challenges' | 'analytics' | 'videos'>('users');
  
  // User Management State
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [amount, setAmount] = useState(1);
  
  // Challenge Management State
  const [challenges, setChallenges] = useState<any[]>([]);
  const [newChallenge, setNewChallenge] = useState({
    question: '',
    options: ['', '', '', ''],
    correct_index: 0,
    area: 'Biología',
    active_date: new Date().toISOString().split('T')[0]
  });
  
  const [message, setMessage] = useState('');

  // Videos State
  const VIDEO_MATERIAS = ['Español','Matemáticas','Biología','Física','Química','Historia','Geografía','Formación Cívica'];
  const emptyVideoForm = { materia: 'Español', subindice: '', titulo: '', youtube_url: '', descripcion: '', orden: 0, activo: false };
  const [videos, setVideos] = useState<any[]>([]);
  const [videoForm, setVideoForm] = useState({ ...emptyVideoForm });
  const [editingVideoId, setEditingVideoId] = useState<string | null>(null);
  const [videoLoading, setVideoLoading] = useState(false);
  const [videoFilter, setVideoFilter] = useState('Todas');

  // Magic Link state
  const [emailNuevo, setEmailNuevo] = useState('');
  const [magicLink, setMagicLink] = useState('');
  const [generando, setGenerando] = useState(false);
  
  // Academic Analytics State
  const [globalStats, setGlobalStats] = useState<any>(null);
  const [areaPerformance, setAreaPerformance] = useState<any[]>([]);

  useEffect(() => {
    if (!isLoading) {
      const adminEmail = 'pepe750822@gmail.com';
      const isAdmin = profile?.is_admin === true || 
                      profile?.email?.toLowerCase() === adminEmail || 
                      user?.email?.toLowerCase() === adminEmail;
                      
      if (!isAdmin) {
        navigate('/', { replace: true });
      }
    }
  }, [profile, user, isLoading, navigate]);

  useEffect(() => {
    if (activeTab === 'challenges') fetchChallenges();
    if (activeTab === 'analytics') fetchAnalytics();
    if (activeTab === 'videos') fetchVideos();
  }, [activeTab]);

  const fetchAnalytics = async () => {
    setLoading(true);
    const { data: stats } = await supabase.from('simulador_global_stats').select('*').single();
    const { data: areas } = await supabase.from('simulador_area_performance').select('*');
    if (stats) setGlobalStats(stats);
    if (areas) setAreaPerformance(areas);
    setLoading(false);
  };

  const fetchChallenges = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('daily_challenges')
      .select('*')
      .order('active_date', { ascending: false });
    
    if (!error && data) setChallenges(data);
    setLoading(false);
  };

  const generarMagicLink = async () => {
    if (!emailNuevo.trim()) return;
    setGenerando(true);
    setMagicLink('');
    try {
      const res = await fetch('/api/admin/magic-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: emailNuevo.trim(),
          adminSecret: import.meta.env.VITE_ADMIN_SECRET,
        }),
      });
      const data = await res.json();
      if (data.link) {
        setMagicLink(data.link);
        toast.success('✅ Link generado y usuario activado');
      } else {
        toast.error('Error: ' + data.error);
      }
    } catch {
      toast.error('Error al generar link');
    }
    setGenerando(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center gap-4">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
        <p className="text-white/50 animate-pulse font-bold uppercase tracking-widest text-[10px]">Verificando Identidad Maestra...</p>
      </div>
    );
  }

  if (!profile) return null;

  const searchUser = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!email) return;
    setLoading(true);
    setMessage('');
    try {
      const resp = await fetch('/api/admin/manage-tokens', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, action: 'get' }),
      });
      const data = await resp.json();
      if (data.error) throw new Error(data.error);
      setUserProfile(data);
    } catch (err: any) {
      setMessage(`❌ ${err.message}`);
      setUserProfile(null);
    } finally {
      setLoading(false);
    }
  };

  const updateTokens = async (action: 'add' | 'remove') => {
    if (!userProfile) return;
    setLoading(true);
    try {
      const resp = await fetch('/api/admin/manage-tokens', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userProfile.email, amount, action }),
      });
      const data = await resp.json();
      if (data.error) throw new Error(data.error);
      setUserProfile({ ...userProfile, tokens: data.newTokens });
      setMessage(`✅ tokens actualizados para ${data.email}. Nuevo saldo: ${data.newTokens}`);
    } catch (err: any) {
      setMessage(`❌ ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const createChallenge = async () => {
    setLoading(true);
    const { error } = await supabase
      .from('daily_challenges')
      .insert([{
        question: newChallenge.question,
        options: newChallenge.options,
        correct_index: newChallenge.correct_index,
        area: newChallenge.area,
        active_date: newChallenge.active_date
      }]);
    
    if (error) {
      setMessage(`❌ Error: ${error.message}`);
    } else {
      setMessage('✅ Reto creado exitosamente');
      fetchChallenges();
      setNewChallenge({
        question: '',
        options: ['', '', '', ''],
        correct_index: 0,
        area: 'Biología',
        active_date: new Date().toISOString().split('T')[0]
      });
    }
    setLoading(false);
  };

  const deleteChallenge = async (id: string) => {
    if (!confirm('¿Seguro que quieres borrar este reto?')) return;
    const { error } = await supabase.from('daily_challenges').delete().eq('id', id);
    if (!error) fetchChallenges();
  };

  const fetchVideos = async () => {
    setVideoLoading(true);
    const { data } = await supabase
      .from('cyberedu_videos' as any)
      .select('*')
      .order('materia')
      .order('orden', { ascending: true });
    setVideos((data as any[]) ?? []);
    setVideoLoading(false);
  };

  const saveVideo = async () => {
    if (!videoForm.titulo.trim() || !videoForm.subindice.trim()) {
      toast.error('Título y subíndice son obligatorios');
      return;
    }
    setVideoLoading(true);
    const payload = {
      materia: videoForm.materia,
      subindice: videoForm.subindice.trim(),
      titulo: videoForm.titulo.trim(),
      youtube_url: videoForm.youtube_url.trim() || null,
      descripcion: videoForm.descripcion.trim() || null,
      orden: Number(videoForm.orden) || 0,
      activo: videoForm.activo,
    };
    if (editingVideoId) {
      const { error } = await supabase.from('cyberedu_videos' as any).update(payload).eq('id', editingVideoId);
      if (error) { toast.error('Error: ' + error.message); }
      else { toast.success('✅ Video actualizado'); setEditingVideoId(null); setVideoForm({ ...emptyVideoForm }); }
    } else {
      const { error } = await supabase.from('cyberedu_videos' as any).insert([payload]);
      if (error) { toast.error('Error: ' + error.message); }
      else { toast.success('✅ Video agregado'); setVideoForm({ ...emptyVideoForm }); }
    }
    fetchVideos();
    setVideoLoading(false);
  };

  const toggleVideoActivo = async (id: string, current: boolean) => {
    await supabase.from('cyberedu_videos' as any).update({ activo: !current }).eq('id', id);
    fetchVideos();
  };

  const deleteVideo = async (id: string) => {
    if (!confirm('¿Eliminar este video?')) return;
    await supabase.from('cyberedu_videos' as any).delete().eq('id', id);
    fetchVideos();
  };

  const startEditVideo = (v: any) => {
    setEditingVideoId(v.id);
    setVideoForm({ materia: v.materia, subindice: v.subindice, titulo: v.titulo, youtube_url: v.youtube_url ?? '', descripcion: v.descripcion ?? '', orden: v.orden ?? 0, activo: v.activo });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-primary/30">
      <div className="absolute inset-0 bg-gradient-radial from-primary/5 via-transparent to-transparent opacity-50" />
      
      <main className="relative z-10 max-w-5xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link to="/" className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div className="flex items-center gap-3">
               <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20">
                  <ShieldCheck className="h-6 w-6 text-amber-500" />
               </div>
               <h1 className="text-3xl font-black tracking-tight">Panel de Control Maestro</h1>
            </div>
          </div>
          <div className="flex gap-2">
            <Link 
                to="/admin/monitoring"
                className="px-4 py-3 rounded-2xl bg-primary/10 border border-primary/30 text-primary font-black uppercase text-[10px] tracking-widest hover:bg-primary hover:text-white transition-all flex items-center gap-2"
            >
                <Zap className="h-3.5 w-3.5" /> Monitor
            </Link>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 p-1.5 bg-white/5 rounded-2xl border border-white/10 w-fit">
          <button 
            onClick={() => setActiveTab('users')}
            className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === 'users' ? 'bg-primary text-white' : 'text-slate-400 hover:text-white'}`}
          >
            <User className="h-3.5 w-3.5" /> Gestión de Usuarios
          </button>
          <button 
            onClick={() => setActiveTab('challenges')}
            className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === 'challenges' ? 'bg-primary text-white' : 'text-slate-400 hover:text-white'}`}
          >
            <Flame className="h-3.5 w-3.5" /> Retos Diarios
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === 'analytics' ? 'bg-primary text-white' : 'text-slate-400 hover:text-white'}`}
          >
            <BarChart3 className="h-3.5 w-3.5" /> Analíticas Académicas
          </button>
          <button
            onClick={() => setActiveTab('videos')}
            className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === 'videos' ? 'bg-pink-600 text-white' : 'text-slate-400 hover:text-white'}`}
          >
            <Video className="h-3.5 w-3.5" /> Videos
          </button>
        </div>

        <div className="grid gap-8">
          {activeTab === 'users' ? (
            <div className="space-y-8">
              {/* ── Activar Usuario (Magic Link) ── */}
              <div className="p-6 rounded-3xl bg-white/5 border border-orange-500/20 backdrop-blur-xl">
                <h2 className="text-xl font-bold mb-1 flex items-center gap-2 text-orange-400">
                  🔗 ACTIVAR USUARIO
                </h2>
                <p className="text-slate-500 text-xs mb-4">
                  Genera un link mágico para usuarios que pagaron por transferencia.
                  Al dar clic entran directo con acceso completo activado.
                </p>

                <input
                  type="email"
                  placeholder="correo@ejemplo.com"
                  value={emailNuevo}
                  onChange={e => setEmailNuevo(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm mb-3 focus:border-orange-500 outline-none transition-all"
                />

                <button
                  onClick={generarMagicLink}
                  disabled={generando || !emailNuevo.trim()}
                  className="w-full bg-orange-600 text-white py-3 rounded-xl font-bold text-sm hover:bg-orange-500 disabled:opacity-40 transition-all mb-3"
                >
                  {generando ? '⏳ Generando...' : '🔗 Generar Magic Link'}
                </button>

                {magicLink && (
                  <div className="bg-black/40 border border-green-500/30 rounded-xl p-4 space-y-2">
                    <p className="text-green-400 text-xs font-bold">
                      ✅ Link listo — cópialo y mándalo por WhatsApp:
                    </p>
                    <p className="text-slate-400 text-xs break-all">{magicLink}</p>
                    <button
                      onClick={() => { navigator.clipboard.writeText(magicLink); toast.success('Link copiado ✅'); }}
                      className="w-full bg-green-600/20 border border-green-500/30 text-green-400 py-2 rounded-lg text-sm font-bold hover:bg-green-600/30 transition-all"
                    >
                      📋 Copiar link
                    </button>
                    <a
                      href={`https://wa.me/?text=${encodeURIComponent(
                        '¡Hola! Tu acceso a CyberEdu MX está listo 🎓\n\n' +
                        'Da clic en este link para entrar directo:\n' +
                        magicLink + '\n\n' +
                        'El link expira en 24 horas.\n' +
                        '¡Mucho éxito en el ECOEMS! 🚀'
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center bg-green-600 text-white py-2 rounded-lg text-sm font-bold hover:bg-green-500 transition-all"
                    >
                      💬 Mandar por WhatsApp
                    </a>
                  </div>
                )}
              </div>

              {/* Search Card */}
              <div className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <Search className="h-5 w-5 text-primary" />
                  Buscar Usuario
                </h2>
                <form onSubmit={searchUser} className="flex gap-4">
                  <div className="flex-1 relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/30" />
                    <input 
                        type="email" 
                        placeholder="email@ejemplo.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/5 border border-white/10 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 outline-none transition-all font-medium"
                    />
                  </div>
                  <button 
                    type="submit"
                    disabled={loading}
                    className="px-8 py-4 rounded-2xl bg-primary text-white font-black hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                  >
                    {loading ? 'Buscando...' : 'Buscar'}
                  </button>
                </form>
              </div>

              {/* User Detail Card */}
              {userProfile && (
                <div className="p-8 rounded-3xl bg-gradient-to-br from-primary/10 to-transparent border border-primary/20 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="flex items-start justify-between mb-8">
                    <div>
                        <h3 className="text-sm font-bold text-primary uppercase tracking-widest mb-1">Usuario Encontrado</h3>
                        <p className="text-2xl font-black">{userProfile.email}</p>
                        <p className="text-white/50 text-xs mt-2 uppercase tracking-tighter">ID: {userProfile.id}</p>
                    </div>
                    <div className="p-6 rounded-3xl bg-white/5 border border-white/10 flex flex-col items-center">
                        <span className="text-xs font-bold text-white/50 uppercase mb-1">Saldo Actual</span>
                        <span className="text-4xl font-black text-amber-500">{userProfile.tokens}</span>
                        <span className="text-[10px] font-black uppercase tracking-tighter text-white/30">tokens</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-6">
                    <div className="flex items-center gap-3 bg-white/5 p-2 rounded-2xl border border-white/10">
                        <button 
                          onClick={() => setAmount(Math.max(1, amount - 1))}
                          className="p-2 rounded-xl hover:bg-white/10 transition-colors"
                        >
                          <Minus className="h-5 w-5" />
                        </button>
                        <input 
                          type="number" 
                          value={amount}
                          onChange={(e) => setAmount(parseInt(e.target.value) || 1)}
                          className="w-16 bg-transparent text-center font-black text-xl outline-none"
                        />
                        <button 
                          onClick={() => setAmount(amount + 1)}
                          className="p-2 rounded-xl hover:bg-white/10 transition-colors"
                        >
                          <Plus className="h-5 w-5" />
                        </button>
                    </div>

                    <div className="flex gap-3">
                        <button 
                          onClick={() => updateTokens('add')}
                          disabled={loading}
                          className="px-6 py-4 rounded-2xl bg-emerald-500 text-white font-black hover:bg-emerald-600 transition-colors flex items-center gap-2"
                        >
                          <Plus className="h-5 w-5" /> Sumar Tokens
                        </button>
                        <button 
                          onClick={() => updateTokens('remove')}
                          disabled={loading}
                          className="px-6 py-4 rounded-2xl bg-rose-500/20 border border-rose-500/50 text-rose-500 font-black hover:bg-rose-500 hover:text-white transition-all flex items-center gap-2"
                        >
                          <Minus className="h-5 w-5" /> Quitar Tokens
                        </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : activeTab === 'analytics' ? (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* Summary Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-6 rounded-3xl bg-white/5 border border-white/10">
                  <p className="text-[10px] font-black uppercase text-slate-500 mb-1">Total Exámenes</p>
                  <p className="text-3xl font-black text-white">{globalStats?.total_examenes || 0}</p>
                  <div className="flex gap-2 mt-2">
                    <span className="text-[8px] px-1.5 py-0.5 rounded bg-primary/20 text-primary font-bold">{globalStats?.examenes_completos} COMP</span>
                    <span className="text-[8px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-500 font-bold">{globalStats?.practicas_rapidas} PRAC</span>
                  </div>
                </div>
                <div className="p-6 rounded-3xl bg-white/5 border border-white/10">
                  <p className="text-[10px] font-black uppercase text-slate-500 mb-1">Promedio Global</p>
                  <p className="text-3xl font-black text-emerald-400">
                    {globalStats?.promedio_global ? Math.round(globalStats.promedio_global) : 0}%
                  </p>
                  <p className="text-[9px] text-slate-400 mt-2 font-medium">En toda la plataforma</p>
                </div>
                <div className="p-6 rounded-3xl bg-white/5 border border-white/10">
                  <p className="text-[10px] font-black uppercase text-slate-500 mb-1">Usuarios Activos</p>
                  <p className="text-3xl font-black text-blue-400">{globalStats?.usuarios_unicos || 0}</p>
                  <p className="text-[9px] text-slate-400 mt-2 font-medium">Han hecho simulacros</p>
                </div>
                <div className="p-6 rounded-3xl bg-white/5 border border-white/10">
                  <p className="text-[10px] font-black uppercase text-slate-500 mb-1">Escuela Top</p>
                  <p className="text-sm font-black text-amber-400 uppercase leading-tight line-clamp-2">
                    {globalStats?.escuela_mas_buscada || '---'}
                  </p>
                  <p className="text-[9px] text-slate-400 mt-2 font-medium">Meta más frecuente</p>
                </div>
              </div>

              {/* Subject Performance */}
              <div className="p-8 rounded-[2.5rem] bg-white/5 border border-white/10 backdrop-blur-xl">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    Rendimiento por Materia
                  </h3>
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Ordenado por dificultad</span>
                </div>

                <div className="space-y-6">
                  {areaPerformance.map((area, i) => (
                    <div key={area.materia} className="space-y-2">
                      <div className="flex justify-between items-end">
                        <div className="flex items-center gap-3">
                          <span className="h-8 w-8 rounded-xl bg-white/5 flex items-center justify-center text-sm font-black text-slate-400">
                            {i + 1}
                          </span>
                          <div>
                            <p className="text-sm font-black text-white uppercase">{area.materia}</p>
                            <p className="text-[9px] font-bold text-slate-500">{area.veces_evaluada} exámenes realizados</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className={cn(
                            "text-lg font-black",
                            area.promedio_acierto >= 70 ? "text-emerald-400" : area.promedio_acierto >= 50 ? "text-amber-400" : "text-rose-400"
                          )}>
                            {Math.round(area.promedio_acierto)}%
                          </span>
                        </div>
                      </div>
                      <div className="h-3 bg-white/5 rounded-full overflow-hidden">
                        <div 
                          className={cn(
                            "h-full transition-all duration-1000",
                            area.promedio_acierto >= 70 ? "bg-emerald-500" : area.promedio_acierto >= 50 ? "bg-amber-500" : "bg-rose-500"
                          )} 
                          style={{ width: `${area.promedio_acierto}%` }}
                        />
                      </div>
                    </div>
                  ))}
                  {areaPerformance.length === 0 && (
                    <div className="py-12 text-center text-slate-600 font-bold uppercase tracking-widest text-xs">
                      Esperando datos de nuevos exámenes...
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="grid lg:grid-cols-2 gap-8 items-start">
              {/* Add Challenge */}
              <div className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl space-y-6">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Plus className="h-5 w-5 text-primary" />
                  Nuevo Reto Diario
                </h2>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Pregunta</label>
                    <textarea 
                      value={newChallenge.question}
                      onChange={e => setNewChallenge({...newChallenge, question: e.target.value})}
                      className="w-full p-4 rounded-xl bg-white/5 border border-white/10 min-h-[100px] text-sm focus:border-primary transition-all outline-none"
                      placeholder="¿Cuál es la capital de...?"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Materia</label>
                      <select 
                        value={newChallenge.area}
                        onChange={e => setNewChallenge({...newChallenge, area: e.target.value})}
                        className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-sm outline-none"
                      >
                        {['Biología', 'Química', 'Física', 'Matemáticas', 'Historia', 'Geografía', 'Español', 'Habilidades'].map(a => (
                          <option key={a} value={a} className="bg-slate-900">{a}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Fecha Activa</label>
                      <input 
                        type="date"
                        value={newChallenge.active_date}
                        onChange={e => setNewChallenge({...newChallenge, active_date: e.target.value})}
                        className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-sm outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest block">Opciones</label>
                    {newChallenge.options.map((opt, i) => (
                      <div key={i} className="flex gap-2">
                        <input 
                          value={opt}
                          onChange={e => {
                            const newOpts = [...newChallenge.options];
                            newOpts[i] = e.target.value;
                            setNewChallenge({...newChallenge, options: newOpts});
                          }}
                          className={`flex-1 p-3 rounded-xl bg-white/5 border text-sm outline-none transition-all ${newChallenge.correct_index === i ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-white/10'}`}
                          placeholder={`Opción ${i + 1}`}
                        />
                        <button 
                          onClick={() => setNewChallenge({...newChallenge, correct_index: i})}
                          className={`w-12 h-12 rounded-xl flex items-center justify-center border transition-all ${newChallenge.correct_index === i ? 'bg-emerald-500 border-emerald-400 text-white' : 'bg-white/5 border-white/10 text-slate-600 hover:text-white'}`}
                        >
                          <CheckCircle className="h-5 w-5" />
                        </button>
                      </div>
                    ))}
                  </div>

                  <button 
                    onClick={createChallenge}
                    disabled={loading || !newChallenge.question || newChallenge.options.some(o => !o)}
                    className="w-full py-4 rounded-2xl bg-primary text-white font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                  >
                    {loading ? 'Creando...' : 'Crear Reto'}
                  </button>
                </div>
              </div>

              {/* List Challenges */}
              <div className="space-y-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <List className="h-5 w-5 text-primary" />
                  Próximos Retos
                </h2>
                <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                  {challenges.map(c => (
                    <div key={c.id} className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all flex items-center justify-between group">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded bg-white/10 text-slate-400">{c.active_date}</span>
                          <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded bg-primary/20 text-primary">{c.area}</span>
                        </div>
                        <p className="text-sm font-bold text-white line-clamp-1">{c.question}</p>
                      </div>
                      <button 
                        onClick={() => deleteChallenge(c.id)}
                        className="p-3 rounded-xl bg-rose-500/10 text-rose-500 opacity-0 group-hover:opacity-100 transition-all hover:bg-rose-500 hover:text-white"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                  {challenges.length === 0 && (
                    <div className="p-12 text-center text-slate-600 font-bold uppercase tracking-widest text-xs">
                      No hay retos programados
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'videos' && (
            <div className="grid lg:grid-cols-2 gap-8 items-start animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* Form */}
              <div className="p-8 rounded-3xl bg-white/5 border border-pink-500/20 backdrop-blur-xl space-y-4">
                <h2 className="text-xl font-bold flex items-center gap-2 text-pink-400">
                  {editingVideoId ? <Pencil className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
                  {editingVideoId ? 'Editar Video' : 'Agregar Video'}
                </h2>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Materia</label>
                    <select
                      value={videoForm.materia}
                      onChange={e => setVideoForm({ ...videoForm, materia: e.target.value })}
                      className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-sm outline-none"
                    >
                      {VIDEO_MATERIAS.map(m => <option key={m} value={m} className="bg-slate-900">{m}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Subíndice</label>
                    <input
                      value={videoForm.subindice}
                      onChange={e => setVideoForm({ ...videoForm, subindice: e.target.value })}
                      placeholder="ej: 1.1 Células"
                      className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-sm outline-none focus:border-pink-500 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Título del video *</label>
                  <input
                    value={videoForm.titulo}
                    onChange={e => setVideoForm({ ...videoForm, titulo: e.target.value })}
                    placeholder="Ej: Introducción a las funciones"
                    className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-sm outline-none focus:border-pink-500 transition-all"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">URL de YouTube</label>
                  <input
                    value={videoForm.youtube_url}
                    onChange={e => setVideoForm({ ...videoForm, youtube_url: e.target.value })}
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-sm outline-none focus:border-pink-500 transition-all"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Descripción</label>
                  <textarea
                    value={videoForm.descripcion}
                    onChange={e => setVideoForm({ ...videoForm, descripcion: e.target.value })}
                    placeholder="Descripción breve (opcional)"
                    rows={2}
                    className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-sm outline-none focus:border-pink-500 transition-all resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Orden</label>
                    <input
                      type="number"
                      value={videoForm.orden}
                      onChange={e => setVideoForm({ ...videoForm, orden: Number(e.target.value) })}
                      className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-sm outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Activo</label>
                    <button
                      onClick={() => setVideoForm({ ...videoForm, activo: !videoForm.activo })}
                      className={`w-full p-3 rounded-xl border text-sm font-black transition-all ${videoForm.activo ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400' : 'bg-white/5 border-white/10 text-slate-500'}`}
                    >
                      {videoForm.activo ? '✅ Visible' : '⏸ Oculto'}
                    </button>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={saveVideo}
                    disabled={videoLoading}
                    className="flex-1 py-4 rounded-2xl bg-pink-600 text-white font-black uppercase tracking-widest hover:bg-pink-500 active:scale-95 transition-all disabled:opacity-50"
                  >
                    {videoLoading ? 'Guardando...' : editingVideoId ? 'Actualizar' : 'Agregar Video'}
                  </button>
                  {editingVideoId && (
                    <button
                      onClick={() => { setEditingVideoId(null); setVideoForm({ ...emptyVideoForm }); }}
                      className="px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-slate-400 font-black hover:bg-white/10 transition-all"
                    >
                      Cancelar
                    </button>
                  )}
                </div>
              </div>

              {/* List */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <List className="h-5 w-5 text-pink-400" />
                    Videos ({videos.length})
                  </h2>
                  <select
                    value={videoFilter}
                    onChange={e => setVideoFilter(e.target.value)}
                    className="p-2 rounded-xl bg-white/5 border border-white/10 text-xs outline-none"
                  >
                    <option value="Todas" className="bg-slate-900">Todas las materias</option>
                    {VIDEO_MATERIAS.map(m => <option key={m} value={m} className="bg-slate-900">{m}</option>)}
                  </select>
                </div>

                <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
                  {videoLoading && <p className="text-center text-slate-500 py-8 text-sm">Cargando...</p>}
                  {!videoLoading && videos.filter(v => videoFilter === 'Todas' || v.materia === videoFilter).length === 0 && (
                    <div className="p-12 text-center text-slate-600 font-bold uppercase tracking-widest text-xs">No hay videos</div>
                  )}
                  {videos
                    .filter(v => videoFilter === 'Todas' || v.materia === videoFilter)
                    .map((v: any) => (
                      <div key={v.id} className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-pink-500/30 transition-all group">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                              <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded bg-pink-500/20 text-pink-400">{v.materia}</span>
                              <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded bg-white/10 text-slate-400">{v.subindice}</span>
                              <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${v.activo ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-700 text-slate-500'}`}>
                                {v.activo ? 'Activo' : 'Oculto'}
                              </span>
                            </div>
                            <p className="text-sm font-bold text-white truncate">{v.titulo}</p>
                            {v.descripcion && <p className="text-xs text-slate-500 truncate mt-0.5">{v.descripcion}</p>}
                          </div>
                          <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => toggleVideoActivo(v.id, v.activo)}
                              title={v.activo ? 'Desactivar' : 'Activar'}
                              className="p-2 rounded-xl bg-white/5 hover:bg-emerald-500/20 text-slate-400 hover:text-emerald-400 transition-all"
                            >
                              {v.activo ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                            <button
                              onClick={() => startEditVideo(v)}
                              className="p-2 rounded-xl bg-white/5 hover:bg-pink-500/20 text-slate-400 hover:text-pink-400 transition-all"
                            >
                              <Pencil className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => deleteVideo(v.id)}
                              className="p-2 rounded-xl bg-white/5 hover:bg-rose-500 text-slate-400 hover:text-white transition-all"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}

          {message && (
            <div className={`p-6 rounded-2xl border font-bold animate-pulse ${message.includes('❌') ? 'bg-rose-500/10 border-rose-500/20 text-rose-500' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500'}`}>
              {message}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminPage;
