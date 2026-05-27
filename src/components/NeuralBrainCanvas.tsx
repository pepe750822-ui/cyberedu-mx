import Spline from '@splinetool/react-spline';
import { Suspense, useState, useRef, useEffect } from 'react';

/**
 * Detecta WebGL sincrónicamente en el primer render (lazy useState initializer).
 * No usa useEffect — el check ocurre ANTES de que Spline se monte.
 * En OBS: canvas.getContext('webgl') devuelve null → false → fallback CSS.
 * En Chrome/Edge: devuelve un contexto válido → true → Spline carga.
 */
function checkWebGL(): boolean {
  if (typeof window === 'undefined') return true; // SSR: asumir soporte
  try {
    const canvas = document.createElement('canvas');
    const gl =
      canvas.getContext('webgl') ||
      canvas.getContext('webgl2') ||
      canvas.getContext('experimental-webgl');
    return !!gl;
  } catch {
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
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!webglOK) return; // No montar Spline → no necesitamos timeout

    // Safety-net: si Spline no llama onLoad ni onError en 12s → fallback
    timeoutRef.current = setTimeout(() => {
      console.warn('[NeuralBrainCanvas] Timeout → fallback CSS activado');
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
    <Suspense
      fallback={
        <div className="w-full h-full flex items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-violet-500/20 animate-pulse" />
        </div>
      }
    >
      <Spline
        scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
        style={{ background: 'transparent' }}
        className="w-full h-full"
        onLoad={() => {
          if (timeoutRef.current) clearTimeout(timeoutRef.current);
        }}
        onError={() => {
          console.warn('[NeuralBrainCanvas] Spline onError → fallback CSS');
          if (timeoutRef.current) clearTimeout(timeoutRef.current);
          setFailed(true);
        }}
      />
    </Suspense>
  );
}
