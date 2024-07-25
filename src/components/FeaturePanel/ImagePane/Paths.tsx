import React from 'react';
import styled, { useTheme } from 'styled-components';
import { Feature, ImageDefFromTag, PathType } from '../../../services/types';
import {
  getDifficulty,
  getDifficultyColor,
} from '../Climbing/utils/grades/routeGrade';
import { Size } from './types';
import { useFeatureContext } from '../../utils/FeatureContext';
import { getKey } from '../../../services/helpers';

const StyledSvg = styled.svg`
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 100%;
  pointer-events: none;

  path {
    stroke-linecap: round;
    stroke-linejoin: round;
    fill: none;
  }
`;

const PathSvg = ({ children, size }) => (
  <StyledSvg
    viewBox={`0 0 ${size.width} ${size.height}`}
    preserveAspectRatio="none"
  >
    {children}
  </StyledSvg>
);

const PathBorder = styled.path<{ $color: string }>`
  stroke-width: 1.3%;
  stroke: ${({ $color }) => $color};
`;

const PathLine = styled.path<{ $color: string }>`
  stroke-width: 1%;
  stroke: ${({ $color }) => $color};
`;

type PathProps = {
  path: PathType;
  feature: Feature;
  size: Size;
};
const Path = ({ path, feature, size }: PathProps) => {
  const theme = useTheme();

  const d = path
    .map(
      ({ x, y }, idx) =>
        `${!idx ? 'M' : 'L'}${x * size.width} ${y * size.height}`,
    )
    .join(',');

  const color = getDifficultyColor(getDifficulty(feature.tags), theme);
  const contrastColor = theme.palette.getContrastText(color);

  return (
    <>
      <PathBorder d={d} $color={contrastColor} />
      <PathLine d={d} $color={color} />
    </>
  );
};

type PathsProps = {
  def: ImageDefFromTag;
  size: Size;
};

export const Paths = ({ def, size }: PathsProps) => {
  const { feature } = useFeatureContext();
  return (
    <PathSvg size={size}>
      {def.path && <Path path={def.path} feature={feature} size={size} />}
      {def.memberPaths?.map(({ path, member }) => (
        <Path key={getKey(member)} path={path} feature={member} size={size} />
      ))}
    </PathSvg>
  );
};
