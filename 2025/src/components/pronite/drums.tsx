/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import React, { useEffect, useRef } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";
import { CONSTANT } from "~/constants";

useGLTF.preload(CONSTANT.ASSETS["3D"].DRUMS);

export default function Drums(props) {
  const group = useRef();
  const { nodes, materials, animations } = useGLTF(CONSTANT.ASSETS["3D"].DRUMS);
  const { actions } = useAnimations(animations, group);

  // Start the first animation once the component mounts.
  useEffect(() => {
    if (animations.length && actions) {
      // Replace "AnimationName" with the name of the animation you want to play,
      // or use animations[0].name if you want the first animation.
      const animName = animations[0].name;
      actions[animName]?.play();
    }
  }, [animations, actions]);
  return (
    <group ref={group} {...props} dispose={null}>
      <group name="Scene">
        <group
          name="Sketchfab_model"
          position={[0.075, 0, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          scale={1.397}
        >
          <group
            name="bar_stool_01fbx"
            rotation={[Math.PI / 2, 0, 0]}
            scale={0.01}
          >
            <group name="RootNode">
              <group name="low">
                <group name="bolt_01_lp">
                  <mesh
                    name="bolt_01_lp_m_bar_stool_01_0"
                    castShadow
                    receiveShadow
                    geometry={nodes.bolt_01_lp_m_bar_stool_01_0.geometry}
                    material={materials["m_bar_stool_01.001"]}
                  />
                </group>
                <group name="bolt_02_lp">
                  <mesh
                    name="bolt_02_lp_m_bar_stool_01_0"
                    castShadow
                    receiveShadow
                    geometry={nodes.bolt_02_lp_m_bar_stool_01_0.geometry}
                    material={materials["m_bar_stool_01.001"]}
                  />
                </group>
                <group name="bolt_03_lp">
                  <mesh
                    name="bolt_03_lp_m_bar_stool_01_0"
                    castShadow
                    receiveShadow
                    geometry={nodes.bolt_03_lp_m_bar_stool_01_0.geometry}
                    material={materials["m_bar_stool_01.001"]}
                  />
                </group>
                <group name="bolt_04_lp">
                  <mesh
                    name="bolt_04_lp_m_bar_stool_01_0"
                    castShadow
                    receiveShadow
                    geometry={nodes.bolt_04_lp_m_bar_stool_01_0.geometry}
                    material={materials["m_bar_stool_01.001"]}
                  />
                </group>
                <group name="bolt_05_lp">
                  <mesh
                    name="bolt_05_lp_m_bar_stool_01_0"
                    castShadow
                    receiveShadow
                    geometry={nodes.bolt_05_lp_m_bar_stool_01_0.geometry}
                    material={materials["m_bar_stool_01.001"]}
                  />
                </group>
                <group name="bolt_06_lp">
                  <mesh
                    name="bolt_06_lp_m_bar_stool_01_0"
                    castShadow
                    receiveShadow
                    geometry={nodes.bolt_06_lp_m_bar_stool_01_0.geometry}
                    material={materials["m_bar_stool_01.001"]}
                  />
                </group>
                <group name="bolt_07_lp">
                  <mesh
                    name="bolt_07_lp_m_bar_stool_01_0"
                    castShadow
                    receiveShadow
                    geometry={nodes.bolt_07_lp_m_bar_stool_01_0.geometry}
                    material={materials["m_bar_stool_01.001"]}
                  />
                </group>
                <group name="bolt_08_lp">
                  <mesh
                    name="bolt_08_lp_m_bar_stool_01_0"
                    castShadow
                    receiveShadow
                    geometry={nodes.bolt_08_lp_m_bar_stool_01_0.geometry}
                    material={materials["m_bar_stool_01.001"]}
                  />
                </group>
                <group name="bolt_09_lp">
                  <mesh
                    name="bolt_09_lp_m_bar_stool_01_0"
                    castShadow
                    receiveShadow
                    geometry={nodes.bolt_09_lp_m_bar_stool_01_0.geometry}
                    material={materials["m_bar_stool_01.001"]}
                  />
                </group>
                <group name="bolt_10_lp">
                  <mesh
                    name="bolt_10_lp_m_bar_stool_01_0"
                    castShadow
                    receiveShadow
                    geometry={nodes.bolt_10_lp_m_bar_stool_01_0.geometry}
                    material={materials["m_bar_stool_01.001"]}
                  />
                </group>
                <group name="bolt_11_lp">
                  <mesh
                    name="bolt_11_lp_m_bar_stool_01_0"
                    castShadow
                    receiveShadow
                    geometry={nodes.bolt_11_lp_m_bar_stool_01_0.geometry}
                    material={materials["m_bar_stool_01.001"]}
                  />
                </group>
                <group name="bolt_12_lp">
                  <mesh
                    name="bolt_12_lp_m_bar_stool_01_0"
                    castShadow
                    receiveShadow
                    geometry={nodes.bolt_12_lp_m_bar_stool_01_0.geometry}
                    material={materials["m_bar_stool_01.001"]}
                  />
                </group>
                <group name="bolt_13_lp">
                  <mesh
                    name="bolt_13_lp_m_bar_stool_01_0"
                    castShadow
                    receiveShadow
                    geometry={nodes.bolt_13_lp_m_bar_stool_01_0.geometry}
                    material={materials["m_bar_stool_01.001"]}
                  />
                </group>
                <group name="foot_01_lp">
                  <mesh
                    name="foot_01_lp_m_bar_stool_01_0"
                    castShadow
                    receiveShadow
                    geometry={nodes.foot_01_lp_m_bar_stool_01_0.geometry}
                    material={materials["m_bar_stool_01.001"]}
                  />
                </group>
                <group name="foot_02_lp">
                  <mesh
                    name="foot_02_lp_m_bar_stool_01_0"
                    castShadow
                    receiveShadow
                    geometry={nodes.foot_02_lp_m_bar_stool_01_0.geometry}
                    material={materials["m_bar_stool_01.001"]}
                  />
                </group>
                <group name="foot_03_lp">
                  <mesh
                    name="foot_03_lp_m_bar_stool_01_0"
                    castShadow
                    receiveShadow
                    geometry={nodes.foot_03_lp_m_bar_stool_01_0.geometry}
                    material={materials["m_bar_stool_01.001"]}
                  />
                </group>
                <group name="foot_04_lp">
                  <mesh
                    name="foot_04_lp_m_bar_stool_01_0"
                    castShadow
                    receiveShadow
                    geometry={nodes.foot_04_lp_m_bar_stool_01_0.geometry}
                    material={materials["m_bar_stool_01.001"]}
                  />
                </group>
                <group name="leg_01_lp">
                  <mesh
                    name="leg_01_lp_m_bar_stool_01_0"
                    castShadow
                    receiveShadow
                    geometry={nodes.leg_01_lp_m_bar_stool_01_0.geometry}
                    material={materials["m_bar_stool_01.001"]}
                  />
                </group>
                <group name="leg_02_lp">
                  <mesh
                    name="leg_02_lp_m_bar_stool_01_0"
                    castShadow
                    receiveShadow
                    geometry={nodes.leg_02_lp_m_bar_stool_01_0.geometry}
                    material={materials["m_bar_stool_01.001"]}
                  />
                </group>
                <group name="nut_01_lp">
                  <mesh
                    name="nut_01_lp_m_bar_stool_01_0"
                    castShadow
                    receiveShadow
                    geometry={nodes.nut_01_lp_m_bar_stool_01_0.geometry}
                    material={materials["m_bar_stool_01.001"]}
                  />
                </group>
                <group name="nut_02_lp">
                  <mesh
                    name="nut_02_lp_m_bar_stool_01_0"
                    castShadow
                    receiveShadow
                    geometry={nodes.nut_02_lp_m_bar_stool_01_0.geometry}
                    material={materials["m_bar_stool_01.001"]}
                  />
                </group>
                <group name="nut_03_lp">
                  <mesh
                    name="nut_03_lp_m_bar_stool_01_0"
                    castShadow
                    receiveShadow
                    geometry={nodes.nut_03_lp_m_bar_stool_01_0.geometry}
                    material={materials["m_bar_stool_01.001"]}
                  />
                </group>
                <group name="nut_04_lp">
                  <mesh
                    name="nut_04_lp_m_bar_stool_01_0"
                    castShadow
                    receiveShadow
                    geometry={nodes.nut_04_lp_m_bar_stool_01_0.geometry}
                    material={materials["m_bar_stool_01.001"]}
                  />
                </group>
                <group name="nut_05_lp">
                  <mesh
                    name="nut_05_lp_m_bar_stool_01_0"
                    castShadow
                    receiveShadow
                    geometry={nodes.nut_05_lp_m_bar_stool_01_0.geometry}
                    material={materials["m_bar_stool_01.001"]}
                  />
                </group>
                <group name="nut_06_lp">
                  <mesh
                    name="nut_06_lp_m_bar_stool_01_0"
                    castShadow
                    receiveShadow
                    geometry={nodes.nut_06_lp_m_bar_stool_01_0.geometry}
                    material={materials["m_bar_stool_01.001"]}
                  />
                </group>
                <group name="nut_07_lp">
                  <mesh
                    name="nut_07_lp_m_bar_stool_01_0"
                    castShadow
                    receiveShadow
                    geometry={nodes.nut_07_lp_m_bar_stool_01_0.geometry}
                    material={materials["m_bar_stool_01.001"]}
                  />
                </group>
                <group name="nut_08_lp">
                  <mesh
                    name="nut_08_lp_m_bar_stool_01_0"
                    castShadow
                    receiveShadow
                    geometry={nodes.nut_08_lp_m_bar_stool_01_0.geometry}
                    material={materials["m_bar_stool_01.001"]}
                  />
                </group>
                <group name="pillow_lp">
                  <mesh
                    name="pillow_lp_m_bar_stool_01_0"
                    castShadow
                    receiveShadow
                    geometry={nodes.pillow_lp_m_bar_stool_01_0.geometry}
                    material={materials["m_bar_stool_01.001"]}
                  />
                </group>
                <group name="plate_01_lp">
                  <mesh
                    name="plate_01_lp_m_bar_stool_01_0"
                    castShadow
                    receiveShadow
                    geometry={nodes.plate_01_lp_m_bar_stool_01_0.geometry}
                    material={materials["m_bar_stool_01.001"]}
                  />
                </group>
                <group name="plate_02_lp">
                  <mesh
                    name="plate_02_lp_m_bar_stool_01_0"
                    castShadow
                    receiveShadow
                    geometry={nodes.plate_02_lp_m_bar_stool_01_0.geometry}
                    material={materials["m_bar_stool_01.001"]}
                  />
                </group>
                <group name="ring_01_lp">
                  <mesh
                    name="ring_01_lp_m_bar_stool_01_0"
                    castShadow
                    receiveShadow
                    geometry={nodes.ring_01_lp_m_bar_stool_01_0.geometry}
                    material={materials["m_bar_stool_01.001"]}
                  />
                </group>
                <group name="ring_02_lp">
                  <mesh
                    name="ring_02_lp_m_bar_stool_01_0"
                    castShadow
                    receiveShadow
                    geometry={nodes.ring_02_lp_m_bar_stool_01_0.geometry}
                    material={materials["m_bar_stool_01.001"]}
                  />
                </group>
              </group>
            </group>
          </group>
        </group>
        <group
          name="Sketchfab_model001"
          position={[0.364, 0, 0.649]}
          rotation={[-Math.PI / 2, 0, 2.11]}
          scale={0.316}
        >
          <group
            name="3faf7760a3794f88998cab209ed5572afbx"
            rotation={[Math.PI / 2, 0, 0]}
            scale={0.01}
          >
            <group name="RootNode001">
              <group name="Circle" rotation={[-Math.PI / 2, 0, 0]} scale={100}>
                <mesh
                  name="Circle_Cymbals_0"
                  castShadow
                  receiveShadow
                  geometry={nodes.Circle_Cymbals_0.geometry}
                  material={materials["Cymbals.001"]}
                />
              </group>
              <group
                name="Circle001"
                rotation={[-Math.PI / 2, 0, 0]}
                scale={100}
              >
                <mesh
                  name="Circle001_Cymbals_0"
                  castShadow
                  receiveShadow
                  geometry={nodes.Circle001_Cymbals_0.geometry}
                  material={materials["Cymbals.001"]}
                />
              </group>
              <group
                name="Circle002"
                rotation={[-Math.PI / 2, 0, 0]}
                scale={100}
              >
                <mesh
                  name="Circle002_Cymbals_0"
                  castShadow
                  receiveShadow
                  geometry={nodes.Circle002_Cymbals_0.geometry}
                  material={materials["Cymbals.001"]}
                />
              </group>
              <group
                name="Circle003"
                rotation={[-Math.PI / 2, 0, 0]}
                scale={100}
              >
                <mesh
                  name="Circle003_Cymbals_0"
                  castShadow
                  receiveShadow
                  geometry={nodes.Circle003_Cymbals_0.geometry}
                  material={materials["Cymbals.001"]}
                />
              </group>
              <group
                name="Circle004"
                rotation={[-Math.PI / 2, 0, 0]}
                scale={100}
              >
                <mesh
                  name="Circle004_Cymbals_0"
                  castShadow
                  receiveShadow
                  geometry={nodes.Circle004_Cymbals_0.geometry}
                  material={materials["Cymbals.001"]}
                />
              </group>
              <group name="Cube040" rotation={[-Math.PI / 2, 0, 0]} scale={100}>
                <mesh
                  name="Cube040_Legs_0"
                  castShadow
                  receiveShadow
                  geometry={nodes.Cube040_Legs_0.geometry}
                  material={materials["Legs.001"]}
                />
                <mesh
                  name="Cube040_Metal001_0"
                  castShadow
                  receiveShadow
                  geometry={nodes.Cube040_Metal001_0.geometry}
                  material={materials["Metal.003"]}
                />
                <mesh
                  name="Cube040_Plastic_02_0"
                  castShadow
                  receiveShadow
                  geometry={nodes.Cube040_Plastic_02_0.geometry}
                  material={materials["Plastic_02.001"]}
                />
                <mesh
                  name="Cube040_Plastic_0"
                  castShadow
                  receiveShadow
                  geometry={nodes.Cube040_Plastic_0.geometry}
                  material={materials["Plastic.001"]}
                />
              </group>
              <group
                name="Cylinder"
                rotation={[-Math.PI / 2, 0, 0]}
                scale={100}
              >
                <mesh
                  name="Cylinder_Drum_cloth001_0"
                  castShadow
                  receiveShadow
                  geometry={nodes.Cylinder_Drum_cloth001_0.geometry}
                  material={materials["Drum_cloth.005"]}
                />
                <mesh
                  name="Cylinder_Drum_cloth002_0"
                  castShadow
                  receiveShadow
                  geometry={nodes.Cylinder_Drum_cloth002_0.geometry}
                  material={materials["Drum_cloth.006"]}
                />
                <mesh
                  name="Cylinder_Drum_cloth003_0"
                  castShadow
                  receiveShadow
                  geometry={nodes.Cylinder_Drum_cloth003_0.geometry}
                  material={materials["Drum_cloth.007"]}
                />
                <mesh
                  name="Cylinder_Drum_cloth004_0"
                  castShadow
                  receiveShadow
                  geometry={nodes.Cylinder_Drum_cloth004_0.geometry}
                  material={materials["Drum_cloth.009"]}
                />
                <mesh
                  name="Cylinder_Drum_cloth_0"
                  castShadow
                  receiveShadow
                  geometry={nodes.Cylinder_Drum_cloth_0.geometry}
                  material={materials["Drum_cloth.008"]}
                />
                <mesh
                  name="Cylinder_Drums_0"
                  castShadow
                  receiveShadow
                  geometry={nodes.Cylinder_Drums_0.geometry}
                  material={materials["Drums.001"]}
                />
                <mesh
                  name="Cylinder_Metal_0"
                  castShadow
                  receiveShadow
                  geometry={nodes.Cylinder_Metal_0.geometry}
                  material={materials["Metal.002"]}
                />
                <mesh
                  name="Cylinder_Metal_0001"
                  castShadow
                  receiveShadow
                  geometry={nodes.Cylinder_Metal_0001.geometry}
                  material={materials["Metal.002"]}
                />
                <mesh
                  name="Cylinder_Plastic_0"
                  castShadow
                  receiveShadow
                  geometry={nodes.Cylinder_Plastic_0.geometry}
                  material={materials["Plastic.001"]}
                />
              </group>
              <group
                name="Cylinder004"
                rotation={[-Math.PI / 2, 0, 0]}
                scale={100}
              >
                <mesh
                  name="Cylinder004_seat_0"
                  castShadow
                  receiveShadow
                  geometry={nodes.Cylinder004_seat_0.geometry}
                  material={materials["seat.001"]}
                />
              </group>
              <group
                name="Cylinder005"
                rotation={[-Math.PI / 2, 0, 0]}
                scale={100}
              >
                <mesh
                  name="Cylinder005_seat_0"
                  castShadow
                  receiveShadow
                  geometry={nodes.Cylinder005_seat_0.geometry}
                  material={materials["seat.001"]}
                />
              </group>
            </group>
          </group>
        </group>
        <group name="Armature001" rotation={[Math.PI / 2, 0, 0]} scale={1.036}>
          <skinnedMesh
            name="EyeLeft"
            geometry={nodes.EyeLeft.geometry}
            material={materials.Wolf3D_Eye}
            skeleton={nodes.EyeLeft.skeleton}
          />
          <skinnedMesh
            name="EyeRight"
            geometry={nodes.EyeRight.geometry}
            material={materials.Wolf3D_Eye}
            skeleton={nodes.EyeRight.skeleton}
          />
          <skinnedMesh
            name="Wolf3D_Beard"
            geometry={nodes.Wolf3D_Beard.geometry}
            material={materials.Wolf3D_Beard}
            skeleton={nodes.Wolf3D_Beard.skeleton}
          />
          <skinnedMesh
            name="Wolf3D_Body"
            geometry={nodes.Wolf3D_Body.geometry}
            material={materials.Wolf3D_Body}
            skeleton={nodes.Wolf3D_Body.skeleton}
          />
          <skinnedMesh
            name="Wolf3D_Glasses"
            geometry={nodes.Wolf3D_Glasses.geometry}
            material={materials.Wolf3D_Glasses}
            skeleton={nodes.Wolf3D_Glasses.skeleton}
          />
          <skinnedMesh
            name="Wolf3D_Hair"
            geometry={nodes.Wolf3D_Hair.geometry}
            material={materials.Wolf3D_Hair}
            skeleton={nodes.Wolf3D_Hair.skeleton}
          />
          <skinnedMesh
            name="Wolf3D_Head"
            geometry={nodes.Wolf3D_Head.geometry}
            material={materials.Wolf3D_Skin}
            skeleton={nodes.Wolf3D_Head.skeleton}
          />
          <skinnedMesh
            name="Wolf3D_Outfit_Bottom"
            geometry={nodes.Wolf3D_Outfit_Bottom.geometry}
            material={materials.Wolf3D_Outfit_Bottom}
            skeleton={nodes.Wolf3D_Outfit_Bottom.skeleton}
          />
          <skinnedMesh
            name="Wolf3D_Outfit_Footwear"
            geometry={nodes.Wolf3D_Outfit_Footwear.geometry}
            material={materials.Wolf3D_Outfit_Footwear}
            skeleton={nodes.Wolf3D_Outfit_Footwear.skeleton}
          />
          <skinnedMesh
            name="Wolf3D_Outfit_Top"
            geometry={nodes.Wolf3D_Outfit_Top.geometry}
            material={materials.Wolf3D_Outfit_Top}
            skeleton={nodes.Wolf3D_Outfit_Top.skeleton}
          />
          <skinnedMesh
            name="Wolf3D_Teeth"
            geometry={nodes.Wolf3D_Teeth.geometry}
            material={nodes.Wolf3D_Teeth.material}
            skeleton={nodes.Wolf3D_Teeth.skeleton}
          />
          <primitive object={nodes.mixamorigHips} />
        </group>
      </group>
    </group>
  );
}
