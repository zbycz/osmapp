import React, { useCallback, useEffect, useRef, useState } from 'react';
import styled from '@emotion/styled';
import { positionValues, Scrollbars } from 'react-custom-scrollbars';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { HEIGHT } from './helpers';
import { PROJECT_ID } from '../../../services/project';

const isOpenClimbing = PROJECT_ID === 'openclimbing';
const SCROLL_RATIO = 0.8;

const SliderWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;

const StyledScrollbars = styled(Scrollbars)`
  width: 100%;
  height: 100%;
  white-space: nowrap;
  ${!isOpenClimbing && `text-align: center;`} // one image centering

  overflow-y: hidden;
  overflow-x: auto;
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
`;

const ArrowButton = styled.button<{ $side: 'left' | 'right' }>`
  position: absolute;
  ${({ $side }) => $side}: 8px;
  top: ${HEIGHT / 2}px;
  transform: translateY(-50%);
  z-index: 2;

  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  padding: 0;
  border: 0;
  border-radius: 50%;
  color: #fff;
  background-color: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(2px);
  cursor: pointer;

  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s ease-out;

  svg {
    font-size: 18px;
  }

  &:hover {
    background-color: rgba(0, 0, 0, 0.65);
  }

  ${SliderWrapper}:hover & {
    opacity: 1;
    pointer-events: auto;
  }

  @media (hover: none) {
    display: none;
  }
`;

// react-custom-scrollbars doesn't expose the scrolling element in its typings
const getView = (scrollbars: Scrollbars | null) =>
  (scrollbars as unknown as { view?: HTMLElement } | null)?.view;

const useScrollable = (scrollbarsRef: React.RefObject<Scrollbars>) => {
  const [scrollable, setScrollable] = useState({ left: false, right: false });

  const update = useCallback(
    ({ scrollLeft, scrollWidth, clientWidth }: positionValues) => {
      const left = scrollLeft > 1;
      const right = scrollLeft + clientWidth < scrollWidth - 1;
      setScrollable((prev) =>
        prev.left === left && prev.right === right ? prev : { left, right },
      );
    },
    [],
  );

  useEffect(() => {
    const view = getView(scrollbarsRef.current);
    if (!view) {
      return undefined;
    }

    const onImageLoad = () => update(scrollbarsRef.current.getValues());
    view.addEventListener('load', onImageLoad, true);
    return () => view.removeEventListener('load', onImageLoad, true);
  }, [scrollbarsRef, update]);

  const scrollByPage = (direction: 1 | -1) => () => {
    const view = getView(scrollbarsRef.current);
    view?.scrollTo({
      left: view.scrollLeft + direction * view.clientWidth * SCROLL_RATIO,
      behavior: 'smooth',
    });
  };

  return { scrollable, update, scrollByPage };
};

export const Slider = ({ children }) => {
  const scrollbarsRef = useRef<Scrollbars>(null);
  const { scrollable, update, scrollByPage } = useScrollable(scrollbarsRef);

  return (
    <SliderWrapper>
      <StyledScrollbars
        universal
        autoHide
        suppressHydrationWarning={true}
        ref={scrollbarsRef}
        onUpdate={update}
        onScrollFrame={update}
      >
        {children}
      </StyledScrollbars>
      {scrollable.left && (
        <ArrowButton
          $side="left"
          type="button"
          aria-label="Scroll left"
          onClick={scrollByPage(-1)}
        >
          <ChevronLeftIcon />
        </ArrowButton>
      )}
      {scrollable.right && (
        <ArrowButton
          $side="right"
          type="button"
          aria-label="Scroll right"
          onClick={scrollByPage(1)}
        >
          <ChevronRightIcon />
        </ArrowButton>
      )}
    </SliderWrapper>
  );
};
