import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Globe, RotateCcw, ZoomIn, ZoomOut, MapPin, Search, Loader2, AlertTriangle, RefreshCw, X } from 'lucide-react';

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
  const cosλ = Math.cos(λ);
  const dot = sinφ * sinφ0 + cosφ * cosλ * cosφ0;
  if (dot < 0) return null;
  return {
    x: cx + cosφ * Math.sin(λ) * scale,
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

function isPointInCountry(lon: number, lat: number, feature: any): boolean {
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

// Center coordinates for each continent
const CONTINENT_CENTERS: Record<string, { lon: number; lat: number; zoom: number }> = {
  'Africa':        { lon:  20,  lat:   2, zoom: 160 },
  'Asia':          { lon:  90,  lat:  35, zoom: 155 },
  'Europe':        { lon:  15,  lat:  52, zoom: 210 },
  'North America': { lon: -100, lat:  45, zoom: 160 },
  'South America': { lon:  -58, lat: -15, zoom: 175 },
  'Oceania':       { lon: 135,  lat: -25, zoom: 195 },
  'Antarctica':    { lon:   0,  lat: -80, zoom: 175 },
};

// Format large numbers
function formatPop(n: number): string {
  if (n >= 1_000_000_000) return (n / 1_000_000_000).toFixed(1) + ' mil millones';
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + ' millones';
  if (n >= 1_000) return (n / 1_000).toFixed(0) + ' mil';
  return n.toString();
}

let CACHED_GEO_DATA: any = null;
let DATA_PROMISE: Promise<any> | null = null;

const GlobeArtifact: React.FC<GlobeArtifactProps> = ({ highlightCountry, highlightContinent, topic }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number>(0);
  const [geoData, setGeoData] = useState<any>(CACHED_GEO_DATA);
  const [rotLon, setRotLon] = useState(-90);
  const [rotLat, setRotLat] = useState(20);
  const [scale, setScale] = useState(180);
  const [dragging, setDragging] = useState(false);
  const [dragOrigin, setDragOrigin] = useState({ x: 0, y: 0, lon: 0, lat: 0 });
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [loading, setLoading] = useState(!CACHED_GEO_DATA);
  const [error, setError] = useState<boolean>(false);
  const [autoRotate, setAutoRotate] = useState(true);
  const canvasSize = 420;

  // ── Data loading ──────────────────────────────────────────────
  const loadData = useCallback(() => {
    let mounted = true;
    setError(false);
    if (CACHED_GEO_DATA) { setGeoData(CACHED_GEO_DATA); setLoading(false); return; }
    if (!DATA_PROMISE) {
      const ctrl = new AbortController();
      const tid = setTimeout(() => ctrl.abort(), 20000);
      DATA_PROMISE = fetch(
        'https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson',
        { signal: ctrl.signal }
      ).then(r => r.json()).then(data => { clearTimeout(tid); CACHED_GEO_DATA = data; return data; })
       .catch(err => { clearTimeout(tid); DATA_PROMISE = null; throw err; });
    }
    setLoading(true);
    DATA_PROMISE.then(data => { if (mounted) { setGeoData(data); setLoading(false); } })
      .catch(() => { if (mounted) { setLoading(false); setError(true); DATA_PROMISE = null; } });
    return () => { mounted = false; };
  }, []);

  useEffect(() => { return loadData(); }, [loadData]);

  // ── Center on country/continent ───────────────────────────────
  const centerOn = useCallback((countryName: string, targetScale?: number) => {
    if (!geoData || !countryName) return;
    const norm = (s: string) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
    const target = norm(countryName);
    const feature = geoData.features.find((f: any) =>
      norm(f.properties?.name || '') === target ||
      norm(f.properties?.formal_en || '') === target
    );
    if (!feature) return;
    let coords = feature.geometry.type === 'Polygon'
      ? feature.geometry.coordinates[0]
      : feature.geometry.coordinates[0][0];
    if (Array.isArray(coords[0]) && Array.isArray(coords[0][0])) coords = coords[0];
    let avgLon = 0, avgLat = 0;
    const n = Math.min(coords.length, 50);
    for (let i = 0; i < n; i++) { avgLon += coords[i][0]; avgLat += coords[i][1]; }
    setRotLon(avgLon / n);
    setRotLat(avgLat / n);
    if (targetScale) setScale(targetScale);
    setAutoRotate(false);
  }, [geoData]);

  const centerOnContinent = useCallback((continent: string) => {
    const c = CONTINENT_CENTERS[continent];
    if (!c) return;
    setRotLon(c.lon);
    setRotLat(c.lat);
    setScale(c.zoom);
    setAutoRotate(false);
    setSelectedCountry(null);
    setSearchQuery('');
    setSearchResults([]);
  }, []);

  // ── Auto-center on prop ───────────────────────────────────────
  useEffect(() => {
    if (highlightCountry && geoData) {
      centerOn(highlightCountry, 220);
      setSelectedCountry(highlightCountry);
    }
  }, [highlightCountry, geoData, centerOn]);

  // ── Auto-rotate ───────────────────────────────────────────────
  useEffect(() => {
    if (!autoRotate) { cancelAnimationFrame(animFrameRef.current); return; }
    const tick = () => { setRotLon(p => p - 0.15); animFrameRef.current = requestAnimationFrame(tick); };
    animFrameRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [autoRotate]);

  // ── Canvas render ─────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !geoData) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const W = canvas.width, H = canvas.height;
    const cx = W / 2, cy = H / 2;
    ctx.clearRect(0, 0, W, H);

    // Ocean
    const grad = ctx.createRadialGradient(cx - scale * 0.2, cy - scale * 0.2, 0, cx, cy, scale);
    grad.addColorStop(0, '#1e3a5f');
    grad.addColorStop(1, '#0f172a');
    ctx.beginPath(); ctx.arc(cx, cy, scale, 0, Math.PI * 2);
    ctx.fillStyle = grad; ctx.fill();
    ctx.strokeStyle = 'rgba(99,102,241,0.4)'; ctx.lineWidth = 2; ctx.stroke();

    if (!geoData?.features) return;

    // Graticule
    ctx.strokeStyle = 'rgba(255,255,255,0.05)'; ctx.lineWidth = 0.5;
    for (let lon = -180; lon <= 180; lon += 30) {
      ctx.beginPath(); let f = true;
      for (let lat = -90; lat <= 90; lat += 2) {
        const pt = orthographicProject(lon, lat, rotLon, rotLat, scale, cx, cy);
        if (!pt) { f = true; continue; }
        f ? ctx.moveTo(pt.x, pt.y) : ctx.lineTo(pt.x, pt.y); f = false;
      }
      ctx.stroke();
    }
    for (let lat = -60; lat <= 60; lat += 30) {
      ctx.beginPath(); let f = true;
      for (let lon = -180; lon <= 181; lon += 2) {
        const pt = orthographicProject(lon, lat, rotLon, rotLat, scale, cx, cy);
        if (!pt) { f = true; continue; }
        f ? ctx.moveTo(pt.x, pt.y) : ctx.lineTo(pt.x, pt.y); f = false;
      }
      ctx.stroke();
    }
    // Equator
    ctx.strokeStyle = 'rgba(255,255,255,0.12)'; ctx.lineWidth = 1;
    ctx.beginPath(); let eq = true;
    for (let lon = -180; lon <= 181; lon += 1) {
      const pt = orthographicProject(lon, 0, rotLon, rotLat, scale, cx, cy);
      if (!pt) { eq = true; continue; }
      eq ? ctx.moveTo(pt.x, pt.y) : ctx.lineTo(pt.x, pt.y); eq = false;
    }
    ctx.stroke();

    // Countries
    for (const feature of geoData.features) {
      const name: string = feature.properties?.name || '';
      const continent: string = feature.properties?.continent || 'default';
      const isSelected = selectedCountry?.toLowerCase() === name.toLowerCase();
      const isHovered = hoveredCountry?.toLowerCase() === name.toLowerCase();
      const isContHighlight = highlightContinent && continent === highlightContinent;
      const baseColor = CONTINENT_COLORS[continent] || CONTINENT_COLORS['default'];
      const polys: number[][][][] =
        feature.geometry.type === 'Polygon' ? [feature.geometry.coordinates] : feature.geometry.coordinates;

      for (const poly of polys) {
        const visible = drawGeoPolygon(ctx, poly, rotLon, rotLat, scale, cx, cy);
        if (!visible) continue;
        if (isSelected) {
          ctx.fillStyle = '#f59e0b'; ctx.strokeStyle = '#fbbf24'; ctx.lineWidth = 1.5;
        } else if (isHovered) {
          ctx.fillStyle = baseColor + 'dd'; ctx.strokeStyle = '#ffffff88'; ctx.lineWidth = 1;
        } else if (isContHighlight) {
          ctx.fillStyle = baseColor + 'aa'; ctx.strokeStyle = '#ffffff44'; ctx.lineWidth = 0.5;
        } else {
          ctx.fillStyle = baseColor + '55'; ctx.strokeStyle = 'rgba(255,255,255,0.15)'; ctx.lineWidth = 0.4;
        }
        ctx.fill(); ctx.stroke();
      }
    }

    // Selected label + pin
    if (selectedCountry) {
      const feat = geoData.features.find((f: any) => f.properties?.name?.toLowerCase() === selectedCountry.toLowerCase());
      if (feat) {
        const geom = feat.geometry;
        const fc: number[][] = geom.type === 'Polygon' ? geom.coordinates[0] : geom.coordinates[0][0];
        const mid = Math.floor(fc.length / 2);
        const pt = orthographicProject(fc[mid][0], fc[mid][1], rotLon, rotLat, scale, cx, cy);
        if (pt) {
          ctx.fillStyle = '#fbbf24'; ctx.font = 'bold 13px Inter, sans-serif';
          ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
          ctx.shadowColor = '#000'; ctx.shadowBlur = 6;
          ctx.fillText(selectedCountry, pt.x, pt.y - 14); ctx.shadowBlur = 0;
          ctx.beginPath(); ctx.arc(pt.x, pt.y, 5, 0, Math.PI * 2);
          ctx.fillStyle = '#f59e0b'; ctx.fill();
          ctx.strokeStyle = '#fff'; ctx.lineWidth = 1.5; ctx.stroke();
        }
      }
    }
  }, [geoData, rotLon, rotLat, scale, hoveredCountry, selectedCountry, highlightContinent]);

  // ── Coordinate helper (CSS px → canvas logical px) ────────────
  const toCanvas = useCallback((clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: (clientX - rect.left) * (canvas.width / rect.width),
      y: (clientY - rect.top) * (canvas.height / rect.height),
    };
  }, []);

  // ── Unproject canvas position → lon/lat ───────────────────────
  const unproject = useCallback((mx: number, my: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const cx = canvas.width / 2, cy = canvas.height / 2;
    const dx = mx - cx, dy = my - cy;
    if (dx * dx + dy * dy > scale * scale) return null;
    const x = dx / scale, y = -dy / scale;
    const z2 = 1 - x * x - y * y;
    if (z2 < 0) return null;
    const z = Math.sqrt(z2);
    const φ0 = toRad(rotLat);
    const lat = Math.asin(y * Math.cos(φ0) + z * Math.sin(φ0)) * 180 / Math.PI;
    const lon = rotLon + Math.atan2(x, z * Math.cos(φ0) - y * Math.sin(φ0)) * 180 / Math.PI;
    return { lon, lat };
  }, [rotLon, rotLat, scale]);

  // ── Mouse handlers ────────────────────────────────────────────
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
      return;
    }
    if (!geoData) return;
    const { x, y } = toCanvas(e.clientX, e.clientY);
    const pos = unproject(x, y);
    if (!pos) { setHoveredCountry(null); return; }
    const found = geoData.features.find((f: any) => isPointInCountry(pos.lon, pos.lat, f));
    setHoveredCountry(found?.properties?.name || null);
  }, [dragging, dragOrigin, geoData, toCanvas, unproject]);

  const handleMouseUp = useCallback(() => setDragging(false), []);

  const handleClick = useCallback((e: React.MouseEvent) => {
    if (!geoData) return;
    const { x, y } = toCanvas(e.clientX, e.clientY);
    const pos = unproject(x, y);
    if (!pos) return;
    const found = geoData.features.find((f: any) => isPointInCountry(pos.lon, pos.lat, f));
    if (found) {
      setSelectedCountry(found.properties.name);
    }
  }, [geoData, toCanvas, unproject]);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    setScale(p => Math.max(100, Math.min(400, p - e.deltaY * 0.3)));
  }, []);

  // ── Touch ─────────────────────────────────────────────────────
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

  // ── Search with autocomplete ──────────────────────────────────
  const handleSearchInput = (q: string) => {
    setSearchQuery(q);
    if (!q || !geoData) { setSearchResults([]); return; }
    const norm = q.toLowerCase();
    const matches = geoData.features
      .filter((f: any) => f.properties?.name?.toLowerCase().includes(norm))
      .map((f: any) => f.properties.name as string)
      .slice(0, 6);
    setSearchResults(matches);
  };

  const selectSearchResult = (name: string) => {
    setSearchQuery(name);
    setSearchResults([]);
    setSelectedCountry(name);
    centerOn(name, 230);
  };

  // ── Selected country info ─────────────────────────────────────
  const selectedInfo = geoData?.features?.find(
    (f: any) => f.properties?.name?.toLowerCase() === selectedCountry?.toLowerCase()
  );
  const props = selectedInfo?.properties || {};

  return (
    <div className="bg-slate-950 rounded-3xl border border-white/10 overflow-hidden shadow-2xl my-4">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-white/10 bg-slate-900/50">
        <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20">
          <Globe className="h-5 w-5 text-blue-400" />
        </div>
        <div>
          <h3 className="font-black text-white text-sm uppercase tracking-tighter">Globo Terráqueo Interactivo</h3>
          <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest">
            {topic || 'Geografía Mundial — Arrastra, gira y explora'}
          </p>
        </div>
        <button
          onClick={() => setAutoRotate(v => !v)}
          className={`ml-auto px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${
            autoRotate ? 'bg-blue-500/20 border-blue-500/30 text-blue-400' : 'bg-white/5 border-white/10 text-white/40'
          }`}
        >
          {autoRotate ? '⟳ Girando' : '⏸ Pausado'}
        </button>
      </div>

      <div className="flex flex-col md:flex-row">
        {/* Canvas */}
        <div className="relative flex-1 min-h-[350px] bg-slate-900/50 flex items-center justify-center">
          {loading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/80 z-20 backdrop-blur-sm">
              <Loader2 className="h-10 w-10 text-blue-400 animate-spin mb-3" />
              <p className="text-xs font-black text-white uppercase tracking-[0.2em] animate-pulse">Generando Globo 3D...</p>
            </div>
          )}
          {error && !loading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/80 z-20 p-6 text-center">
              <AlertTriangle className="h-12 w-12 text-amber-500 mb-4" />
              <p className="text-sm font-bold text-white mb-2">No se pudo cargar el mapa</p>
              <p className="text-xs text-slate-400 mb-6 max-w-[200px]">Verifica tu conexión e intenta de nuevo.</p>
              <button
                onClick={() => loadData()}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-500/20 border border-blue-500/30 text-blue-400 text-xs font-black uppercase transition-all hover:bg-blue-500/30"
              >
                <RefreshCw className="h-4 w-4" /> Reintentar
              </button>
            </div>
          )}

          {!loading && !error && highlightCountry && !autoRotate && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 px-4 py-2 bg-slate-950/80 border border-white/10 rounded-full backdrop-blur-md">
              <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                Localizando: {highlightCountry}
              </p>
            </div>
          )}

          <canvas
            ref={canvasRef}
            width={canvasSize}
            height={canvasSize}
            className="rounded-2xl"
            style={{ cursor: dragging ? 'grabbing' : hoveredCountry ? 'pointer' : 'grab' }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={() => { handleMouseUp(); setHoveredCountry(null); }}
            onClick={handleClick}
            onWheel={handleWheel}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={() => { touchStart.current = null; }}
          />

          {hoveredCountry && !dragging && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-xl bg-slate-800/90 border border-white/10 backdrop-blur-sm pointer-events-none">
              <p className="text-white text-xs font-bold">{hoveredCountry}</p>
            </div>
          )}
        </div>

        {/* Panel lateral */}
        <div className="flex-1 p-4 flex flex-col gap-3 min-w-0 max-w-xs">

          {/* Búsqueda con autocomplete */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/30 pointer-events-none" />
            <input
              type="text"
              placeholder="Buscar país..."
              value={searchQuery}
              onChange={e => handleSearchInput(e.target.value)}
              className="w-full pl-9 pr-8 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm font-medium placeholder:text-white/20 focus:outline-none focus:border-blue-500/40 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => { setSearchQuery(''); setSearchResults([]); }}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
            {searchResults.length > 0 && (
              <div className="absolute top-full mt-1 left-0 right-0 z-30 bg-slate-800 border border-white/10 rounded-xl overflow-hidden shadow-xl">
                {searchResults.map(name => (
                  <button
                    key={name}
                    onClick={() => selectSearchResult(name)}
                    className="w-full text-left px-3 py-2 text-xs text-white/70 hover:bg-white/10 hover:text-white transition-all flex items-center gap-2"
                  >
                    <MapPin className="h-3 w-3 text-amber-400 flex-shrink-0" />
                    {name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Zoom + Reset */}
          <div className="flex gap-2">
            <button onClick={() => setScale(p => Math.min(400, p + 30))}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-white/5 border border-white/10 text-white/60 hover:bg-white/10 hover:text-white transition-all text-xs font-black">
              <ZoomIn className="h-3.5 w-3.5" /> +
            </button>
            <button onClick={() => setScale(p => Math.max(100, p - 30))}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-white/5 border border-white/10 text-white/60 hover:bg-white/10 hover:text-white transition-all text-xs font-black">
              <ZoomOut className="h-3.5 w-3.5" /> −
            </button>
            <button
              onClick={() => { setRotLon(-90); setRotLat(20); setScale(180); setSelectedCountry(null); setAutoRotate(true); setSearchQuery(''); setSearchResults([]); }}
              className="p-2 rounded-xl bg-white/5 border border-white/10 text-white/60 hover:bg-white/10 hover:text-white transition-all"
              title="Resetear vista"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          </div>

          {/* Información del país seleccionado */}
          {selectedCountry && selectedInfo ? (
            <div className="flex-1 p-4 rounded-2xl bg-white/5 border border-white/10 overflow-y-auto">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-amber-400 flex-shrink-0" />
                  <h4 className="font-black text-white text-sm leading-tight">{selectedCountry}</h4>
                </div>
                <button onClick={() => setSelectedCountry(null)} className="text-white/20 hover:text-white/60 transition-all ml-2 flex-shrink-0">
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>

              <div className="space-y-2.5">
                {props.continent && (
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Continente</span>
                    <span className="text-xs font-bold flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full inline-block" style={{ backgroundColor: CONTINENT_COLORS[props.continent] }} />
                      <span style={{ color: CONTINENT_COLORS[props.continent] }}>{props.continent}</span>
                    </span>
                  </div>
                )}
                {props.subregion && (
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Subregión</span>
                    <span className="text-xs font-bold text-white">{props.subregion}</span>
                  </div>
                )}
                {props.pop_est && (
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Población</span>
                    <span className="text-xs font-bold text-white">{formatPop(Number(props.pop_est))}</span>
                  </div>
                )}
                {props.economy && (
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] text-white/40 font-bold uppercase tracking-widest flex-shrink-0">Economía</span>
                    <span className="text-xs font-bold text-white text-right">{props.economy}</span>
                  </div>
                )}
                {props.income_grp && (
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] text-white/40 font-bold uppercase tracking-widest flex-shrink-0">Nivel ingreso</span>
                    <span className="text-xs font-bold text-white text-right">{props.income_grp}</span>
                  </div>
                )}
                {props.region_wb && (
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] text-white/40 font-bold uppercase tracking-widest flex-shrink-0">Región</span>
                    <span className="text-xs font-bold text-white text-right">{props.region_wb}</span>
                  </div>
                )}
              </div>

              {/* Ir al continente */}
              {props.continent && CONTINENT_CENTERS[props.continent] && (
                <button
                  onClick={() => centerOnContinent(props.continent)}
                  className="mt-4 w-full py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border"
                  style={{
                    backgroundColor: CONTINENT_COLORS[props.continent] + '22',
                    borderColor: CONTINENT_COLORS[props.continent] + '44',
                    color: CONTINENT_COLORS[props.continent],
                  }}
                >
                  Ver todo {props.continent}
                </button>
              )}
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col items-center justify-center gap-2 text-center py-6">
              <Globe className="h-7 w-7 text-white/10" />
              <p className="text-white/30 text-[10px] font-bold uppercase tracking-widest">
                Clic en un país para ver características
              </p>
            </div>
          )}

          {/* Leyenda de continentes — clickeable */}
          <div className="space-y-1">
            <p className="text-[9px] font-black text-white/20 uppercase tracking-widest mb-2">Navegar por continente</p>
            <div className="grid grid-cols-2 gap-1.5">
              {Object.entries(CONTINENT_CENTERS).map(([cont, _]) => (
                <button
                  key={cont}
                  onClick={() => centerOnContinent(cont)}
                  className="flex items-center gap-1.5 text-[10px] font-bold text-white/40 hover:text-white transition-all px-2 py-1.5 rounded-lg hover:bg-white/5 text-left"
                >
                  <div className="h-2.5 w-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: CONTINENT_COLORS[cont] }} />
                  {cont}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GlobeArtifact;
