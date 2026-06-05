import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface PromoBloqueoProps {
  titulo: string;
}

export const PromoBloqueo = ({ titulo }: PromoBloqueoProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const irAMercadoPago = async () => {
    if (!user) {
      navigate('/auth?ref=promo-ecoems');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/tokens/buy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          packageId: 'promo_ecoems',
          userId: user.id,
          userEmail: user.email,
        }),
      });
      const data = await res.json();
      if (data.init_point) {
        window.location.href = data.init_point;
      } else {
        toast.error('Error al conectar con Mercado Pago');
      }
    } catch {
      toast.error('Error al conectar con Mercado Pago');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-8">
      <div className="max-w-sm w-full text-center">

        <div className="text-5xl mb-4">🔒</div>

        <h2 className="font-bold text-white text-xl mb-2">
          {titulo} bloqueado
        </h2>

        <p className="text-slate-400 text-sm mb-6 leading-relaxed">
          Para seguir creciendo y mejorar la plataforma
          con más contenido, simuladores y tecnología de IA,
          este contenido requiere activación.
        </p>

        <div className="bg-[#12121a] border border-orange-500/30 rounded-2xl p-5 mb-4 text-left">

          <div className="flex items-center justify-between mb-3">
            <span className="text-orange-400 font-bold text-xs uppercase tracking-widest">
              🔥 Promo ECOEMS 2026
            </span>
            <span className="text-xs bg-orange-600/20 border border-orange-600/30 text-orange-400 px-2 py-0.5 rounded-full">
              Permanente ♾️
            </span>
          </div>

          <div className="flex items-baseline gap-2 mb-4">
            <span className="text-slate-500 line-through text-sm">$170 MXN</span>
            <span className="text-orange-400 font-bold text-3xl">$50 MXN</span>
          </div>

          <div className="space-y-1.5 text-sm text-slate-300 mb-5">
            <p>✅ Todos los bancos del Simulador Pro</p>
            <p>✅ Simulador Infinito (3,680+ preguntas)</p>
            <p>✅ Práctica por Subíndice</p>
            <p>✅ Acordeón ECOEMS completo</p>
            <p>✅ 44 videos Guía 2026</p>
            <p>🤖 Tutor IA GRATIS hasta el 29 de junio</p>
          </div>

          <div className="bg-purple-600/10 border border-purple-500/30 rounded-xl p-3 mb-4 text-center">
            <p className="text-purple-400 font-bold text-sm">
              🎁 Tutor IA ilimitado hasta el 29 de junio
            </p>
            <p className="text-slate-500 text-xs mt-0.5">
              Pregunta todo lo que necesites antes del examen
            </p>
          </div>

          <button
            onClick={irAMercadoPago}
            disabled={loading}
            className="w-full bg-orange-600 text-white py-4 rounded-xl font-bold text-base hover:bg-orange-500 active:scale-95 transition-all disabled:opacity-50 shadow-[0_0_20px_rgba(234,88,12,0.3)]"
          >
            {loading
              ? '⏳ Conectando con Mercado Pago...'
              : '💳 Pagar $50 MXN ahora'}
          </button>

          <p className="text-center text-xs text-slate-600 mt-2">
            OXXO · SPEI · Tarjeta · Débito
          </p>
        </div>

        <p className="text-slate-600 text-xs">
          ¿Ya pagaste? Recarga la página o cierra sesión y vuelve a entrar.
        </p>
      </div>
    </div>
  );
};

export default PromoBloqueo;
