/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import React, { useMemo, useState } from "react";

import * as THREE from "three";

import { useVideoTexture } from "@react-three/drei";

function VideoMaterial({ src, setVideo }) {
  const texture = useVideoTexture(src);

  texture.wrapS = THREE.RepeatWrapping;

  texture.wrapT = THREE.RepeatWrapping;

  texture.repeat.x = -1;

  texture.offset.x = 1;

  setVideo?.(texture.image);

  return (
    <meshStandardMaterial
      side={THREE.DoubleSide}
      map={texture}
      toneMapped={false}
      transparent
      opacity={1}
    />
  );
}

export default function Screen({ src }: { src: string }) {
  const [video, setVideo] = useState();

  const ratio = 16 / 9;

  const width = 5;

  const radius = 5;

  const z = 4;

  const r = useMemo(
    () => (video ? video.videoWidth / video.videoHeight : ratio),

    [video, ratio],
  );

  return <VideoMaterial src={src} setVideo={setVideo} />;
}
