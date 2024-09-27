import React, { CSSProperties, useEffect, useRef, useState } from 'react';
import styled from '@emotion/styled';
import { css } from '@emotion/react';
import { convertHexToRgba } from '../../../utils/colorUtils';

const DEFAULT_GRADIENT_PERCENTAGE = 3;
const DEFAULT_OPACITY = 0.7;
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
  $gradientPercentage?: number;
  $opacity?: number;
}

const gradientBase = ({ $isVisible }) => css`
  width: 100%;
  height: 100%;
  z-index: 1;
  position: absolute;
  pointer-events: none;
  visibility: ${$isVisible ? 'visible' : 'hidden'};
  transition: all 2s;
`;

const GradientBefore = styled.div<GradientProps>`
  ${gradientBase};
  top: 0;
  background: linear-gradient(
    to top,
    rgba(0 0 0 / 0%)
      ${({ $gradientPercentage = DEFAULT_GRADIENT_PERCENTAGE }) =>
        `${100 - $gradientPercentage}%`},
    ${({ $backgroundColor, $opacity = DEFAULT_OPACITY }) =>
      convertHexToRgba($backgroundColor, $opacity)}
  );
`;

const GradientAfter = styled.div<GradientProps>`
  ${gradientBase};
  bottom: 0;
  background: linear-gradient(
    to bottom,
    rgba(0 0 0 / 0%)
      ${({ $gradientPercentage = DEFAULT_GRADIENT_PERCENTAGE }) =>
        `${100 - $gradientPercentage}%`},
    ${({ $backgroundColor, $opacity = DEFAULT_OPACITY }) =>
      convertHexToRgba($backgroundColor, $opacity)}
  );
`;

const GradientLeft = styled.div<GradientProps>`
  ${gradientBase};
  left: 0;
  height: 100%;
  background: linear-gradient(
    to left,
    rgba(0 0 0 / 0%)
      ${({ $gradientPercentage = DEFAULT_GRADIENT_PERCENTAGE }) =>
        `${100 - $gradientPercentage}%`},
    ${({ $backgroundColor, $opacity = DEFAULT_OPACITY }) =>
      convertHexToRgba($backgroundColor, $opacity)}
  );
`;

const GradientRight = styled.div<GradientProps>`
  ${gradientBase};
  right: 0;
  height: 100%;
  background: linear-gradient(
    to right,
    rgba(0 0 0 / 0%)
      ${({ $gradientPercentage = DEFAULT_GRADIENT_PERCENTAGE }) =>
        `${100 - $gradientPercentage}%`},
    ${({ $backgroundColor, $opacity = DEFAULT_OPACITY }) =>
      convertHexToRgba($backgroundColor, $opacity)}
  );
`;

export const useScrollShadow = (deps = []) => {
  const scrollElementRef = useRef<HTMLDivElement>(null);
  const [isScrolledToTop, setIsScrolledToTop] = useState(true);
  const [isScrolledToBottom, setIsScrolledToBottom] = useState(true);
  const [isScrolledToLeft, setIsScrolledToLeft] = useState(true);
  const [isScrolledToRight, setIsScrolledToRight] = useState(true);

  const setShadows = () => {
    if (scrollElementRef?.current) {
      const {
        scrollTop,
        scrollHeight,
        clientHeight,
        clientWidth,
        scrollLeft,
        scrollWidth,
      } = (scrollElementRef.current as any)?.view ?? scrollElementRef.current; // hack because of react-custom-scroll

      setIsScrolledToTop(scrollTop <= 0);
      setIsScrolledToBottom(
        Math.ceil(scrollTop + clientHeight) >= scrollHeight,
      );
      setIsScrolledToLeft(scrollLeft <= 0);
      setIsScrolledToRight(Math.ceil(scrollLeft + clientWidth) >= scrollWidth);
    }
  };

  useEffect(() => {
    setShadows();
  }, deps); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const handleShadows = () => setShadows();
    window.addEventListener('resize', handleShadows);
    window.addEventListener('orientationchange', handleShadows);

    return () => {
      window.removeEventListener('resize', handleShadows);
      window.removeEventListener('orientationchange', handleShadows);
    };
  }, []);

  const onScroll = () => {
    setShadows();
  };
  type ShadowProps = {
    backgroundColor: string;
    style?: CSSProperties;
    gradientPercentage?: number;
    opacity?: number;
  };

  const ShadowTop = ({
    backgroundColor,
    style,
    gradientPercentage,
    opacity,
  }: ShadowProps) => (
    <GradientBefore
      $backgroundColor={backgroundColor}
      style={style}
      $isVisible={!isScrolledToTop}
      $gradientPercentage={gradientPercentage}
      $opacity={opacity}
    />
  );
  const ShadowBottom = ({
    backgroundColor,
    style,
    gradientPercentage,
    opacity,
  }: ShadowProps) => (
    <GradientAfter
      $backgroundColor={backgroundColor}
      style={style}
      $isVisible={!isScrolledToBottom}
      $gradientPercentage={gradientPercentage}
      $opacity={opacity}
    />
  );
  const ShadowLeft = ({
    backgroundColor,
    style,
    gradientPercentage,
    opacity,
  }: ShadowProps) => (
    <GradientLeft
      $backgroundColor={backgroundColor}
      style={style}
      $isVisible={!isScrolledToLeft}
      $gradientPercentage={gradientPercentage}
      $opacity={opacity}
    />
  );
  const ShadowRight = ({
    backgroundColor,
    style,
    gradientPercentage,
    opacity,
  }: ShadowProps) => (
    <GradientRight
      $backgroundColor={backgroundColor}
      style={style}
      $isVisible={!isScrolledToRight}
      $gradientPercentage={gradientPercentage}
      $opacity={opacity}
    />
  );

  return {
    scrollElementRef,
    onScroll,
    ShadowContainer,
    ShadowTop,
    ShadowBottom,
    ShadowLeft,
    ShadowRight,
  };
};
