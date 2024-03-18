import React, { useEffect, useRef, useState } from 'react';
import styled, { CSSObject, css } from 'styled-components';

const ShadowContainer = styled.div`
  overflow: auto;
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
`;

interface GradientProps {
  $isVisible: boolean;
  $backgroundColor: string;
}

const gradientBase = css<GradientProps>`
  width: 100%;
  height: 45px;
  z-index: 1;
  position: absolute;
  pointer-events: none;
  opacity: ${({ $isVisible }) => ($isVisible ? 1 : 0)};
  transition: all 2s ease-in;
`;

const GradientBefore = styled.div<GradientProps>`
  ${gradientBase}
  top: 0;
  background: linear-gradient(
    ${({ $backgroundColor }) => $backgroundColor},
    rgba(0 0 0 / 0%)
  );
`;

const GradientAfter = styled.div<GradientProps>`
  ${gradientBase}
  bottom: 0;
  background: linear-gradient(
    rgba(0 0 0 / 0%),
    ${({ $backgroundColor }) => $backgroundColor}
  );
`;

export const useScrollShadow = (deps = []) => {
  const scrollElementRef = useRef<HTMLDivElement>(null);
  const [isScrolledToTop, setIsScrolledToTop] = useState(true);
  const [isScrolledToBottom, setIsScrolledToBottom] = useState(true);

  const setShadows = () => {
    if (scrollElementRef?.current) {
      const { scrollTop, scrollHeight, clientHeight } =
        (scrollElementRef.current as any)?.view ?? scrollElementRef.current; // hack because of react-custom-scroll

      setIsScrolledToTop(scrollTop === 0);
      setIsScrolledToBottom(
        Math.ceil(scrollTop + clientHeight) >= scrollHeight,
      );
    }
  };

  useEffect(() => {
    setShadows();
  }, deps);

  useEffect(() => {
    window.addEventListener('resize', () => setShadows());
    window.addEventListener('orientationchange', () => setShadows());

    return () => {
      window.removeEventListener('resize', () => setShadows());
      window.removeEventListener('orientationchange', () => setShadows());
    };
  }, []);

  const onScroll = () => {
    setShadows();
  };
  type ShadowProps = { backgroundColor: string; style?: CSSObject };

  const ShadowTop = ({ backgroundColor, style }: ShadowProps) => (
    <GradientBefore
      $backgroundColor={backgroundColor}
      style={style}
      $isVisible={!isScrolledToTop}
    />
  );
  const ShadowBottom = ({ backgroundColor, style }: ShadowProps) => (
    <GradientAfter
      $backgroundColor={backgroundColor}
      style={style}
      $isVisible={!isScrolledToBottom}
    />
  );

  return {
    scrollElementRef,
    onScroll,
    ShadowContainer,
    ShadowTop,
    ShadowBottom,
  };
};
