import React from 'react';
import styled from '@emotion/styled';
import EditIcon from '@mui/icons-material/Edit';
import { IconButton } from '@mui/material';
import { useEditDialogContext } from './helpers/EditDialogContext';
import { PoiDescription } from './helpers/PoiDescription';
import { StarButton } from './helpers/StarButton';
import { getLabel } from '../../helpers/featureLabel';
import { useFeatureContext } from '../utils/FeatureContext';
import { t } from '../../services/intl';
import { isMobileDevice } from '../helpers';

const StyledEditButton = styled(IconButton)`
  visibility: hidden;
  position: relative;
  top: 3px;
`;
const NameWithEdit = styled.div`
  display: flex;
  gap: 8px;
`;

const EditNameButton = () => {
  const { openWithTag } = useEditDialogContext();
  const { feature } = useFeatureContext();
  if (feature?.skeleton || isMobileDevice()) {
    return null;
  }

  return (
    <div>
      <StyledEditButton onClick={() => openWithTag('name')} size="small">
        <EditIcon
          fontSize="small"
          titleAccess={t('featurepanel.inline_edit_title')}
        />
      </StyledEditButton>
    </div>
  );
};

const Container = styled.div`
  margin: 12px 0 20px 0;
`;

const HeadingContainer = styled.div`
  margin: 6px 0 4px 0;

  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  position: relative;

  &:hover ${StyledEditButton} {
    visibility: visible;
  }
`;

const Heading = styled.h1<{ $deleted: boolean }>`
  font-size: 36px;
  line-height: 0.98;
  margin: 0;
  ${({ $deleted }) => $deleted && 'text-decoration: line-through;'}
`;

export const FeatureHeading = () => {
  const { feature } = useFeatureContext();
  const label = getLabel(feature);

  return (
    <Container>
      <PoiDescription />
      <HeadingContainer>
        <NameWithEdit>
          <Heading $deleted={feature?.deleted}>{label}</Heading>
          {/* <YellowedBadge /> */}
          <EditNameButton />
        </NameWithEdit>
        <StarButton />
      </HeadingContainer>
    </Container>
  );
};
