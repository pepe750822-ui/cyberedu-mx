import React from "react";
import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface RestoreModalProps {
    onRestore: () => void;
    onNew: () => void;
}

export const RestoreModal: React.FC<RestoreModalProps> = ({ onRestore, onNew }) => (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-900/50 border border-white/10 rounded-[2.5rem] p-10 text-center space-y-8 backdrop-blur-xl">
            <div className="h-20 w-20 bg-primary/20 rounded-3xl flex items-center justify-center mx-auto">
                <RotateCcw className="h-10 w-10 text-primary" />
            </div>
            <div className="space-y-4">
                <h2 className="text-2xl font-black uppercase tracking-tighter text-white">¿Continuar Anterior?</h2>
                <p className="text-slate-400 text-sm leading-relaxed">
                    Detectamos un simulador en progreso. ¿Deseas retomarlo exactamente donde lo dejaste?
                </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <Button onClick={onRestore} className="h-14 rounded-2xl bg-primary hover:bg-primary/90 font-bold uppercase">
                    Sí, Continuar
                </Button>
                <Button onClick={onNew} variant="outline" className="h-14 rounded-2xl border-white/10 text-white font-bold uppercase">
                    No, Nuevo
                </Button>
            </div>
        </div>
    </div>
);
