import { Link } from "react-router-dom";
import { MessageSquarePlus } from "lucide-react";

const Footer = () => {
    return (
        <footer className="border-t border-border bg-card">
            <div className="container mx-auto px-4 py-8 text-center space-y-3">
                <p className="text-sm text-muted-foreground mb-1">
                    © 2026 PrepáraTE — Preparación para el examen de educación media superior
                </p>
                <p className="text-xs font-bold text-primary/70 uppercase tracking-widest">
                    Desarrollado por CyberEdu Mx
                </p>
                <div className="flex flex-wrap justify-center gap-3">
                    <Link
                        to="/sugerencias"
                        className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-primary transition-colors border border-white/5 hover:border-primary/30 px-4 py-2 rounded-full"
                    >
                        <MessageSquarePlus className="h-3.5 w-3.5" />
                        Enviar sugerencia
                    </Link>
                    <a
                        href="/manual"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-amber-500 transition-colors border border-white/5 hover:border-amber-500/30 px-4 py-2 rounded-full"
                    >
                        Manual de Uso
                    </a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

