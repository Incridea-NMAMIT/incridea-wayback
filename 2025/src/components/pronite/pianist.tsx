/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import React, { useEffect, useRef } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";
import { CONSTANT } from "~/constants";

export default function Pianist(props) {
  const group = useRef();
  const { nodes, materials, animations } = useGLTF(
    CONSTANT.ASSETS["3D"].PIANIST,
  );
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
          position={[4.691, -0.123, 0.179]}
          rotation={[-Math.PI / 2, 0, 0]}
          scale={0.654}
        >
          <group name="root">
            <group name="GLTF_SceneRootNode" rotation={[Math.PI / 2, 0, 0]}>
              <group
                name="Cube003_5"
                position={[-8.302, 1.485, 0.531]}
                rotation={[Math.PI, 0, Math.PI]}
                scale={[0.034, 0.028, 0.019]}
              >
                <mesh
                  name="Object_10"
                  castShadow
                  receiveShadow
                  geometry={nodes.Object_10.geometry}
                  material={materials["Material.002"]}
                />
                <mesh
                  name="Object_11"
                  castShadow
                  receiveShadow
                  geometry={nodes.Object_11.geometry}
                  material={materials["Material.002"]}
                />
              </group>
              <group
                name="Cube011_4"
                position={[-7.029, 1.523, 0.589]}
                rotation={[Math.PI, 0, Math.PI]}
                scale={[0.016, 0.028, 0.021]}
              >
                <mesh
                  name="Object_8"
                  castShadow
                  receiveShadow
                  geometry={nodes.Object_8.geometry}
                  material={materials["Material.001"]}
                />
              </group>
              <group
                name="pain_suport_1"
                position={[-7.606, 0.215, 0.938]}
                rotation={[-1.578, -0.887, -1.578]}
                scale={[0.024, 0.056, 0.029]}
              >
                <mesh
                  name="Object_6"
                  castShadow
                  receiveShadow
                  geometry={nodes.Object_6.geometry}
                  material={materials["METAL.002"]}
                />
              </group>
              <group
                name="Plane016_0"
                position={[-7.163, 1.395, 0.799]}
                rotation={[Math.PI, 0, Math.PI]}
                scale={[1.189, 0.663, 0.444]}
              >
                <mesh
                  name="Object_4"
                  castShadow
                  receiveShadow
                  geometry={nodes.Object_4.geometry}
                  material={materials["Material.001"]}
                />
              </group>
            </group>
          </group>
        </group>
        <group
          name="Sketchfab_model001"
          rotation={[-Math.PI / 2, 0, 0]}
          scale={1.203}
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
                    material={materials.m_bar_stool_01}
                  />
                </group>
                <group name="bolt_02_lp">
                  <mesh
                    name="bolt_02_lp_m_bar_stool_01_0"
                    castShadow
                    receiveShadow
                    geometry={nodes.bolt_02_lp_m_bar_stool_01_0.geometry}
                    material={materials.m_bar_stool_01}
                  />
                </group>
                <group name="bolt_03_lp">
                  <mesh
                    name="bolt_03_lp_m_bar_stool_01_0"
                    castShadow
                    receiveShadow
                    geometry={nodes.bolt_03_lp_m_bar_stool_01_0.geometry}
                    material={materials.m_bar_stool_01}
                  />
                </group>
                <group name="bolt_04_lp">
                  <mesh
                    name="bolt_04_lp_m_bar_stool_01_0"
                    castShadow
                    receiveShadow
                    geometry={nodes.bolt_04_lp_m_bar_stool_01_0.geometry}
                    material={materials.m_bar_stool_01}
                  />
                </group>
                <group name="bolt_05_lp">
                  <mesh
                    name="bolt_05_lp_m_bar_stool_01_0"
                    castShadow
                    receiveShadow
                    geometry={nodes.bolt_05_lp_m_bar_stool_01_0.geometry}
                    material={materials.m_bar_stool_01}
                  />
                </group>
                <group name="bolt_06_lp">
                  <mesh
                    name="bolt_06_lp_m_bar_stool_01_0"
                    castShadow
                    receiveShadow
                    geometry={nodes.bolt_06_lp_m_bar_stool_01_0.geometry}
                    material={materials.m_bar_stool_01}
                  />
                </group>
                <group name="bolt_07_lp">
                  <mesh
                    name="bolt_07_lp_m_bar_stool_01_0"
                    castShadow
                    receiveShadow
                    geometry={nodes.bolt_07_lp_m_bar_stool_01_0.geometry}
                    material={materials.m_bar_stool_01}
                  />
                </group>
                <group name="bolt_08_lp">
                  <mesh
                    name="bolt_08_lp_m_bar_stool_01_0"
                    castShadow
                    receiveShadow
                    geometry={nodes.bolt_08_lp_m_bar_stool_01_0.geometry}
                    material={materials.m_bar_stool_01}
                  />
                </group>
                <group name="bolt_09_lp">
                  <mesh
                    name="bolt_09_lp_m_bar_stool_01_0"
                    castShadow
                    receiveShadow
                    geometry={nodes.bolt_09_lp_m_bar_stool_01_0.geometry}
                    material={materials.m_bar_stool_01}
                  />
                </group>
                <group name="bolt_10_lp">
                  <mesh
                    name="bolt_10_lp_m_bar_stool_01_0"
                    castShadow
                    receiveShadow
                    geometry={nodes.bolt_10_lp_m_bar_stool_01_0.geometry}
                    material={materials.m_bar_stool_01}
                  />
                </group>
                <group name="bolt_11_lp">
                  <mesh
                    name="bolt_11_lp_m_bar_stool_01_0"
                    castShadow
                    receiveShadow
                    geometry={nodes.bolt_11_lp_m_bar_stool_01_0.geometry}
                    material={materials.m_bar_stool_01}
                  />
                </group>
                <group name="bolt_12_lp">
                  <mesh
                    name="bolt_12_lp_m_bar_stool_01_0"
                    castShadow
                    receiveShadow
                    geometry={nodes.bolt_12_lp_m_bar_stool_01_0.geometry}
                    material={materials.m_bar_stool_01}
                  />
                </group>
                <group name="bolt_13_lp">
                  <mesh
                    name="bolt_13_lp_m_bar_stool_01_0"
                    castShadow
                    receiveShadow
                    geometry={nodes.bolt_13_lp_m_bar_stool_01_0.geometry}
                    material={materials.m_bar_stool_01}
                  />
                </group>
                <group name="foot_01_lp">
                  <mesh
                    name="foot_01_lp_m_bar_stool_01_0"
                    castShadow
                    receiveShadow
                    geometry={nodes.foot_01_lp_m_bar_stool_01_0.geometry}
                    material={materials.m_bar_stool_01}
                  />
                </group>
                <group name="foot_02_lp">
                  <mesh
                    name="foot_02_lp_m_bar_stool_01_0"
                    castShadow
                    receiveShadow
                    geometry={nodes.foot_02_lp_m_bar_stool_01_0.geometry}
                    material={materials.m_bar_stool_01}
                  />
                </group>
                <group name="foot_03_lp">
                  <mesh
                    name="foot_03_lp_m_bar_stool_01_0"
                    castShadow
                    receiveShadow
                    geometry={nodes.foot_03_lp_m_bar_stool_01_0.geometry}
                    material={materials.m_bar_stool_01}
                  />
                </group>
                <group name="foot_04_lp">
                  <mesh
                    name="foot_04_lp_m_bar_stool_01_0"
                    castShadow
                    receiveShadow
                    geometry={nodes.foot_04_lp_m_bar_stool_01_0.geometry}
                    material={materials.m_bar_stool_01}
                  />
                </group>
                <group name="leg_01_lp">
                  <mesh
                    name="leg_01_lp_m_bar_stool_01_0"
                    castShadow
                    receiveShadow
                    geometry={nodes.leg_01_lp_m_bar_stool_01_0.geometry}
                    material={materials.m_bar_stool_01}
                  />
                </group>
                <group name="leg_02_lp">
                  <mesh
                    name="leg_02_lp_m_bar_stool_01_0"
                    castShadow
                    receiveShadow
                    geometry={nodes.leg_02_lp_m_bar_stool_01_0.geometry}
                    material={materials.m_bar_stool_01}
                  />
                </group>
                <group name="nut_01_lp">
                  <mesh
                    name="nut_01_lp_m_bar_stool_01_0"
                    castShadow
                    receiveShadow
                    geometry={nodes.nut_01_lp_m_bar_stool_01_0.geometry}
                    material={materials.m_bar_stool_01}
                  />
                </group>
                <group name="nut_02_lp">
                  <mesh
                    name="nut_02_lp_m_bar_stool_01_0"
                    castShadow
                    receiveShadow
                    geometry={nodes.nut_02_lp_m_bar_stool_01_0.geometry}
                    material={materials.m_bar_stool_01}
                  />
                </group>
                <group name="nut_03_lp">
                  <mesh
                    name="nut_03_lp_m_bar_stool_01_0"
                    castShadow
                    receiveShadow
                    geometry={nodes.nut_03_lp_m_bar_stool_01_0.geometry}
                    material={materials.m_bar_stool_01}
                  />
                </group>
                <group name="nut_04_lp">
                  <mesh
                    name="nut_04_lp_m_bar_stool_01_0"
                    castShadow
                    receiveShadow
                    geometry={nodes.nut_04_lp_m_bar_stool_01_0.geometry}
                    material={materials.m_bar_stool_01}
                  />
                </group>
                <group name="nut_05_lp">
                  <mesh
                    name="nut_05_lp_m_bar_stool_01_0"
                    castShadow
                    receiveShadow
                    geometry={nodes.nut_05_lp_m_bar_stool_01_0.geometry}
                    material={materials.m_bar_stool_01}
                  />
                </group>
                <group name="nut_06_lp">
                  <mesh
                    name="nut_06_lp_m_bar_stool_01_0"
                    castShadow
                    receiveShadow
                    geometry={nodes.nut_06_lp_m_bar_stool_01_0.geometry}
                    material={materials.m_bar_stool_01}
                  />
                </group>
                <group name="nut_07_lp">
                  <mesh
                    name="nut_07_lp_m_bar_stool_01_0"
                    castShadow
                    receiveShadow
                    geometry={nodes.nut_07_lp_m_bar_stool_01_0.geometry}
                    material={materials.m_bar_stool_01}
                  />
                </group>
                <group name="nut_08_lp">
                  <mesh
                    name="nut_08_lp_m_bar_stool_01_0"
                    castShadow
                    receiveShadow
                    geometry={nodes.nut_08_lp_m_bar_stool_01_0.geometry}
                    material={materials.m_bar_stool_01}
                  />
                </group>
                <group name="pillow_lp">
                  <mesh
                    name="pillow_lp_m_bar_stool_01_0"
                    castShadow
                    receiveShadow
                    geometry={nodes.pillow_lp_m_bar_stool_01_0.geometry}
                    material={materials.m_bar_stool_01}
                  />
                </group>
                <group name="plate_01_lp">
                  <mesh
                    name="plate_01_lp_m_bar_stool_01_0"
                    castShadow
                    receiveShadow
                    geometry={nodes.plate_01_lp_m_bar_stool_01_0.geometry}
                    material={materials.m_bar_stool_01}
                  />
                </group>
                <group name="plate_02_lp">
                  <mesh
                    name="plate_02_lp_m_bar_stool_01_0"
                    castShadow
                    receiveShadow
                    geometry={nodes.plate_02_lp_m_bar_stool_01_0.geometry}
                    material={materials.m_bar_stool_01}
                  />
                </group>
                <group name="ring_01_lp">
                  <mesh
                    name="ring_01_lp_m_bar_stool_01_0"
                    castShadow
                    receiveShadow
                    geometry={nodes.ring_01_lp_m_bar_stool_01_0.geometry}
                    material={materials.m_bar_stool_01}
                  />
                </group>
                <group name="ring_02_lp">
                  <mesh
                    name="ring_02_lp_m_bar_stool_01_0"
                    castShadow
                    receiveShadow
                    geometry={nodes.ring_02_lp_m_bar_stool_01_0.geometry}
                    material={materials.m_bar_stool_01}
                  />
                </group>
              </group>
            </group>
          </group>
        </group>
        <group name="Armature" rotation={[Math.PI / 2, 0, 0]} scale={1.02}>
          <skinnedMesh
            name="EyeLeft001"
            geometry={nodes.EyeLeft001.geometry}
            material={materials["Wolf3D_Eye.001"]}
            skeleton={nodes.EyeLeft001.skeleton}
          />
          <skinnedMesh
            name="EyeRight001"
            geometry={nodes.EyeRight001.geometry}
            material={materials["Wolf3D_Eye.001"]}
            skeleton={nodes.EyeRight001.skeleton}
          />
          <skinnedMesh
            name="Wolf3D_Body001"
            geometry={nodes.Wolf3D_Body001.geometry}
            material={materials["Wolf3D_Body.001"]}
            skeleton={nodes.Wolf3D_Body001.skeleton}
          />
          <skinnedMesh
            name="Wolf3D_Glasses001"
            geometry={nodes.Wolf3D_Glasses001.geometry}
            material={materials["Wolf3D_Glasses.001"]}
            skeleton={nodes.Wolf3D_Glasses001.skeleton}
          />
          <skinnedMesh
            name="Wolf3D_Hair001"
            geometry={nodes.Wolf3D_Hair001.geometry}
            material={materials["Wolf3D_Hair.001"]}
            skeleton={nodes.Wolf3D_Hair001.skeleton}
          />
          <skinnedMesh
            name="Wolf3D_Head001"
            geometry={nodes.Wolf3D_Head001.geometry}
            material={materials["Wolf3D_Skin.001"]}
            skeleton={nodes.Wolf3D_Head001.skeleton}
          />
          <skinnedMesh
            name="Wolf3D_Outfit_Bottom001"
            geometry={nodes.Wolf3D_Outfit_Bottom001.geometry}
            material={materials.Wolf3D_Outfit_Bottom}
            skeleton={nodes.Wolf3D_Outfit_Bottom001.skeleton}
          />
          <skinnedMesh
            name="Wolf3D_Outfit_Footwear001"
            geometry={nodes.Wolf3D_Outfit_Footwear001.geometry}
            material={materials.Wolf3D_Outfit_Footwear}
            skeleton={nodes.Wolf3D_Outfit_Footwear001.skeleton}
          />
          <skinnedMesh
            name="Wolf3D_Outfit_Top001"
            geometry={nodes.Wolf3D_Outfit_Top001.geometry}
            material={materials.Wolf3D_Outfit_Top}
            skeleton={nodes.Wolf3D_Outfit_Top001.skeleton}
          />
          <skinnedMesh
            name="Wolf3D_Teeth001"
            geometry={nodes.Wolf3D_Teeth001.geometry}
            material={nodes.Wolf3D_Teeth001.material}
            skeleton={nodes.Wolf3D_Teeth001.skeleton}
          />
          <primitive object={nodes.mixamorigHips} />
        </group>
      </group>
    </group>
  );
}

useGLTF.preload(CONSTANT.ASSETS["3D"].PIANIST);
