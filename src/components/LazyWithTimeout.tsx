import React, { Suspense, lazy, ComponentType, useEffect, useState } from 'react';
import { shouldLoadDirect } from '@/utils/deviceDetect';

interface Props<T extends ComponentType<any>> {
  /** Factory function, igual que el argumento de React.lazy() */
  factory: () => Promise<{ default: T }>;
  /** Props que se pasan al componente cargado */
  componentProps?: React.ComponentPropsWithoutRef<T>;
  /** Timeout en ms antes de mostrar el fallback de error (default 12000) */
  timeoutMs?: number;
  /** Contenido mientras carga */
  fallback?: React.ReactNode;
  /** Contenido si falla o timeout */
  errorFallback?: React.ReactNode;
}

interface State {
  LoadedComponent: ComponentType<any> | null;
  timedOut: boolean;
  error: boolean;
}

/**
 * LazyWithTimeout
 * Wrapper sobre React.lazy() + Suspense que:
 *  1. Muestra un fallback mientras carga.
 *  2. En tablets (shouldLoadDirect) carga DIRECTAMENTE sin lazy para evitar
 *     problemas con CSP + blob: + WebGL en iOS/Android tablets.
 *  3. Cancela con un error amigable si la carga supera `timeoutMs`.
 */
export function LazyWithTimeout<T extends ComponentType<any>>({
  factory,
  componentProps = {} as any,
  timeoutMs = 12_000,
  fallback = (
    <div className="flex items-center justify-center p-8 text-slate-400 text-sm gap-2">
      <span className="animate-spin inline-block w-4 h-4 border-2 border-cyan-500 border-t-transparent rounded-full" />
      Cargando componente…
    </div>
  ),
  errorFallback = (
    <div className="flex items-center justify-center p-6 text-amber-400 text-sm gap-2 rounded-xl border border-amber-500/20 bg-amber-500/5">
      ⚠️ No se pudo cargar este componente. Intenta recargar la página.
    </div>
  ),
}: Props<T>) {
  const [state, setState] = useState<State>({
    LoadedComponent: null,
    timedOut: false,
    error: false,
  });

  useEffect(() => {
    let cancelled = false;

    // En tablets: carga directa (sin lazy/Suspense) para evitar problemas CSP+WebGL
    if (shouldLoadDirect()) {
      factory()
        .then(mod => {
          if (!cancelled) setState({ LoadedComponent: mod.default, timedOut: false, error: false });
        })
        .catch(() => {
          if (!cancelled) setState({ LoadedComponent: null, timedOut: false, error: true });
        });

      const timer = setTimeout(() => {
        if (!cancelled) setState(s => (s.LoadedComponent ? s : { ...s, timedOut: true }));
      }, timeoutMs);

      return () => {
        cancelled = true;
        clearTimeout(timer);
      };
    }

    // Desktop / Mobile: lazy normal con timeout
    const LazyComp = lazy(factory);
    setState({ LoadedComponent: LazyComp, timedOut: false, error: false });

    const timer = setTimeout(() => {
      if (!cancelled) setState(s => (s.LoadedComponent ? s : { ...s, timedOut: true }));
    }, timeoutMs);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, []);  // eslint-disable-line react-hooks/exhaustive-deps

  const { LoadedComponent, timedOut, error } = state;

  if (error || timedOut) return <>{errorFallback}</>;
  if (!LoadedComponent) return <>{fallback}</>;

  // En tablets, LoadedComponent ya está resuelto (no es lazy) → no necesita Suspense
  if (shouldLoadDirect()) {
    return <LoadedComponent {...componentProps} />;
  }

  return (
    <Suspense fallback={fallback}>
      <LoadedComponent {...componentProps} />
    </Suspense>
  );
}

export default LazyWithTimeout;
