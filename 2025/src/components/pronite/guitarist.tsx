/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import React, { useEffect, useRef } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";
import { CONSTANT } from "~/constants";

useGLTF.preload(CONSTANT.ASSETS["3D"].GUITARIST);

export default function Guitarist(props) {
  const group = useRef();
  const { nodes, materials, animations } = useGLTF(
    CONSTANT.ASSETS["3D"].GUITARIST,
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
          position={[0.237, 1.018, 0.315]}
          rotation={[-0.067, -0.455, -3.012]}
          scale={0.094}
        >
          <group name="to_subsobjcleanermaterialmergergles">
            <mesh
              name="Object_2"
              castShadow
              receiveShadow
              geometry={nodes.Object_2.geometry}
              material={materials.lambert4SG}
            />
            <mesh
              name="Object_3"
              castShadow
              receiveShadow
              geometry={nodes.Object_3.geometry}
              material={materials.lambert5SG}
              rotation={[-0.006, -0.037, 0.002]}
            />
          </group>
        </group>
        <group name="Armature" rotation={[Math.PI / 2, 0, 0]} scale={1.066}>
          <skinnedMesh
            name="EyeLeft001"
            geometry={nodes.EyeLeft001.geometry}
            material={materials.Wolf3D_Eye}
            skeleton={nodes.EyeLeft001.skeleton}
          />
          <skinnedMesh
            name="EyeRight001"
            geometry={nodes.EyeRight001.geometry}
            material={materials.Wolf3D_Eye}
            skeleton={nodes.EyeRight001.skeleton}
          />
          <skinnedMesh
            name="Wolf3D_Beard001"
            geometry={nodes.Wolf3D_Beard001.geometry}
            material={materials.Wolf3D_Beard}
            skeleton={nodes.Wolf3D_Beard001.skeleton}
          />
          <skinnedMesh
            name="Wolf3D_Body001"
            geometry={nodes.Wolf3D_Body001.geometry}
            material={materials.Wolf3D_Body}
            skeleton={nodes.Wolf3D_Body001.skeleton}
          />
          <skinnedMesh
            name="Wolf3D_Glasses001"
            geometry={nodes.Wolf3D_Glasses001.geometry}
            material={materials.Wolf3D_Glasses}
            skeleton={nodes.Wolf3D_Glasses001.skeleton}
          />
          <skinnedMesh
            name="Wolf3D_Head001"
            geometry={nodes.Wolf3D_Head001.geometry}
            material={materials.Wolf3D_Skin}
            skeleton={nodes.Wolf3D_Head001.skeleton}
          />
          <skinnedMesh
            name="Wolf3D_Headwear001"
            geometry={nodes.Wolf3D_Headwear001.geometry}
            material={materials.Wolf3D_Headwear}
            skeleton={nodes.Wolf3D_Headwear001.skeleton}
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
