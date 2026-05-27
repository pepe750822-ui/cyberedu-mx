import Spline from '@splinetool/react-spline';
import { Suspense } from 'react';

export default function NeuralBrainCanvas() {
  return (
    <Suspense fallback={
      <div className="w-full h-64 flex items-center justify-center">
        <div className="w-16 h-16 rounded-full bg-violet-500/20 animate-pulse" />
      </div>
    }>
      <Spline
        scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
        style={{ background: 'transparent' }}
        className="w-full h-full"
      />
    </Suspense>
  );
}
