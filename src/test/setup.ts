import "@testing-library/jest-dom";

// Algunas pruebas (p. ej. las de los endpoints en api/) corren en entorno `node`
// y no tienen `window`; el polyfill de matchMedia solo aplica en jsdom.
if (typeof window !== "undefined") {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => {},
    }),
  });
}
