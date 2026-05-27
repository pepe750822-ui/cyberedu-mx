import { useState } from 'react';
import Spline from '@splinetool/react-spline';

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
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return <OrbFallback />;
  }

  return (
    <div className="w-full h-full">
      <Spline
        scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
        onError={() => setHasError(true)}
      />
    </div>
  );
}
