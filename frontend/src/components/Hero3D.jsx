import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Sparkles } from '@react-three/drei';
import { useMemo, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';

function Orb({ color }) {
  const mesh = useRef();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (mesh.current) {
      mesh.current.rotation.x = t * 0.2;
      mesh.current.rotation.y = t * 0.35;
      mesh.current.position.y = Math.sin(t * 0.6) * 0.2;
    }
  });

  return (
    <Float speed={1.4} rotationIntensity={0.6} floatIntensity={1.2}>
      <mesh ref={mesh} scale={1.55}>
        <icosahedronGeometry args={[1, 1]} />
        <MeshDistortMaterial color={color} attach="material" distort={0.45} speed={2.2} roughness={0.25} metalness={0.35} />
      </mesh>
    </Float>
  );
}

function Rings({ color }) {
  const group = useRef();

  useFrame((state) => {
    if (group.current) {
      group.current.rotation.z = state.clock.getElapsedTime() * 0.15;
      group.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.2) * 0.2;
    }
  });

  return (
    <group ref={group} position={[0, 0, -1]}>
      {[1.8, 2.4, 3.1].map((radius) => (
        <mesh key={radius} rotation={[Math.PI / 2.4, 0.2, 0]}>
          <torusGeometry args={[radius, 0.02, 16, 120]} />
          <meshBasicMaterial color={color} transparent opacity={0.35} />
        </mesh>
      ))}
    </group>
  );
}

export default function Hero3D() {
  const { theme } = useTheme();
  const colors = useMemo(
    () =>
      theme === 'dark'
        ? { orb: '#3dd6c6', ring: '#7cf0e4', spark: '#9fdfff' }
        : { orb: '#0f8f84', ring: '#147a72', spark: '#4f7cff' },
    [theme]
  );

  return (
    <div className="hero-canvas" aria-hidden="true">
      <Canvas camera={{ position: [0, 0, 5.2], fov: 45 }} dpr={[1, 1.75]}>
        <ambientLight intensity={0.65} />
        <directionalLight position={[4, 4, 2]} intensity={1.2} />
        <Orb color={colors.orb} />
        <Rings color={colors.ring} />
        <Sparkles count={80} scale={8} size={2.5} speed={0.4} color={colors.spark} />
      </Canvas>
    </div>
  );
}
