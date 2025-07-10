import React from 'react';
import styled from '@emotion/styled';
import EditIcon from '@mui/icons-material/Edit';
import { IconButton, Stack, Tooltip, useMediaQuery } from '@mui/material';
import { useEditDialogContext } from './helpers/EditDialogContext';
import { PoiDescription } from './helpers/PoiDescription';
import { getLabel, getSecondaryLabel } from '../../helpers/featureLabel';
import { useFeatureContext } from '../utils/FeatureContext';
import { t } from '../../services/intl';
import { isMobileDevice, useMobileMode } from '../helpers';
import { QuickActions } from './QuickActions/QuickActions';
import { PROJECT_ID } from '../../services/project';
import { css } from '@emotion/react';

const EditNameContainer = styled.div`
  position: absolute;
  z-index: 1010000;
  right: 0;
  top: 0;
  bottom: 0;
  align-items: center;
  display: flex;
  margin-top: 3px;
  background: ${({ theme }) => theme.palette.background.paper};
`;
const EditNameButton = () => {
  const { openWithTag } = useEditDialogContext();
  const { feature } = useFeatureContext();
  if (feature?.skeleton || isMobileDevice()) {
    return null;
  }

  return (
    <EditNameContainer>
      <Tooltip title={t('featurepanel.inline_edit_title')}>
        <IconButton onClick={() => openWithTag('name')} size="small">
          <EditIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </EditNameContainer>
  );
};

const Container = styled.div<{ showBottomPadding: boolean; isMobile: boolean }>`
  margin-bottom: ${({ showBottomPadding }) =>
    showBottomPadding ? '5px' : '20px'};
  ${({ isMobile }) => !isMobile && 'margin-top: 20px;'}
  ${({ showBottomPadding }) =>
    showBottomPadding && 'padding-bottom: var(--safe-bottom);'}
`;

const HeadingsWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  flex: 1;
  margin-bottom: 8px;
`;

const Headings = () => {
  const isOpenClimbing = PROJECT_ID === 'openclimbing';
  const [isHovered, setIsHovered] = React.useState(false);

  const onMouseEnter = () => {
    setIsHovered(true);
  };
  const onMouseLeave = () => {
    setIsHovered(false);
  };

  const { feature } = useFeatureContext();
  const label = getLabel(feature);
  const secondaryLabel = getSecondaryLabel(feature);
  return (
    <HeadingsWrapper onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
      <Heading $deleted={feature?.deleted} $isOpenClimbing={isOpenClimbing}>
        {label}
      </Heading>
      {secondaryLabel && (
        <SecondaryHeading
          $deleted={feature?.deleted}
          $isOpenClimbing={isOpenClimbing}
        >
          {secondaryLabel}
        </SecondaryHeading>
      )}
      {isHovered && <EditNameButton />}
    </HeadingsWrapper>
  );
};

const Heading = styled.h1<{ $deleted: boolean; $isOpenClimbing: boolean }>`
  font-size: 36px;
  line-height: 1.1;
  ${({ $isOpenClimbing }) =>
    $isOpenClimbing &&
    css`
      font-family: 'Piazzolla', sans-serif;
      font-weight: 900;
      font-size: 46px;
    `}
  margin: 0;
  ${({ $deleted }) => $deleted && 'text-decoration: line-through;'}
`;
const SecondaryHeading = styled.h2<{
  $deleted: boolean;
  $isOpenClimbing: boolean;
}>`
  font-size: 24px;
  line-height: 0.98;
  ${({ $isOpenClimbing }) =>
    $isOpenClimbing &&
    css`
      font-family: 'Piazzolla', sans-serif;
      font-weight: 900;
    `}
  margin: 0;
  ${({ $deleted }) => $deleted && 'text-decoration: line-through;'}
`;

type FeatureHeadingProps = {
  isCollapsed: boolean;
};

export const FeatureHeading = React.forwardRef<
  HTMLDivElement,
  FeatureHeadingProps
>(({ isCollapsed }, ref) => {
  const isMobile = useMobileMode();
  return (
    <Container ref={ref} showBottomPadding={isCollapsed} isMobile={isMobile}>
      <Headings />
      <PoiDescription />

      <QuickActions />
    </Container>
  );
});
FeatureHeading.displayName = 'FeatureHeading';
