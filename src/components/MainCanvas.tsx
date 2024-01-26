import { ScrollControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import * as THREE from "three";
import Dancer from "./Dancer";
import Loader from "./Loader";
import MovingDOM from "./dom/MovingDOM";
import { threeStore } from "../stores/threeStore";

interface MainCanvasProps {}

function MainCanvas({}: MainCanvasProps) {
  const loadingComplete = threeStore((state) => state.loadingComplete);
  const aspectRatio = window.innerWidth / window.innerHeight;

  return (
    <Canvas
      id="canvas"
      gl={{ antialias: true }}
      shadows="soft"
      camera={{
        fov: 30,
        aspect: aspectRatio,
        near: 0.01,
        far: 1000,
        position: [0, 6, 12],
      }}
      scene={{ background: new THREE.Color(0x000000) }}
    >
      <ScrollControls pages={loadingComplete ? 8 : 0} damping={0.25}>
        <Suspense fallback={<Loader />}>
          <MovingDOM />
          <Dancer />
        </Suspense>
      </ScrollControls>
    </Canvas>
  );
}

export default MainCanvas;
