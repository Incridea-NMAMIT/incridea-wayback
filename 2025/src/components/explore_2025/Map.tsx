import * as THREE from "three";
import { useAnimations, useGLTF } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";
import { useRouter } from "next/router";
import { useEffect, useRef } from "react";

import linksData from "~/components/explore_2025/data/data.json";
import { CONSTANT } from "~/constants";

type Link = {
  id: number;
  link: string;
};

type MapProps = {
  model: never;
  [key: string]: never;
};

const links: Link[] = linksData.links.map((link) => ({
  ...link,
  link: link.link,
}));

export const Map = ({ model, ...props }: MapProps) => {
  const { nodes, materials, animations } = useGLTF(
    CONSTANT.ASSETS["3D"].MEDIEVAL_BOUNDED,
  ) as never;
  const group = useRef<THREE.Group>(null);
  const { actions } = useAnimations(animations as THREE.AnimationClip[], group);
  const router = useRouter();

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    if (actions && Array.isArray(animations) && animations.length > 0) {
      if (actions && animations[0]) {
        actions[(animations[0] as THREE.AnimationClip).name]?.play();
      }
    }
  }, [actions, animations]);

  return (
    <group ref={group} {...props} dispose={null}>
      <RigidBody type="fixed" colliders="trimesh">
        <group name="Scene">
          <group name="Sketchfab_model" rotation={[-Math.PI / 2, 0, 0]}>
            <group
              name="dad255dd2cf24ae0bb357684e49722b4fbx"
              rotation={[Math.PI / 2, 0, 0]}
            >
              <group name="Object_2">
                <group name="RootNode">
                  <group
                    name="deers"
                    position={[-23.122, -0.049, 14.878]}
                    rotation={[-Math.PI / 2, 0, 0]}
                  >
                    <group name="Object_26" position={[4.328, 30.387, 4.387]}>
                      <mesh
                        name="deers_Texture-base_0"
                        castShadow
                        receiveShadow
                        geometry={
                          (nodes["deers_Texture-base_0"] as THREE.Mesh).geometry
                        }
                        material={materials["Texture-base"]}
                      />
                    </group>
                  </group>
                  <group
                    name="flag"
                    position={[-11.513, 12.497, -6.752]}
                    rotation={[-Math.PI / 2, 0, -Math.PI / 6]}
                  >
                    <group name="Object_17" position={[-7.262, 9.035, -8.16]}>
                      <mesh
                        name="0"
                        castShadow
                        receiveShadow
                        geometry={(nodes["0"] as THREE.Mesh).geometry}
                        material={materials["Texture-base"]}
                        morphTargetDictionary={
                          (nodes["0"] as THREE.Mesh).morphTargetDictionary
                        }
                        morphTargetInfluences={
                          (nodes["0"] as THREE.Mesh).morphTargetInfluences
                        }
                      />
                    </group>
                  </group>
                  <group
                    name="flag-second"
                    position={[-11.494, 12.552, -26.245]}
                    rotation={[-Math.PI / 2, 0, 0]}
                  >
                    <group name="Object_20" position={[-7.262, 9.035, -8.16]}>
                      <mesh
                        name="1"
                        castShadow
                        receiveShadow
                        geometry={(nodes["1"] as THREE.Mesh).geometry}
                        material={materials["Texture-base"]}
                        morphTargetDictionary={
                          (nodes["1"] as THREE.Mesh).morphTargetDictionary
                        }
                        morphTargetInfluences={
                          (nodes["1"] as THREE.Mesh).morphTargetInfluences
                        }
                      />
                    </group>
                  </group>
                  <group
                    name="Scene_1"
                    position={[-4.794, 0, 0.278]}
                    rotation={[-Math.PI / 2, 0, 0]}
                  >
                    <group
                      name="Mill-water-wheel"
                      position={[3.708, -15.395, -0.444]}
                      rotation={[-1.92, 0, 0]}
                    >
                      <group
                        name="Object_14"
                        position={[-17.708, 31.183, 4.781]}
                      >
                        <mesh
                          name="Mill-water-wheel_Texture-base_0"
                          castShadow
                          receiveShadow
                          geometry={
                            (
                              nodes[
                                "Mill-water-wheel_Texture-base_0"
                              ] as THREE.Mesh
                            ).geometry
                          }
                          material={materials["Texture-base"]}
                        />
                      </group>
                    </group>
                    <group
                      name="Mill-wind-wheel"
                      position={[-35.783, -27.192, 3.888]}
                      rotation={[0.445, -0.447, -0.498]}
                    >
                      <group
                        name="Object_11"
                        position={[-8.253, 39.884, -25.75]}
                        rotation={[-0.607, 0.138, 0.644]}
                      >
                        <mesh
                          name="Mill-wind-wheel_Texture-base_0"
                          castShadow
                          receiveShadow
                          geometry={
                            (
                              nodes[
                                "Mill-wind-wheel_Texture-base_0"
                              ] as THREE.Mesh
                            ).geometry
                          }
                          material={materials["Texture-base"]}
                        />
                      </group>
                    </group>
                    <group name="Object_5" position={[-14, 15.788, 4.337]}>
                      <mesh
                        name="Scene_Book-tittle_0"
                        castShadow
                        receiveShadow
                        geometry={
                          (nodes["Scene_Book-tittle_0"] as THREE.Mesh).geometry
                        }
                        material={materials["Book-tittle"]}
                      />
                      <mesh
                        name="Scene_Texture-base-gloss-jpg_0"
                        castShadow
                        receiveShadow
                        geometry={
                          (
                            nodes[
                              "Scene_Texture-base-gloss-jpg_0"
                            ] as THREE.Mesh
                          ).geometry
                        }
                        material={materials["Texture-base-gloss-jpg"]}
                      />
                      <mesh
                        name="Scene_Texture-base_0"
                        castShadow
                        receiveShadow
                        geometry={
                          (nodes["Scene_Texture-base_0"] as THREE.Mesh).geometry
                        }
                        material={materials["Texture-base"]}
                      />
                      <mesh
                        name="Scene_Texture-base_0001"
                        castShadow
                        receiveShadow
                        geometry={
                          (nodes["Scene_Texture-base_0001"] as THREE.Mesh)
                            .geometry
                        }
                        material={materials["Texture-base"]}
                      />
                    </group>
                  </group>
                  <group
                    name="Waterfall"
                    position={[-4.794, 0.1, 0.351]}
                    rotation={[-Math.PI / 2, 0, 0]}
                  >
                    <group name="Object_23" position={[-14, 15.788, 4.337]}>
                      <mesh
                        name="Waterfall_Texture-base-gloss-jpg_0"
                        castShadow
                        receiveShadow
                        geometry={
                          (
                            nodes[
                              "Waterfall_Texture-base-gloss-jpg_0"
                            ] as THREE.Mesh
                          ).geometry
                        }
                        material={materials["Texture-base-gloss-jpg"]}
                        position={[0, 0, -0.623]}
                      />
                    </group>
                  </group>
                </group>
              </group>
            </group>
          </group>
        </group>
      </RigidBody>
      <group
        name="Object_23"
        position={[-19, 4.9, -15.337]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <mesh
          name="Waterfall_Texture-base-gloss-jpg_0"
          castShadow
          receiveShadow
          geometry={
            (nodes["Waterfall_Texture-base-gloss-jpg_0"] as THREE.Mesh).geometry
          }
          material={
            new THREE.MeshPhysicalMaterial({
              roughness: 0.3,
              metalness: 0.1,
              transmission: 1,
              transparent: true,
              opacity: 1,
              ior: 1.4,
              thickness: 0.1,
              color: 0x00bbcc,
              side: THREE.DoubleSide,
            })
          }
          position={[0, 0, -0.623]}
        />
      </group>
      <group position={[-15.5, 0, -5.4]} rotation={[0, 0, 0]} scale={[1, 1, 1]}>
        <mesh
          name="animeverse"
          castShadow
          receiveShadow
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          geometry={(nodes.animeverse as THREE.Mesh).geometry}
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          material={materials.animeverse as THREE.Material}
          position={[-6.043, 1.152, -17.504]}
          rotation={[Math.PI / 2, 0, 0]}
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          onClick={() => router.push(links[0].link)}
        />
        <mesh
          name="AntakshariPostFinal"
          castShadow
          receiveShadow
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          geometry={(nodes.AntakshariPostFinal as THREE.Mesh).geometry}
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          material={materials.AntakshariPostFinal as THREE.Material}
          position={[-2.743, 1.152, -17.504]}
          rotation={[Math.PI / 2, 0, 0]}
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          onClick={() => router.push(links[0].link)}
        />
        <mesh
          name="bits_with_benifits"
          castShadow
          receiveShadow
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          geometry={(nodes.bits_with_benifits as THREE.Mesh).geometry}
          material={materials["bits with benifits"]}
          position={[-4.943, 1.152, -17.504]}
          rotation={[Math.PI / 2, 0, 0]}
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          onClick={() => router.push(links[0].link)}
        />
        <mesh
          name="final1080plss"
          castShadow
          receiveShadow
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          geometry={(nodes.final1080plss as THREE.Mesh).geometry}
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          material={materials.final1080plss as THREE.Material}
          position={[-7.143, 1.151, -17.504]}
          rotation={[Math.PI / 2, 0, -0.14]}
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          onClick={() => router.push(links[0].link)}
        />
        <mesh
          name="Jam_1080x1080"
          castShadow
          receiveShadow
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          geometry={(nodes.Jam_1080x1080 as THREE.Mesh).geometry}
          material={materials["Jam 1080x1080"]}
          position={[-9.19, 1.151, -16.574]}
          rotation={[Math.PI / 2, 0, -0.733]}
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          onClick={() => router.push(links[0].link)}
        />
        <mesh
          name="mad_ad_insta"
          castShadow
          receiveShadow
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          geometry={(nodes.mad_ad_insta as THREE.Mesh).geometry}
          material={materials["mad ad insta"]}
          position={[-3.843, 1.152, -17.504]}
          rotation={[Math.PI / 2, 0, 0]}
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          onClick={() => router.push(links[0].link)}
        />
        <mesh
          name="meme_wars"
          castShadow
          receiveShadow
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          geometry={(nodes.meme_wars as THREE.Mesh).geometry}
          material={materials["meme wars"]}
          position={[-1.638, 1.152, -17.504]}
          rotation={[Math.PI / 2, 0, 0]}
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          onClick={() => router.push(links[0].link)}
        />
        <mesh
          name="Roadies_Posters@2x"
          castShadow
          receiveShadow
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          geometry={(nodes["Roadies_Posters@2x"] as THREE.Mesh).geometry}
          material={materials["Roadies Posters@2x"]}
          position={[-8.251, 1.151, -17.2]}
          rotation={[Math.PI / 2, 0, -0.471]}
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          onClick={() => router.push(links[0].link)}
        />
        <mesh
          name="Non_technical"
          castShadow
          receiveShadow
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          geometry={(nodes.Non_technical as THREE.Mesh).geometry}
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          material={materials.Material as THREE.Material}
          position={[-7.513, 2.152, -17.545]}
          rotation={[Math.PI / 2, 0, 0]}
        />
        <mesh
          name="Respawn"
          castShadow
          receiveShadow
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          geometry={(nodes.Respawn as THREE.Mesh).geometry}
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          material={materials.Respawn as THREE.Material}
          position={[-10.461, 1.152, -9.364]}
          rotation={[Math.PI / 2, 0, -Math.PI / 2]}
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          onClick={() => router.push(links[0].link)}
        />
        <mesh
          name="Thinking_Cap_squar"
          castShadow
          receiveShadow
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          geometry={(nodes.Thinking_Cap_squar as THREE.Mesh).geometry}
          material={materials["Thinking Cap [squar]"]}
          position={[-10.461, 1.152, -11.564]}
          rotation={[Math.PI / 2, 0, -Math.PI / 2]}
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          onClick={() => router.push(links[0].link)}
        />
        <mesh
          name="Special"
          castShadow
          receiveShadow
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          geometry={(nodes.Special as THREE.Mesh).geometry}
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          material={materials.Material as THREE.Material}
          position={[-10.46, 2.152, -9.774]}
          rotation={[Math.PI / 2, 0, -Math.PI / 2]}
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          onClick={() => router.push(links[0].link)}
        />
        <mesh
          name="post"
          castShadow
          receiveShadow
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          geometry={(nodes.post as THREE.Mesh).geometry}
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          material={materials.post as THREE.Material}
          position={[-10.459, 1.152, -10.464]}
          rotation={[Math.PI / 2, 0, -Math.PI / 2]}
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          onClick={() => router.push(links[0].link)}
        />
        <mesh
          name="paint_nd_pixel_insta"
          castShadow
          receiveShadow
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          geometry={(nodes.paint_nd_pixel_insta as THREE.Mesh).geometry}
          material={materials["paint nd pixel insta"]}
          position={[-10.466, 1.151, -12.664]}
          rotation={[Math.PI / 2, 0, -Math.PI / 2]}
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          onClick={() => router.push(links[0].link)}
        />
        <mesh
          name="bomb_squad_10"
          castShadow
          receiveShadow
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          geometry={(nodes.bomb_squad_10 as THREE.Mesh).geometry}
          material={materials["bomb squad 10"]}
          position={[0.72, 1.151, -3.719]}
          rotation={[Math.PI / 2, 0, 2.845]}
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          onClick={() => router.push(links[0].link)}
        />
        <mesh
          name="cc-insta_Final"
          castShadow
          receiveShadow
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          geometry={(nodes["cc-insta_Final"] as THREE.Mesh).geometry}
          material={materials["cc-insta Final"]}
          position={[-6.83, 1.151, -3.59]}
          rotation={[Math.PI / 2, 0, -3.054]}
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          onClick={() => router.push(links[0].link)}
        />
        <mesh
          name="civil_instagram_final"
          castShadow
          receiveShadow
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          geometry={(nodes.civil_instagram_final as THREE.Mesh).geometry}
          material={materials["civil instagram final"]}
          position={[-1.54, 1.151, -3.57]}
          rotation={[Math.PI / 2, 0, Math.PI]}
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          onClick={() => router.push(links[0].link)}
        />
        <mesh
          name="Code-Relay@Square"
          castShadow
          receiveShadow
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          geometry={(nodes["Code-Relay@Square"] as THREE.Mesh).geometry}
          material={materials["Code-Relay@Square"]}
          position={[2.547, 1.151, -4.918]}
          rotation={[Math.PI / 2, 0, 2.286]}
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          onClick={() => router.push(links[0].link)}
        />
        <mesh
          name="Escape_RoomSquar-1"
          castShadow
          receiveShadow
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          geometry={(nodes["Escape_RoomSquar-1"] as THREE.Mesh).geometry}
          material={materials["Escape Room[Squar]-1"]}
          position={[-4.698, 1.151, -3.57]}
          rotation={[Math.PI / 2, 0, Math.PI]}
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          onClick={() => router.push(links[0].link)}
        />
        <mesh
          name="IMG_2654"
          castShadow
          receiveShadow
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          geometry={(nodes.IMG_2654 as THREE.Mesh).geometry}
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          material={materials.IMG_2654 as THREE.Material}
          position={[-3.648, 1.151, -3.57]}
          rotation={[Math.PI / 2, 0, Math.PI]}
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          onClick={() => router.push(links[0].link)}
        />
        <mesh
          name="insta"
          castShadow
          receiveShadow
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          geometry={(nodes.insta as THREE.Mesh).geometry}
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          material={materials.insta as THREE.Material}
          position={[-7.985, 1.151, -3.874]}
          rotation={[Math.PI / 2, 0, -2.827]}
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          onClick={() => router.push(links[0].link)}
        />
        <mesh
          name="Lakshman_rekha_1_1"
          castShadow
          receiveShadow
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          geometry={(nodes.Lakshman_rekha_1_1 as THREE.Mesh).geometry}
          material={materials["Lakshman rekha 1_1"] as THREE.Material}
          position={[1.737, 1.151, -4.212]}
          rotation={[Math.PI / 2, 0, 2.531]}
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          onClick={() => router.push(links[0].link)}
        />
        <mesh
          name="post001"
          castShadow
          receiveShadow
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          geometry={(nodes.post001 as THREE.Mesh).geometry}
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          material={materials.post as THREE.Material}
          position={[-9.062, 1.151, -4.472]}
          rotation={[Math.PI / 2, 0, -2.461]}
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          onClick={() => router.push(links[0].link)}
        />
        <mesh
          name="Robosoccer_1080x1080"
          castShadow
          receiveShadow
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          geometry={(nodes.Robosoccer_1080x1080 as THREE.Mesh).geometry}
          material={materials["Robosoccer 1080x1080"]}
          position={[-0.415, 1.151, -3.57]}
          rotation={[Math.PI / 2, 0, Math.PI]}
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          onClick={() => router.push(links[0].link)}
        />
        <mesh
          name="Sherlocked@square"
          castShadow
          receiveShadow
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          geometry={(nodes["Sherlocked@square"] as THREE.Mesh).geometry}
          material={materials["Sherlocked@square"]}
          position={[-9.841, 1.151, -5.36]}
          rotation={[Math.PI / 2, 0, -2.164]}
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          onClick={() => router.push(links[0].link)}
        />
        <mesh
          name="square_"
          castShadow
          receiveShadow
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          geometry={(nodes.square_ as THREE.Mesh).geometry}
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          material={materials.square_ as THREE.Material}
          position={[-2.585, 1.151, -3.57]}
          rotation={[Math.PI / 2, 0, Math.PI]}
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          onClick={() => router.push(links[0].link)}
        />
        <mesh
          name="wired_square"
          castShadow
          receiveShadow
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          geometry={(nodes.wired_square as THREE.Mesh).geometry}
          material={materials["wired square"]}
          position={[-5.751, 1.151, -3.57]}
          rotation={[Math.PI / 2, 0, Math.PI]}
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          onClick={() => router.push(links[0].link)}
        />
        <mesh
          name="technical"
          castShadow
          receiveShadow
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          geometry={(nodes.technical as THREE.Mesh).geometry}
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          material={materials.Material as THREE.Material}
          position={[-2.116, 2.151, -3.612]}
          rotation={[Math.PI / 2, 0, Math.PI]}
        />
        <mesh
          name="Text"
          castShadow
          receiveShadow
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          geometry={(nodes.Text as THREE.Mesh).geometry}
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          material={materials.Material as THREE.Material}
          position={[5.845, 4.329, -9.904]}
          rotation={[1.588, -0.127, -1.634]}
          scale={0.714}
        />
        <mesh
          name="Text001"
          castShadow
          receiveShadow
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          geometry={(nodes.Text001 as THREE.Mesh).geometry}
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          material={materials.Material as THREE.Material}
          position={[22.804, 3.06, 22.442]}
          rotation={[1.525, 0, -Math.PI / 2]}
          scale={0.779}
        />
      </group>
    </group>
  );
};

useGLTF.preload(CONSTANT.ASSETS["3D"].MEDIEVAL_BOUNDED);
