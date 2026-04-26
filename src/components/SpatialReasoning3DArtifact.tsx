import React, { useState, useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Box, Edges, PerspectiveCamera } from '@react-three/drei';
import { Box as BoxIcon, Rotate3d, CheckCircle2, XCircle, Info } from 'lucide-react';

const RotatingCube = ({ faces }: { faces: string[] }) => {
  const meshRef = useRef<any>();
  
  return (
    <Box ref={meshRef} args={[2, 2, 2]}>
      <meshStandardMaterial attach="material-0" color="#3b82f6" /> {/* Right */}
      <meshStandardMaterial attach="material-1" color="#ef4444" /> {/* Left */}
      <meshStandardMaterial attach="material-2" color="#10b981" /> {/* Top */}
      <meshStandardMaterial attach="material-3" color="#facc15" /> {/* Bottom */}
      <meshStandardMaterial attach="material-4" color="#8b5cf6" /> {/* Front */}
      <meshStandardMaterial attach="material-5" color="#f97316" /> {/* Back */}
      <Edges color="white" lineWidth={2} />
    </Box>
  );
};

const SpatialReasoning3DArtifact: React.FC = () => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  
  const correctOption = 1;

  const handleCheck = () => {
    if (selectedOption !== null) setShowResult(true);
  };

  return (
    <div className="bg-slate-950 rounded-3xl border border-white/10 overflow-hidden shadow-2xl my-4 font-sans">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-white/10 bg-slate-900/50">
        <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20">
          <Rotate3d className="h-5 w-5 text-blue-400" />
        </div>
        <div>
          <h3 className="font-black text-white text-sm uppercase tracking-tighter">Entrenamiento Espacial 3D</h3>
          <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest">Desafío de Rotación Mental</p>
        </div>
      </div>

      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* 3D Scene */}
        <div className="relative h-[300px] bg-slate-900 rounded-2xl border border-white/5 overflow-hidden">
          <Canvas>
            <PerspectiveCamera makeDefault position={[4, 4, 4]} />
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} />
            <Suspense fallback={null}>
              <RotatingCube faces={[]} />
            </Suspense>
            <OrbitControls enableZoom={true} autoRotate={false} />
          </Canvas>
          
          <div className="absolute top-4 left-4 flex flex-col gap-1">
            <div className="px-2 py-1 rounded bg-blue-500/20 border border-blue-500/30 text-[8px] font-black text-blue-400 uppercase">Vista 3D</div>
            <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Arrastra para rotar</p>
          </div>
        </div>

        {/* Challenge Area */}
        <div className="space-y-6 flex flex-col justify-center">
          <div className="space-y-4">
            <h4 className="text-xs font-black text-white uppercase tracking-widest">¿Cuál es la vista superior correcta?</h4>
            
            <div className="grid grid-cols-2 gap-4">
              {[0, 1, 2, 3].map((i) => (
                <button
                  key={i}
                  onClick={() => { setSelectedOption(i); setShowResult(false); }}
                  className={`relative aspect-square rounded-xl border-2 transition-all overflow-hidden p-2 flex items-center justify-center ${
                    selectedOption === i 
                      ? 'border-blue-500 bg-blue-500/10' 
                      : 'border-white/5 bg-white/5 hover:border-white/20'
                  }`}
                >
                  <div 
                    className="w-12 h-12 rounded shadow-inner"
                    style={{ 
                      backgroundColor: i === 0 ? '#3b82f6' : i === 1 ? '#10b981' : i === 2 ? '#ef4444' : '#8b5cf6' 
                    }}
                  />
                  <div className="absolute top-1 left-2 text-[10px] font-black text-white/20 uppercase">{String.fromCharCode(65 + i)}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <button
              disabled={selectedOption === null}
              onClick={handleCheck}
              className={`w-full py-4 rounded-xl font-black text-xs uppercase tracking-[0.2em] transition-all ${
                selectedOption !== null 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20 hover:scale-[1.02]' 
                  : 'bg-white/5 text-white/20 cursor-not-allowed'
              }`}
            >
              Comprobar Respuesta
            </button>

            {showResult && (
              <div
                className={`p-4 rounded-xl flex items-center gap-3 border animate-in fade-in slide-in-from-bottom-2 duration-300 ${
                  selectedOption === correctOption
                    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                    : 'bg-red-500/10 border-red-500/20 text-red-400'
                }`}
              >
                {selectedOption === correctOption ? <CheckCircle2 className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
                <div>
                  <p className="text-xs font-black uppercase">{selectedOption === correctOption ? '¡Excelente!' : 'Casi...'}</p>
                  <p className="text-[10px] opacity-80">{selectedOption === correctOption ? 'Has identificado correctamente la cara superior (verde).' : 'Observa bien los colores al rotar el cubo.'}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="px-6 py-4 bg-slate-900/50 border-t border-white/5">
        <div className="flex items-start gap-3">
          <Info className="h-4 w-4 text-blue-400 mt-0.5" />
          <p className="text-[11px] text-white/60 leading-relaxed">
            <span className="font-bold text-white">Razonamiento Espacial:</span> Esta habilidad te permite imaginar objetos desde diferentes ángulos sin moverlos físicamente. Es clave en ingeniería, arquitectura y diseño.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SpatialReasoning3DArtifact;
