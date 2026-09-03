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
      navigate('/auth?ref=tokens');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/tokens/buy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          packageId: 'paquete_completo',
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

        <div className="bg-[#12121a] border border-violet-500/30 rounded-2xl p-5 mb-4 text-left">

          <div className="flex items-center justify-between mb-3">
            <span className="text-violet-400 font-bold text-xs uppercase tracking-widest">
              👑 Paquete Completo
            </span>
            <span className="text-xs bg-violet-600/20 border border-violet-600/30 text-violet-400 px-2 py-0.5 rounded-full">
              Permanente ♾️
            </span>
          </div>

          <div className="flex items-baseline gap-2 mb-4">
            <span className="text-violet-400 font-bold text-3xl">$200 MXN</span>
            <span className="text-slate-500 text-xs">pago único</span>
          </div>

          <div className="space-y-1.5 text-sm text-slate-300 mb-5">
            <p>✅ Todos los bancos del Simulador Pro</p>
            <p>✅ Simulador Infinito (3,680+ preguntas)</p>
            <p>✅ Práctica por Subíndice ilimitada</p>
            <p>✅ Acordeón ECOEMS completo</p>
            <p>✅ 44 videos Guía 2026</p>
            <p>🎁 200 tokens para el Tutor IA incluidos</p>
          </div>

          <button
            onClick={irAMercadoPago}
            disabled={loading}
            className="w-full bg-violet-600 text-white py-4 rounded-xl font-bold text-base hover:bg-violet-500 active:scale-95 transition-all disabled:opacity-50 shadow-[0_0_20px_rgba(124,58,237,0.3)]"
          >
            {loading
              ? '⏳ Conectando con Mercado Pago...'
              : '💳 Pagar $200 MXN ahora'}
          </button>

          <p className="text-center text-xs text-slate-600 mt-2">
            OXXO · SPEI · Tarjeta · Débito
          </p>

          <a
            href={`https://wa.me/5552326941?text=${encodeURIComponent('¡Hola! Quiero activar el Paquete Completo de CyberEdu MX por $200 MXN.\n\nDatos para transferencia:\nBanco: Santander\nCLABE: 014180565546539842\nNombre: JOSE LUIS GONZALEZ PEREZ\n\nTe mando mi comprobante. Mi correo de Google es: ')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 bg-green-600/20 border border-green-500/30 text-green-400 py-3 rounded-xl font-bold text-sm hover:bg-green-600/30 transition-all mt-3"
          >
            💬 Pagar por WhatsApp
          </a>

          <p className="text-center text-xs text-slate-600 mt-2">
            Manda tu comprobante + correo de Google
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
