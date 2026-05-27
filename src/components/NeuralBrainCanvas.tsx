import Spline from '@splinetool/react-spline';
import { Suspense, useState, useEffect } from 'react';

// Detección temprana de WebGL
function isWebGLAvailable() {
  if (typeof window === 'undefined') return true;
  try {
    const canvas = document.createElement('canvas');
    return !!(window.WebGLRenderingContext && 
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
  } catch (e) {
    return false;
  }
}

export default function NeuralBrainCanvas() {
  const [webglSupported, setWebglSupported] = useState(true);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setWebglSupported(isWebGLAvailable());
  }, []);

  if (!webglSupported || failed) {
    return (
      <div className="w-full h-full relative flex items-center justify-center overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="orb-float absolute rounded-full"
            style={{
              width: `${80 + i * 40}px`,
              height: `${80 + i * 40}px`,
              background: i % 2 === 0
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

  return (
    <Suspense fallback={
      <div className="w-full h-full flex items-center justify-center">
        <div className="w-16 h-16 rounded-full bg-violet-500/20 animate-pulse" />
      </div>
    }>
      <Spline
        scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
        style={{ background: 'transparent' }}
        className="w-full h-full"
        onError={() => setFailed(true)}
      />
    </Suspense>
  );
}
