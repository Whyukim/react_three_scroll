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
import { RefObject, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { Object3D } from "three";
import { threeStore } from "../stores/threeStore";
import Loader from "./Loader";

interface DancerProps {}

let timeline: gsap.core.Timeline;
const colors = {
  boxMeterialColor: "#dc4f00",
};

function Dancer({}: DancerProps) {
  const three = useThree();
  const modelRef = useRef<Object3D>(null);
  const boxRef = useRef<any>(null);
  const starGroupRef01 = useRef(null);
  const starGroupRef02 = useRef(null);
  const starGroupRef03 = useRef(null);
  const rectAreaLightRef = useRef(null);
  const hemisphereLightRef = useRef(null);
  const [currentAnimation, setCurrentAnimation] = useState("wave");
  const [rotateFinished, setRotateFinished] = useState(false);

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
    three.camera.lookAt(1, 2, 0);
    actions["wave"]?.play();
    three.scene.background = new THREE.Color(colors.boxMeterialColor);
    scene.traverse((obj: any) => {
      if (obj?.isMesh) {
        obj.castShadow = true;
        obj.receiveShadow = true;
      }
    });
  }, [loadingComplete, actions, three.scene, three.camera, scene]);

  useEffect(() => {
    if (!loadingComplete || !modelRef?.current) return;

    gsap.fromTo(
      three.camera.position,
      { x: -5, y: 5, z: 5 },
      { duration: 2.5, x: 0, y: 6, z: 12 }
    );
    gsap.fromTo(three.camera.rotation, { z: Math.PI }, { duration: 2.5, z: 0 });
  }, [loadingComplete, modelRef?.current, three.camera.rotation]);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    if (currentAnimation === "wave") {
      actions[currentAnimation]?.reset().fadeIn(0.5).play();
    } else {
      actions[currentAnimation]
        ?.reset()
        .fadeIn(0.5)
        .play()
        .setLoop(THREE.LoopOnce, 1);
    }

    timeout = setTimeout(() => {
      if (actions[currentAnimation]) {
        actions[currentAnimation]!.paused = true;
      }
    }, 8000);

    return () => clearTimeout(timeout);
  }, [actions, currentAnimation]);

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

    gsap.to(
      colors,
      { boxMeterialColor: "#0c0400" },
      { duration: 2.5, boxMeterialColor: "#dc4f00" }
    );

    gsap.to(starGroupRef01.current, {
      yoyo: true,
      duration: 2,
      repeat: -1,
      ease: "linear",
      size: "0.05",
    });

    gsap.to(starGroupRef02.current, {
      yoyo: true,
      duration: 4,
      repeat: -1,
      ease: "linear",
      size: "0.05",
    });

    gsap.to(starGroupRef03.current, {
      yoyo: true,
      duration: 5,
      repeat: -1,
      ease: "linear",
      size: "0.05",
    });
  }, [loadingComplete, three.camera.position]);

  // * frame
  useFrame(() => {
    if (!loadingComplete) return;
    timeline.seek(scroll.offset * timeline.duration());
    if (boxRef.current)
      boxRef.current.material.color = new THREE.Color(colors.boxMeterialColor);
  });

  if (!loadingComplete) return <Loader isCompleted />;
  return (
    <>
      <primitive ref={modelRef} object={scene} scale={0.05} />
      <ambientLight intensity={2} />
      <rectAreaLight
        ref={rectAreaLightRef}
        position={[0, 10, 0]}
        intensity={30}
      />
      <pointLight
        position={[0, 5, 0]}
        intensity={45}
        castShadow
        receiveShadow
      />
      <hemisphereLight
        ref={hemisphereLightRef}
        position={[0, 5, 0]}
        intensity={0}
        groundColor={"lime"}
        color={"blue"}
      />

      <Box ref={boxRef} position={[0, 0, 0]} args={[100, 100, 100]}>
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
          ref={starGroupRef01}
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
          ref={starGroupRef02}
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
          ref={starGroupRef03}
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
