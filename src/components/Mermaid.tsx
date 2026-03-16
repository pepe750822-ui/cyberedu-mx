
import React, { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';
import { Maximize2, Minimize2, Download, ZoomIn, ZoomOut } from 'lucide-react';
import { Button } from './ui/button';
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

  useEffect(() => {
    if (ref.current && chart) {
      setError(false);
      ref.current.removeAttribute('data-processed');
      
      const renderChart = async () => {
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
              // If not in fullscreen, we might want to cap it but here we let it be
            }
          }
        } catch (error) {
          console.error('Mermaid render error:', error);
          setError(true);
        }
      };
      
      renderChart();
    }
  }, [chart]);

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

  if (error) {
    return (
      <div className="text-red-400 p-4 border border-red-500/20 bg-red-500/5 rounded-xl text-xs flex items-center gap-2 my-4">
        <span>Error en renderizado de diagrama. Verifica la sintaxis.</span>
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
              onClick={() => setZoom(prev => Math.max(0.5, prev - 0.2))}
              className="p-1.5 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors"
              title="Alejar"
            >
              <ZoomOut className="h-3.5 w-3.5" />
            </button>
            <span className="text-[10px] font-bold text-slate-600 w-8 text-center">{Math.round(zoom * 100)}%</span>
            <button 
              onClick={() => setZoom(prev => Math.min(3, prev + 0.2))}
              className="p-1.5 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors"
              title="Acercar"
            >
              <ZoomIn className="h-3.5 w-3.5" />
            </button>
            <div className="w-px h-4 bg-white/10 mx-1" />
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
