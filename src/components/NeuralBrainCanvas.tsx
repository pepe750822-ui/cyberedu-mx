import { Suspense, useState, useRef, useEffect, lazy } from 'react';

// Carga perezosa del componente Spline para evitar cargar el motor 3D si WebGL no está disponible
const Spline = lazy(() => import('@splinetool/react-spline'));

const SPLINE_URL = 'https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode';

/**
 * Detecta WebGL sincrónicamente en el primer render (lazy useState initializer).
 * No usa useEffect — el check ocurre ANTES de que Spline se monte.
 */
function checkWebGL(): boolean {
  if (typeof window === 'undefined') return true; // SSR: asumir soporte
  try {
    const canvas = document.createElement('canvas');
    const gl = (canvas.getContext('webgl') || canvas.getContext('webgl2') || canvas.getContext('experimental-webgl')) as WebGLRenderingContext | null;

    if (!gl) {
      console.warn('❌ WebGL no disponible');
      // Intentar obtener razón
      const canvas2 = document.createElement('canvas');
      const gl2 = canvas2.getContext('webgl', { failIfMajorPerformanceCaveat: true });
      console.warn('[NeuralBrainCanvas] failIfMajorPerformanceCaveat test:', !!gl2);
      return false;
    }

    // Obtener información del renderer
    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
    if (debugInfo) {
      const vendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
      const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
      console.log('✅ WebGL disponible | Vendor:', vendor, '| Renderer:', renderer);
    } else {
      console.log('✅ WebGL disponible | (sin WEBGL_debug_renderer_info)');
    }

    return true;
  } catch (e) {
    console.warn('❌ [NeuralBrainCanvas] Error detectando WebGL:', e);
    return false;
  }
}

// Fallback de orbes CSS — sin dependencias de WebGL
function OrbFallback() {
  return (
    <div className="w-full h-full relative flex flex-col items-center justify-center overflow-hidden bg-slate-900/40 rounded-2xl border border-white/5 shadow-[0_0_40px_rgba(124,58,237,0.15)]">
      <style>{`
        @keyframes hueCycle {
          0% { filter: hue-rotate(0deg) blur(30px); }
          50% { filter: hue-rotate(180deg) blur(40px); }
          100% { filter: hue-rotate(360deg) blur(30px); }
        }
        @keyframes robotFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        @keyframes floatOrb0 { 0%, 100% { transform: translate(0, 0) scale(1); } 50% { transform: translate(20px, -30px) scale(1.1); } }
        @keyframes floatOrb1 { 0%, 100% { transform: translate(0, 0) scale(1); } 50% { transform: translate(-30px, 20px) scale(0.95); } }
        @keyframes floatOrb2 { 0%, 100% { transform: translate(0, 0) scale(1); } 50% { transform: translate(30px, 25px) scale(1.05); } }
        @keyframes floatOrb3 { 0%, 100% { transform: translate(0, 0) scale(1); } 50% { transform: translate(-20px, -30px) scale(1.1); } }
        @keyframes floatOrb4 { 0%, 100% { transform: translate(0, 0) scale(1); } 50% { transform: translate(25px, -20px) scale(0.9); } }
        @keyframes floatOrb5 { 0%, 100% { transform: translate(0, 0) scale(1); } 50% { transform: translate(-35px, 25px) scale(1.15); } }
      `}</style>
      
      {/* Background Orbs */}
      <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full mix-blend-screen opacity-70"
            style={{
              width: `${140 + i * 45}px`,
              height: `${140 + i * 45}px`,
              background: i % 2 === 0
                ? 'radial-gradient(circle, rgba(124,58,237,0.6) 0%, transparent 60%)'
                : 'radial-gradient(circle, rgba(245,158,11,0.4) 0%, transparent 60%)',
              boxShadow: `0 0 ${50 + i * 15}px ${i % 2 === 0 ? 'rgba(124,58,237,0.3)' : 'rgba(245,158,11,0.2)'}`,
              animation: `floatOrb${i} ${6 + i * 1.5}s ease-in-out infinite, hueCycle ${12 + i * 3}s linear infinite`,
              left: `${5 + i * 16}%`,
              top: `${10 + (i % 3) * 25}%`,
            }}
          />
        ))}
      </div>

      {/* Robot SVG & Text */}
      <div className="z-10 flex flex-col items-center justify-center" style={{ animation: 'robotFloat 4s ease-in-out infinite' }}>
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="110" 
          height="110" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="1.2" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          className="text-violet-300 drop-shadow-[0_0_20px_rgba(124,58,237,0.9)]"
        >
          <rect width="16" height="12" x="4" y="8" rx="3" fill="rgba(124,58,237,0.1)" />
          <path d="M2 14h2" />
          <path d="M20 14h2" />
          <path d="M15 13v2" />
          <path d="M9 13v2" />
          <path d="M12 8V4H8" />
          <circle cx="12" cy="2" r="2" fill="currentColor" className="animate-pulse" />
        </svg>
      </div>

      <div className="z-10 mt-8 text-center max-w-xs px-4">
        <p className="text-xs md:text-sm text-slate-300/90 font-medium tracking-wide drop-shadow-md">
          Versión 2D
        </p>
        <p className="text-[10px] md:text-xs text-slate-400/70 mt-1">
          Para la experiencia 3D completa, usa un navegador con aceleración gráfica activada.
        </p>
      </div>
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
