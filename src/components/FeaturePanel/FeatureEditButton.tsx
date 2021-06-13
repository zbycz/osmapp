import Button from '@material-ui/core/Button';
import EditIcon from '@material-ui/icons/Edit';
import AddLocationIcon from '@material-ui/icons/AddLocation';
import React from 'react';
import styled from 'styled-components';
import { t } from '../../services/intl';

const StyledEdit = styled.div`
  margin: 60px 0 20px 0;
  text-align: center;
`;

export const FeatureEditButton = ({ add, setDialogOpenedWith }) => (
  <StyledEdit>
    <Button
      size="large"
      startIcon={add ? <AddLocationIcon /> : <EditIcon />}
      variant="outlined"
      color="primary"
      onClick={() => setDialogOpenedWith(true)}
    >
      {add ? t('featurepanel.add_place_button') : t('featurepanel.edit_button')}{' '}
    </Button>
  </StyledEdit>
);
