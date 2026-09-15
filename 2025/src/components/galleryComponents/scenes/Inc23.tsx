import { Canvas, useLoader, useThree } from "@react-three/fiber";
import { useCallback, Suspense, useEffect, useRef, useState } from "react";
import { GLTFLoader, DRACOLoader } from "three-stdlib";
import Modal from "../gallery-modal";
import PreviewComponent from "../previewComponent/preview-component";
import * as THREE from "three";
import gsap from "gsap";
import { CONSTANT } from "~/constants";

const Inc23 = ({
  imgArr,
  clockPos,
}: {
  imgArr: string[];
  clockPos: { x: number; y: number };
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeModal, setActiveModal] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleImageClick = useCallback((index: number) => {
    setActiveModal(true);
    setActiveIndex(index);
  }, []);

  return (
    <div
      className={`relative -top-[${window.innerWidth >= 768 && window.innerWidth < 1024 && window.innerWidth < window.innerHeight}] h-screen w-screen overflow-hidden`}
    >
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
        <ambientLight intensity={5} />
        <Suspense fallback={null}>
          <Model
            imgArr={imgArr}
            currentIndex={currentIndex}
            setCurrentIndex={setCurrentIndex}
            clockPos={clockPos}
          />
        </Suspense>
      </Canvas>
      {/* Image Carousel Overlay */}
      <div className="absolute top-[70%] left-1/2 transform -translate-x-1/2 flex justify-center items-center gap-40">
        {imgArr.length > 0 &&
          (window.innerWidth < 768 ? [-1, 0, 1] : [-2, -1, 0, 1, 2]).map(
            (offset) => {
              const index =
                (currentIndex + offset + imgArr.length) % imgArr.length;
              const isCenter = offset === 0;

              // Calculate xPos based on offset
              const xPos =
                offset === -2
                  ? -1000
                  : offset === -1
                    ? -500
                    : offset === 1
                      ? 500
                      : offset === 2
                        ? 1000
                        : 0;

              // Adjust opacity for left and right images
              const opacity = isCenter ? 1 : 0.6;

              return (
                <div
                  key={index}
                  className={`absolute md:w-80 w-64 md:h-52 h-40 transition-all duration-700 ease-in-out]
                }`}
                  style={{
                    transform: `translateX(${xPos}px) scale(${isCenter ? 1.3 : 1})`,
                    opacity: opacity,
                    transition:
                      "transform 1s ease-in-out, opacity 1s ease-in-out",
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    rel="preload"
                    src={imgArr[index]}
                    onClick={() => handleImageClick(index)}
                    className="object-cover w-full h-full rounded-lg shadow-lg transition-transform duration-700 ease-in-out"
                    alt={`Carousel image ${index}`}
                  />
                </div>
              );
            },
          )}
      </div>
      <Modal
        showModal={activeModal}
        title="Gallery"
        onClose={() => setActiveModal(false)}
      >
        <PreviewComponent
          imgArr={imgArr}
          index={activeIndex}
          afterMovieLink="gmF72fu1w6A"
          thumbnailSrc={CONSTANT.ASSETS.GALLERY.THUMBNAIL23}
        />
      </Modal>
    </div>
  );
};

const Model = ({
  imgArr,
  currentIndex,
  setCurrentIndex,
  clockPos,
}: {
  imgArr: string[];
  currentIndex: number;
  setCurrentIndex: React.Dispatch<React.SetStateAction<number>>;
  clockPos: { x: number; y: number };
}) => {
  const pendulumRef = useRef<THREE.Object3D | null>(null);
  const pivotRef = useRef<THREE.Group | null>(null);
  const animationRef = useRef<gsap.core.Tween | null>(null);
  const { camera, size } = useThree();

  useEffect(() => {
    if (!pivotRef.current) return;

    // Convert screen coordinates to normalized device coordinates (NDC)
    const ndcX = (clockPos.x / size.width) * 2 - 1;
    const ndcY = -(clockPos.y / size.height) * 2 + 1;

    // Create vectors for the calculation
    const vector = new THREE.Vector3(ndcX, ndcY, 0);
    vector.unproject(camera);

    // Calculate the direction from camera to the point
    const dir = vector.sub(camera.position).normalize();

    // Calculate distance to the z=0 plane
    const distance = -camera.position.z / dir.z;

    // Get the final world position
    const worldPos = camera.position.clone().add(dir.multiplyScalar(distance));

    // Update pivot position
    pivotRef.current.position.set(worldPos.x, worldPos.y, 0);
  }, [clockPos, camera, size]);

  const gltf = useLoader(
    GLTFLoader,
    CONSTANT.ASSETS["3D"].PENDULUM,
    (loader) => {
      const dracoLoader = new DRACOLoader();
      dracoLoader.setDecoderPath(
        "https://www.gstatic.com/draco/versioned/decoders/1.5.7/",
      );
      loader.setDRACOLoader(dracoLoader);
    },
  );

  useEffect(() => {
    if (pendulumRef.current && pivotRef.current) {
      if (animationRef.current) animationRef.current.kill();

      pivotRef.current.rotation.z = -Math.PI / 12;

      animationRef.current = gsap.to(pivotRef.current.rotation, {
        z: Math.PI / 12,
        duration: 2,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        onRepeat: () => {
          setCurrentIndex((prevIndex) => (prevIndex + 1) % imgArr.length);
        },
      });
    }

    return () => {
      if (animationRef.current) animationRef.current.kill();
    };
  }, [imgArr.length, setCurrentIndex]);

  return (
    <group ref={pivotRef}>
      <ambientLight intensity={0.6} />
      <directionalLight position={[2, 1, 3]} intensity={2} />
      <primitive
        ref={pendulumRef}
        object={gltf.scene}
        scale={[0.4, 0.25, 0.4]}
        position={[0, -1.5, 0]}
      />
    </group>
  );
};

export default Inc23;
