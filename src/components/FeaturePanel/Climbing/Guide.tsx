import React, { useContext } from 'react';
import styled from 'styled-components';
import { Alert } from '@material-ui/lab';
import { t } from '../../../services/intl';
import { ClimbingEditorContext } from './contexts/climbingEditorContext';

const GuideContainer = styled.div`
  padding: 10px;
`;

export const Guide = ({ tempRoute }) => {
  const { isSelectedRouteEditable } = useContext(ClimbingEditorContext);

  return (
    <GuideContainer>
      {isSelectedRouteEditable && (
        <Alert severity="info" variant="filled">
          {tempRoute.length === 0
            ? t('climbingpanel.create_first_node')
            : t('climbingpanel.create_next_node')}
        </Alert>
      )}
    </GuideContainer>
  );
};