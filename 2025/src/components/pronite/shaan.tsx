/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import React, { useEffect, useRef } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";
import { CONSTANT } from "~/constants";

export default function Shaan(props) {
  const group = useRef();
  const { nodes, materials, animations } = useGLTF(CONSTANT.ASSETS["3D"].SHAAN);
  const { actions } = useAnimations(animations, group);

  // Start the first animation once the component mounts.
  useEffect(() => {
    if (animations.length && actions) {
      const animName = animations[0].name;
      actions[animName]?.play();
    }
  }, [animations, actions]);

  return (
    <group ref={group} {...props} dispose={null}>
      <group name="Scene">
        <group name="Armature" rotation={[Math.PI / 2, 0, 0]} scale={1.023}>
          <skinnedMesh
            name="avaturn_body001"
            geometry={nodes.avaturn_body001.geometry}
            material={materials.avaturn_body_material}
            skeleton={nodes.avaturn_body001.skeleton}
          />
          <skinnedMesh
            name="avaturn_hair_0001"
            geometry={nodes.avaturn_hair_0001.geometry}
            material={materials.avaturn_hair_1_material}
            skeleton={nodes.avaturn_hair_0001.skeleton}
          />
          <skinnedMesh
            name="avaturn_hair_1001"
            geometry={nodes.avaturn_hair_1001.geometry}
            material={materials.avaturn_hair_0_material}
            skeleton={nodes.avaturn_hair_1001.skeleton}
          />
          <skinnedMesh
            name="avaturn_look_0001"
            geometry={nodes.avaturn_look_0001.geometry}
            material={materials.avaturn_look_0_material}
            skeleton={nodes.avaturn_look_0001.skeleton}
          />
          <skinnedMesh
            name="avaturn_shoes_0001"
            geometry={nodes.avaturn_shoes_0001.geometry}
            material={materials.avaturn_shoes_0_material}
            skeleton={nodes.avaturn_shoes_0001.skeleton}
          />
          <primitive object={nodes.mixamorigHips} />
        </group>
      </group>
    </group>
  );
}

useGLTF.preload(CONSTANT.ASSETS["3D"].SHAAN);
