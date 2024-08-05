import React from 'react';
import styled from 'styled-components';
import { RouteDifficultyBadge } from '../Climbing/RouteDifficultyBadge';
import {
  getDifficulties,
  getGradeSystemFromOsmTag,
  getGradeSystemName,
} from '../Climbing/utils/grades/routeGrade';
import { t } from '../../../services/intl';

const Container = styled.div`
  display: flex;
  gap: 8px;
`;

export const ClimbingRenderer = ({ k, v }) => {
  const routeDifficulties = getDifficulties({ [k]: v });
  const gradeSystemName = getGradeSystemName(getGradeSystemFromOsmTag(k));
  return (
    <Container>
      <RouteDifficultyBadge routeDifficulty={routeDifficulties[0]} />
      <span>
        {t('climbing_renderer.climbing_grade')}({gradeSystemName})
      </span>
    </Container>
  );
};
