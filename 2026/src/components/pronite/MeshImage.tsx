import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';

interface MeshImageProps {
  url: string;
  scrollZ: number;
  position: [number, number, number];
}

const MeshImage: React.FC<MeshImageProps> = ({ url, scrollZ, position }) => {
  const meshRef = useRef<THREE.Mesh>(null!);
  const texture = useTexture(url);

  const shader = useMemo(
    () => ({
      uniforms: {
        uTexture: { value: texture },
        uStrength: { value: 0 },
        uTime: { value: 0 },
      },
      vertexShader: `
        varying vec2 vUv;
        uniform float uStrength;
        uniform float uTime;

        float noise(vec2 p) {
          return sin(p.x * 10.0 + uTime) * sin(p.y * 10.0 + uTime);
        }

        void main() {
          vUv = uv;
          vec3 pos = position;
          float n = noise(uv);
          // Increased displacement for larger scale
          pos.z += n * uStrength * 50.0; 
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos,1.);
        }
      `,
      fragmentShader: `
        varying vec2 vUv;
        uniform sampler2D uTexture;
        uniform float uStrength;

        void main() {
          vec4 tex = texture2D(uTexture, vUv);
          float gridX = step(0.97, fract(vUv.x * 40.0));
          float gridY = step(0.97, fract(vUv.y * 40.0));
          float grid = max(gridX, gridY);
          vec3 wire = vec3(0.0, 0.8, 1.0);
          vec3 color = mix(tex.rgb, wire, grid * uStrength);
          gl_FragColor = vec4(color, tex.a);
        }
      `,
    }),
    [texture]
  );

  useFrame(({ clock }) => {
    const mat = meshRef.current.material as THREE.ShaderMaterial;

    mat.uniforms.uTime.value = clock.getElapsedTime();
    meshRef.current.position.z = position[2] - scrollZ;

    const dist = Math.abs(meshRef.current.position.z);

    // Trigger relative to scale. 
    // If objects are large (200 units), 1500 is reasonable.
    const trigger = 2500;

    const strength =
      dist < trigger ? gsap.utils.clamp(0, 1, 1 - dist / trigger) : 0;

    mat.uniforms.uStrength.value = Math.pow(strength, 1.8);
  });

  return (
    <mesh ref={meshRef} position={new THREE.Vector3(...position)}>
      {/* Scaled up to be visible at Z=-5000 */}
      <planeGeometry args={[220, 300, 64, 64]} />
      <shaderMaterial args={[shader]} transparent side={THREE.DoubleSide} />
    </mesh>
  );
};

export default MeshImage;
