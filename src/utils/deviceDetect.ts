/**
 * deviceDetect.ts
 * Utilidad para detectar el tipo de dispositivo.
 * Usada para decidir si cargar componentes pesados con lazy loading
 * o directamente (tablets son el caso problemático con WebGL/video).
 */

export type DeviceType = 'mobile' | 'tablet' | 'desktop';

/** Detecta si el dispositivo es táctil */
export function isTouchDevice(): boolean {
  if (typeof window === 'undefined') return false;
  return (
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    // @ts-ignore
    navigator.msMaxTouchPoints > 0
  );
}

/** Detecta tipo de dispositivo con UA + tamaño de pantalla */
export function getDeviceType(): DeviceType {
  if (typeof window === 'undefined') return 'desktop';

  const ua = navigator.userAgent || '';
  const isTabletUA = /ipad|android(?!.*mobile)|tablet|playbook|silk/i.test(ua);
  const isMobileUA = /iphone|ipod|android.*mobile|windows phone|blackberry|mobile/i.test(ua);

  // Heurística: ancho 600–1280 + táctil → tablet
  const w = window.innerWidth;
  const isTabletSize = w >= 600 && w <= 1280 && isTouchDevice();

  if (isTabletUA || isTabletSize) return 'tablet';
  if (isMobileUA) return 'mobile';
  return 'desktop';
}

export const isTablet  = (): boolean => getDeviceType() === 'tablet';
export const isMobile  = (): boolean => getDeviceType() === 'mobile';
export const isDesktop = (): boolean => getDeviceType() === 'desktop';

/**
 * En tablets y celulares, los componentes WebGL y video tienen problemas con lazy loading
 * combinado con CSP estrictas. Devuelve `true` cuando se recomienda carga DIRECTA.
 */
export const shouldLoadDirect = (): boolean => isTablet() || isMobile();
