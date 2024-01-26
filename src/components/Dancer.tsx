import {
  Box,
  Circle,
  Points,
  useAnimations,
  useGLTF,
  useScroll,
  useTexture,
} from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import gsap from "gsap";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { Object3D } from "three";
import { threeStore } from "../stores/threeStore";
import Loader from "./Loader";

interface DancerProps {}

let timeline: gsap.core.Timeline;
function Dancer({}: DancerProps) {
  const three = useThree();
  const modelRef = useRef<Object3D>(null);
  const scroll = useScroll();

  const loadingComplete = threeStore((state) => state.loadingComplete);
  const { scene, animations } = useGLTF("/models/dancer.glb");
  const texture = useTexture("/texture/star.png");
  const { actions } = useAnimations(animations, modelRef);

  const { positions } = useMemo(() => {
    const count = 500;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 25;
    }

    return { positions };
  }, []);

  useEffect(() => {
    if (!loadingComplete) return;
    // actions["hiphop02"]?.play();
  }, [loadingComplete, actions]);

  useEffect(() => {
    if (!loadingComplete || !modelRef?.current) return;

    // gsap.fromTo(
    //   three.camera.position,
    //   { x: -5, y: 5, z: 5 },
    //   { duration: 2.5, x: 0, y: 6, z: 12 }
    // );
    // gsap.fromTo(three.camera.rotation, { z: Math.PI }, { duration: 2.5, z: 0 });
  }, [loadingComplete, modelRef?.current, three.camera.rotation]);

  useEffect(() => {
    if (!loadingComplete || !modelRef?.current) return;

    timeline = gsap.timeline();
    timeline
      .from(
        modelRef.current.rotation,
        {
          duration: 4,
          y: -4 * Math.PI,
        },
        0.5
      )
      .from(
        modelRef.current.position,
        {
          duration: 4,
          x: 3,
        },
        "<"
      )
      .to(
        three.camera.position,
        {
          duration: 10,
          x: 2,
          z: 8,
        },
        "<"
      )
      .to(three.camera.position, {
        duration: 10,
        x: 0,
        z: 6,
      })
      .to(three.camera.position, {
        duration: 10,
        x: 0,
        z: 16,
      });
  }, [loadingComplete, three.camera.position]);

  // * frame
  useFrame(() => {
    if (!loadingComplete) return;
    timeline.seek(scroll.offset * timeline.duration());
  });

  if (!loadingComplete) return <Loader isCompleted />;
  return (
    <>
      <primitive ref={modelRef} object={scene} scale={0.05} />
      <ambientLight intensity={2} />
      <rectAreaLight position={[0, 10, 0]} intensity={30} />
      <pointLight
        position={[0, 5, 0]}
        intensity={45}
        castShadow
        receiveShadow
      />
      <hemisphereLight
        position={[0, 5, 0]}
        intensity={0}
        groundColor={"lime"}
        color={"blue"}
      />

      <Box position={[0, 0, 0]} args={[100, 100, 100]}>
        <meshStandardMaterial color={"#dc4f00"} side={THREE.DoubleSide} />
      </Box>

      <Circle
        castShadow
        receiveShadow
        args={[8, 12]}
        rotation-x={-Math.PI / 2}
        position-y={-4.4}
      >
        <meshStandardMaterial color={"#dc4f00"} side={THREE.DoubleSide} />
      </Circle>

      <Points positions={positions.slice(0, positions.length / 3)}>
        <pointsMaterial
          size={0.5}
          color={new THREE.Color("#dc4f00")}
          sizeAttenuation
          depthWrite
          alphaMap={texture}
          transparent
          alphaTest={0.001}
        />
      </Points>

      <Points
        positions={positions.slice(
          positions.length / 3,
          (positions.length / 3) * 2
        )}
      >
        <pointsMaterial
          size={0.5}
          color={new THREE.Color("#dc4f00")}
          sizeAttenuation
          depthWrite
          alphaMap={texture}
          transparent
          alphaTest={0.001}
        />
      </Points>

      <Points positions={positions.slice((positions.length / 3) * 2)}>
        <pointsMaterial
          size={0.5}
          color={new THREE.Color("#dc4f00")}
          sizeAttenuation
          depthWrite
          alphaMap={texture}
          transparent
          alphaTest={0.001}
        />
      </Points>
    </>
  );
}

export default Dancer;
