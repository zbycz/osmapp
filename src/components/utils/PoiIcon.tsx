import { useUserThemeContext } from '../../helpers/theme';
import { useTheme } from '@mui/material';
import { AreaIcon } from '../FeaturePanel/Climbing/AreaIcon';
import { CragIcon } from '../FeaturePanel/Climbing/CragIcon';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import Maki from './Maki';
import React from 'react';
import styled from '@emotion/styled';
import { FeatureTags } from '../../services/types';

const Container = styled.span`
  margin-right: 6px;
  font-size: 12px;
`;
type PoiIconProps = {
  tags?: FeatureTags;
  size?: number;
  ico: string;
  title?: string;
  middle?: boolean;
  themed?: boolean;
};

export const PoiIcon = ({
  ico,
  tags,
  size = 12,
  title,
  middle,
  themed,
}: PoiIconProps) => {
  const { currentTheme } = useUserThemeContext();
  const theme = useTheme();

  if (tags) {
    const isClimbingArea = tags.climbing === 'area';
    const isClimbingCrag = tags.climbing === 'crag';
    const isClimbingRoute = tags.climbing === 'route_bottom';

    if (isClimbingArea)
      return (
        <Container>
          <AreaIcon
            fill={theme.palette.text.secondary}
            stroke={theme.palette.text.secondary}
            height={size}
            width={size}
          />
        </Container>
      );

    if (isClimbingCrag)
      return (
        <Container>
          <CragIcon
            fill={theme.palette.text.secondary}
            stroke={theme.palette.text.secondary}
            height={size}
            width={size}
          />
        </Container>
      );

    if (isClimbingRoute)
      return (
        <Container>
          <ShowChartIcon fontSize="inherit" color="secondary" />
        </Container>
      );
  }
  return (
    <Maki
      ico={ico}
      invert={currentTheme === 'dark'}
      size={size}
      style={{ opacity: '0.3' }}
      title={title}
      middle={middle}
      themed={themed}
    />
  );
};
