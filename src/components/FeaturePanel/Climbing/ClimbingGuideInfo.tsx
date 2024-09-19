import React from 'react';
import { Typography } from '@mui/material';
import { useFeatureContext } from '../../utils/FeatureContext';
import { t } from '../../../services/intl';
import { TooltipButton } from '../../utils/TooltipButton';
import styled from '@emotion/styled';

const Container = styled.div`
  font-size: 14px;
  margin-bottom: 12px;
`;

export const ClimbingGuideInfo = () => {
  const { feature } = useFeatureContext();

  if (
    !['crag', 'area', 'route', 'route_bottom', 'route_top'].includes(
      feature.tags.climbing,
    )
  ) {
    return null;
  }

  return (
    <Container>
      <Typography variant="body2">
        {t('climbing.guideinfo.title')}{' '}
        <TooltipButton tooltip={t('climbing.guideinfo.description')} />
      </Typography>
    </Container>
  );
};
