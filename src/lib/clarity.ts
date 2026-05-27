export const clarityEvent = (event: string) => {
  if (typeof window !== 'undefined' && (window as any).clarity) {
    (window as any).clarity('event', event);
  }
};

export const clarityIdentify = (userId: string, email?: string | null) => {
  if (typeof window !== 'undefined' && (window as any).clarity) {
    (window as any).clarity('identify', userId, undefined, undefined, email ?? undefined);
  }
};
