import React from 'react';
import styled from 'styled-components';
import EditIcon from '@mui/icons-material/Edit';
import { IconButton } from '@mui/material';
import { useEditDialogContext } from './helpers/EditDialogContext';
import { PoiDescription } from './ImageSection/PoiDescription';
import { StarButton } from './ImageSection/StarButton';
import { getLabel } from '../../helpers/featureLabel';
import { useFeatureContext } from '../utils/FeatureContext';
import { t } from '../../services/intl';

const StyledEditButton = styled(IconButton)`
  visibility: hidden;
  position: relative;
  top: 3px;
`;
const NameWithEdit = styled.div`
  display: flex;
  gap: 8px;
`;
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
  const { openWithTag } = useEditDialogContext();
  const { feature } = useFeatureContext();
  const label = getLabel(feature);
  const { skeleton, deleted } = feature;
  const editEnabled = !skeleton;

  return (
    <Container>
      <PoiDescription />
      <HeadingContainer>
        <NameWithEdit>
          <Heading $deleted={deleted}>{label}</Heading>
          {/* <YellowedBadge /> */}
          {editEnabled && (
            <div>
              <StyledEditButton
                onClick={() => openWithTag('name')}
                size="small"
              >
                <EditIcon
                  fontSize="small"
                  titleAccess={t('featurepanel.inline_edit_title')}
                />
              </StyledEditButton>
            </div>
          )}
        </NameWithEdit>
        <StarButton />
      </HeadingContainer>
    </Container>
  );
};
