import Button from '@material-ui/core/Button';
import EditIcon from '@material-ui/icons/Edit';
import React from 'react';
import styled from 'styled-components';
import { t } from '../../services/intl';

const StyledEdit = styled.div`
  margin: 60px 0 20px 0;
  text-align: center;
`;

export const FeatureEditButton = ({ setDialogOpenedWith }) => (
  <StyledEdit>
    <Button
      size="large"
      title={t('featurepanel.edit_button_title')}
      startIcon={<EditIcon />}
      variant="outlined"
      color="primary"
      onClick={() => setDialogOpenedWith(true)}
    >
      {t('featurepanel.edit_button')}
    </Button>
  </StyledEdit>
);
