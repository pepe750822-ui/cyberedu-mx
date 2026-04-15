import React, { useState } from 'react';
import { Search, User, Database, Plus, Minus, ShieldCheck, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [amount, setAmount] = useState(1);
  const [message, setMessage] = useState('');

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

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-primary/30">
      <div className="absolute inset-0 bg-gradient-radial from-primary/5 via-transparent to-transparent opacity-50" />
      
      <main className="relative z-10 max-w-4xl mx-auto px-6 py-12">
        <div className="flex items-center gap-4 mb-8">
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

        <div className="grid gap-8">
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
