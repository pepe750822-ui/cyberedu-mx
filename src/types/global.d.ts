interface Window {
  gtag?: (...args: unknown[]) => void;
  clarity?: (method: string, ...args: unknown[]) => void;
}
