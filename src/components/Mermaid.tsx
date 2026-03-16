
import React, { useEffect, useRef, useState, useCallback } from 'react';
import mermaid from 'mermaid';
import { Maximize2, Minimize2, Download, ZoomIn, ZoomOut, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

// Get a clean ID for mermaid rendering
const getMermaidId = () => `mermaid-${Math.random().toString(36).substr(2, 9)}`;

mermaid.initialize({
  startOnLoad: true,
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

  const renderChart = useCallback(async () => {
    if (!ref.current || !chart) return;
    
    setError(false);
    ref.current.removeAttribute('data-processed');
    ref.current.innerHTML = '';
    
    try {
      const id = getMermaidId();
      // We render with useMaxWidth: false to get natural size
      const { svg } = await mermaid.render(id, chart);
      if (ref.current) {
        ref.current.innerHTML = svg;
        // Target the SVG and make sure it has clean dimensions
        const svgElement = ref.current.querySelector('svg');
        if (svgElement) {
          svgElement.style.maxWidth = 'none';
          svgElement.style.height = 'auto';
        }
      }
    } catch (err) {
      console.error('Mermaid render error:', err);
      setError(true);
    }
  }, [chart]);

  useEffect(() => {
    renderChart();
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
    const containerWidth = ref.current.parentElement?.clientWidth || 800;
    const svg = ref.current.querySelector('svg');
    if (svg) {
      const svgWidth = svg.viewBox.baseVal.width || svg.clientWidth || 800;
      const newZoom = Math.min(1.5, (containerWidth - 40) / svgWidth);
      setZoom(Math.max(0.2, newZoom));
    }
  };

  const handleRefresh = () => {
    renderChart();
  };

  if (error) {
    return (
      <div className="text-red-400 p-4 border border-red-500/20 bg-red-500/5 rounded-xl text-xs flex items-center gap-2 my-4">
        <span>Error en renderizado de diagrama. Verifica la sintaxis.</span>
        <button onClick={handleRefresh} className="p-1 hover:bg-white/10 rounded">
            <RefreshCw className="h-3 w-3" />
        </button>
      </div>
    );
  }

  return (
    <>
      <div className={cn(
        "group relative flex flex-col my-6 bg-slate-900/40 rounded-[2rem] border border-white/5 shadow-inner transition-all overflow-hidden",
        isFullscreen ? "fixed inset-4 z-[1000] bg-slate-950/95 backdrop-blur-xl border-white/10" : "w-full"
      )}>
        {/* Toolbar */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-white/5 bg-white/5 backdrop-blur-sm">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Diagrama Autogenerado</span>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setZoom(prev => Math.max(0.1, prev - 0.2))}
              className="p-1.5 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors"
              title="Alejar"
            >
              <ZoomOut className="h-3.5 w-3.5" />
            </button>
            <span className="text-[10px] font-bold text-slate-600 w-8 text-center">{Math.round(zoom * 100)}%</span>
            <button 
              onClick={() => setZoom(prev => Math.min(5, prev + 0.2))}
              className="p-1.5 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors"
              title="Acercar"
            >
              <ZoomIn className="h-3.5 w-3.5" />
            </button>
            <button 
              onClick={handleFit}
              className="p-1.5 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors"
              title="Ajustar ancho"
            >
              <div className="flex items-center justify-center border border-current rounded-sm h-3 w-4 px-0.5">
                <div className="w-full h-px bg-current" />
              </div>
            </button>
            <div className="w-px h-4 bg-white/10 mx-1" />
            <button 
              onClick={handleRefresh}
              className="p-1.5 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors"
              title="Recargar diagrama"
            >
              <RefreshCw className="h-3.5 w-3.5" />
            </button>
            <button 
              onClick={handleDownload}
              className="p-1.5 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors"
              title="Descargar SVG"
            >
              <Download className="h-3.5 w-3.5" />
            </button>
            <button 
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-1.5 bg-primary/10 hover:bg-primary/20 rounded-lg text-primary transition-colors"
              title={isFullscreen ? "Cerrar" : "Pantalla completa"}
            >
              {isFullscreen ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
            </button>
          </div>
        </div>

        {/* Content Container */}
        <div className={cn(
          "flex-1 overflow-auto p-8 flex justify-center custom-scrollbar",
          isFullscreen ? "items-center" : "items-start min-h-[200px]"
        )}>
          <div 
            ref={ref} 
            className="mermaid transition-transform duration-200"
            style={{ 
              transform: `scale(${zoom})`, 
              transformOrigin: isFullscreen ? 'center' : 'top center',
              width: 'max-content'
            }}
          />
        </div>

        {!isFullscreen && (
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

export default Mermaid;
