'use client'
import { Suspense, lazy } from 'react'
const Spline = lazy(() => import('@splinetool/react-spline'))

interface SplineSceneProps {
  scene: string
  className?: string
}

export function SplineScene({ scene, className }: SplineSceneProps) {
  return (
    <Suspense fallback={
      <div className="w-full h-full flex items-center justify-center">
        <div className="w-16 h-16 rounded-full bg-violet-500/20 animate-pulse" />
      </div>
    }>
      <Spline scene={scene} className={className} />
    </Suspense>
  )
}
