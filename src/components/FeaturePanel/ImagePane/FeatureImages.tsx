import React from 'react';
import styled from '@emotion/styled';
import { useLoadImages } from './useLoadImages';
import { NoImage } from './NoImage';
import { HEIGHT, ImageSkeleton, isElementVisible } from './helpers';
import { Gallery } from './Gallery';
import { SwitchImageArrows } from './SwitchImageArrow';

export const Wrapper = styled.div`
  height: calc(${HEIGHT}px + 10px); // 10px for scrollbar
  min-height: calc(${HEIGHT}px + 10px); // otherwise it shrinks b/c of flex
  width: 100%;
  position: relative;
`;

const StyledScrollbars = styled.div`
  width: 100%;
  height: 100%;

  white-space: nowrap;
  text-align: center; // one image centering

  display: flex;
  gap: 3px;
  overflow: hidden;
  overflow-x: auto;
  scroll-snap-type: x mandatory;

  scroll-behavior: smooth;
`;

export const Slider = ({ children, onScroll }) => (
  <StyledScrollbars onScroll={onScroll}>{children}</StyledScrollbars>
);

export const FeatureImages = () => {
  const { loading, groups } = useLoadImages();
  const [rightBouncing, setRightBouncing] = React.useState(true);
  const [visibleIndex, setVisibleIndex] = React.useState(0);

  const galleryRefs = React.useRef<React.RefObject<HTMLDivElement>[]>([]);
  galleryRefs.current = groups.map(
    (_, i) => galleryRefs.current[i] ?? React.createRef(),
  );

  if (groups.length === 0) {
    return <Wrapper>{loading ? <ImageSkeleton /> : <NoImage />}</Wrapper>;
  }

  return (
    <Wrapper>
      <SwitchImageArrows
        rightBouncing={rightBouncing}
        showLeft={visibleIndex !== 0}
        showRight={visibleIndex !== groups.length - 1}
        onClick={(pos) => {
          setRightBouncing(false);

          const target =
            pos === 'right'
              ? galleryRefs.current[visibleIndex + 1]
              : galleryRefs.current[visibleIndex - 1];

          target?.current.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
            inline: 'center',
          });
        }}
      />
      <Slider
        onScroll={() => {
          const currentIndex = galleryRefs.current.findIndex(
            ({ current: el }) => isElementVisible(el),
          );
          setVisibleIndex(currentIndex);
        }}
      >
        {groups.map((group, i) => (
          <Gallery
            key={i}
            ref={galleryRefs.current[i]}
            def={group.def}
            images={group.images}
            isFirst={i === 0}
          />
        ))}
      </Slider>
    </Wrapper>
  );
};
