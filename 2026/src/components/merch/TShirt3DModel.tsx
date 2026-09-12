import { Suspense, useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF, PerspectiveCamera, Html } from '@react-three/drei';
import * as THREE from 'three';
import ErrorBoundary from '../ErrorBoundary';

interface ModelProps {
  modelPath: string;
  scale?: number;
}

function TShirtModel({ modelPath, scale = 1 }: ModelProps) {
  const gltf = useGLTF(modelPath);
  const meshRef = useRef<THREE.Group>(null);

  useEffect(() => {
    if (meshRef.current && gltf.scene) {
      const box = new THREE.Box3().setFromObject(gltf.scene);
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());

      gltf.scene.position.x = -center.x;
      gltf.scene.position.y = -center.y;
      gltf.scene.position.z = -center.z;

      const maxDim = Math.max(size.x, size.y, size.z);
      const computedScale = (2 / maxDim) * scale;
      meshRef.current.scale.setScalar(computedScale);
    }
  }, [gltf.scene, scale]);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.2;
    }
  });

  return (
    <group ref={meshRef}>
      <primitive object={gltf.scene} />
    </group>
  );
}

function Loader() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <Html center>
      <div className="flex flex-col items-center justify-center bg-gradient-to-br from-purple-900/30 to-indigo-900/30 backdrop-blur-sm rounded-xl p-4 min-w-[200px]">
        <div className="relative">
          {/* Spinner Ring */}
          <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />

          {/* Progress Text */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-white font-bold text-sm">{progress}%</span>
          </div>
        </div>

        <p className="mt-4 text-gray-300 text-sm animate-pulse whitespace-nowrap">Loading 3D Model...</p>
      </div>
    </Html>
  );
}

interface TShirt3DModelProps {
  modelPath?: string;
  className?: string;
  scale?: number;
}

export default function TShirt3DModel({
  modelPath = '/models/tshirt.glb',
  className = '',
  scale = 1
}: TShirt3DModelProps) {
  const [cameraZ, setCameraZ] = useState(5.0);

  useEffect(() => {
    const handleResize = () => {
      setCameraZ(window.innerWidth > 640 ? 3.5 : 5.0);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Only preload the model when this component is actually mounted
  useEffect(() => {
    useGLTF.preload(modelPath);
  }, [modelPath]);

  return (
    <div className={`relative w-full h-full min-h-[400px] ${className}`}>
      <ErrorBoundary>
        <Canvas
          shadows
          dpr={[1, 2]}
          style={{ background: 'transparent' }}
          gl={{
            antialias: true,
            alpha: true,
            preserveDrawingBuffer: true,
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1
          }}
          camera={{ position: [0, 0, cameraZ], fov: 45 }}
        >
          { }
          <PerspectiveCamera
            makeDefault
            position={[0, 0, cameraZ]}
            fov={45}
            near={0.1}
            far={100}
          />

          { }
          { }
          {/* Main Key Light - INCREASED */}
          <directionalLight
            position={[5, 5, 5]}
            intensity={2.5}
            castShadow
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
          />

          {/* Fill Light - INCREASED */}
          <directionalLight
            position={[-5, 3, -5]}
            intensity={1.5}
          />

          {/* Rim Light - INCREASED */}
          <directionalLight
            position={[0, 5, -5]}
            intensity={1.0}
          />

          {/* Front Spot Light - NEW for highlighting */}
          <spotLight
            position={[0, 0, 5]}
            angle={0.5}
            penumbra={1}
            intensity={2.0}
            distance={10}
            castShadow
          />

          {/* Ambient Light - INCREASED */}
          <ambientLight intensity={0.8} />

          {/* Hemisphere Light - INCREASED */}
          <hemisphereLight
            intensity={1.0}
            color="#ffffff"
            groundColor="#444444"
          />

          { }
          <Suspense fallback={<Loader />}>
            <TShirtModel modelPath={modelPath} scale={scale} />
          </Suspense>

          { }
          <OrbitControls
            enablePan={false}
            enableZoom={true}
            enableRotate={true}
            minDistance={1.5}
            maxDistance={6}
            minPolarAngle={Math.PI / 4}
            maxPolarAngle={Math.PI / 1.5}
            dampingFactor={0.05}
            enableDamping={true}
            rotateSpeed={0.5}
            zoomSpeed={0.8}
            autoRotate={false}
            autoRotateSpeed={1}
          />
        </Canvas>
      </ErrorBoundary>

    </div>
  );
}
