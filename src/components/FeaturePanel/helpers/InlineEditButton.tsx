import styled from '@emotion/styled';
import { IconButton, Tooltip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import React from 'react';
import { t } from '../../../services/intl';
import { useEditDialogContext } from './EditDialogContext';
import { useFeatureContext } from '../../utils/FeatureContext';
import { isMobileDevice } from '../../helpers';

const StyledIconButton = styled(IconButton)`
  position: absolute !important; /* TODO mui styles takes precendence, why? */
  right: 1px;
  margin-top: -3px !important;
  display: none !important;
  background: ${({ theme }) => theme.palette.background.paper};
  border: solid 2px ${({ theme }) => theme.palette.divider};
  border-radius: 50%;
  &:hover {
    background: ${({ theme }) => theme.palette.background.default};
  }

  svg {
    /* width: 16px;
    height: 16px; */
    opacity: 0.7;
  }
`;

export const InlineEditButton = ({ k }: { k: string }) => {
  const { openWithTag } = useEditDialogContext();
  const { feature } = useFeatureContext();

  if (feature?.skeleton || isMobileDevice()) {
    return null;
  }

  return (
    <Tooltip title={t('featurepanel.inline_edit_title')}>
      <StyledIconButton
        className="show-on-hover"
        onClick={() => openWithTag(k)}
        size="small"
      >
        <EditIcon fontSize="small" />
      </StyledIconButton>
    </Tooltip>
  );
};
