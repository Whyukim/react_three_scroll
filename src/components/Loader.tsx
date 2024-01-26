import { Html, useProgress } from "@react-three/drei";
import { threeStore } from "../stores/threeStore";
import styled, { keyframes } from "styled-components";

interface LoaderProps {
  isCompleted?: boolean;
}

function Loader({ isCompleted }: LoaderProps) {
  const loadingComplete = threeStore((state) => state.loadingComplete);
  const loadingOnChange = threeStore((state) => state.loadingOnChange);

  const progress = useProgress();

  if (loadingComplete) return null;
  return (
    <Html center>
      <BlurBackround />
      <Container>
        <ProgressBar>{isCompleted ? 100 : progress.progress}%</ProgressBar>
        <EnterButton onClick={loadingOnChange}>Enter</EnterButton>
      </Container>
    </Html>
  );
}

export default Loader;

const blink = keyframes`
  0%,100% { opacity: 1}
  50% {opacity:0}
`;

const BlurBackround = styled.div`
  width: 50vw;
  aspect-ratio: 1/1;
  background-color: skyblue;
  border-radius: 50%;
  filter: blur(300px);
`;
const Container = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
`;

const ProgressBar = styled.div`
  font-size: 24px;
  color: #fff;
`;
const EnterButton = styled.button`
  padding: 12px;
  color: #fff;
  border: 1px solid #fff;
  border-radius: 12px;
  background-color: transparent;
  animation: ${blink} 1.5s infinite;
  transition: 0.3s;
  cursor: pointer;

  &:hover {
    background-color: #ccc;
    color: #2b9613;
  }
`;
