/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import React from "react";
import * as THREE from "three";
import { Box, useGLTF } from "@react-three/drei";
import {
  Euler,
  ExtendedColors,
  Layers,
  Matrix4,
  NodeProps,
  NonFunctionKeys,
  Overwrite,
  Quaternion,
  Vector3,
} from "@react-three/fiber";

import { EventHandlers } from "@react-three/fiber/dist/declarations/src/core/events";
import Screen from "~/components/pronite/screen";
import { CONSTANT } from "~/constants";

export default function Stage({
  src,
  ...props
}: {
  src: string;
} & React.JSX.IntrinsicAttributes &
  Omit<
    ExtendedColors<
      Overwrite<
        Partial<THREE.Group<THREE.Object3DEventMap>>,
        NodeProps<THREE.Group<THREE.Object3DEventMap>, typeof THREE.Group>
      >
    >,
    NonFunctionKeys<{
      position?: Vector3;
      up?: Vector3;
      scale?: Vector3;
      rotation?: Euler;
      matrix?: Matrix4;
      quaternion?: Quaternion;
      layers?: Layers;
      dispose?: (() => void) | null;
    }>
  > & {
    position?: Vector3;
    up?: Vector3;
    scale?: Vector3;
    rotation?: Euler;
    matrix?: Matrix4;
    quaternion?: Quaternion;
    layers?: Layers;
    dispose?: (() => void) | null;
  } & EventHandlers) {
  const { nodes, materials } = useGLTF(CONSTANT.ASSETS["3D"].STAGE);

  return (
    <group {...props} dispose={null}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Arc001.geometry}
        material={materials.wire_153228184}
        position={[-0.571, -5.12, -25.823]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={0.113}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Arc003.geometry}
        material={materials.wire_153228184}
        position={[-0.571, -5.12, -25.823]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={0.113}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Arc004.geometry}
        material={materials.wire_153228184}
        position={[-0.571, -5.12, -25.823]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={0.113}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Arc005.geometry}
        material={materials.wire_153228184}
        position={[-0.571, -5.12, -25.823]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={0.113}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Arc006.geometry}
        material={materials.wire_153228184}
        position={[-0.571, -5.12, -25.823]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={0.113}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Arc007.geometry}
        material={materials.wire_153228184}
        position={[-0.571, -5.12, -25.823]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={0.113}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Arc008.geometry}
        material={materials.wire_153228184}
        position={[-0.571, -5.12, -25.823]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={0.113}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Arc009.geometry}
        material={materials.wire_153228184}
        position={[-0.571, -5.12, -25.823]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={0.113}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Arc010.geometry}
        material={materials.wire_153228184}
        position={[-0.571, -5.12, -25.823]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={0.113}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Arc011.geometry}
        material={materials.wire_153228184}
        position={[-0.571, -5.12, -25.823]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={0.113}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Arc012.geometry}
        material={materials.wire_153228184}
        position={[-0.571, -5.12, -25.823]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={0.113}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Arc013.geometry}
        material={materials.wire_153228184}
        position={[-0.571, -5.12, -25.823]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={0.113}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Arc014.geometry}
        material={materials.wire_153228184}
        position={[-0.571, -5.12, -25.823]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={0.113}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Arc022.geometry}
        material={materials.wire_153228184}
        position={[-0.571, -5.12, -25.823]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={0.113}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Arc023.geometry}
        material={materials.wire_153228184}
        position={[-0.571, -5.12, -25.823]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={0.113}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Arc024.geometry}
        material={materials.wire_153228184}
        position={[-0.571, -5.12, -25.823]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={0.113}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Arc025.geometry}
        material={materials.wire_153228184}
        position={[-0.571, -5.12, -25.823]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={0.113}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Arc026.geometry}
        material={materials.wire_153228184}
        position={[-0.571, -5.12, -25.823]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={0.113}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Arc027.geometry}
        material={materials.wire_153228184}
        position={[-0.571, -5.12, -25.823]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={0.113}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Arc028.geometry}
        material={materials.wire_153228184}
        position={[-0.571, -5.12, -25.823]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={0.113}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Arc029.geometry}
        material={materials.wire_153228184}
        position={[-0.571, -5.12, -25.823]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={0.113}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Arc052.geometry}
        material={materials.wire_153228184}
        position={[-0.571, -5.12, -25.823]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={0.113}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Arc053.geometry}
        material={materials.wire_153228184}
        position={[-0.571, -5.12, -25.823]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={0.113}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Arc054.geometry}
        material={materials.wire_153228184}
        position={[-0.571, -5.12, -25.823]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={0.113}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Arc055.geometry}
        material={materials.wire_153228184}
        position={[-0.571, -5.12, -25.823]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={0.113}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Arc056.geometry}
        material={materials.wire_153228184}
        position={[-0.571, -5.12, -25.823]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={0.113}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Arc057.geometry}
        material={materials.wire_153228184}
        position={[-0.571, -5.12, -25.823]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={0.113}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Arc058.geometry}
        material={materials.wire_153228184}
        position={[-0.571, -5.12, -25.823]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={0.113}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Arc059.geometry}
        material={materials.wire_153228184}
        position={[-0.571, -5.12, -25.823]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={0.113}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Arc060.geometry}
        material={materials.wire_153228184}
        position={[-0.571, -5.12, -25.823]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={0.113}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Arc061.geometry}
        material={materials.wire_153228184}
        position={[-0.571, -5.12, -25.823]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={0.113}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Arc062.geometry}
        material={materials.wire_153228184}
        position={[-0.571, -5.12, -25.823]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={0.113}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Arc063.geometry}
        material={materials.wire_153228184}
        position={[-0.571, -5.12, -25.823]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={0.113}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Arc064.geometry}
        material={materials.wire_153228184}
        position={[-0.571, -5.12, -25.823]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={0.113}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Arc065.geometry}
        material={materials.wire_153228184}
        position={[-0.571, -5.12, -25.823]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={0.113}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Arc066.geometry}
        material={materials.wire_153228184}
        position={[-0.571, -5.12, -25.823]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={0.113}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Arc067.geometry}
        material={materials.wire_153228184}
        position={[-0.571, -5.12, -25.823]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={0.113}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Arc068.geometry}
        material={materials.wire_153228184}
        position={[-0.571, -5.12, -25.823]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={0.113}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Arc069.geometry}
        material={materials.wire_153228184}
        position={[-0.571, -5.12, -25.823]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={0.113}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Arc070.geometry}
        material={materials.wire_153228184}
        position={[-0.571, -5.12, -25.823]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={0.113}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Arc071.geometry}
        material={materials.wire_153228184}
        position={[-0.571, -5.12, -25.823]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={0.113}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Arc072.geometry}
        material={materials.wire_153228184}
        position={[-0.571, -5.12, -25.823]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={0.113}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cylinder409.geometry}
        material={materials.wire_154215229}
        position={[-0.571, -5.12, -25.823]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={0.113}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cylinder410.geometry}
        material={materials.wire_154215229}
        position={[-0.571, -5.12, -25.823]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={0.113}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cylinder411.geometry}
        material={materials.wire_154215229}
        position={[-0.571, -5.12, -25.823]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={0.113}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cylinder412.geometry}
        material={materials.wire_154215229}
        position={[-0.571, -5.12, -25.823]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={0.113}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cylinder413.geometry}
        material={materials.wire_154215229}
        position={[-0.571, -5.12, -25.823]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={0.113}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cylinder414.geometry}
        material={materials.wire_154215229}
        position={[-0.571, -5.12, -25.823]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={0.113}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cylinder422.geometry}
        material={materials.wire_154215229}
        position={[-0.571, -5.12, -25.823]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={0.113}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cylinder423.geometry}
        material={materials.wire_154215229}
        position={[-0.571, -5.12, -25.823]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={0.113}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cylinder424.geometry}
        material={materials.wire_154215229}
        position={[-0.571, -5.12, -25.823]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={0.113}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cylinder425.geometry}
        material={materials.wire_154215229}
        position={[-0.571, -5.12, -25.823]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={0.113}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cylinder426.geometry}
        material={materials.wire_154215229}
        position={[-0.571, -5.12, -25.823]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={0.113}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cylinder427.geometry}
        material={materials.wire_154215229}
        position={[-0.571, -5.12, -25.823]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={0.113}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cylinder428.geometry}
        material={materials.wire_154215229}
        position={[-0.571, -5.12, -25.823]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={0.113}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Mesh002.geometry}
        position={[-0.571, 21.12, -25.823]}
        rotation={[Math.PI / 2, Math.PI, 0]}
        scale={0.113}
      >
        <Screen src={src} />
      </mesh>
      <Box
        scale={[80, 40, 1]}
        material={materials.wire_177088027}
        position={[0, 0, -23]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Rectanwgle027.geometry}
        material={materials.wire_177088027}
        position={[-0.571, -5.12, -50.703]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={[0.233, 0.403, 0.167]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Shape021.geometry}
        material={materials.wire_135110008}
        position={[-0.571, -5.12, -25.823]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={0.113}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Shape022.geometry}
        material={materials.wire_135110008}
        position={[-0.571, -5.12, -25.823]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={0.113}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.truss01.geometry}
        material={materials.Metal_Chrome}
        position={[-0.571, -5.12, -25.823]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={0.113}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Tube144.geometry}
        material={materials["14___Default"]}
        position={[-0.571, -5.12, -25.823]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={0.113}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Tube145.geometry}
        material={materials["14___Default"]}
        position={[-0.571, -5.12, -25.823]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={0.113}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Tube146.geometry}
        material={materials["14___Default"]}
        position={[-0.571, -5.12, -25.823]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={0.113}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Tube147.geometry}
        material={materials["14___Default"]}
        position={[-0.571, -5.12, -25.823]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={0.113}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Tube148.geometry}
        material={materials["14___Default"]}
        position={[-0.571, -5.12, -25.823]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={0.113}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Tube149.geometry}
        material={materials["14___Default"]}
        position={[-0.571, -5.12, -25.823]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={0.113}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Tube157.geometry}
        material={materials["14___Default"]}
        position={[-0.571, -5.12, -25.823]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={0.113}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Tube158.geometry}
        material={materials["14___Default"]}
        position={[-0.571, -5.12, -25.823]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={0.113}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Tube159.geometry}
        material={materials["14___Default"]}
        position={[-0.571, -5.12, -25.823]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={0.113}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Tube160.geometry}
        material={materials["14___Default"]}
        position={[-0.571, -5.12, -25.823]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={0.113}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Tube161.geometry}
        material={materials["14___Default"]}
        position={[-0.571, -5.12, -25.823]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={0.113}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Tube162.geometry}
        material={materials["14___Default"]}
        position={[-0.571, -5.12, -25.823]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={0.113}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Tube163.geometry}
        material={materials["14___Default"]}
        position={[-0.571, -5.12, -25.823]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={0.113}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube006_Cube017.geometry}
        material={materials["Material.001"]}
        position={[-3.669, -5.752, -2.65]}
        rotation={[Math.PI / 2, 0, Math.PI]}
        scale={2.423}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube007_Cube018.geometry}
        material={materials["Material.001"]}
        position={[-3.669, -5.752, -2.65]}
        rotation={[Math.PI / 2, 0, Math.PI]}
        scale={2.423}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube008_Cube019.geometry}
        material={materials["Material.001"]}
        position={[-3.669, -5.752, -2.65]}
        rotation={[Math.PI / 2, 0, Math.PI]}
        scale={2.423}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube009_Cube020.geometry}
        material={materials["Material.001"]}
        position={[-3.669, -5.752, -2.65]}
        rotation={[Math.PI / 2, 0, Math.PI]}
        scale={2.423}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube050.geometry}
        material={materials.Chrome}
        position={[-3.669, -5.752, -2.65]}
        rotation={[Math.PI / 2, 0, Math.PI]}
        scale={2.423}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube051.geometry}
        material={materials.Chrome}
        position={[-3.669, -5.752, -2.65]}
        rotation={[Math.PI / 2, 0, Math.PI]}
        scale={2.423}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube052.geometry}
        material={materials.Chrome}
        position={[-3.669, -5.752, -2.65]}
        rotation={[Math.PI / 2, 0, Math.PI]}
        scale={2.423}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube053.geometry}
        material={materials.Chrome}
        position={[-3.669, -5.752, -2.65]}
        rotation={[Math.PI / 2, 0, Math.PI]}
        scale={2.423}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube054.geometry}
        material={materials.Chrome}
        position={[-3.669, -5.752, -2.65]}
        rotation={[Math.PI / 2, 0, Math.PI]}
        scale={2.423}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube055.geometry}
        material={materials.Chrome}
        position={[-3.669, -5.752, -2.65]}
        rotation={[Math.PI / 2, 0, Math.PI]}
        scale={2.423}
      />
      <group
        position={[-3.669, -5.752, -2.65]}
        rotation={[Math.PI / 2, 0, Math.PI]}
        scale={2.423}
      >
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Cylinder000_1.geometry}
          material={materials.light_inside_bar}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Cylinder000_2.geometry}
          material={materials.light_handle}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Cylinder000_3.geometry}
          material={materials.light_pot}
        />
      </group>
      <group
        position={[-3.669, -5.752, -2.65]}
        rotation={[Math.PI / 2, 0, Math.PI]}
        scale={2.423}
      >
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Cylinder001_Cylinder006_1.geometry}
          material={materials.light_inside_bar}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Cylinder001_Cylinder006_2.geometry}
          material={materials.light_handle}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Cylinder001_Cylinder006_3.geometry}
          material={materials.light_pot}
        />
      </group>
      <group
        position={[-3.669, -5.752, -2.65]}
        rotation={[Math.PI / 2, 0, Math.PI]}
        scale={2.423}
      >
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Cylinder002_Cylinder011_1.geometry}
          material={materials.light_inside_bar}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Cylinder002_Cylinder011_2.geometry}
          material={materials.light_handle}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Cylinder002_Cylinder011_3.geometry}
          material={materials.light_pot}
        />
      </group>
      <group
        position={[-3.669, -5.752, -2.65]}
        rotation={[Math.PI / 2, 0, Math.PI]}
        scale={2.423}
      >
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Cylinder003_Cylinder012_1.geometry}
          material={materials.light_inside_bar}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Cylinder003_Cylinder012_2.geometry}
          material={materials.light_handle}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Cylinder003_Cylinder012_3.geometry}
          material={materials.light_pot}
        />
      </group>
      <group
        position={[-3.669, -5.752, -2.65]}
        rotation={[Math.PI / 2, 0, Math.PI]}
        scale={2.423}
      >
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Cylinder004_Cylinder013_1.geometry}
          material={materials.light_inside_bar}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Cylinder004_Cylinder013_2.geometry}
          material={materials.light_handle}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Cylinder004_Cylinder013_3.geometry}
          material={materials.light_pot}
        />
      </group>
      <group
        position={[-3.669, -5.752, -2.65]}
        rotation={[Math.PI / 2, 0, Math.PI]}
        scale={2.423}
      >
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Cylinder005_Cylinder014_1.geometry}
          material={materials.light_inside_bar}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Cylinder005_Cylinder014_2.geometry}
          material={materials.light_handle}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Cylinder005_Cylinder014_3.geometry}
          material={materials.light_pot}
        />
      </group>
      <group
        position={[-3.669, -5.752, -2.65]}
        rotation={[Math.PI / 2, 0, Math.PI]}
        scale={2.423}
      >
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Cylinder006_Cylinder015_1.geometry}
          material={materials.light_inside_bar}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Cylinder006_Cylinder015_2.geometry}
          material={materials.light_handle}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Cylinder006_Cylinder015_3.geometry}
          material={materials.light_pot}
        />
      </group>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cylinder014_Cylinder005.geometry}
        material={materials.Chrome}
        position={[-3.669, -5.752, -2.65]}
        rotation={[Math.PI / 2, 0, Math.PI]}
        scale={2.423}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cylinder015_Cylinder023.geometry}
        material={materials.Chrome}
        position={[-3.669, -5.752, -2.65]}
        rotation={[Math.PI / 2, 0, Math.PI]}
        scale={2.423}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cylinder036.geometry}
        material={materials.Chrome}
        position={[-3.669, -5.752, -2.65]}
        rotation={[Math.PI / 2, 0, Math.PI]}
        scale={2.423}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={(nodes.Cylinder038 as THREE.Mesh).geometry}
        material={materials.Chrome}
        position={[-3.669, -5.752, -2.65]}
        rotation={[Math.PI / 2, 0, Math.PI]}
        scale={2.423}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube007_Cube001.geometry}
        material={materials["Material.001"]}
        position={[-22.149, -5.752, -15.039]}
        rotation={[Math.PI / 2, 0, -Math.PI / 2]}
        scale={2.423}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube007_Cube002.geometry}
        material={materials["Material.001"]}
        position={[18.688, -5.752, -15.039]}
        rotation={[Math.PI / 2, 0, -Math.PI / 2]}
        scale={2.423}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube007_Cube003.geometry}
        material={materials["Material.001"]}
        position={[-35.54, -5.752, -2.65]}
        rotation={[Math.PI / 2, 0, Math.PI]}
        scale={2.423}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube007_Cube004.geometry}
        material={materials["Material.001"]}
        position={[39.871, -5.752, -2.65]}
        rotation={[Math.PI / 2, 0, Math.PI]}
        scale={2.423}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube007_Cube005.geometry}
        material={materials["Material.001"]}
        position={[-23.347, 9.168, -2.65]}
        rotation={[-Math.PI / 2, Math.PI / 2, 0]}
        scale={2.423}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube007_Cube006.geometry}
        material={materials["Material.001"]}
        position={[80.856, 9.168, -2.65]}
        rotation={[-Math.PI / 2, Math.PI / 2, 0]}
        scale={2.423}
      />
    </group>
  );
}

useGLTF.preload(CONSTANT.ASSETS["3D"].STAGE);
