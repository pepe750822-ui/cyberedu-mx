import React from 'react';

const LoadingSpinner = () => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] w-full gap-4">
    <div className="relative">
      <div className="w-12 h-12 border-4 border-primary/20 rounded-full" />
      <div className="absolute top-0 w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground animate-pulse">
      Cargando plataforma...
    </p>
  </div>
);

export default LoadingSpinner;
