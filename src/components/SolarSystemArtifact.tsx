import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Sun, Info, RotateCcw, ZoomIn, ZoomOut, Play, Pause } from 'lucide-react';

interface Planet {
  name: string;
  color: string;
  size: number;
  distance: number;
  speed: number;
  info: string;
  type: string;
  distSun: string;
  moons: number;
  diameter: string;
  temp: string;
}

const PLANETS: Planet[] = [
  { name: 'Mercurio', color: '#9ca3af', size: 4,   distance: 40,  speed: 0.040,  type: 'Terrestre',    distSun: '57.9 M km',  moons: 0,   diameter: '4,879 km',   temp: '167 °C promedio', info: 'El más pequeño y rápido. Un año dura 88 días terrestres.' },
  { name: 'Venus',    color: '#fbbf24', size: 6,   distance: 62,  speed: 0.015,  type: 'Terrestre',    distSun: '108.2 M km', moons: 0,   diameter: '12,104 km',  temp: '462 °C (más caliente)', info: 'Efecto invernadero extremo. Gira al revés que la mayoría.' },
  { name: 'Tierra',   color: '#3b82f6', size: 6.5, distance: 88,  speed: 0.010,  type: 'Terrestre',    distSun: '149.6 M km', moons: 1,   diameter: '12,742 km',  temp: '15 °C promedio', info: 'Único planeta con vida confirmada y agua líquida estable.' },
  { name: 'Marte',    color: '#ef4444', size: 5,   distance: 114, speed: 0.008,  type: 'Terrestre',    distSun: '227.9 M km', moons: 2,   diameter: '6,779 km',   temp: '−60 °C promedio', info: 'Tiene el volcán más alto del sistema solar: Olympus Mons.' },
  { name: 'Júpiter',  color: '#d97706', size: 14,  distance: 154, speed: 0.004,  type: 'Gaseoso',      distSun: '778.5 M km', moons: 95,  diameter: '139,820 km', temp: '−110 °C (nubes)', info: 'Gigante gaseoso. Su gran mancha roja es una tormenta de siglos.' },
  { name: 'Saturno',  color: '#eab308', size: 11,  distance: 196, speed: 0.003,  type: 'Gaseoso',      distSun: '1,432 M km', moons: 146, diameter: '116,460 km', temp: '−140 °C', info: 'Sus anillos son de hielo y roca. Menos denso que el agua.' },
  { name: 'Urano',    color: '#22d3ee', size: 8,   distance: 234, speed: 0.002,  type: 'Gigante hielo',distSun: '2,867 M km', moons: 28,  diameter: '50,724 km',  temp: '−195 °C', info: 'Gira de lado (eje inclinado 98°). Gigante de hielo.' },
  { name: 'Neptuno',  color: '#4f46e5', size: 8,   distance: 265, speed: 0.0010, type: 'Gigante hielo',distSun: '4,515 M km', moons: 16,  diameter: '49,244 km',  temp: '−200 °C', info: 'Los vientos más rápidos del sistema solar: 2,100 km/h.' },
  { name: 'Plutón',   color: '#c4b5a0', size: 3.5, distance: 295, speed: 0.0007, type: 'Planeta enano', distSun: '5,906 M km', moons: 5,   diameter: '2,376 km',   temp: '−230 °C', info: 'Reclasificado como planeta enano en 2006. Tiene una luna gigante: Caronte.' },
];

const SUN_INFO = {
  name: 'El Sol',
  color: '#fbbf24',
  type: 'Estrella — Tipo G (Secuencia principal)',
  diameter: '1,392,700 km (≈ 109 × Tierra)',
  mass: '1.989 × 10³⁰ kg (≈ 333,000 × Tierra)',
  surfaceTemp: '~5,778 K / 5,505 °C',
  galacticDist: '~26,000 años luz del centro',
  age: '~4,600 millones de años',
  info: 'Concentra el 99.86% de la masa del sistema solar. Su energía proviene de la fusión nuclear de hidrógeno en helio.',
};

// Hit radius: at least 20 logical px, even for tiny planets
const HIT_RADIUS = (p: Planet, s: number) => Math.max(20, (p.size + 12) * s);
const SUN_HIT_RADIUS = (s: number) => Math.max(24, 30 * s);

const SolarSystemArtifact: React.FC<{ topic?: string }> = ({ topic }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [scale, setScale] = useState(1);
  const [isPlaying, setIsPlaying] = useState(true);
  const [selectedPlanet, setSelectedPlanet] = useState<Planet | null>(null);
  const [sunSelected, setSunSelected] = useState(false);
  const [hoveredPlanet, setHoveredPlanet] = useState<Planet | null>(null);
  const [hoveredSun, setHoveredSun] = useState(false);

  const angleRef       = useRef<number[]>(PLANETS.map(() => Math.random() * Math.PI * 2));
  const animFrameRef   = useRef<number>(0);
  // ★ KEY FIX: store the exact pixel position of each planet as drawn last frame
  const drawnPosRef    = useRef<Array<{ x: number; y: number }>>(PLANETS.map(() => ({ x: -9999, y: -9999 })));

  const scaleRef           = useRef(scale);
  const isPlayingRef       = useRef(isPlaying);
  const selectedPlanetRef  = useRef<Planet | null>(selectedPlanet);
  const sunSelectedRef     = useRef(false);
  const hoveredRef         = useRef<Planet | null>(null);
  const hoveredSunRef      = useRef(false);
  const mousePosRef        = useRef<{ x: number; y: number }>({ x: -9999, y: -9999 });

  useEffect(() => { scaleRef.current = scale; }, [scale]);
  useEffect(() => { isPlayingRef.current = isPlaying; }, [isPlaying]);
  useEffect(() => { selectedPlanetRef.current = selectedPlanet; }, [selectedPlanet]);
  useEffect(() => { sunSelectedRef.current = sunSelected; }, [sunSelected]);

  const toCanvasCoords = useCallback((clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: (clientX - rect.left) * (canvas.width / rect.width),
      y: (clientY - rect.top) * (canvas.height / rect.height),
    };
  }, []);

  // Uses LAST DRAWN positions — guaranteed to match what user sees on screen
  const getPlanetAt = useCallback((lx: number, ly: number, s: number): Planet | null => {
    // Reverse order so smaller/outer planets on top
    for (let i = PLANETS.length - 1; i >= 0; i--) {
      const pos = drawnPosRef.current[i];
      if (Math.hypot(pos.x - lx, pos.y - ly) < HIT_RADIUS(PLANETS[i], s)) return PLANETS[i];
    }
    return null;
  }, []);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const s  = scaleRef.current;
    const W  = canvas.width;
    const H  = canvas.height;
    const cx = W / 2;
    const cy = H / 2;

    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#020617';
    ctx.fillRect(0, 0, W, H);

    // Stars
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    for (let i = 0; i < 120; i++) {
      ctx.beginPath();
      ctx.arc(
        (Math.sin(i * 123.45) * 0.5 + 0.5) * W,
        (Math.cos(i * 456.78) * 0.5 + 0.5) * H,
        i % 5 === 0 ? 1 : 0.5, 0, Math.PI * 2
      );
      ctx.fill();
    }

    // Orbits
    ctx.strokeStyle = 'rgba(255,255,255,0.08)';
    ctx.lineWidth = 1;
    PLANETS.forEach(p => {
      ctx.beginPath();
      ctx.ellipse(cx, cy, p.distance * s, p.distance * 0.6 * s, 0, 0, Math.PI * 2);
      ctx.stroke();
    });

    // Hover detection using scaled coordinates
    const { x: lx, y: ly } = toCanvasCoords(mousePosRef.current.x, mousePosRef.current.y);

    // Sun hover detection
    const isHoveringSun = Math.hypot(cx - lx, cy - ly) < SUN_HIT_RADIUS(s);
    if (hoveredSunRef.current !== isHoveringSun) {
      hoveredSunRef.current = isHoveringSun;
      setHoveredSun(isHoveringSun);
    }

    // Sun
    const sunGlow = ctx.createRadialGradient(cx, cy, 0, cx, cy, 28 * s);
    sunGlow.addColorStop(0, '#fef9c3');
    sunGlow.addColorStop(0.4, '#fbbf24');
    sunGlow.addColorStop(1, 'rgba(251,191,36,0)');
    ctx.fillStyle = sunGlow;
    ctx.shadowBlur = isHoveringSun || sunSelectedRef.current ? 30 : 0;
    ctx.shadowColor = '#fbbf24';
    ctx.beginPath();
    ctx.arc(cx, cy, 32 * s, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
    // Selection / hover ring around Sun
    if (sunSelectedRef.current) {
      ctx.beginPath();
      ctx.arc(cx, cy, 34 * s + 4, 0, Math.PI * 2);
      ctx.strokeStyle = '#fbbf24cc';
      ctx.lineWidth = 2;
      ctx.stroke();
    } else if (isHoveringSun) {
      ctx.beginPath();
      ctx.arc(cx, cy, SUN_HIT_RADIUS(s), 0, Math.PI * 2);
      ctx.strokeStyle = '#fbbf2455';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }
    if (isHoveringSun || sunSelectedRef.current) {
      ctx.fillStyle = '#fef9c3';
      ctx.font = `bold ${Math.max(10, 11 * s)}px Inter, sans-serif`;
      ctx.textAlign = 'center';
      ctx.fillText('Sol', cx, cy - 34 * s - 8);
    }
    let newHovered: Planet | null = null;

    PLANETS.forEach((p, i) => {
      const angle = angleRef.current[i];
      const px = cx + Math.cos(angle) * p.distance * s;
      const py = cy + Math.sin(angle) * p.distance * 0.6 * s;

      // ★ Save drawn position for click detection
      drawnPosRef.current[i] = { x: px, y: py };

      if (Math.hypot(px - lx, py - ly) < HIT_RADIUS(p, s)) newHovered = p;

      const selected  = selectedPlanetRef.current;
      const isHovered = hoveredRef.current === p;
      const isSel     = selected === p;

      // Saturno: dibujar anillos primero
      if (p.name === 'Saturno') {
        ctx.save();
        ctx.translate(px, py);
        ctx.scale(1, 0.35);
        ctx.beginPath();
        ctx.ellipse(0, 0, p.size * s * 2.2, p.size * s * 2.2, 0, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(234,179,8,0.45)';
        ctx.lineWidth = 4 * s;
        ctx.stroke();
        ctx.restore();
      }

      const grad = ctx.createRadialGradient(
        px - p.size * 0.3, py - p.size * 0.3, 0,
        px, py, p.size * s
      );
      grad.addColorStop(0, p.color);
      grad.addColorStop(1, '#111827');
      ctx.fillStyle = grad;
      ctx.shadowBlur  = (isHovered || isSel) ? 20 : 0;
      ctx.shadowColor = p.color;
      ctx.beginPath();
      ctx.arc(px, py, p.size * s, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Hit-area ring on hover (visual feedback)
      if (isHovered && !isSel) {
        ctx.beginPath();
        ctx.arc(px, py, HIT_RADIUS(p, s), 0, Math.PI * 2);
        ctx.strokeStyle = p.color + '55';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }
      // Selected ring
      if (isSel) {
        ctx.beginPath();
        ctx.arc(px, py, p.size * s + 4, 0, Math.PI * 2);
        ctx.strokeStyle = p.color + 'cc';
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      // Label on hover/selected
      if (isHovered || isSel) {
        ctx.fillStyle = '#fff';
        ctx.font = `bold ${Math.max(10, 11 * s)}px Inter, sans-serif`;
        ctx.textAlign = 'center';
        ctx.fillText(p.name, px, py - p.size * s - 8);
      }

      if (isPlayingRef.current) angleRef.current[i] += p.speed;
    });

    if (hoveredRef.current !== newHovered) {
      hoveredRef.current = newHovered;
      setHoveredPlanet(newHovered);
    }

    animFrameRef.current = requestAnimationFrame(draw);
  }, [toCanvasCoords]);

  useEffect(() => {
    animFrameRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [draw]);

  const handleMouseMove = (e: React.MouseEvent) => {
    mousePosRef.current = { x: e.clientX, y: e.clientY };
  };
  const handleMouseLeave = () => {
    mousePosRef.current = { x: -9999, y: -9999 };
    hoveredRef.current = null;
    setHoveredPlanet(null);
  };

  const handleClick = (e: React.MouseEvent) => {
    const { x, y } = toCanvasCoords(e.clientX, e.clientY);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const cx = canvas.width / 2, cy = canvas.height / 2;
    // Check Sun first (center of canvas)
    if (Math.hypot(cx - x, cy - y) < SUN_HIT_RADIUS(scaleRef.current)) {
      setSunSelected(prev => !prev);
      setSelectedPlanet(null);
      return;
    }
    // Check planets
    const clicked = getPlanetAt(x, y, scaleRef.current);
    setSunSelected(false);
    setSelectedPlanet(prev =>
      clicked ? (prev?.name === clicked.name ? null : clicked) : null
    );
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
          <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest">
            {topic || 'Los Planetas'}
          </p>
        </div>
        <div className="ml-auto flex gap-2">
          <button
            onClick={() => setIsPlaying(p => !p)}
            className="p-2 rounded-xl bg-white/5 border border-white/10 text-white/60 hover:text-white transition-all"
            title={isPlaying ? 'Pausar' : 'Reanudar'}
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </button>
          <button
            onClick={() => { angleRef.current = PLANETS.map(() => Math.random() * Math.PI * 2); setScale(1); setSelectedPlanet(null); }}
            className="p-2 rounded-xl bg-white/5 border border-white/10 text-white/60 hover:text-white transition-all"
            title="Reiniciar"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row">
        {/* Canvas */}
        <div className="relative flex-1">
          <canvas
            ref={canvasRef}
            width={620}
            height={420}
            className="w-full h-auto cursor-crosshair"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onClick={handleClick}
          />

          {/* Hint bar */}
          <div className="absolute bottom-3 left-3 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 border border-white/10 text-[10px] font-bold text-white/40 pointer-events-none">
            <Info className="h-3 w-3 flex-shrink-0" />
            {hoveredSun
              ? 'Sol — clic para info'
              : hoveredPlanet
              ? `${hoveredPlanet.name} — clic para info`
              : sunSelected
              ? 'Sol seleccionado'
              : selectedPlanet
              ? `${selectedPlanet.name} seleccionado`
              : 'Haz clic en el Sol o un planeta para explorar'}
          </div>

          {/* Zoom */}
          <div className="absolute bottom-3 right-3 flex flex-col gap-1.5">
            <button onClick={() => setScale(s => Math.min(2, s + 0.15))} className="p-2 rounded-xl bg-black/60 border border-white/10 text-white/40 hover:text-white transition-all"><ZoomIn className="h-4 w-4" /></button>
            <button onClick={() => setScale(s => Math.max(0.5, s - 0.15))} className="p-2 rounded-xl bg-black/60 border border-white/10 text-white/40 hover:text-white transition-all"><ZoomOut className="h-4 w-4" /></button>
          </div>
        </div>

        {/* Info panel */}
        {sunSelected ? (
          <div className="md:w-52 p-4 border-t md:border-t-0 md:border-l border-white/10 bg-black/30 flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <Sun className="h-4 w-4 text-amber-400 fill-amber-400 flex-shrink-0" />
              <h4 className="font-black text-amber-300 text-sm">El Sol</h4>
            </div>

            <p className="text-white/50 text-[11px] leading-relaxed">{SUN_INFO.info}</p>

            <div className="space-y-2 border-t border-white/5 pt-3">
              {[
                ['Tipo',             SUN_INFO.type],
                ['Diámetro',         SUN_INFO.diameter],
                ['Masa',             SUN_INFO.mass],
                ['Temp. superficie', SUN_INFO.surfaceTemp],
                ['Dist. galaxia',    SUN_INFO.galacticDist],
                ['Edad aprox.',      SUN_INFO.age],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between items-start gap-2">
                  <span className="text-[10px] text-white/30 font-bold uppercase tracking-widest flex-shrink-0">{label}</span>
                  <span className="text-[11px] text-white font-bold text-right leading-tight">{value}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => setSunSelected(false)}
              className="mt-auto py-2 rounded-xl bg-white/5 border border-white/10 text-white/30 hover:text-white text-[10px] font-black uppercase tracking-widest transition-all"
            >
              Cerrar
            </button>
          </div>
        ) : selectedPlanet ? (
          <div className="md:w-52 p-4 border-t md:border-t-0 md:border-l border-white/10 bg-black/30 flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded-full flex-shrink-0" style={{ backgroundColor: selectedPlanet.color }} />
              <h4 className="font-black text-white text-sm">{selectedPlanet.name}</h4>
            </div>

            <p className="text-white/50 text-[11px] leading-relaxed">{selectedPlanet.info}</p>

            <div className="space-y-2 border-t border-white/5 pt-3">
              {[
                ['Tipo',        selectedPlanet.type],
                ['Diámetro',    selectedPlanet.diameter],
                ['Dist. al Sol',selectedPlanet.distSun],
                ['Lunas',       String(selectedPlanet.moons)],
                ['Temperatura', selectedPlanet.temp],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between items-start gap-2">
                  <span className="text-[10px] text-white/30 font-bold uppercase tracking-widest flex-shrink-0">{label}</span>
                  <span className="text-[11px] text-white font-bold text-right">{value}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => setSelectedPlanet(null)}
              className="mt-auto py-2 rounded-xl bg-white/5 border border-white/10 text-white/30 hover:text-white text-[10px] font-black uppercase tracking-widest transition-all"
            >
              Cerrar
            </button>
          </div>
        ) : (
          <div className="md:w-52 p-4 border-t md:border-t-0 md:border-l border-white/10 bg-black/30 flex flex-col items-center justify-center gap-2 text-center">
            <Sun className="h-8 w-8 text-amber-500/20 fill-amber-500/10" />
            <p className="text-white/20 text-[10px] font-bold uppercase tracking-widest leading-relaxed">
              Haz clic en el Sol o un planeta para ver sus características
            </p>
            <p className="text-white/10 text-[9px]">
              {PLANETS.length} planetas • 1 estrella
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SolarSystemArtifact;
