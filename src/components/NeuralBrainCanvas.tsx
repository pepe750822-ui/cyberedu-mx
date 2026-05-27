import Spline from '@splinetool/react-spline';
import { Suspense, useState, useEffect, useRef } from 'react';

// Fallback de orbes CSS — se muestra solo si Spline falla o agota el tiempo
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
  // `failed` solo se activa cuando Spline reporta un error real
  const [failed, setFailed] = useState(false);
  // Safety-net: si Spline nunca dispara onLoad ni onError en 15s → fallback
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    timeoutRef.current = setTimeout(() => {
      console.warn('[NeuralBrainCanvas] Spline timeout — activando fallback CSS');
      setFailed(true);
    }, 15_000);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleLoad = () => {
    // Spline cargó correctamente → cancelar el timeout
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  const handleError = () => {
    console.warn('[NeuralBrainCanvas] Spline onError → activando fallback CSS');
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setFailed(true);
  };

  if (failed) {
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
        onLoad={handleLoad}
        onError={handleError}
      />
    </Suspense>
  );
}
