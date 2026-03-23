
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
    // Primary palette
    primaryColor: '#312e81',        // dark indigo background for nodes
    primaryTextColor: '#e2e8f0',    // light slate text
    primaryBorderColor: '#6366f1',  // indigo border
    lineColor: '#6366f1',
    // Secondary / tertiary node colors
    secondaryColor: '#1e1b4b',
    tertiaryColor: '#0f172a',
    // Node fill and text
    nodeBkg: '#1e1b4b',
    nodeBorder: '#6366f1',
    clusterBkg: '#0f172a',
    clusterBorder: '#4f46e5',
    // Edge labels
    edgeLabelBackground: '#1e1b4b',
    // Text
    titleColor: '#e2e8f0',
    textColor: '#cbd5e1',
    // Overall background
    mainBkg: '#0f172a',
    background: '#0f172a',
    // Pie chart
    pie1: '#6366f1',
    pie2: '#22d3ee',
    pie3: '#f59e0b',
    pie4: '#10b981',
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
    
    // 1. Strip Markdown and XML-like tags
    cleaned = cleaned
      .replace(/^```mermaid\s*/im, '')
      .replace(/^```\s*/im, '')
      .replace(/```\s*$/gm, '')
      .replace(/<mermaid>|<\/mermaid>/gi, '')
      .replace(/^mermaid\s+/i, '')
      .trim();

    // 2. graph TD -> flowchart TD (v11 preference)
    if (/^graph\s/i.test(cleaned)) {
      cleaned = 'flowchart ' + cleaned.replace(/^graph\s/i, '');
    }

    // 3. Process line-by-line for targeted fixes
    const lines = cleaned.split('\n');
    const fixedLines = lines.map(line => {
      let fixed = line;

      // Fix dots in node IDs before arrow operators (A.1 --> B.2)
      fixed = fixed.replace(
        /\b([a-zA-Z][a-zA-Z0-9_]*)\.([a-zA-Z0-9_]+)\b/g,
        '$1_$2'
      );

      // Quote unquoted square-bracket labels: id[label] -> id["label"]
      // Uses \] as the only valid closer (avoids cross-bracket bugs)
      fixed = fixed.replace(
        /([a-zA-Z][a-zA-Z0-9_]*)\[([^"\]\n][^\]\n]*)\]/g,
        (_, id, label) => {
          const safe = label.trim().replace(/"/g, "'");
          return `${id}["${safe}"]`;
        }
      );

      // Quote unquoted diamond labels: id{label} -> id{"label"}
      fixed = fixed.replace(
        /([a-zA-Z][a-zA-Z0-9_]*)\{([^"{\}\n][^{\}\n]*)\}/g,
        (_, id, label) => {
          const safe = label.trim().replace(/"/g, "'");
          return `${id}{"${safe}"}`;
        }
      );

      // Quote unquoted double-paren (circle) labels: id((label)) -> id(("label"))
      fixed = fixed.replace(
        /([a-zA-Z][a-zA-Z0-9_]*)\(\(([^"()\n][^()\n]*)\)\)/g,
        (_, id, label) => {
          const safe = label.trim().replace(/"/g, "'");
          return `${id}(("${safe}"))`;
        }
      );

      // Quote unquoted round-bracket labels: id(label) -> id("label")
      // Do this AFTER double-paren so we don't double-process
      fixed = fixed.replace(
        /([a-zA-Z][a-zA-Z0-9_]*)\(([^"()\n][^()\n]*)\)/g,
        (_, id, label) => {
          const safe = label.trim().replace(/"/g, "'");
          return `${id}("${safe}")`;
        }
      );

      // Quote unquoted arrow labels: -->|label| -> -->|"label"|
      fixed = fixed.replace(
        /\|([^"'|\n][^|\n]*)\|/g,
        (_, label) => `|"${label.trim().replace(/"/g, "'")}"|`
      );

      // Quote unquoted subgraph titles
      fixed = fixed.replace(
        /^(\s*subgraph\s+)([^"\n][^\n]*)$/,
        (_, prefix, title) => `${prefix}"${title.trim().replace(/"/g, "'")}"`
      );

      return fixed;
    });
    cleaned = fixedLines.join('\n');

    // 4. Ultra-aggressive character sanitization (v11 compatibility)
    cleaned = cleaned
      .replace(/á/g, 'a').replace(/é/g, 'e').replace(/í/g, 'i')
      .replace(/ó/g, 'o').replace(/ú/g, 'u').replace(/ü/g, 'u')
      .replace(/Á/g, 'A').replace(/É/g, 'E').replace(/Í/g, 'I')
      .replace(/Ó/g, 'O').replace(/Ú/g, 'U')
      .replace(/ñ/g, 'n').replace(/Ñ/g, 'N')
      .replace(/¿/g, '').replace(/¡/g, '')
      .replace(/\(/g, ' ').replace(/\)/g, ' ')
      .replace(/:/g, ' -')
      .replace(/"/g, "'");

    // 5. Normalize HTML entities
    cleaned = cleaned
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&amp;/g, '&');
    
    return cleaned.trim();
  }, []);

  // Inject dark-theme CSS for SVG nodes only once
  useEffect(() => {
    const styleId = 'mermaid-dark-override';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = `
        .mermaid-container .node rect,
        .mermaid-container .node circle,
        .mermaid-container .node ellipse,
        .mermaid-container .node polygon,
        .mermaid-container .node path {
          fill: #1e1b4b !important;
          stroke: #6366f1 !important;
        }
        .mermaid-container .nodeLabel,
        .mermaid-container text.nodeLabel {
          color: #e2e8f0 !important;
          fill: #e2e8f0 !important;
        }
        .mermaid-container .edgeLabel rect {
          fill: #1e1b4b !important;
          opacity: 0.95 !important;
        }
        .mermaid-container .edgeLabel span {
          color: #cbd5e1 !important;
          background: #1e1b4b !important;
        }
        .mermaid-container .cluster rect {
          fill: #0f172a !important;
          stroke: #4f46e5 !important;
        }
      `;
      document.head.appendChild(style);
    }
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
        "group relative flex flex-col my-6 bg-slate-900/40 rounded-[2rem] border border-white/5 shadow-inner transition-all overflow-hidden max-w-full",
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
            className={cn("mermaid-container mermaid transition-transform duration-200", error && "opacity-20 grayscale pointer-events-none")}
            style={{ 
              transform: `scale(${zoom})`, 
              transformOrigin: isFullscreen ? 'center' : 'top center',
              width: 'max-content',
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
