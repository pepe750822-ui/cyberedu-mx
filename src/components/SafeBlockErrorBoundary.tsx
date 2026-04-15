import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle } from "lucide-react";

interface Props {
  children?: ReactNode;
  fallbackMessage?: string;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class SafeBlockErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error in interactive AI block:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="my-4 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-bold text-red-400 uppercase tracking-widest mb-1">Error de Sistema</p>
            <p className="text-sm text-slate-300">
              {this.props.fallbackMessage || "No se pudo cargar este bloque interactivo devido a un formato inesperado de la Inteligencia Artificial."}
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
