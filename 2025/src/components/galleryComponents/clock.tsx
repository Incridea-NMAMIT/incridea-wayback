import type * as THREE from "three";
import { useMutation } from "@apollo/client";
import { Canvas, useLoader } from "@react-three/fiber";
import {
  Bloom,
  BrightnessContrast,
  EffectComposer,
} from "@react-three/postprocessing";
import { useDrag } from "@use-gesture/react";
import gsap from "gsap";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";
import { DRACOLoader, type GLTF, GLTFLoader } from "three-stdlib";

import { angleToScenes } from "~/pages/gallery";

import { CONSTANT } from "~/constants";
import { AddXpDocument, GetUserXpDocument, Role } from "~/generated/generated";
import { AuthStatus, useAuth } from "~/hooks/useAuth";

type GLTFResult = GLTF & {
  nodes: {
    clock_face: THREE.Mesh;
    clock_hand: THREE.Mesh;
  };
  materials: {
    ["Material"]: THREE.MeshStandardMaterial;
    ["pointer_Mat.001"]: THREE.MeshStandardMaterial;
  };
};

const getSnapAngle = (angle: number): number => {
  const snapAngles = [0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2, 2 * Math.PI];
  const threshold = Math.PI / 4;

  let closestAngle = snapAngles[0];
  let minDiff = Math.abs(angle - (snapAngles[0] ?? 0));

  for (const snapAngle of snapAngles) {
    const diff = Math.abs(angle - snapAngle);
    if (diff < minDiff) {
      minDiff = diff;
      closestAngle = snapAngle;
    }
  }

  return minDiff <= threshold ? (closestAngle ?? angle) : angle;
};

const Model = ({ handRef }: { handRef: React.RefObject<THREE.Group> }) => {
  const gltf = useLoader(GLTFLoader, CONSTANT.ASSETS["3D"].CLOCK, (loader) => {
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath("https://www.gstatic.com/draco/v1/decoders/");
    loader.setDRACOLoader(dracoLoader);
  }) as GLTFResult;

  const { nodes, materials } = gltf;

  useEffect(() => {
    if (handRef.current) {
      handRef.current.rotation.y = Math.PI / 2;
    }
  }, [handRef]);

  return (
    <group
      dispose={null}
      rotation={[Math.PI / 2, 0, 0]}
      scale={[1.9, 1.9, 1.9]}
    >
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.clock_face.geometry}
        material={materials.Material}
        scale={[1.25, 0.067, 1.25]}
      >
        <group
          position={[0, 0.5, 0]}
          ref={handRef}
          rotation={[Math.PI, Math.PI, Math.PI]}
        >
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.clock_hand.geometry}
            material={materials["pointer_Mat.001"]}
            position={[0.005, 1.179, -0.14]}
            rotation={[Math.PI / 2, 0, 2.193]}
            scale={[0.013, 0.013, 0.2]}
          />
        </group>
      </mesh>
    </group>
  );
};

type ClockProps = {
  onClockClick?: (angle: number) => void;
  year: number;
  onRotationComplete?: (count: number) => void;
};

const Clock = ({ onClockClick, year, onRotationComplete }: ClockProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const handRef = useRef<THREE.Group>(null);
  const gsapContextRef = useRef<gsap.Context | null>(null);
  const previousAngleRef = useRef<number | null>(null);
  const cumulativeRotationRef = useRef<number>(0);
  const [rotationCount, setRotationCount] = useState<number>(0);
  const [calledXp, setCalledXp] = useState(false);
  const session = useAuth();

  const [addXp] = useMutation(AddXpDocument, {
    variables: {
      levelId: "3",
    },
    refetchQueries: [GetUserXpDocument],
    awaitRefetchQueries: true,
  });

  const handleAddXp = useCallback(async () => {
    if (calledXp) return;

    try {
      setCalledXp(true);
      const res = await addXp();

      if (res.data?.addXP.__typename === "MutationAddXPSuccess") {
        toast.success(
          `Congratulations!!! You have earned ${res.data?.addXP.data.level.point} timestones.`,
          {
            position: "top-center",
            style: {
              backgroundColor: "#00653d",
              color: "white",
            },
            duration: 5000,
          },
        );
      }
    } catch (error) {
      console.error("Error adding XP:", error);
    }
  }, [addXp, calledXp]);

  useEffect(() => {
    // Create GSAP context
    gsapContextRef.current = gsap.context(() => {
      console.log("Clock GSAP context created");
    }, containerRef);

    return () => {
      if (gsapContextRef.current) {
        gsapContextRef.current.revert();
      }
    };
  }, []);

  const updateRotationCount = (prevAngle: number, currentAngle: number) => {
    if (prevAngle === null) return;

    // Calculate the change in angle
    let deltaAngle = currentAngle - prevAngle;

    // Adjust for angle wrapping
    if (deltaAngle > Math.PI) {
      deltaAngle -= 2 * Math.PI;
    } else if (deltaAngle < -Math.PI) {
      deltaAngle += 2 * Math.PI;
    }

    // Update cumulative rotation (negative for anti-clockwise)
    cumulativeRotationRef.current += deltaAngle;

    // Calculate the number of full rotations (negative if anti-clockwise)
    const completeRotations = Math.floor(
      cumulativeRotationRef.current / (2 * Math.PI),
    );

    if (completeRotations !== rotationCount) {
      setRotationCount(completeRotations);
      if (onRotationComplete) {
        onRotationComplete(completeRotations);
      }
    }
  };

  const normalizeAngle = (angle: number) => {
    while (angle > Math.PI) angle -= 2 * Math.PI;
    while (angle < -Math.PI) angle += 2 * Math.PI;
    return angle;
  };

  const calculateShortestPath = useMemo(
    () => (current: number, target: number) => {
      const normalizedCurrent = normalizeAngle(current);
      const delta = normalizeAngle(target - normalizedCurrent);
      return normalizedCurrent + delta;
    },
    [],
  );

  useEffect(() => {
    const checkAndHandleEasterEgg = async () => {
      if (
        localStorage.getItem("galleryEasterEgg") === "true" &&
        session.status === AuthStatus.AUTHENTICATED &&
        session.user?.role !== Role.User
      ) {
        try {
          await handleAddXp();
          localStorage.removeItem("galleryEasterEgg");
        } catch (error) {
          console.error("Error handling easter egg:", error);
        }
      }
    };

    void checkAndHandleEasterEgg();
  }, [session.status, session.user?.role, handleAddXp]);

  useEffect(() => {
    const handleRotationReward = async () => {
      if (localStorage.getItem("galleryEasterEgg") === "true") return;

      if (rotationCount > 4 || rotationCount < -4) {
        if (
          session.status === AuthStatus.AUTHENTICATED &&
          session.user?.role !== Role.User
        ) {
          await handleAddXp();
        } else {
          toast.success(
            "You have come across some timestones. Register to redeem your time stones",
            {
              position: "top-center",
              style: {
                backgroundColor: "#00653d",
                color: "white",
              },
              duration: 5000,
            },
          );
          localStorage.setItem("galleryEasterEgg", "true");
        }
      }
    };

    void handleRotationReward();
  }, [rotationCount, session.status, session.user?.role, handleAddXp]);

  useEffect(() => {
    if (!handRef.current) return;

    const scene = Object.entries(angleToScenes).find(
      ([key]) => Number(key) === year,
    );

    const targetAngle = scene?.[1][0] ?? 0;

    const currentAngle = normalizeAngle(handRef.current.rotation.y);
    const shortestPathAngle = calculateShortestPath(currentAngle, targetAngle);

    gsap.fromTo(
      handRef.current.rotation,
      { y: currentAngle },
      {
        y: shortestPathAngle,
        duration: 1,
        ease: "power2.out",
        overwrite: true,
      },
    );
  }, [year, calculateShortestPath]);

  const getAngleFromCenter = (x: number, y: number) => {
    if (!containerRef.current) return 0;

    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Calculate angle from center
    let angle = Math.atan2(y - centerY, x - centerX);

    // Normalize angle to [0, 2π]
    if (angle < 0) angle += 2 * Math.PI;

    return angle;
  };

  const bind = useDrag(
    ({ active, xy: [x, y], first, last }) => {
      if (!handRef.current) return;

      const currentAngle = getAngleFromCenter(x, y);
      if (first) {
        previousAngleRef.current = currentAngle;
        return;
      }

      updateRotationCount(previousAngleRef.current ?? 0, currentAngle);
      previousAngleRef.current = currentAngle;

      // Direct rotation application
      if (handRef.current) {
        handRef.current.rotation.y = currentAngle - Math.PI / 2;
      }

      // if (active) {
      //   gsap.to(handRef.current.rotation, {
      //     y: currentAngle - Math.PI / 2,
      //     duration: 0,
      //     overwrite: true,
      //   });
      // }

      if (last) {
        const snappedAngle = getSnapAngle(currentAngle);
        gsap.to(handRef.current.rotation, {
          y: snappedAngle - Math.PI / 2,
          duration: 0.5,
          ease: "power2.out",
          overwrite: true,
          onComplete: () => {
            if (onClockClick) {
              onClockClick(snappedAngle - Math.PI / 2);
            }
          },
        });
      }
    },
    {
      pointer: { touch: true },
      preventDefault: true,
    },
  );

  return (
    <div
      ref={containerRef}
      className="z-10 aspect-square w-[200px] cursor-pointer touch-none overflow-hidden rounded-full sm:w-[230px]"
      {...bind()}
    >
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        {/* <ambientLight intensity={3} /> */}
        <directionalLight position={[0, 0, 1]} intensity={2.2} />
        <EffectComposer>
          <Bloom
            intensity={0.5}
            luminanceThreshold={0.9}
            luminanceSmoothing={0.025}
            height={500}
          />
          <BrightnessContrast contrast={0.5}></BrightnessContrast>
        </EffectComposer>
        <Model handRef={handRef} />
      </Canvas>
    </div>
  );
};

export default Clock;
