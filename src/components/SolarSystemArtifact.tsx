import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Sun, Star, Info, RotateCcw, ZoomIn, ZoomOut, Play, Pause } from 'lucide-react';

interface Planet {
  name: string;
  color: string;
  size: number;
  distance: number;
  speed: number;
  info: string;
}

const PLANETS: Planet[] = [
  { name: 'Mercurio', color: '#9ca3af', size: 3, distance: 40, speed: 0.04, info: 'El planeta más pequeño y cercano al Sol.' },
  { name: 'Venus', color: '#fbbf24', size: 5, distance: 60, speed: 0.015, info: 'El planeta más caliente del sistema solar.' },
  { name: 'Tierra', color: '#3b82f6', size: 5.5, distance: 85, speed: 0.01, info: 'Nuestro hogar. El único con vida confirmada.' },
  { name: 'Marte', color: '#ef4444', size: 4, distance: 110, speed: 0.008, info: 'El planeta rojo. Posee el volcán más grande.' },
  { name: 'Júpiter', color: '#d97706', size: 12, distance: 150, speed: 0.004, info: 'El gigante gaseoso. 1,300 veces más grande que la Tierra.' },
  { name: 'Saturno', color: '#eab308', size: 10, distance: 190, speed: 0.003, info: 'Famoso por sus espectaculares anillos de hielo.' },
  { name: 'Urano', color: '#22d3ee', size: 7, distance: 230, speed: 0.002, info: 'Un gigante de hielo que gira de lado.' },
  { name: 'Neptuno', color: '#4f46e5', size: 7, distance: 260, speed: 0.001, info: 'El planeta más lejano y ventoso.' },
  { name: 'Plutón', color: '#a8a29e', size: 2.5, distance: 290, speed: 0.0007, info: 'Planeta enano. El corazón del cinturón de Kuiper.' },
];

const SolarSystemArtifact: React.FC<{ topic?: string }> = ({ topic }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [scale, setScale] = useState(1);
  const [isPlaying, setIsPlaying] = useState(true);
  const [selectedPlanet, setSelectedPlanet] = useState<Planet | null>(null);
  const [hoveredPlanet, setHoveredPlanet] = useState<Planet | null>(null);
  const angleRef = useRef<number[]>(PLANETS.map(() => Math.random() * Math.PI * 2));
  const animFrameRef = useRef<number>(0);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;
    const cx = W / 2;
    const cy = H / 2;

    ctx.clearRect(0, 0, W, H);

    // Starfield
    ctx.fillStyle = '#020617';
    ctx.fillRect(0, 0, W, H);
    
    // Draw some static stars
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    for(let i=0; i<100; i++) {
        const x = (Math.sin(i * 123.45) * 0.5 + 0.5) * W;
        const y = (Math.cos(i * 456.78) * 0.5 + 0.5) * H;
        ctx.beginPath();
        ctx.arc(x, y, 0.5, 0, Math.PI * 2);
        ctx.fill();
    }

    // Draw Orbits
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    PLANETS.forEach(p => {
      ctx.beginPath();
      ctx.ellipse(cx, cy, p.distance * scale, p.distance * 0.6 * scale, 0, 0, Math.PI * 2);
      ctx.stroke();
    });

    // Draw Sun
    const sunGlow = ctx.createRadialGradient(cx, cy, 0, cx, cy, 25 * scale);
    sunGlow.addColorStop(0, '#fef08a');
    sunGlow.addColorStop(0.4, '#eab308');
    sunGlow.addColorStop(1, 'rgba(234, 179, 8, 0)');
    ctx.fillStyle = sunGlow;
    ctx.beginPath();
    ctx.arc(cx, cy, 30 * scale, 0, Math.PI * 2);
    ctx.fill();

    // Draw Planets
    PLANETS.forEach((p, i) => {
      const angle = angleRef.current[i];
      const x = cx + Math.cos(angle) * p.distance * scale;
      const y = cy + Math.sin(angle) * p.distance * 0.6 * scale;

      // Interaction check
      const mx = (window as any).__mouseX || 0;
      const my = (window as any).__mouseY || 0;
      const rect = canvas.getBoundingClientRect();
      const localX = mx - rect.left;
      const localY = my - rect.top;
      const dist = Math.hypot(x - localX, y - localY);

      if (dist < (p.size + 5) * scale) {
        setHoveredPlanet(p);
      }

      // Planet Glow / Shadow
      const grad = ctx.createRadialGradient(x - p.size * 0.3, y - p.size * 0.3, 0, x, y, p.size * scale);
      grad.addColorStop(0, p.color);
      grad.addColorStop(1, '#000');
      
      ctx.fillStyle = grad;
      ctx.shadowBlur = (hoveredPlanet === p || selectedPlanet === p) ? 15 : 0;
      ctx.shadowColor = p.color;
      
      ctx.beginPath();
      ctx.arc(x, y, p.size * scale, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Names if selected
      if (selectedPlanet === p) {
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 12px Inter';
        ctx.textAlign = 'center';
        ctx.fillText(p.name, x, y - p.size * scale - 10);
      }

      // Update position
      if (isPlaying) {
        angleRef.current[i] += p.speed;
      }
    });

    animFrameRef.current = requestAnimationFrame(draw);
  }, [scale, isPlaying, selectedPlanet, hoveredPlanet]);

  useEffect(() => {
    animFrameRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [draw]);

  const handleMouseMove = (e: React.MouseEvent) => {
    (window as any).__mouseX = e.clientX;
    (window as any).__mouseY = e.clientY;
  };

  const handleClick = () => {
    if (hoveredPlanet) {
      setSelectedPlanet(hoveredPlanet);
    } else {
      setSelectedPlanet(null);
    }
  };

  return (
    <div className="bg-slate-900 rounded-3xl border border-white/10 overflow-hidden shadow-2xl my-4">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-white/10 bg-black/40">
        <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500">
          <Sun className="h-5 w-5 fill-amber-500" />
        </div>
        <div>
          <h3 className="font-black text-white text-sm uppercase tracking-tighter">Simulador del Sistema Solar</h3>
          <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest">{topic || "Física y Astronomía — Interactivo"}</p>
        </div>
        <div className="ml-auto flex gap-2">
            <button 
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-2 rounded-xl bg-white/5 border border-white/10 text-white/60 hover:text-white transition-all"
            >
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </button>
            <button 
                onClick={() => { angleRef.current = PLANETS.map(() => Math.random() * Math.PI * 2); setScale(1); setSelectedPlanet(null); }}
                className="p-2 rounded-xl bg-white/5 border border-white/10 text-white/60 hover:text-white transition-all"
            >
                <RotateCcw className="h-4 w-4" />
            </button>
        </div>
      </div>

      <div className="relative">
        <canvas
          ref={canvasRef}
          width={600}
          height={400}
          className="w-full h-auto cursor-crosshair"
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setHoveredPlanet(null)}
          onClick={handleClick}
        />

        {/* Info Card Overlay */}
        {selectedPlanet && (
            <div className="absolute top-4 right-4 w-48 p-4 rounded-2xl bg-slate-900/90 border border-white/10 backdrop-blur-md animate-in fade-in zoom-in duration-300">
                <div className="flex items-center gap-2 mb-2">
                    <div className="h-3 w-3 rounded-full" style={{ backgroundColor: selectedPlanet.color }} />
                    <span className="font-black text-white text-xs uppercase">{selectedPlanet.name}</span>
                </div>
                <p className="text-white/60 text-[11px] leading-relaxed mb-3">{selectedPlanet.info}</p>
                <button 
                    onClick={() => setSelectedPlanet(null)}
                    className="w-full py-2 rounded-lg bg-white/5 text-[10px] font-black uppercase text-white/40 hover:text-white transition-all"
                >
                    Cerrar
                </button>
            </div>
        )}

        {/* Legend / Hover Hint */}
        {!selectedPlanet && (
            <div className="absolute bottom-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold text-white/40">
                <Info className="h-3 w-3" />
                {hoveredPlanet ? `Planeta: ${hoveredPlanet.name} (Clic para info)` : 'Haz clic en un planeta para explorar'}
            </div>
        )}

        {/* Zoom Controls */}
        <div className="absolute bottom-4 right-4 flex flex-col gap-2">
            <button onClick={() => setScale(s => Math.min(2, s + 0.1))} className="p-2 rounded-xl bg-black/60 border border-white/10 text-white/40 hover:text-white transition-all">
                <ZoomIn className="h-4 w-4" />
            </button>
            <button onClick={() => setScale(s => Math.max(0.5, s - 0.1))} className="p-2 rounded-xl bg-black/60 border border-white/10 text-white/40 hover:text-white transition-all">
                <ZoomOut className="h-4 w-4" />
            </button>
        </div>
      </div>
    </div>
  );
};

export default SolarSystemArtifact;
