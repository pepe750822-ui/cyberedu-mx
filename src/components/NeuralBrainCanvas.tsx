import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Line } from "@react-three/drei";

const NEURON_POSITIONS: [number, number, number][] = [
  [-1.2, 0.6, 0.1], [-0.8, 0.9, -0.3], [-1.4, 0.2, -0.2],
  [-0.6, 0.3, 0.6], [-1.0, -0.2, 0.4], [-0.5, 0.7, -0.6],
  [-0.3, -0.4, 0.2], [-1.1, 0.5, 0.5], [-0.7, -0.6, -0.1],
  [-0.3, 0.1, -0.5], [ 1.2, 0.6, 0.1], [ 0.8, 0.9, -0.3],
  [ 1.4, 0.2, -0.2], [ 0.6, 0.3, 0.6], [ 1.0, -0.2, 0.4],
  [ 0.5, 0.7, -0.6], [ 0.3, -0.4, 0.2], [ 1.1, 0.5, 0.5],
  [ 0.7, -0.6, -0.1], [ 0.3, 0.1, -0.5],
];

const CONNECTIONS: [number, number][] = (() => {
  const edges: [number, number][] = [];
  for (let i = 0; i < NEURON_POSITIONS.length; i++) {
    for (let j = i + 1; j < NEURON_POSITIONS.length; j++) {
      const [x1, y1, z1] = NEURON_POSITIONS[i];
      const [x2, y2, z2] = NEURON_POSITIONS[j];
      const d = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2 + (z2 - z1) ** 2);
      if (d < 1.0) edges.push([i, j]);
    }
  }
  return edges;
})();

function NeuralBrain() {
  const groupRef = useRef<any>(null);
  const pulseRefs = useRef<(any | null)[]>([]);
  const progress = useRef<number[]>(
    CONNECTIONS.map((_, i) => (i / CONNECTIONS.length))
  );

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.25;
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.08;
    }
    CONNECTIONS.forEach(([a, b], i) => {
      const speed = 0.3 + (i % 4) * 0.08;
      progress.current[i] = (progress.current[i] + delta * speed) % 1;
      const p = progress.current[i];
      const [x1, y1, z1] = NEURON_POSITIONS[a];
      const [x2, y2, z2] = NEURON_POSITIONS[b];
      if (pulseRefs.current[i]) {
        pulseRefs.current[i].position.set(
          x1 + (x2 - x1) * p,
          y1 + (y2 - y1) * p,
          z1 + (z2 - z1) * p
        );
      }
    });
  });

  return (
    <group ref={groupRef}>
      {NEURON_POSITIONS.map((pos, i) => (
        <mesh key={`n-${i}`} position={pos}>
          <sphereGeometry args={[i % 5 === 0 ? 0.10 : 0.065, 16, 16]} />
          <meshStandardMaterial
            color={i % 4 === 0 ? "#f59e0b" : "#7c3aed"}
            emissive={i % 4 === 0 ? "#f59e0b" : "#7c3aed"}
            emissiveIntensity={i % 4 === 0 ? 2.5 : 1.8}
            roughness={0.1}
            metalness={0.3}
          />
        </mesh>
      ))}
      {CONNECTIONS.map(([a, b], i) => (
        <Line
          key={`l-${i}`}
          points={[NEURON_POSITIONS[a], NEURON_POSITIONS[b]]}
          color="#7c3aed"
          lineWidth={0.8}
          opacity={0.28}
          transparent
        />
      ))}
      {CONNECTIONS.map(([a, b], i) => {
        const [x1, y1, z1] = NEURON_POSITIONS[a];
        const [x2, y2, z2] = NEURON_POSITIONS[b];
        const p = progress.current[i];
        return (
          <mesh
            key={`p-${i}`}
            ref={(el) => { pulseRefs.current[i] = el; }}
            position={[x1 + (x2 - x1) * p, y1 + (y2 - y1) * p, z1 + (z2 - z1) * p]}
          >
            <sphereGeometry args={[0.028, 8, 8]} />
            <meshStandardMaterial
              color={i % 3 === 0 ? "#f59e0b" : "#a855f7"}
              emissive={i % 3 === 0 ? "#f59e0b" : "#a855f7"}
              emissiveIntensity={5}
            />
          </mesh>
        );
      })}
    </group>
  );
}

export default function NeuralBrainCanvas() {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 45 }}
      gl={{ alpha: true }}
      style={{ background: "transparent" }}
    >
      <ambientLight intensity={0.5} />
      <pointLight position={[5, 5, 5]} intensity={2.5} color="#7c3aed" />
      <pointLight position={[-5, -5, 5]} intensity={1.2} color="#f59e0b" />
      <pointLight position={[0, -5, -5]} intensity={0.5} color="#a855f7" />
      <NeuralBrain />
    </Canvas>
  );
}
