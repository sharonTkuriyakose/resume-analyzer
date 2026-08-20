import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Sparkles, MeshDistortMaterial, Outlines } from '@react-three/drei';
import * as THREE from 'three';

export function CrystalCore({ score = 67, activeFace = null, onFaceClick }) {
  const crystalRef = useRef();
  const innerRef = useRef();

  // Morph crystal based on score
  const energyIntensity = score / 100;
  const color = new THREE.Color(0x0ea5e9).lerp(new THREE.Color(0x8b5cf6), energyIntensity);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (!activeFace) {
      crystalRef.current.rotation.y += 0.002 + energyIntensity * 0.005;
      crystalRef.current.rotation.x = Math.sin(t / 4) / 4;
      crystalRef.current.rotation.z = Math.sin(t / 5) / 4;
      
      innerRef.current.rotation.y -= 0.005;
      innerRef.current.rotation.x += 0.005;
    } else {
      // If a face is active, slowly rotate towards a specific angle or hold steady
      crystalRef.current.rotation.y = THREE.MathUtils.lerp(crystalRef.current.rotation.y, activeFace === 'ats' ? 0 : activeFace === 'skills' ? Math.PI/2 : activeFace === 'projects' ? Math.PI : -Math.PI/2, 0.05);
    }
  });

  return (
    <group onClick={(e) => {
      e.stopPropagation();
      // Simple face rotation assignment for now. In a real app we'd map face normals to chambers.
      const faces = ['ats', 'skills', 'projects', 'career'];
      const randomFace = faces[Math.floor(Math.random() * faces.length)];
      onFaceClick(randomFace);
    }}>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={1} floatingRange={[-0.2, 0.2]}>
        {/* Outer Crystal Shell - Icosahedron */}
        <mesh ref={crystalRef} scale={activeFace ? 3 : 1.5}>
          <icosahedronGeometry args={[1, 0]} />
          <meshPhysicalMaterial
            color={color}
            metalness={0.1}
            roughness={0.1}
            transmission={0.9}
            thickness={1.5}
            ior={1.5}
            transparent={true}
            opacity={0.8}
            emissive={new THREE.Color(0x0ea5e9)}
            emissiveIntensity={0.2 + energyIntensity * 0.3}
          />
          <Outlines thickness={0.02} color={0x8b5cf6} opacity={0.5} transparent />
        </mesh>

        {/* Inner Energy Core */}
        <mesh ref={innerRef} scale={activeFace ? 1.5 : 0.8}>
          <octahedronGeometry args={[1, 1]} />
          <MeshDistortMaterial
            color={0x8b5cf6}
            emissive={0x8b5cf6}
            emissiveIntensity={1 + energyIntensity * 2}
            distort={0.4}
            speed={2 + energyIntensity * 3}
            transparent={true}
            opacity={0.8}
          />
        </mesh>

        {/* Particle Energy Field */}
        <Sparkles 
          count={50 + score} 
          scale={activeFace ? 8 : 4} 
          size={2} 
          speed={0.4} 
          opacity={0.6} 
          color={color} 
        />
      </Float>
    </group>
  );
}
