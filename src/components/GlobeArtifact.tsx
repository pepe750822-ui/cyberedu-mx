import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Globe, RotateCcw, ZoomIn, ZoomOut, MapPin, Search } from 'lucide-react';

interface GlobeArtifactProps {
  highlightCountry?: string;
  highlightContinent?: string;
  topic?: string;
}

const toRad = (d: number) => (d * Math.PI) / 180;

function orthographicProject(
  lon: number, lat: number,
  rotLon: number, rotLat: number,
  scale: number, cx: number, cy: number
): { x: number; y: number } | null {
  const λ = toRad(lon - rotLon);
  const φ = toRad(lat);
  const φ0 = toRad(rotLat);
  const cosφ = Math.cos(φ), sinφ = Math.sin(φ);
  const cosφ0 = Math.cos(φ0), sinφ0 = Math.sin(φ0);
  const cosλ = Math.cos(λ), sinλ = Math.sin(λ);
  const dot = sinφ * sinφ0 + cosφ * cosλ * cosφ0;
  if (dot < 0) return null;
  return {
    x: cx + cosφ * sinλ * scale,
    y: cy - (sinφ * cosφ0 - cosφ * cosλ * sinφ0) * scale,
  };
}

function drawGeoPolygon(
  ctx: CanvasRenderingContext2D,
  rings: number[][][],
  rotLon: number, rotLat: number,
  scale: number, cx: number, cy: number
): boolean {
  let anyVisible = false;
  ctx.beginPath();
  for (const ring of rings) {
    let penDown = false;
    for (const [lon, lat] of ring) {
      const pt = orthographicProject(lon, lat, rotLon, rotLat, scale, cx, cy);
      if (!pt) { penDown = false; continue; }
      anyVisible = true;
      if (!penDown) { ctx.moveTo(pt.x, pt.y); penDown = true; }
      else ctx.lineTo(pt.x, pt.y);
    }
    if (penDown) ctx.closePath();
  }
  return anyVisible;
}

function isPointInCountry(
  lon: number, lat: number,
  feature: any
): boolean {
  const geom = feature.geometry;
  const testRings = (rings: number[][][]) => {
    const ring = rings[0];
    if (!ring) return false;
    let inside = false;
    for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
      const xi = ring[i][0], yi = ring[i][1];
      const xj = ring[j][0], yj = ring[j][1];
      if (yi > lat !== yj > lat && lon < ((xj - xi) * (lat - yi)) / (yj - yi) + xi)
        inside = !inside;
    }
    return inside;
  };
  if (geom.type === 'Polygon') return testRings(geom.coordinates);
  if (geom.type === 'MultiPolygon') return geom.coordinates.some((p: number[][][]) => testRings(p));
  return false;
}

// Continent color palette
const CONTINENT_COLORS: Record<string, string> = {
  'Africa': '#f59e0b',
  'Asia': '#10b981',
  'Europe': '#3b82f6',
  'North America': '#8b5cf6',
  'South America': '#ec4899',
  'Oceania': '#06b6d4',
  'Antarctica': '#94a3b8',
  'default': '#6366f1',
};

const GlobeArtifact: React.FC<GlobeArtifactProps> = ({
  highlightCountry,
  highlightContinent,
  topic,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [geoData, setGeoData] = useState<any>(null);
  const [rotLon, setRotLon] = useState(-90);
  const [rotLat, setRotLat] = useState(20);
  const [scale, setScale] = useState(180);
  const [dragging, setDragging] = useState(false);
  const [dragOrigin, setDragOrigin] = useState({ x: 0, y: 0, lon: 0, lat: 0 });
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [autoRotate, setAutoRotate] = useState(true);
  const autoRotateRef = useRef(autoRotate);
  const rotLonRef = useRef(rotLon);
  const animFrameRef = useRef<number>(0);

  autoRotateRef.current = autoRotate;
  rotLonRef.current = rotLon;

  // Load GeoJSON
  useEffect(() => {
    fetch('https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson')
      .then(r => r.json())
      .then(data => { setGeoData(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  // If highlightCountry given, center on it
  useEffect(() => {
    if (highlightCountry) {
      setAutoRotate(false);
      setSelectedCountry(highlightCountry);
    }
  }, [highlightCountry]);

  // Auto-rotate animation
  useEffect(() => {
    if (!autoRotate) { cancelAnimationFrame(animFrameRef.current); return; }
    const tick = () => {
      setRotLon(prev => prev - 0.15);
      animFrameRef.current = requestAnimationFrame(tick);
    };
    animFrameRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [autoRotate]);

  // Render
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !geoData) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;
    const cx = W / 2;
    const cy = H / 2;

    ctx.clearRect(0, 0, W, H);

    // Ocean gradient
    const grad = ctx.createRadialGradient(cx - scale * 0.2, cy - scale * 0.2, 0, cx, cy, scale);
    grad.addColorStop(0, '#1e3a5f');
    grad.addColorStop(1, '#0f172a');
    ctx.beginPath();
    ctx.arc(cx, cy, scale, 0, Math.PI * 2);
    ctx.fillStyle = grad;
    ctx.fill();

    // Globe rim glow
    ctx.beginPath();
    ctx.arc(cx, cy, scale, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(99,102,241,0.4)';
    ctx.lineWidth = 2;
    ctx.stroke();

    if (!geoData?.features) return;

    // Draw graticule (latitude/longitude lines)
    ctx.strokeStyle = 'rgba(255,255,255,0.05)';
    ctx.lineWidth = 0.5;
    for (let lon = -180; lon <= 180; lon += 30) {
      ctx.beginPath();
      let first = true;
      for (let lat = -90; lat <= 90; lat += 2) {
        const pt = orthographicProject(lon, lat, rotLon, rotLat, scale, cx, cy);
        if (!pt) { first = true; continue; }
        first ? ctx.moveTo(pt.x, pt.y) : ctx.lineTo(pt.x, pt.y);
        first = false;
      }
      ctx.stroke();
    }
    for (let lat = -60; lat <= 60; lat += 30) {
      ctx.beginPath();
      let first = true;
      for (let lon = -180; lon <= 181; lon += 2) {
        const pt = orthographicProject(lon, lat, rotLon, rotLat, scale, cx, cy);
        if (!pt) { first = true; continue; }
        first ? ctx.moveTo(pt.x, pt.y) : ctx.lineTo(pt.x, pt.y);
        first = false;
      }
      ctx.stroke();
    }

    // Draw equator
    ctx.strokeStyle = 'rgba(255,255,255,0.12)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    let eqFirst = true;
    for (let lon = -180; lon <= 181; lon += 1) {
      const pt = orthographicProject(lon, 0, rotLon, rotLat, scale, cx, cy);
      if (!pt) { eqFirst = true; continue; }
      eqFirst ? ctx.moveTo(pt.x, pt.y) : ctx.lineTo(pt.x, pt.y);
      eqFirst = false;
    }
    ctx.stroke();

    // Draw countries
    for (const feature of geoData.features) {
      const name: string = feature.properties?.name || '';
      const continent: string = feature.properties?.continent || 'default';
      const isSelected = selectedCountry?.toLowerCase() === name.toLowerCase();
      const isHovered = hoveredCountry?.toLowerCase() === name.toLowerCase();
      const isHighlighted = highlightContinent && continent === highlightContinent;
      const baseColor = CONTINENT_COLORS[continent] || CONTINENT_COLORS['default'];

      const geom = feature.geometry;
      const polys: number[][][][] =
        geom.type === 'Polygon' ? [geom.coordinates] : geom.coordinates;

      for (const poly of polys) {
        const visible = drawGeoPolygon(ctx, poly, rotLon, rotLat, scale, cx, cy);
        if (!visible) continue;

        if (isSelected) {
          ctx.fillStyle = '#f59e0b';
          ctx.strokeStyle = '#fbbf24';
          ctx.lineWidth = 1.5;
        } else if (isHovered) {
          ctx.fillStyle = baseColor + 'dd';
          ctx.strokeStyle = '#ffffff88';
          ctx.lineWidth = 1;
        } else if (isHighlighted) {
          ctx.fillStyle = baseColor + 'aa';
          ctx.strokeStyle = '#ffffff44';
          ctx.lineWidth = 0.5;
        } else {
          ctx.fillStyle = baseColor + '55';
          ctx.strokeStyle = 'rgba(255,255,255,0.15)';
          ctx.lineWidth = 0.4;
        }
        ctx.fill();
        ctx.stroke();
      }
    }

    // Country label if selected
    if (selectedCountry) {
      const feature = geoData.features.find(
        (f: any) => f.properties?.name?.toLowerCase() === selectedCountry.toLowerCase()
      );
      if (feature) {
        // Find centroid of first polygon point visible
        const geom = feature.geometry;
        const firstCoords: number[][] =
          geom.type === 'Polygon' ? geom.coordinates[0] : geom.coordinates[0][0];
        const midIdx = Math.floor(firstCoords.length / 2);
        const [lon, lat] = firstCoords[midIdx];
        const pt = orthographicProject(lon, lat, rotLon, rotLat, scale, cx, cy);
        if (pt) {
          ctx.fillStyle = '#fbbf24';
          ctx.font = 'bold 13px Inter, sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.shadowColor = '#000';
          ctx.shadowBlur = 6;
          ctx.fillText(selectedCountry, pt.x, pt.y - 12);
          ctx.shadowBlur = 0;
          // Pin dot
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, 4, 0, Math.PI * 2);
          ctx.fillStyle = '#f59e0b';
          ctx.fill();
        }
      }
    }
  }, [geoData, rotLon, rotLat, scale, hoveredCountry, selectedCountry, highlightContinent]);

  // Mouse events
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setAutoRotate(false);
    setDragging(true);
    setDragOrigin({ x: e.clientX, y: e.clientY, lon: rotLon, lat: rotLat });
  }, [rotLon, rotLat]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (dragging) {
      const dx = e.clientX - dragOrigin.x;
      const dy = e.clientY - dragOrigin.y;
      setRotLon(dragOrigin.lon - dx * 0.4);
      setRotLat(Math.max(-90, Math.min(90, dragOrigin.lat + dy * 0.4)));
    } else {
      // Hover detection
      const canvas = canvasRef.current;
      if (!canvas || !geoData) return;
      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      const cx = canvas.width / 2, cy = canvas.height / 2;
      const dx2 = mx - cx, dy2 = my - cy;
      if (dx2 * dx2 + dy2 * dy2 > scale * scale) { setHoveredCountry(null); return; }

      // Unproject mouse position to lon/lat
      const x = dx2 / scale, y = -dy2 / scale;
      const z2 = 1 - x * x - y * y;
      if (z2 < 0) { setHoveredCountry(null); return; }
      const z = Math.sqrt(z2);
      const φ0 = toRad(rotLat);
      const lat = Math.asin(y * Math.cos(φ0) + z * Math.sin(φ0)) * 180 / Math.PI;
      const lon = rotLon + Math.atan2(x, z * Math.cos(φ0) - y * Math.sin(φ0)) * 180 / Math.PI;

      const found = geoData.features.find((f: any) => isPointInCountry(lon, lat, f));
      setHoveredCountry(found?.properties?.name || null);
    }
  }, [dragging, dragOrigin, geoData, rotLon, rotLat, scale]);

  const handleMouseUp = useCallback(() => setDragging(false), []);

  const handleClick = useCallback((e: React.MouseEvent) => {
    if (hoveredCountry) setSelectedCountry(hoveredCountry);
  }, [hoveredCountry]);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    setScale(prev => Math.max(100, Math.min(400, prev - e.deltaY * 0.3)));
  }, []);

  // Touch events
  const touchStart = useRef<{ x: number; y: number; lon: number; lat: number } | null>(null);
  const handleTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    setAutoRotate(false);
    touchStart.current = { x: t.clientX, y: t.clientY, lon: rotLon, lat: rotLat };
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStart.current) return;
    const t = e.touches[0];
    const dx = t.clientX - touchStart.current.x;
    const dy = t.clientY - touchStart.current.y;
    setRotLon(touchStart.current.lon - dx * 0.4);
    setRotLat(Math.max(-90, Math.min(90, touchStart.current.lat + dy * 0.4)));
  };

  // Country search
  const handleSearch = (q: string) => {
    setSearchQuery(q);
    if (!q || !geoData) return;
    const found = geoData.features.find(
      (f: any) => f.properties?.name?.toLowerCase().includes(q.toLowerCase())
    );
    if (found) {
      setSelectedCountry(found.properties.name);
      setAutoRotate(false);
    }
  };

  const selectedInfo = geoData?.features?.find(
    (f: any) => f.properties?.name?.toLowerCase() === selectedCountry?.toLowerCase()
  );

  const canvasSize = 420;

  return (
    <div className="bg-slate-950 rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-white/10 bg-slate-900/50">
        <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20">
          <Globe className="h-5 w-5 text-blue-400" />
        </div>
        <div>
          <h3 className="font-black text-white text-sm uppercase tracking-tighter">
            Globo Terráqueo Interactivo
          </h3>
          <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest">
            {topic || 'Geografía Mundial — Arrastra, gira y explora'}
          </p>
        </div>
        <button
          onClick={() => setAutoRotate(v => !v)}
          className={`ml-auto px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${
            autoRotate
              ? 'bg-blue-500/20 border-blue-500/30 text-blue-400'
              : 'bg-white/5 border-white/10 text-white/40'
          }`}
        >
          {autoRotate ? '⟳ Girando' : '⏸ Pausado'}
        </button>
      </div>

      <div className="flex flex-col md:flex-row">
        {/* Globe Canvas */}
        <div className="relative flex-shrink-0 flex items-center justify-center p-4">
          {loading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 z-10">
              <div className="h-10 w-10 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
              <p className="text-white/40 text-xs font-bold uppercase tracking-widest animate-pulse">Cargando mapa...</p>
            </div>
          )}
          <canvas
            ref={canvasRef}
            width={canvasSize}
            height={canvasSize}
            className="rounded-2xl cursor-grab active:cursor-grabbing"
            style={{ cursor: dragging ? 'grabbing' : hoveredCountry ? 'pointer' : 'grab' }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onClick={handleClick}
            onWheel={handleWheel}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={() => { touchStart.current = null; }}
          />

          {/* Hover tooltip */}
          {hoveredCountry && !dragging && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 rounded-xl bg-slate-800/90 border border-white/10 backdrop-blur-sm pointer-events-none">
              <p className="text-white text-xs font-bold">{hoveredCountry}</p>
            </div>
          )}
        </div>

        {/* Controls & Info Panel */}
        <div className="flex-1 p-4 flex flex-col gap-4 min-w-0">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/30" />
            <input
              type="text"
              placeholder="Buscar país..."
              value={searchQuery}
              onChange={e => handleSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm font-medium placeholder:text-white/20 focus:outline-none focus:border-blue-500/40 transition-all"
            />
          </div>

          {/* Zoom controls */}
          <div className="flex gap-2">
            <button onClick={() => setScale(p => Math.min(400, p + 30))}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white/60 hover:bg-white/10 hover:text-white transition-all text-xs font-black">
              <ZoomIn className="h-4 w-4" /> Zoom +
            </button>
            <button onClick={() => setScale(p => Math.max(100, p - 30))}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white/60 hover:bg-white/10 hover:text-white transition-all text-xs font-black">
              <ZoomOut className="h-4 w-4" /> Zoom -
            </button>
            <button onClick={() => { setRotLon(-90); setRotLat(20); setScale(180); setSelectedCountry(null); setAutoRotate(true); }}
              className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-white/60 hover:bg-white/10 hover:text-white transition-all">
              <RotateCcw className="h-4 w-4" />
            </button>
          </div>

          {/* Country info */}
          {selectedCountry && selectedInfo ? (
            <div className="flex-1 p-4 rounded-2xl bg-white/5 border border-white/10">
              <div className="flex items-center gap-2 mb-3">
                <MapPin className="h-4 w-4 text-amber-400" />
                <h4 className="font-black text-white text-sm">{selectedCountry}</h4>
              </div>
              <div className="space-y-2">
                {selectedInfo.properties?.continent && (
                  <div className="flex justify-between text-xs">
                    <span className="text-white/40 font-bold uppercase tracking-widest">Continente</span>
                    <span className="text-white font-bold"
                      style={{ color: CONTINENT_COLORS[selectedInfo.properties.continent] }}>
                      {selectedInfo.properties.continent}
                    </span>
                  </div>
                )}
                {selectedInfo.properties?.economy && (
                  <div className="flex justify-between text-xs">
                    <span className="text-white/40 font-bold uppercase tracking-widest">Economía</span>
                    <span className="text-white font-bold">{selectedInfo.properties.economy}</span>
                  </div>
                )}
                {selectedInfo.properties?.pop_est && (
                  <div className="flex justify-between text-xs">
                    <span className="text-white/40 font-bold uppercase tracking-widest">Población</span>
                    <span className="text-white font-bold">{Number(selectedInfo.properties.pop_est).toLocaleString('es-MX')}</span>
                  </div>
                )}
                {selectedInfo.properties?.subregion && (
                  <div className="flex justify-between text-xs">
                    <span className="text-white/40 font-bold uppercase tracking-widest">Subregión</span>
                    <span className="text-white font-bold">{selectedInfo.properties.subregion}</span>
                  </div>
                )}
              </div>
              <button onClick={() => setSelectedCountry(null)}
                className="mt-3 w-full py-1.5 rounded-xl bg-white/5 border border-white/10 text-white/40 hover:text-white text-[10px] font-black uppercase tracking-widest transition-all">
                Limpiar selección
              </button>
            </div>
          ) : (
            <div className="flex-1 p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col items-center justify-center gap-2 text-center">
              <Globe className="h-8 w-8 text-white/10" />
              <p className="text-white/30 text-xs font-bold uppercase tracking-widest">
                Haz clic en un país para ver información
              </p>
            </div>
          )}

          {/* Legend */}
          <div className="grid grid-cols-2 gap-1.5">
            {Object.entries(CONTINENT_COLORS).filter(([k]) => k !== 'default').map(([cont, color]) => (
              <div key={cont} className="flex items-center gap-1.5 text-[10px] font-bold text-white/40">
                <div className="h-2.5 w-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
                {cont}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GlobeArtifact;
