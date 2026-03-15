
import React, { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

mermaid.initialize({
  startOnLoad: true,
  theme: 'dark',
  securityLevel: 'loose',
  fontFamily: 'Inter, sans-serif',
});

interface MermaidProps {
  chart: string;
}

const Mermaid: React.FC<MermaidProps> = ({ chart }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current && chart) {
      ref.current.removeAttribute('data-processed');
      mermaid.contentLoaded();
      
      // Force re-render of mermaid
      const renderChart = async () => {
        try {
          const { svg } = await mermaid.render(`mermaid-${Math.random().toString(36).substr(2, 9)}`, chart);
          if (ref.current) {
            ref.current.innerHTML = svg;
          }
        } catch (error) {
          console.error('Mermaid render error:', error);
          if (ref.current) {
            ref.current.innerHTML = '<div class="text-red-400 p-4 border border-red-500/20 bg-red-500/5 rounded-xl text-xs">Error en renderizado de diagrama</div>';
          }
        }
      };
      
      renderChart();
    }
  }, [chart]);

  return (
    <div className="flex justify-center my-6 bg-slate-900/50 p-6 rounded-[2rem] border border-white/5 shadow-inner overflow-x-auto">
      <div ref={ref} className="mermaid" />
    </div>
  );
};

export default Mermaid;
