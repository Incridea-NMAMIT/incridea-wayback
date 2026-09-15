/* eslint-disable */
import * as THREE from "three";
import {
  Environment,
  Lightformer,
  PerspectiveCamera,
  RenderTexture,
  useGLTF,
  useTexture,
} from "@react-three/drei";
import {
  Canvas,
  extend,
  MaterialNode,
  type Object3DNode,
  type ObjectMap,
  useFrame,
  useThree,
} from "@react-three/fiber";
import {
  BallCollider,
  CuboidCollider,
  Physics,
  type RapierRigidBody,
  RigidBody,
  useRopeJoint,
  useSphericalJoint,
} from "@react-three/rapier";
import { Container, Root, Text, Image as ThreeImage } from "@react-three/uikit";
import { damp } from "maath/easing";
import { MeshLineGeometry, MeshLineMaterial } from "meshline";
import { useEffect, useRef, useState } from "react";
import { type GLTF } from "three-stdlib";

import { CONSTANT } from "~/constants";
import { useAuth } from "~/hooks/useAuth";
import { idToPid } from "~/utils/id";
import qrcodeDataURI from "~/utils/qr";

type BadgeGLTF = GLTF &
  ObjectMap & {
    nodes: {
      clip: THREE.Mesh;
      clamp: THREE.Mesh;
      card: THREE.Mesh;
    };
  };

function truncateText(text: string, maxChar = 20) {
  text = text.trim();
  if (text.length > maxChar) {
    return text.slice(0, maxChar) + "...";
  }
  return text;
}

function ProfileCard({
  user,
  showQR,
}: {
  user: NonNullable<ReturnType<typeof useAuth>["user"]>;
  showQR: boolean;
}) {
  const handlePointerDown = () => {
    document.body.style.overflow = "hidden"; // Prevent scrolling
  };

  const handlePointerUp = () => {
    document.body.style.overflow = ""; // Restore scrolling
  };

  return (
    <Canvas
      camera={{ position: [0, 0, 13], fov: 25 }}
      style={{
        // backgroundImage: "url('/assets/png/id_bg.jpg')",
        touchAction: "none",
      }}
      className="border-1 border-secondary-500/50 bg-gradient-to-br from-primary-900/80 via-primary-700/80 to-primary-900/80 bg-cover bg-top backdrop-blur-sm"
      onTouchStartCapture={handlePointerDown}
      onTouchEndCapture={handlePointerUp}
    >
      <Intermediate user={user} showQR={showQR} />
    </Canvas>
  );
}

function Intermediate({
  user,
  showQR,
}: {
  user: NonNullable<ReturnType<typeof useAuth>["user"]>;
  showQR: boolean;
}) {
  return (
    <>
      <ambientLight intensity={Math.PI * 2} />
      <Physics interpolate gravity={[0, -40, 0]} timeStep={1 / 60}>
        <Band showQR={showQR} user={user} />
        <Environment>
          <Lightformer
            intensity={2}
            color="gold"
            position={[0, -1, 5]}
            rotation={[0, 0, Math.PI / 3]}
            scale={[100, 0.1, 1]}
          />
          {/* <Lightformer
            intensity={3}
            color="gold"
            position={[-1, -1, 1]}
            rotation={[0, 0, Math.PI / 3]}
            scale={[100, 0.1, 1]}
          /> */}
          <Lightformer
            intensity={3}
            color="gold"
            position={[1, 1, 1]}
            rotation={[0, 0, Math.PI / 3]}
            scale={[100, 0.1, 1]}
          />
          {/* <Lightformer
            intensity={10}
            color="gold"
            position={[-10, 0, 14]}
            rotation={[0, Math.PI / 2, Math.PI / 3]}
            scale={[100, 10, 1]}
          /> */}
        </Environment>
      </Physics>
    </>
  );
}

function Band({
  user,
  maxSpeed = 50,
  minSpeed = 10,
  showQR = false,
}: {
  user: NonNullable<ReturnType<typeof useAuth>["user"]>;
  maxSpeed?: number;
  minSpeed?: number;
  showQR?: boolean;
}) {
  const band = useRef<THREE.Mesh>(null), fixed = useRef<RapierRigidBody>(null), j1 = useRef<RapierRigidBody>(null), j2 = useRef<RapierRigidBody>(null), j3 = useRef<RapierRigidBody>(null), card = useRef<RapierRigidBody>(null) // prettier-ignore
  const vec = new THREE.Vector3(), ang = new THREE.Vector3(), rot = new THREE.Vector3(), dir = new THREE.Vector3() // prettier-ignore
  const segmentProps = {
    type: "dynamic",
    canSleep: true,
    colliders: false,
    angularDamping: 2,
    linearDamping: 2,
  };
  const { nodes, materials } = useGLTF(
    CONSTANT.ASSETS["3D"].PROFILETAG,
  ) as BadgeGLTF;
  const texture = useTexture(CONSTANT.ASSETS.PUBLIC.TAG_LOGO);
  const { width, height } = useThree((state) => state.size);
  const [curve] = useState(
    () =>
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(),
        new THREE.Vector3(),
        new THREE.Vector3(),
        new THREE.Vector3(),
      ]),
  );
  const [dragged, drag] = useState<THREE.Vector3 | false>(false);
  const [hovered, hover] = useState(false);

  useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], 1]) // prettier-ignore
  useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], 1]) // prettier-ignore
  useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], 1]) // prettier-ignore
  useSphericalJoint(j3, card, [[0, 0, 0], [0, 2.4, 0]]) // prettier-ignore

  useEffect(() => {
    if (hovered) {
      document.body.style.cursor = dragged ? "grabbing" : "grab";
      return () => void (document.body.style.cursor = "auto");
    }
  }, [hovered, dragged]);

  const cardRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (cardRef.current) {
      damp(cardRef.current.rotation, "y", showQR ? Math.PI : 0, 0.25, delta);
    }

    if (dragged) {
      vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera);
      dir.copy(vec).sub(state.camera.position).normalize();
      vec.add(dir.multiplyScalar(state.camera.position.length()));
      [card, j1, j2, j3, fixed].forEach((ref) => ref.current?.wakeUp());
      card.current?.setNextKinematicTranslation({
        x: vec.x - dragged.x,
        y: vec.y - dragged.y,
        z: vec.z - dragged.z,
      });
    }
    if (fixed.current) {
      // Fix most of the jitter when over pulling the card
      [j1, j2].forEach((ref) => {
        if (!ref.current) return;
        //@ts-expect-error  it exits ts is just mad
        ref.current.lerped = new THREE.Vector3().copy(
          ref.current.translation(),
        );
        const clampedDistance = Math.max(
          0.1,
          //@ts-expect-error  it exits ts is just mad
          Math.min(1, ref.current.lerped.distanceTo(ref.current.translation())),
        );
        //@ts-expect-error  it exits ts is just mad
        ref.current.lerped.lerp(
          ref.current.translation(),
          delta * (minSpeed + clampedDistance * (maxSpeed - minSpeed)),
        );
      });
      // Calculate catmul curve
      curve.points[0]?.copy(j3.current!.translation());
      //@ts-expect-error  it exits ts is just mad
      curve.points[1]?.copy(j2.current!.lerped);
      //@ts-expect-error  it exits ts is just mad
      curve.points[2]?.copy(j1.current!.lerped);
      curve.points[3]?.copy(fixed.current.translation());
      //@ts-expect-error
      band.current!.geometry.setPoints(curve.getPoints(32));
      // Tilt it back towards the screen
      if (card.current) {
        ang.copy(card.current.angvel());
        rot.copy(card.current.rotation());
        card.current.setAngvel(
          { x: ang.x, y: ang.y - rot.y * 0.25, z: ang.z },
          false,
        );
      }
    }
  });

  curve.curveType = "chordal";
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

  const cardMaterial = useRef<THREE.MeshPhysicalMaterial>(null);

  // form some unknown reason flipy isnt working so we have to manually flip the uv
  useEffect(() => {
    if (cardMaterial.current) {
      cardMaterial.current.onBeforeCompile = (shader) => {
        shader.fragmentShader = shader.fragmentShader.replace(
          "#include <map_fragment>",
          `
                    // Flip the UV along the Y-axis
                    vec2 flippedUv = vec2(vMapUv.x, 1.0 - vMapUv.y);
                    vec4 texelColor = texture2D(map, flippedUv);
                    diffuseColor *= texelColor;
                    `,
        );
      };
    }
  }, []);

  return (
    <>
      <group position={[0, 4, 0]}>
        <RigidBody
          position={[0, 0.5, 0]}
          ref={fixed}
          {...segmentProps}
          type="fixed"
          colliders={undefined}
        />
        <RigidBody
          position={[0.5, 0, 0]}
          ref={j1}
          {...segmentProps}
          colliders={undefined}
          type={undefined}
        >
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody
          position={[1, 0, 0]}
          ref={j2}
          {...segmentProps}
          colliders={undefined}
          type={undefined}
        >
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody
          position={[1.5, 0, 0]}
          ref={j3}
          {...segmentProps}
          colliders={undefined}
          type={undefined}
        >
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody
          position={[2, 0, 0]}
          ref={card}
          {...segmentProps}
          type={dragged ? "kinematicPosition" : "dynamic"}
          colliders={undefined}
        >
          <CuboidCollider args={[0.8, 1.125, 0.01]} />
          <group
            scale={3.5}
            position={[0, -1.75, -0.05]}
            onPointerOver={() => hover(true)}
            onPointerOut={() => hover(false)}
            onPointerUp={(e) => {
              //@ts-expect-error  it exits ts is just mad
              e.target?.releasePointerCapture(e.pointerId);
              drag(false);
            }}
            onPointerDown={(e) => {
              //@ts-expect-error  it exits ts is just mad
              e.target?.setPointerCapture(e.pointerId),
                drag(
                  new THREE.Vector3()
                    .copy(e.point)
                    .sub(vec.copy(card.current!.translation())),
                );
            }}
          >
            <mesh
              geometry={nodes.card?.geometry}
              rotation={[0, 0, 0]}
              ref={cardRef}
            >
              <meshPhysicalMaterial
                clearcoat={1}
                clearcoatRoughness={0.15}
                roughness={0.3}
                metalness={0.5}
                ref={cardMaterial}
              >
                <RenderTexture
                  attach="map"
                  anisotropy={16}
                  width={1024}
                  height={1024}
                  flipY={false}
                >
                  <PerspectiveCamera
                    makeDefault
                    manual
                    aspect={1 / 1}
                    position={[0, 0, 5]}
                  />
                  <Root
                    sizeX={10}
                    sizeY={10}
                    width={465}
                    height={465}
                    flexDirection="row"
                    backgroundColor="#1b1b1c"
                  >
                    <Container
                      backgroundColor="#1b1b1c"
                      width={470}
                      alignItems="center"
                      justifyContent="space-evenly"
                      flexDirection={"column"}
                    >
                      <Container
                        backgroundColor="#1b1b1c"
                        width={"100%"}
                        height="53%"
                        alignItems="flex-end"
                        justifyContent="center"
                      >
                        <ThreeImage
                          src={
                            user.profileImage ?? CONSTANT.ASSETS.PUBLIC.RYOKO
                          }
                          width={130}
                          aspectRatio={0.7}
                          borderRadius={6}
                          objectFit={"cover"}
                          borderColor={"white"}
                          borderWidth={4}
                        />
                      </Container>
                      <Container
                        alignItems="center"
                        justifyContent="center"
                        gap={24}
                        flexDirection={"column"}
                        width={"100%"}
                        flexGrow={1}
                      >
                        <Text
                          fontSize={26}
                          fontWeight="bold"
                          transformScaleY={1.4}
                          color="white"
                          textAlign={"center"}
                          overflow={"hidden"}
                          marginLeft={5}
                          marginRight={5}
                        >
                          {truncateText(user.name, 20)}
                        </Text>
                        <Text
                          overflow={"hidden"}
                          fontSize={18}
                          color="white"
                          transformScaleY={1.4}
                          textAlign={"center"}
                          marginLeft={5}
                          marginRight={5}
                        >
                          {truncateText(user.college?.name ?? "", 40)}
                        </Text>

                        <Text
                          overflow={"hidden"}
                          fontSize={16}
                          color="white"
                          transformScaleY={1.4}
                          textAlign={"center"}
                          marginLeft={5}
                          marginRight={5}
                        >
                          {user.phoneNumber ?? ""}
                        </Text>
                      </Container>
                    </Container>
                    <Container
                      width={470}
                      // backgroundColor="#038f57"
                      backgroundColor="#1b1b1c"
                      alignItems="center"
                      justifyContent="center"
                      flexDirection="column"
                      gap={24}
                    >
                      <ThreeImage
                        src={qrcodeDataURI({
                          value: idToPid(user.id),
                          bgColor: "transparent",
                          fgColor: "white",
                        })}
                        width={180}
                        aspectRatio={0.7}
                      />

                      <Text
                        fontSize={28}
                        fontWeight="bold"
                        transformScaleY={1.4}
                        color="white"
                      >
                        {idToPid(user.id)}
                      </Text>
                    </Container>
                  </Root>
                </RenderTexture>
              </meshPhysicalMaterial>
            </mesh>
            <mesh
              geometry={nodes.clip?.geometry}
              material={materials.metal}
              material-roughness={0.3}
            />
            <mesh geometry={nodes.clamp?.geometry} material={materials.metal} />
          </group>
        </RigidBody>
      </group>
      <mesh ref={band}>
        <meshLineGeometry />
        <meshLineMaterial
          color="white"
          depthTest={false}
          resolution={new THREE.Vector2(width, height)}
          useMap={1}
          map={texture}
          repeat={new THREE.Vector2(-2, 1)}
          lineWidth={1.3}
        />
      </mesh>
    </>
  );
}

useGLTF.preload(CONSTANT.ASSETS["3D"].PROFILETAG);
extend({ MeshLineGeometry, MeshLineMaterial });

declare module "@react-three/fiber" {
  interface ThreeElements {
    meshLineGeometry: Object3DNode<MeshLineGeometry, typeof MeshLineGeometry>;
    meshLineMaterial: MaterialNode<MeshLineMaterial, typeof MeshLineMaterial>;
  }
}

export default ProfileCard;
