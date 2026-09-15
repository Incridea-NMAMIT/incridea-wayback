/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import React, { useEffect, useRef } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";
import Drums from "./drums";
import Pianist from "./pianist";
import Singer from "./singer";
import Guitarist from "./guitarist";

export default function MasalaModel(props) {
  return (
    <group {...props} dispose={null}>
      <Drums
        scale={[3.5, 3.5, 3.5]}
        position={[1, 0, -7]}
        rotation={[0, -1, 0]}
      />
      <Pianist
        scale={[4, 4, 4]}
        position={[-8, 0, -5]}
        rotation={[0, 0.5, 0]}
      />
      <Singer
        scale={[3.5, 3.5, 3.5]}
        position={[-3, 0, 0]}
        rotation={[0, 0, 0]}
      />
      <Guitarist
        scale={[3.5, 3.5, 3.5]}
        position={[5, 0, -2]}
        rotation={[0, 0, 0]}
      />
    </group>
  );
}
