import React from 'react';
import { ImageDef, isTag } from '../../../services/types';
import {
  getImageDefId,
  ImageType,
} from '../../../services/images/getImageDefs';
import styled from '@emotion/styled';
import { PanoramaImg } from './Image/PanoramaImg';
import { GalleryDialog } from './GalleryDialog';
import { UncertainCover } from './Image/UncertainCover';
import { InfoButton } from './Image/InfoButton';
import { PathsSvg } from './PathsSvg';

type GalleryProps = {
  def: ImageDef;
  images: ImageType[];
};

const GalleryWrapper = styled.div`
  scroll-snap-align: center;
  width: 100%;
  height: 100%;
  flex: none;
  position: relative;
  overflow: hidden;
`;

const BgImg = ({ url }: { url: string }) => (
  <img
    src={url}
    style={{
      inset: '0px',
      objectFit: 'cover',
      width: '100%',
      height: '100%',
      position: 'absolute',
      display: 'inline-block',
      filter: 'blur(4px)',
    }}
    loading="lazy"
  />
);

const MainImg = React.forwardRef<
  HTMLImageElement,
  { url: string; alt: string; children?: React.ReactNode }
>(({ url, alt, children }, ref) => (
  <div
    style={{
      position: 'absolute',
      inset: '0',
      height: '100%',
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
    }}
  >
    <img
      ref={ref}
      src={url}
      alt={alt}
      style={{
        objectFit: 'contain',
        height: '100%',
        width: 'auto',
        display: 'inline-block',
      }}
      loading="lazy"
    />
    {children}
  </div>
));

MainImg.displayName = 'MainImg';

type ImageProps = {
  image: ImageType;
  def: ImageDef;
  high: boolean;
  wide: boolean;
  children?: React.ReactNode;
};

const Image = React.forwardRef<HTMLImageElement, ImageProps>(
  ({ image, def, high, wide, children }, ref) => (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        ...(high ? { gridRow: 'span 2' } : {}),
        ...(wide ? { gridColumn: 'span 2' } : {}),
      }}
    >
      <BgImg url={image.imageUrl} />
      <MainImg url={image.imageUrl} alt={getImageDefId(def)} ref={ref}>
        {children}
      </MainImg>
    </div>
  ),
);

Image.displayName = 'Image';

type SeeMoreProps = {
  image: ImageType;
  more: number;
  onClick: () => void;
};

const SeeMoreButton: React.FC<SeeMoreProps> = ({ image, more, onClick }) => (
  <button
    onClick={onClick}
    style={{
      width: '100%',
      height: '100%',
      position: 'relative',
      border: 'none',
      padding: 0,
      background: 'transparent',
      cursor: 'pointer',
    }}
  >
    <BgImg url={image.imageUrl} />
    <span
      style={{
        position: 'relative',
        zIndex: 2,
        color: '#000',
        fontSize: '1rem',
        backgroundColor: 'rgba(212, 212, 216, 0.5)',
        padding: '0.125rem 0.25rem',
        borderRadius: '0.125rem',
      }}
    >
      See {more} More
    </span>
  </button>
);

type GallerySlotProps = {
  images: ImageType[];
  def: ImageDef;
  onSeeMore: () => void;
  index: number;
};

const GallerySlot: React.FC<GallerySlotProps> = ({
  images,
  def,
  onSeeMore,
  index,
}) => {
  const image = images[index];
  const isLastImg = images.length - 1 === index;
  const isBlurredButton = !isLastImg && images.length > 4 && index === 3;
  const hasPaths =
    isTag(def) && !!(def.path?.length || def.memberPaths?.length);

  const imgRef = React.useRef<HTMLImageElement>();

  if (isBlurredButton) {
    return (
      <SeeMoreButton
        key={image.imageUrl}
        image={image}
        more={images.length - 3}
        onClick={() => {
          onSeeMore();
        }}
      />
    );
  }

  return (
    <Image
      key={image.imageUrl}
      image={image}
      def={def}
      high={images.length <= 2 || (images.length === 3 && index === 1)}
      wide={images.length === 1}
      ref={imgRef}
    >
      {hasPaths && imgRef.current && (
        <PathsSvg
          def={def}
          size={{
            width: imgRef.current.width,
            height: imgRef.current.height,
          }}
        />
      )}
    </Image>
  );
};

const GalleryInner: React.FC<GalleryProps> = ({ def, images }) => {
  const [opened, setOpened] = React.useState(false);

  const panorama = images.find(({ panoramaUrl }) => panoramaUrl);
  if (panorama) {
    return <PanoramaImg url={panorama.panoramaUrl} />;
  }

  return (
    <>
      <GalleryDialog
        images={images}
        def={def}
        opened={opened}
        onClose={() => {
          setOpened(false);
        }}
      />

      <div
        style={{
          display: 'grid',
          gridTemplateRows: '1fr 1fr',
          gridTemplateColumns: '1fr 1fr',
          height: '100%',
          width: '100%',
        }}
      >
        {images.slice(0, 4).map((_, i) => (
          <GallerySlot
            key={i}
            images={images}
            def={def}
            index={i}
            onSeeMore={() => {
              setOpened(true);
            }}
          />
        ))}
      </div>
    </>
  );
};

export const Gallery = React.forwardRef<HTMLDivElement, GalleryProps>(
  ({ def, images }, ref) => {
    const showUncertainCover =
      images.some(({ uncertainImage }) => uncertainImage) &&
      !images.some(({ panoramaUrl }) => panoramaUrl);

    const internalRef = React.useRef<HTMLDivElement>();

    return (
      <GalleryWrapper ref={ref}>
        <div
          ref={internalRef}
          style={{
            display: 'contents',
          }}
        >
          <GalleryInner def={def} images={images} />
          <InfoButton images={images} />
          {showUncertainCover && <UncertainCover />}
        </div>
      </GalleryWrapper>
    );
  },
);

Gallery.displayName = 'Gallery';
