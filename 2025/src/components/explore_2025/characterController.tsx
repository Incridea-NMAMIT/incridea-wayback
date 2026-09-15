import { useMutation } from "@apollo/client";
import { useKeyboardControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { CapsuleCollider, RigidBody } from "@react-three/rapier";
import { type ComponentRef, useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";
import type * as THREE from "three";
import { MathUtils, Raycaster, Vector3 } from "three";
import { degToRad } from "three/src/math/MathUtils.js";
import { Character } from "~/components/explore_2025/Character";
import stonesData from "~/components/explore_2025/data/data.json";
import { useRouter } from "next/router";
import { UpdateStoneVisibilitiesDocument } from "~/generated/generated";
import { useAuth } from "~/hooks/useAuth";

const normalizeAngle = (angle: number) => {
  while (angle > Math.PI) angle -= 2 * Math.PI;
  while (angle < -Math.PI) angle += 2 * Math.PI;
  return angle;
};

const lerpAngle = (start: number, end: number, t: number) => {
  start = normalizeAngle(start);
  end = normalizeAngle(end);
  if (Math.abs(end - start) > Math.PI) {
    if (end > start) {
      start += 2 * Math.PI;
    } else {
      end += 2 * Math.PI;
    }
  }
  return normalizeAngle(start + (end - start) * t);
};

export type Stone = {
  id: number;
  pos: [number, number, number];
};

type Location = {
  id: number;
  pos: [number, number];
  href: string;
};

// Process stone and location data
export const stones: Stone[] = stonesData.stones.map((stone) => ({
  ...stone,
  pos: [stone.pos[0] ?? 0, stone.pos[1] ?? 0, stone.pos[2] ?? 0] as [
    number,
    number,
    number,
  ],
}));

const locations: Location[] = stonesData.locations.map((location) => ({
  ...location,
  pos: [location.pos[0] ?? 0, location.pos[1] ?? 0] as [number, number],
}));

export const playerPosition = new Vector3();

export const CharacterController = () => {
  // Detect device orientation
  const [isLandscape, setIsLandscape] = useState(
    window.innerWidth > window.innerHeight,
  );
  const router = useRouter();

  useEffect(() => {
    const handleResize = () => {
      setIsLandscape(window.innerWidth > window.innerHeight);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Set different speeds based on orientation
  const RUN_SPEED = isLandscape ? 1.8 : 2.6;
  const WALK_SPEED = isLandscape ? 0.5 : 0.8;
  const ROTATION_SPEED = degToRad(isLandscape ? 3 : 5);

  const [, get] = useKeyboardControls();
  const rb = useRef<ComponentRef<typeof RigidBody>>(null);
  const container = useRef<THREE.Group>(null);
  const character = useRef<THREE.Group | null>(null);
  const characterRotationTarget = useRef(0);
  const rotationTarget = useRef(0);
  const cameraTarget = useRef<THREE.Group | null>(null);
  const cameraPosition = useRef<THREE.Group | null>(null);
  const cameraWorldPosition = useRef(new Vector3());
  const cameraLookAtWorldPosition = useRef(new Vector3());
  const cameraLookAt = useRef(new Vector3());
  const raycaster = useRef(new Raycaster());
  const cameraDirection = useRef(new Vector3());
  const [animation, setAnimation] = useState("idle");
  const [spacebarPressed, setSpacebarPressed] = useState(false);
  const [spacebarDisabled, setSpacebarDisabled] = useState(false);
  const [visibility, setVisibility] = useState<boolean[]>([]);
  const prevVisibility = useRef<boolean[]>([]);
  const { user } = useAuth();
  const [setStoneVisiblity] = useMutation(UpdateStoneVisibilitiesDocument);

  const handleJump = () => {
    const keyDownEvent = new KeyboardEvent("keydown", {
      key: "Space",
      code: "Space",
      bubbles: true,
    });
    document.dispatchEvent(keyDownEvent);

    setTimeout(() => {
      const keyUpEvent = new KeyboardEvent("keyup", {
        key: "Space",
        code: "Space",
        bubbles: true,
      });
      document.dispatchEvent(keyUpEvent);
    }, 100);
  };

  useEffect(() => {
    const onMouseDown = (event: MouseEvent | TouchEvent) => {
      const target = (event.target as HTMLElement).closest("[id]");
      if (!target) return;

      if (target.id === "jump" || target.id === "shift") return;

      if (target.id === "w") {
        get().forward = true;
      }
      if (target.id === "s") {
        get().backward = true;
      }
      if (target.id === "a") {
        get().left = true;
      }
      if (target.id === "d") {
        get().right = true;
      }
    };

    const onMouseUp = (event: MouseEvent | TouchEvent) => {
      const target = (event.target as HTMLElement).closest("[id]");
      if (!target) return;

      if (target.id === "jump") {
        handleJump();
        return;
      }
      if (target.id === "shift") return;

      if (target.id === "w") {
        get().forward = false;
      }
      if (target.id === "s") {
        get().backward = false;
      }
      if (target.id === "a") {
        get().left = false;
      }
      if (target.id === "d") {
        get().right = false;
      }
    };

    const onRunClick = (event: MouseEvent | TouchEvent) => {
      const target = (event.target as HTMLElement).closest("[id]");
      if (!target) return;
      if (target.id === "shift") {
        get().run = !get().run;
      }
    };

    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("mouseup", onMouseUp);
    document.addEventListener("touchstart", onMouseDown);
    document.addEventListener("touchend", onMouseUp);
    document.addEventListener("click", onRunClick);

    return () => {
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("touchstart", onMouseDown);
      document.removeEventListener("touchend", onMouseUp);
      document.removeEventListener("click", onRunClick);
    };
  }, [get]);

  // Update the stone visibilities on change
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleSetTimeStone = async (visibilityString: string) => {
    try {
      await setStoneVisiblity({
        variables: { stoneId: visibilityString },
      });
    } catch (error) {
      console.error("Error updating stone visibilities:", error);
    }
  };

  // TimeStones: update the visibility (and trigger the mutation if changed)
  useEffect(() => {
    const updateVisibility = () => {
      const storedVisibility = localStorage.getItem("stoneVisibility");
      if (storedVisibility) {
        const parsedVisibility = JSON.parse(storedVisibility) as boolean[];
        const visibilityString = parsedVisibility
          .map((v) => (v ? "1" : "0"))
          .join("");
        const prevVisibilityString = prevVisibility.current
          .map((v) => (v ? "1" : "0"))
          .join("");

        if (visibilityString !== prevVisibilityString) {
          if (user) {
            void handleSetTimeStone(visibilityString);
          }
        }
        setVisibility(parsedVisibility);
        prevVisibility.current = parsedVisibility; // Update previous state
      } else {
        const initialVisibility = stones.map(() => true);
        setVisibility(initialVisibility);
        localStorage.setItem(
          "stoneVisibility",
          JSON.stringify(initialVisibility),
        );
        prevVisibility.current = initialVisibility; // Store initial value
      }
    };

    // Run once immediately...
    void updateVisibility();

    const interval = setInterval(() => {
      void updateVisibility;
    }, 2000);
    return () => clearInterval(interval);
  }, [handleSetTimeStone]);

  const stoneModels = useMemo(() => {
    return stones.map((stone, index) => {
      if (!visibility[index]) return null;
      return <mesh key={stone.id} position={stone.pos}></mesh>;
    });
  }, [visibility]);

  const countdowns = useRef(
    new Map<number, { timer: NodeJS.Timeout; count: number }>(),
  );
  const redirectedLocations = useRef(new Set<number>());

  useFrame(({ camera, scene }) => {
    if (rb.current) {
      const vel = rb.current.linvel() as { x: number; y: number; z: number };
      const pos = rb.current.translation() as {
        x: number;
        y: number;
        z: number;
      };

      // Update player position
      playerPosition.set(pos.x, pos.y, pos.z);
      if (pos.y < -9) {
        playerPosition.set(0, 0, 0);
        rb.current.setTranslation({ x: 0, y: 0, z: 0 }, true);
        toast.error("You fell off the map! Respawning...");
      }

      const movement = { x: 0, z: 0 };

      if (get().forward) movement.z = 1;
      if (get().backward) movement.z = -1;
      const speed = get().run ? RUN_SPEED : WALK_SPEED;

      if (get().left) movement.x = 1;
      if (get().right) movement.x = -1;

      if (movement.x !== 0) {
        rotationTarget.current += ROTATION_SPEED * movement.x;
      }

      if (movement.x !== 0 || movement.z !== 0) {
        characterRotationTarget.current = Math.atan2(movement.x, movement.z);
        vel.x =
          Math.sin(rotationTarget.current + characterRotationTarget.current) *
          speed;
        vel.z =
          Math.cos(rotationTarget.current + characterRotationTarget.current) *
          speed;
        setAnimation(speed === RUN_SPEED ? "run" : "walk");
      } else {
        setAnimation("idle");
      }

      if (character.current) {
        character.current.rotation.y = lerpAngle(
          character.current.rotation.y,
          characterRotationTarget.current,
          0.1,
        );
      }

      // Handle jumping
      if (get().jump && !spacebarDisabled) {
        setSpacebarPressed(true);
        setTimeout(() => {
          setSpacebarPressed(false);
          setSpacebarDisabled(true);
          setTimeout(() => {
            setSpacebarDisabled(false);
          }, 500);
        }, 1000);
      }

      if (spacebarPressed) {
        vel.y = 1;
        if (get().forward) {
          vel.x +=
            Math.sin(rotationTarget.current + characterRotationTarget.current) *
            0.1;
          vel.z +=
            Math.cos(rotationTarget.current + characterRotationTarget.current) *
            0.1;
        }
        setAnimation("jump");
      }

      rb.current.setLinvel(vel, true);

      // Check if the player is close to any stone
      stones.forEach((stone, index) => {
        const distance = Math.sqrt(
          (pos.x - stone.pos[0]) ** 2 +
          (pos.y - stone.pos[1]) ** 2 +
          (pos.z - stone.pos[2]) ** 2,
        );
        if (distance <= 0.5 && visibility[index]) {
          const newVisibility = [...visibility];
          newVisibility[index] = false;
          setVisibility(newVisibility);
          localStorage.setItem(
            "stoneVisibility",
            JSON.stringify(newVisibility),
          );
          toast.success("Shh 🤫");
        }
      });

      // Location redirection logic
      locations.forEach((location) => {
        const distance = Math.sqrt(
          (pos.x - (location.pos?.[0] ?? 0)) ** 2 +
          (pos.z - (location.pos?.[1] ?? 0)) ** 2,
        );

        if (redirectedLocations.current.has(location.id)) {
          if (distance > 0.5) {
            redirectedLocations.current.delete(location.id);
          }
          return;
        }

        if (distance <= 0.5) {
          if (!countdowns.current.has(location.id)) {
            let count = 5;
            const timer = setInterval(() => {
              const currentDistance = Math.sqrt(
                (pos.x - (location.pos?.[0] ?? 0)) ** 2 +
                (pos.z - (location.pos?.[1] ?? 0)) ** 2,
              );

              // If the user has moved out of range, cancel the countdown.
              if (currentDistance > 0.5) {
                clearInterval(timer);
                countdowns.current.delete(location.id);
                return;
              }

              count -= 1;
              if (count <= 0) {
                redirectedLocations.current.add(location.id);
                clearInterval(timer);
                countdowns.current.delete(location.id);
                if (location.id != 4) {
                  window.open(location.href, "_blank");
                } else {
                  void router.push(location.href);
                }
              } else {
                toast(
                  (t) => (
                    <span>
                      {location.id == 1
                        ? `Opening RuleBook in ${count}`
                        : location.id == 4
                          ? `Exiting level in ${count}`
                          : ""}
                      <button
                        onClick={() => {
                          redirectedLocations.current.add(location.id);
                          clearInterval(timer);
                          countdowns.current.delete(location.id);
                          toast.dismiss(t.id);
                        }}
                        style={{ marginLeft: "10px", color: "blue" }}
                      >
                        Cancel
                      </button>
                    </span>
                  ),
                  { id: location.id.toString() },
                );
              }
            }, 1000);
            countdowns.current.set(location.id, { timer, count });
            toast("", { id: location.id.toString() });
          }
        } else {
          if (countdowns.current.has(location.id)) {
            clearInterval(countdowns.current.get(location.id)!.timer);
            countdowns.current.delete(location.id);
          }
        }
      });
    }

    // CAMERA COLLISION DETECTION
    if (cameraPosition.current && cameraTarget.current) {
      cameraPosition.current.getWorldPosition(cameraWorldPosition.current);
      cameraTarget.current.getWorldPosition(cameraLookAtWorldPosition.current);

      cameraDirection.current
        .subVectors(
          cameraWorldPosition.current,
          cameraLookAtWorldPosition.current,
        )
        .normalize();
      raycaster.current.set(
        cameraLookAtWorldPosition.current,
        cameraDirection.current,
      );

      const intersects = raycaster.current.intersectObjects(
        scene.children,
        true,
      );

      if (
        intersects.length > 0 &&
        intersects[0] &&
        intersects[0].distance <
        cameraWorldPosition.current.distanceTo(
          cameraLookAtWorldPosition.current,
        )
      ) {
        if (intersects[0]) {
          const newCameraPos = cameraLookAtWorldPosition.current
            .clone()
            .add(
              cameraDirection.current.multiplyScalar(
                intersects[0].distance - 0.1,
              ),
            );
          camera.position.lerp(newCameraPos, 0);
        } else {
          camera.position.lerp(cameraWorldPosition.current, 0.1);
        }
      } else {
        camera.position.lerp(cameraWorldPosition.current, 0.1);
      }

      cameraLookAt.current.lerp(cameraLookAtWorldPosition.current, 1);
      camera.lookAt(cameraLookAt.current);
    }

    if (container.current) {
      container.current.rotation.y = MathUtils.lerp(
        container.current.rotation.y,
        rotationTarget.current,
        0.1,
      );
    }
  });

  return (
    <RigidBody
      colliders={false}
      lockRotations
      ref={rb}
      position={[0.4, 8, -3]}
    >
      <group ref={container}>
        <group ref={cameraTarget} position-z={1} />
        <group ref={cameraPosition} position-y={0.5} position-z={-1.5} />
        <group ref={character}>
          <Character scale={0.18} position-y={-0.25} animation={animation} />
        </group>
        {stoneModels}
      </group>
      <CapsuleCollider args={[0.08, 0.16]} />
    </RigidBody>
  );
};
