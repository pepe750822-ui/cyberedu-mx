export default function NeuralBrainCanvas() {
  return (
    <div className="w-full h-full relative flex items-center justify-center overflow-hidden">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="absolute rounded-full opacity-70"
          style={{
            width: `${80 + i * 40}px`,
            height: `${80 + i * 40}px`,
            background: i % 2 === 0
              ? 'radial-gradient(circle, #7c3aed, transparent)'
              : 'radial-gradient(circle, #f59e0b, transparent)',
            animation: `floatOrb${i} ${3 + i * 0.8}s ease-in-out infinite alternate`,
            left: `${10 + i * 12}%`,
            top: `${15 + (i % 3) * 20}%`,
          }}
        />
      ))}
      <div className="text-6xl animate-pulse z-10">🧠</div>
    </div>
  );
}
