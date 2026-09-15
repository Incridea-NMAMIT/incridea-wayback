import { KeyboardControls, Sky, useProgress } from "@react-three/drei";
import { OrthographicCamera } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Physics } from "@react-three/rapier";
import { gsap } from "gsap";
import React, { Suspense, useEffect, useRef, useState } from "react";

import * as UIButtons from "~/components/explore_2025/UI";
import { CharacterController } from "~/components/explore_2025/characterController";
import LoadingScreen from "~/components/explore_2025/Loader";
import { Map } from "~/components/explore_2025/Map";
import { CONSTANT } from "~/constants";

import { Portal } from "./Portal";
import Poi from "./Stone";

const maps = {
  medieval_fantasy_book: {
    scale: 0.4,
    position: [-4, -3, -6],
    rotation: [10, 0],
  },
};

const keyboardMap = [
  { name: "forward", keys: ["ArrowUp", "KeyW"] },
  { name: "backward", keys: ["ArrowDown", "KeyS"] },
  { name: "left", keys: ["ArrowLeft", "KeyA"] },
  { name: "right", keys: ["ArrowRight", "KeyD"] },
  { name: "run", keys: ["Shift"] },
  { name: "jump", keys: ["Space"] },
];

export const Experience = () => {
  const { progress, active } = useProgress();
  const experienceRef = useRef<HTMLDivElement | null>(null);
  const [isLandscape, setIsLandscape] = useState(
    typeof window !== "undefined"
      ? window.innerWidth > window.innerHeight
      : true,
  );

  const [isRunOn, setIsRunOn] = useState(false);
  const [showLoading, setShowLoading] = useState(true);
  const images: string[] = [
    CONSTANT.ASSETS.EXPLORE.LOADING_BACKGROUND,
    CONSTANT.ASSETS.EXPLORE.LOADING_FOREGROUND,
  ];

  useEffect(() => {
    if (!active && progress === 100) {
      gsap.to("#loading-screen", {
        opacity: 0,
        duration: 6,
        onComplete: () => setShowLoading(false),
      });

      gsap.fromTo(
        experienceRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 1 },
      );
    }
  }, [progress, active]);

  useEffect(() => {
    const handleResize = () => {
      const landscape = window.innerWidth > window.innerHeight;
      setIsLandscape(landscape);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div
      ref={experienceRef}
      className="relative h-[100vh] w-full"
      style={{ opacity: 0 }}
    >
      {showLoading && <LoadingScreen images={images} />}
      <div className="relative h-[100vh] w-full">
        <KeyboardControls map={keyboardMap}>
          <Canvas
            shadows
            camera={{
              position: [0, 0, 0],
              near: 0.01,
              fov: isLandscape ? 60 : 100,
            }}
            className="absolute inset-0"
            gl={{ antialias: false, pixelRatio: 0.1 }}
            id="canvas"
          >
            <Suspense fallback={null}>
              <color attach="background" args={["#ffffff"]} />
              <fog attach="fog" args={["white", 3, 40]} />
              <Physics key="medieval_fantasy_book">
                <ambientLight intensity={1} />
                <directionalLight
                  intensity={3}
                  castShadow
                  position={[-5, 20, -15]}
                  shadow-mapSize-width={256}
                  shadow-mapSize-height={256}
                  shadow-bias={-0.00005}
                >
                  <OrthographicCamera
                    left={-22}
                    right={15}
                    top={10}
                    bottom={-20}
                    attach="shadow-camera"
                  />
                </directionalLight>
                <Map
                  scale={maps.medieval_fantasy_book.scale as never}
                  position={maps.medieval_fantasy_book.position as never}
                  model={`models/medieval_fantasy_book.glb` as never}
                />
                <CharacterController />
                <Portal props={undefined as never} />
              </Physics>
              <Poi />
              <Sky />
            </Suspense>
          </Canvas>
        </KeyboardControls>
        <div className="pointer-events-auto sticky bottom-24 z-50 flex w-full justify-between px-8">
          <div className="flex flex-col items-center">
            <button id="w" className="mb-2 scale-[150%]">
              <UIButtons.CircleArrowUpFilled className="h-12 w-12 text-white/60" />
            </button>
            <div className="flex">
              <button id="a" className="mr-8 scale-[150%]">
                <UIButtons.CircleArrowLeftFilled className="h-12 w-12 text-white/60" />
              </button>
              <button id="s" className="mr-8 mt-16 scale-[150%]">
                <UIButtons.CircleArrowDownFilled className="h-12 w-12 text-white/60" />
              </button>
              <button id="d" className="scale-[150%]">
                <UIButtons.CircleArrowRightFilled className="h-12 w-12 text-white/60" />
              </button>
            </div>
          </div>

          <div className="flex flex-col items-center">
            <button
              id="shift"
              onClick={() => {
                setIsRunOn((prev) => !prev);
              }}
              className={`mb-12 scale-[100%] rounded-full p-2 transition-colors ${
                isRunOn ? "bg-green-950" : "bg-transparent"
              }`}
            >
              <UIButtons.Run className="h-12 w-12 text-white/60" />
            </button>
            <button id="jump" className="scale-[150%]">
              <UIButtons.CircleChevronsUpFilled className="h-12 w-12 text-white/60" />
            </button>
          </div>
        </div>
      </div>
      )
    </div>
  );
};
