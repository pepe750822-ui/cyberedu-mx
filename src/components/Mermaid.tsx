
import React, { useEffect, useRef, useState, useCallback } from 'react';
import mermaid from 'mermaid';
import { Maximize2, Minimize2, Download, ZoomIn, ZoomOut, RefreshCw, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

// Get a clean ID for mermaid rendering
const getMermaidId = () => `mermaid-${Math.random().toString(36).substr(2, 9)}`;

mermaid.initialize({
  startOnLoad: false,
  theme: 'dark',
  securityLevel: 'loose',
  fontFamily: 'Inter, sans-serif',
  themeVariables: {
    primaryColor: '#6366f1',
    primaryTextColor: '#fff',
    primaryBorderColor: '#6366f1',
    lineColor: '#4f46e5',
    secondaryColor: '#1e1b4b',
    tertiaryColor: '#0f172a'
  },
  flowchart: {
    useMaxWidth: false,
    htmlLabels: true,
    curve: 'basis'
  }
});

interface MermaidProps {
  chart: string;
}

const Mermaid: React.FC<MermaidProps> = ({ chart }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [error, setError] = useState(false);
  const [isRendering, setIsRendering] = useState(false);
  const [showRaw, setShowRaw] = useState(false);

  // Clean and auto-fix common Mermaid syntax errors
  const cleanChart = useCallback((input: string) => {
    let cleaned = input.trim();
    
    // 1. Strip Markdown and XML-like tags (AI often wraps things)
    cleaned = cleaned
      .replace(/^```mermaid\s+/i, '')
      .replace(/^```\s+/i, '')
      .replace(/```$/g, '')
      .replace(/<mermaid>|<\/mermaid>/gi, '')
      .trim();

    // 2. Remove leading 'mermaid' keyword if present
    cleaned = cleaned.replace(/^mermaid\s+/i, '');
    
    // 3. Normalize Diagram Type to Flowchart (v11 preference)
    // graph TD -> flowchart TD
    if (cleaned.startsWith('graph ')) {
      cleaned = 'flowchart ' + cleaned.substring(6);
    }

    // 4. AUTO-FIX: Aggressively quote all labels that aren't already quoted
    const lines = cleaned.split('\n');
    const fixedLines = lines.map(line => {
      let fixed = line;
      
      // Handle nodes: id[Label], id(Label), id((Label)), id{Label}, id[[Label]], id[(Label)], id{{Label}}
      // We look for brackets/parens/braces and quote the content if it's not already quoted
      
      // [Label] or [[Label]] or [(Label)]
      fixed = fixed.replace(/([a-zA-Z0-9_-]+)\[+([^"\]\n]+)\]+/g, (match, id, label) => {
        if (label.startsWith('"') && label.endsWith('"')) return match;
        const brackets = match.includes('[[') ? '[[' : '[';
        const closeBrackets = match.includes(']]') ? ']]' : ']';
        return `${id}${brackets}"${label.trim()}"${closeBrackets}`;
      });

      // (Label) or ((Label))
      fixed = fixed.replace(/([a-zA-Z0-9_-]+)\(+([^"\)\n]+)\)+/g, (match, id, label) => {
        if (label.startsWith('"') && label.endsWith('"')) return match;
        const parens = match.includes('((') ? '((' : '(';
        const closeParens = match.includes('))') ? '))' : ')';
        return `${id}${parens}"${label.trim()}"${closeParens}`;
      });

      // {Label} or {{Label}}
      fixed = fixed.replace(/([a-zA-Z0-9_-]+)\{+([^"\}\n]+)\}+/g, (match, id, label) => {
        if (label.startsWith('"') && label.endsWith('"')) return match;
        const braces = match.includes('{{') ? '{{' : '{';
        const closeBraces = match.includes('}}') ? '}}' : '}';
        return `${id}${braces}"${label.trim()}"${closeBraces}`;
      });

      // Handle Arrow Labels: -->|Label| B
      fixed = fixed.replace(/\|([^"\|\n]+)\|/g, (match, label) => {
        if (label.startsWith('"') && label.endsWith('"')) return match;
        return `|"${label.trim()}"|`;
      });

      // Handle Subgraph Titles: subgraph id [Title] or subgraph Title
      fixed = fixed.replace(/subgraph\s+([a-zA-Z0-9_-]+)\s+([^" \n\r][^"\n\r]*)$/g, 'subgraph $1 "$2"');
      fixed = fixed.replace(/subgraph\s+([^" \n\r][^"\n\r]*)$/g, 'subgraph "$1"');

      return fixed;
    });
    cleaned = fixedLines.join('\n');

    // 5. Normalize HTML entities
    cleaned = cleaned
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&amp;/g, '&');
    
    return cleaned.trim();
  }, []);

  const renderChart = useCallback(async () => {
    if (!ref.current || !chart) return;
    
    setIsRendering(true);
    setError(false);
    
    // Clear previous content
    ref.current.removeAttribute('data-processed');
    ref.current.innerHTML = '';
    
    try {
      const id = getMermaidId();
      const content = cleanChart(chart);
      
      // We render with useMaxWidth: false to get natural size
      const { svg } = await mermaid.render(id, content);
      
      if (ref.current) {
        ref.current.innerHTML = svg;
        const svgElement = ref.current.querySelector('svg');
        if (svgElement) {
          svgElement.style.maxWidth = 'none';
          svgElement.style.height = 'auto';
          svgElement.style.width = 'auto';
        }
      }
    } catch (err) {
      console.error('Mermaid render error:', err);
      setError(true);
    } finally {
      setIsRendering(false);
    }
  }, [chart, cleanChart]);

  // Initial render when mount or chart changes
  useEffect(() => {
    // Small timeout to ensure DOM is ready
    const timer = setTimeout(() => {
      renderChart();
    }, 50);
    return () => clearTimeout(timer);
  }, [renderChart]);

  const handleDownload = () => {
    if (!ref.current) return;
    const svg = ref.current.querySelector('svg');
    if (!svg) return;
    
    const svgData = new XMLSerializer().serializeToString(svg);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const svgUrl = URL.createObjectURL(svgBlob);
    const downloadLink = document.createElement('a');
    downloadLink.href = svgUrl;
    downloadLink.download = 'diagrama.svg';
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  const handleFit = () => {
    if (!ref.current) return;
    const container = ref.current.parentElement;
    if (!container) return;
    
    const containerWidth = container.clientWidth || 800;
    const svg = ref.current.querySelector('svg');
    if (svg) {
      const viewBox = svg.viewBox.baseVal;
      const svgWidth = viewBox.width || svg.clientWidth || 800;
      const newZoom = Math.min(1.5, (containerWidth - 64) / svgWidth);
      setZoom(Math.max(0.1, newZoom));
    }
  };

  const handleRefresh = () => {
    renderChart();
  };

  return (
    <>
      <div className={cn(
        "group relative flex flex-col my-6 bg-slate-900/40 rounded-[2rem] border border-white/5 shadow-inner transition-all overflow-hidden",
        isFullscreen ? "fixed inset-4 z-[1000] bg-slate-950/95 backdrop-blur-xl border-white/10" : "w-full"
      )}>
        {/* Toolbar */}
        <div className="flex items-center justify-between px-3 sm:px-6 py-3 border-b border-white/5 bg-white/5 backdrop-blur-sm">
          <div className="flex items-center gap-1 sm:gap-2">
            <button 
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-1.5 bg-primary/20 hover:bg-primary/30 rounded-lg text-primary transition-colors border border-primary/30"
              title={isFullscreen ? "Cerrar" : "Pantalla completa"}
            >
              {isFullscreen ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
            </button>

            {!error && (
              <button 
                onClick={handleFit}
                className="p-1.5 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors border border-white/5"
                title="Ajustar ancho"
              >
                <div className="flex items-center justify-center border border-current rounded-sm h-3 w-4 px-0.5">
                  <div className="w-full h-px bg-current" />
                </div>
              </button>
            )}

            <div className="w-px h-4 bg-white/10 mx-1" />

            {!error && (
              <div className="flex items-center gap-1 sm:gap-1.5 bg-white/5 rounded-lg border border-white/5 p-0.5">
                <button 
                  onClick={() => setZoom(prev => Math.max(0.05, prev - 0.2))}
                  className="p-1 hover:bg-white/10 rounded text-slate-400 hover:text-white transition-colors"
                  title="Alejar"
                >
                  <ZoomOut className="h-3 w-3" />
                </button>
                <span className="text-[9px] font-bold text-slate-500 w-7 text-center">{Math.round(zoom * 100)}%</span>
                <button 
                  onClick={() => setZoom(prev => Math.min(8, prev + 0.2))}
                  className="p-1 hover:bg-white/10 rounded text-slate-400 hover:text-white transition-colors"
                  title="Acercar"
                >
                  <ZoomIn className="h-3 w-3" />
                </button>
              </div>
            )}
            
            <button 
              onClick={handleRefresh}
              className={cn("p-1.5 hover:bg-white/10 rounded-lg transition-colors border border-white/5", error ? "text-amber-400 bg-amber-400/10 border-amber-400/20" : "text-slate-400 hover:text-white")}
              title="Recargar diagrama"
            >
              <RefreshCw className={cn("h-3.5 w-3.5", isRendering && "animate-spin")} />
            </button>
            
            {!error && (
              <button 
                onClick={handleDownload}
                className="hidden xs:flex p-1.5 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors border border-white/5"
                title="Descargar SVG"
              >
                <Download className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {isRendering && <RefreshCw className="h-3 w-3 animate-spin text-primary" />}
            <span className="hidden sm:inline-block text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Diagrama</span>
          </div>
        </div>

        {/* Content Container */}
        <div className={cn(
          "flex-1 overflow-auto p-8 flex justify-center custom-scrollbar relative min-h-[150px]",
          isFullscreen ? "items-center" : "items-start"
        )}>
          {error && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/80 backdrop-blur-md z-10 p-6 text-center">
              <div className="h-12 w-12 rounded-full bg-amber-500/10 flex items-center justify-center mb-4 border border-amber-500/20">
                <AlertTriangle className="h-6 w-6 text-amber-500" />
              </div>
              <p className="text-sm font-bold text-white mb-1 uppercase tracking-wider">Error de Sintaxis</p>
              <p className="text-xs text-slate-400 max-w-xs mb-6">
                El diagrama contiene caracteres que Mermaid v11 no puede procesar (probablemente acentos o paréntesis sin comillas).
              </p>
              
              <div className="flex flex-wrap justify-center gap-3">
                <button 
                  onClick={handleRefresh}
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl font-black uppercase text-[10px] tracking-widest hover:scale-105 transition-transform"
                >
                  <RefreshCw className="h-3 w-3" /> Reintentar
                </button>
                
                <button 
                  onClick={() => setShowRaw(!showRaw)}
                  className="flex items-center gap-2 px-4 py-2 bg-white/10 text-white rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-white/20 transition-all border border-white/5"
                >
                  {showRaw ? "Ocultar Código" : "Ver Código"}
                </button>
              </div>

              {showRaw && (
                <div className="mt-6 w-full max-w-lg">
                  <pre className="text-left text-[10px] p-4 bg-black/50 rounded-xl border border-white/10 text-amber-200/70 overflow-x-auto whitespace-pre-wrap font-mono">
                    {cleanChart(chart)}
                  </pre>
                  <p className="mt-2 text-[9px] text-slate-500 italic">
                    Tip: Pídele al chat "Corrige el diagrama Mermaid citando con comillas los textos con acentos".
                  </p>
                </div>
              )}
            </div>
          )}

          <div 
            ref={ref} 
            className={cn("mermaid transition-transform duration-200", error && "opacity-20 grayscale pointer-events-none")}
            style={{ 
              transform: `scale(${zoom})`, 
              transformOrigin: isFullscreen ? 'center' : 'top center',
              width: 'max-content'
            }}
          />
        </div>

        {!isFullscreen && !error && (
          <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest bg-slate-950/50 px-2 py-1 rounded-full backdrop-blur-sm border border-white/5">
              Usar pantalla completa para ver mejor
            </p>
          </div>
        )}
      </div>
      
      {/* Spacer when in fullscreen to avoid layout shift */}
      {isFullscreen && <div className="h-20" />}
    </>
  );
};

export default React.memo(Mermaid);
