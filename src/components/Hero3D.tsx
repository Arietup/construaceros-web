import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Lightformer } from '@react-three/drei';
import { useRef } from 'react';
import type { Mesh } from 'three';

function PiezaAcero() {
  const malla = useRef<Mesh>(null);

  useFrame((estado) => {
    if (!malla.current) return;
    // Rotación base continua más una inclinación ligada al scroll.
    malla.current.rotation.y = estado.clock.elapsedTime * 0.18 + window.scrollY * 0.0012;
    malla.current.rotation.x = 0.28 + window.scrollY * 0.0004;
  });

  return (
    <mesh ref={malla} position={[1.6, 0, 0]}>
      <torusKnotGeometry args={[1.15, 0.32, 220, 32]} />
      {/* Acero inoxidable satinado: metálico total, rugosidad baja. */}
      <meshStandardMaterial color="#C7CBD1" metalness={1} roughness={0.18} envMapIntensity={1.4} />
    </mesh>
  );
}

export default function Hero3D({ alMontar }: { alMontar?: () => void }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 5.2], fov: 45 }}
      dpr={[1, 1.75]}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
      // Solo cuando hay contexto WebGL de verdad se retira la imagen de respaldo.
      onCreated={() => alMontar?.()}
    >
      <ambientLight intensity={0.25} />
      <directionalLight position={[4, 5, 3]} intensity={2.2} color="#F2B705" />
      <directionalLight position={[-4, -2, -3]} intensity={1.1} color="#8fa0b5" />
      <PiezaAcero />
      {/* Los reflejos del entorno son lo que hace que el acero parezca acero.
          Se generan en la escena, sin descargar un HDRI de un CDN ajeno. */}
      <Environment resolution={256}>
        <Lightformer intensity={4} position={[0, 3, -4]} scale={[10, 3, 1]} color="#ffffff" />
        <Lightformer intensity={2} position={[-4, 1, 2]} scale={[6, 6, 1]} color="#F2B705" />
        <Lightformer intensity={1.5} position={[4, -1, 2]} scale={[6, 6, 1]} color="#8fa0b5" />
      </Environment>
    </Canvas>
  );
}
