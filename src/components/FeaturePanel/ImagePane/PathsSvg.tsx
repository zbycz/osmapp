import React from 'react';
import styled from '@emotion/styled';
import { useTheme } from '@emotion/react';

import {
  Feature,
  ImageDef,
  ImageDefFromTag,
  isTag,
  PathType,
} from '../../../services/types';
import {
  getDifficulty,
  getDifficultyColor,
} from '../Climbing/utils/grades/routeGrade';

import { Size } from './types';
import { useFeatureContext } from '../../utils/FeatureContext';
import { getKey, getShortId } from '../../../services/helpers';

const StyledSvg = styled.svg`
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 100%;
  pointer-events: none;
`;

const Svg = ({ children, size }) => (
  <StyledSvg
    viewBox={`0 0 ${size.width} ${size.height}`}
    preserveAspectRatio="none" // when we load image we overlay and stretch the svg
  >
    {children}
  </StyledSvg>
);

const PathBorder = styled.path<{ $color: string }>`
  stroke-width: 1.3%;
  stroke: ${({ $color }) => $color};
  stroke-linecap: round;
  stroke-linejoin: round;
  fill: none;
`;

const PathLine = styled.path<{ $color: string }>`
  stroke-width: 1%;
  stroke: ${({ $color }) => $color};
  stroke-linecap: round;
  stroke-linejoin: round;
  fill: none;
`;

type PathProps = {
  path: PathType;
  feature: Feature;
  size: Size;
  isHighlighted?: boolean;
};
const Path = ({
  path,
  feature,
  size: { height, width },
  isHighlighted = false,
}: PathProps) => {
  const theme = useTheme();
  const color = isHighlighted
    ? theme.palette.climbing.selected
    : getDifficultyColor(getDifficulty(feature.tags), theme);
  const contrastColor = theme.palette.getContrastText(color);
  const d = path
    .map(({ x, y }, idx) => `${!idx ? 'M' : 'L'}${x * width} ${y * height}`)
    .join('');
  return (
    <>
      <PathBorder d={d} $color={contrastColor} />
      <PathLine d={d} $color={color} />
    </>
  );
};

type PathsProps = {
  def: ImageDef;
  feature: Feature;
  size: Size;
};
export const Paths = ({ def, feature, size }: PathsProps) => {
  const { preview } = useFeatureContext();

  return (
    isTag(def) && (
      <>
        {def.path && <Path path={def.path} feature={feature} size={size} />}
        {def.memberPaths?.map(({ path, member }) => (
          <Path
            key={getKey(member)}
            path={path}
            feature={member}
            size={size}
            isHighlighted={preview === member}
          />
        ))}
      </>
    )
  );
}; // Careful: used also in image generation, eg. /api/image?id=r6

type PathsSvgProps = {
  def: ImageDefFromTag;
  size: Size;
};
export const PathsSvg = ({ def, size }: PathsSvgProps) => {
  const { feature } = useFeatureContext();
  return (
    <Svg size={size}>
      <Paths def={def} feature={feature} size={size} />
    </Svg>
  );
};
