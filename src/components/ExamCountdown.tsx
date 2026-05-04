import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { X } from "lucide-react";

const EXAM_DATE = new Date("2026-06-20T08:00:00");
const STORAGE_KEY = "exam_banner_closed";

export default function ExamCountdown() {
  const [days, setDays] = useState(0);
  const [closed, setClosed] = useState(() => !!localStorage.getItem(STORAGE_KEY));

  useEffect(() => {
    const calc = () => {
      const diff = EXAM_DATE.getTime() - Date.now();
      setDays(Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24))));
    };
    calc();
    const id = setInterval(calc, 60_000);
    return () => clearInterval(id);
  }, []);

  if (closed || days <= 0) return null;

  return (
    <div className="relative z-50 bg-gradient-to-r from-amber-500 to-orange-500 text-white">
      <div className="max-w-6xl mx-auto px-4 py-2 flex items-center justify-between gap-4">
        <div className="flex-1 text-center text-sm font-medium">
          ⏰ Faltan <span className="font-black">{days} días</span> para el ECOEMS 2026 — ¡Prepárate ahora!
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <Link
            to="/tokens"
            className="text-xs font-black uppercase tracking-wide bg-white/20 hover:bg-white/30 px-3 py-1 rounded-full transition-colors whitespace-nowrap"
          >
            Comprar tokens →
          </Link>
          <button
            onClick={() => {
              localStorage.setItem(STORAGE_KEY, "1");
              setClosed(true);
            }}
            className="p-1 hover:bg-white/20 rounded-full transition-colors"
            aria-label="Cerrar"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
