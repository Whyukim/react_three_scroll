import { Scroll } from "@react-three/drei";
import { useRef } from "react";
import { threeStore } from "../../stores/threeStore";
import styled from "styled-components";

interface MovingDOMProps {}

function MovingDOM({}: MovingDOMProps) {
  const loadingComplete = threeStore((state) => state.loadingComplete);

  const article01Ref = useRef(null);
  const article02Ref = useRef(null);
  const article03Ref = useRef(null);
  const article04Ref = useRef(null);
  const article05Ref = useRef(null);
  const article06Ref = useRef(null);
  const article07Ref = useRef(null);
  const article08Ref = useRef(null);

  if (!loadingComplete) return null;
  return (
    <Scroll html>
      <ArticleWrapper ref={article01Ref}></ArticleWrapper>
      <ArticleWrapper ref={article02Ref}></ArticleWrapper>
      <ArticleWrapper ref={article03Ref}></ArticleWrapper>
      <ArticleWrapper ref={article04Ref}></ArticleWrapper>
      <ArticleWrapper ref={article05Ref}></ArticleWrapper>
      <ArticleWrapper ref={article06Ref}></ArticleWrapper>
      <ArticleWrapper ref={article07Ref}></ArticleWrapper>
      <ArticleWrapper ref={article08Ref}></ArticleWrapper>
    </Scroll>
  );
}

export default MovingDOM;

const ArticleWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  opacity: 0;
  width: 100vw;
  height: 100vh;
  background-color: transparent;
  color: #fff;
  font-size: 24px;
  padding: 40px;
`;
