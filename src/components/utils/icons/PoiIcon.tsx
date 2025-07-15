import { useUserThemeContext } from '../../../helpers/theme';
import { useTheme } from '@mui/material';
import { AreaIcon } from '../../FeaturePanel/Climbing/AreaIcon';
import { CragIcon } from '../../FeaturePanel/Climbing/CragIcon';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import { Maki } from './Maki';
import React from 'react';
import styled from '@emotion/styled';
import { FeatureTags } from '../../../services/types';
import { getPoiClass } from '../../../services/getPoiClass';

const Container = styled.span`
  margin-right: 6px;
  font-size: 12px;
`;

const ClimbingAreaIcon = (props: { size: number }) => {
  const theme = useTheme();
  return (
    <Container>
      <AreaIcon
        fill={theme.palette.text.secondary}
        stroke={theme.palette.text.secondary}
        height={props.size}
        width={props.size}
      />
    </Container>
  );
};

const ClimbingCragIcon = (props: { size: number }) => {
  const theme = useTheme();
  return (
    <Container>
      <CragIcon
        fill={theme.palette.text.secondary}
        stroke={theme.palette.text.secondary}
        height={props.size}
        width={props.size}
      />
    </Container>
  );
};

const ClimbingRouteIcon = () => (
  <Container>
    <ShowChartIcon fontSize="inherit" color="secondary" />
  </Container>
);

type Props = {
  ico?: string; // ico is supplied only in skeleton (until we have all tags) or point
  tags?: FeatureTags;
  size?: number;
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
}: Props) => {
  const { currentTheme } = useUserThemeContext();

  if (tags) {
    // TODO merge these icons with getPoiClass logic
    const isClimbingArea = tags.climbing === 'area';
    const isClimbingCrag = tags.climbing === 'crag';
    const isClimbingRoute = tags.climbing === 'route_bottom';

    if (isClimbingArea) return <ClimbingAreaIcon size={size} />;
    if (isClimbingCrag) return <ClimbingCragIcon size={size} />;
    if (isClimbingRoute) return <ClimbingRouteIcon />;
  }

  const finalIco = ico ? ico : getPoiClass(tags).class;

  return (
    <Maki
      ico={finalIco}
      invert={currentTheme === 'dark'}
      size={size}
      style={{ opacity: '0.3', position: 'relative', top: 3 }}
      title={title}
      middle={middle}
      themed={themed}
    />
  );
};
