import { useState } from 'react';
import styled from '@emotion/styled';
import React, { useEffect, useRef } from 'react';
import Router from 'next/router';
import { Size } from '../types';
import { HEIGHT } from '../helpers';
import { getOsmappLink } from '../../../../services/helpers';
import { removeFilePrefix } from '../../Climbing/utils/photo';
import { Feature, ImageDef, isTag } from '../../../../services/types';

export const initialSize: Size = { width: 100, height: HEIGHT }; // until image size is known, the paths are rendered using this (eg. ssr)

export const useImgSizeOnload = () => {
  const imgRef = useRef<HTMLImageElement>(null);
  const [size, setSize] = useState<Size>(initialSize);
  useEffect(() => {
    if (imgRef.current?.complete) {
      setSize({ width: imgRef.current.width, height: imgRef.current.height }); // SSR case
    }
  }, []);

  const onPhotoLoad = (e) => {
    setSize({ width: e.target.width, height: e.target.height }); // browser case
  };

  return { imgRef, size, onPhotoLoad };
};

export const UncertainCover = styled.div`
  pointer-events: none;
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  backdrop-filter: contrast(0.6) brightness(1.2);
  -webkit-backdrop-filter: contrast(0.6) brightness(1.2);
  box-shadow: inset 0 0 100px rgba(255, 255, 255, 0.3);
`;

export type ImageClickHandler = (e: React.MouseEvent) => void | undefined; // undefined = no cursor

export const filterCrags = (parentFeatures: Array<Feature>) => {
  return parentFeatures.filter((item) => item.tags.climbing === 'crag');
};

export const getUrlToParentCrag = (
  parentFeatures: Array<Feature>,
  photo?: string,
) => {
  const parentCrags = filterCrags(parentFeatures);
  if (parentCrags.length > 0) {
    const featureLink = getOsmappLink(parentCrags[0]);
    return `${featureLink}/climbing/${photo ? `photo/${photo}` : ''}`;
  }
  return null;
};

export const getClickHandler = (
  feature: Feature,
  def: ImageDef,
): ImageClickHandler => {
  if (!isTag(def)) {
    return undefined;
  }

  if (!def.v.startsWith('File:')) {
    return undefined;
  }

  if (feature.tags.climbing === 'crag') {
    return (e: React.MouseEvent) => {
      const featureLink = getOsmappLink(feature);
      const photoLink = removeFilePrefix(def.v);

      Router.push(`${featureLink}/climbing/photo/${photoLink}`);
      e.stopPropagation();
      e.preventDefault();
    };
  }

  if (feature.tags.climbing === 'route_bottom') {
    const cragUrl = getUrlToParentCrag(
      feature.parentFeatures,
      removeFilePrefix(def.v),
    );

    return (e: React.MouseEvent) => {
      if (cragUrl) {
        Router.push(cragUrl);
        e.stopPropagation();
        e.preventDefault();
      }
    };
  }

  return undefined;
};
