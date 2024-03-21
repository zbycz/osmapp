import React from 'react';
import styled from 'styled-components';
import { useTheme } from '@material-ui/core';
import { FeatureTags } from '../../../services/types';
import { useFeatureContext } from '../../utils/FeatureContext';

const Svg = styled.svg`
  width: 100%;
  height: 200px;
  border: 1px red solid;
`;
const BorderPath = styled.path`
  stroke-width: 5;
  stroke: ${({ theme }) => theme.palette.climbing.border};
  stroke-linecap: round;
  stroke-linejoin: round;
  fill: none;
`;
const LinePath = styled.path`
  stroke-width: 4;
  stroke: ${({ theme }) => theme.palette.climbing.inactive};
  stroke-linecap: round;
  stroke-linejoin: round;
  fill: none;
`;
const PathWithBorder = ({ d }) => {
  return (
    <>
      <BorderPath d={d} />
      <LinePath d={d} />
    </>
  );
};

const parsePathString = (pathString?: string) =>
  pathString
    ?.split('|')
    .map((coords) => coords.split(',', 2))
    .map(([x, y]) => ({
      x: parseFloat(x),
      y: parseFloat(y),
      type: y.slice(-1), // TODO only letter
    }))
    .filter(({ x, y }) => !isNaN(x) && !isNaN(y)) ?? [];

const getImages = (tags: FeatureTags) => {
  const keys = Object.keys(tags).filter((key) =>
    key.match(/^(image|wikimedia_commons):?\d*$/),
  );

  return keys.map((key) => {
    const image = tags[key];
    const path = tags[`${key}:path`];
    const points = parsePathString(path);
    return { key, image, path, points };
  });
};

export const ImagePane = () => {
  const { feature } = useFeatureContext();
  const images = getImages(feature.tags);

  const pointsInString = images[0].points.map(
    ({ x, y }, idx) => `${idx > 0 ? 'L' : 'M'}${x * 100} ${y * 100}`,
  );

  return (
    <div>
      <Svg>
        <PathWithBorder d={`M0 0 ${pointsInString}`} />
      </Svg>
    </div>
  );
};
