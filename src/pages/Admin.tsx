import React, { useState, useEffect } from 'react';
import { 
  Search, User, Database, Plus, Minus, ShieldCheck, 
  ArrowLeft, Zap, Flame, Trash2, Calendar, LayoutGrid,
  CheckCircle, List
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

const AdminPage = () => {
  const { user, profile, isLoading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'users' | 'challenges'>('users');
  
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
    if (activeTab === 'challenges') {
      fetchChallenges();
    }
  }, [activeTab]);

  const fetchChallenges = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('daily_challenges')
      .select('*')
      .order('active_date', { ascending: false });
    
    if (!error && data) setChallenges(data);
    setLoading(false);
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
        </div>

        <div className="grid gap-8">
          {activeTab === 'users' ? (
            <>
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
            </>
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
