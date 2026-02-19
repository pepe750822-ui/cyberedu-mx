import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const { user, isLoading } = useAuth();
    const location = useLocation();

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 cyber-grid">
                <div className="relative">
                    <div className="h-16 w-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                    <Loader2 className="h-8 w-8 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                </div>
                <p className="mt-4 text-slate-400 font-black uppercase tracking-widest text-[10px] animate-pulse">
                    Verificando Credenciales...
                </p>
            </div>
        );
    }

    if (!user) {
        // Redirect to login but save the current location
        return <Navigate to="/auth" state={{ from: location }} replace />;
    }

    return <>{children}</>;
};
