import Spline from '@splinetool/react-spline';
import { Suspense, useState, useRef, useEffect } from 'react';

const SPLINE_URL = 'https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode';

/**
 * Detecta WebGL sincrónicamente en el primer render (lazy useState initializer).
 * No usa useEffect — el check ocurre ANTES de que Spline se monte.
 */
function checkWebGL(): boolean {
  if (typeof window === 'undefined') return true; // SSR: asumir soporte
  try {
    const canvas = document.createElement('canvas');
    const gl =
      canvas.getContext('webgl') ||
      canvas.getContext('webgl2') ||
      canvas.getContext('experimental-webgl');

    const result = !!gl;
    console.log('[NeuralBrainCanvas] checkWebGL:', result, '| gl:', gl);
    return result;
  } catch (e) {
    console.warn('[NeuralBrainCanvas] checkWebGL exception:', e);
    return false;
  }
}

// Fallback de orbes CSS — sin dependencias de WebGL
function OrbFallback() {
  return (
    <div className="w-full h-full relative flex items-center justify-center overflow-hidden">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="orb-float absolute rounded-full"
          style={{
            width: `${80 + i * 40}px`,
            height: `${80 + i * 40}px`,
            background:
              i % 2 === 0
                ? 'radial-gradient(circle, #7c3aed, transparent)'
                : 'radial-gradient(circle, #f59e0b, transparent)',
            animation: `floatOrb${i} ${3 + i * 0.8}s ease-in-out infinite`,
            left: `${10 + i * 12}%`,
            top: `${15 + (i % 3) * 20}%`,
          }}
        />
      ))}
      <div className="text-6xl animate-pulse z-10">🤖</div>
    </div>
  );
}

export default function NeuralBrainCanvas() {
  // ✅ Lazy initializer: corre sincrónicamente ANTES del primer render.
  // Spline NUNCA se monta si WebGL no está disponible.
  const [webglOK] = useState<boolean>(() => checkWebGL());
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    console.log('[NeuralBrainCanvas] mount | webglOK:', webglOK, '| URL:', SPLINE_URL);

    if (!webglOK) {
      console.log('[NeuralBrainCanvas] → mostrando OrbFallback (sin WebGL)');
      return;
    }

    // Log del tamaño del contenedor al montar
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      console.log('[NeuralBrainCanvas] contenedor:', rect.width, 'x', rect.height, 'px');
    }

    // Safety-net: si Spline no llama onLoad ni onError en 12s → fallback
    timeoutRef.current = setTimeout(() => {
      console.warn('[NeuralBrainCanvas] ⏱ Timeout 12s → fallback CSS activado (Spline no respondió)');
      setFailed(true);
    }, 12_000);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [webglOK]);

  // Sin WebGL (OBS, navegadores sandboxed) → CSS inmediato, sin Spline
  if (!webglOK || failed) {
    return <OrbFallback />;
  }

  return (
    <div
      ref={containerRef}
      style={{ width: '100%', height: '100%', minHeight: '400px', position: 'relative' }}
    >
      <Suspense
        fallback={
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-violet-500/20 animate-pulse" />
          </div>
        }
      >
        <Spline
          scene={SPLINE_URL}
          style={{ width: '100%', height: '100%', background: 'transparent' }}
          onLoad={(splineApp) => {
            console.log('✅ [NeuralBrainCanvas] Spline onLoad — robot cargado', splineApp);
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            setLoaded(true);

            // Log del canvas que Spline creó
            const canvas = containerRef.current?.querySelector('canvas');
            if (canvas) {
              const r = canvas.getBoundingClientRect();
              console.log('[NeuralBrainCanvas] canvas size:', r.width, 'x', r.height);
            } else {
              console.warn('[NeuralBrainCanvas] ⚠ No se encontró canvas en el DOM después de onLoad');
            }
          }}
          onError={(err) => {
            console.error('❌ [NeuralBrainCanvas] Spline onError:', err);
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            setFailed(true);
          }}
        />
      </Suspense>

      {/* Indicador de carga visible mientras Spline inicializa */}
      {!loaded && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none',
          }}
        >
          <div className="w-16 h-16 rounded-full bg-violet-500/20 animate-pulse" />
        </div>
      )}
    </div>
  );
}
