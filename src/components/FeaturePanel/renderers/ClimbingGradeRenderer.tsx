import React from 'react';
import styled from '@emotion/styled';
import { RouteDifficultyBadge } from '../Climbing/RouteDifficultyBadge';
import {
  getDifficulties,
  getGradeSystemFromOsmTag,
} from '../Climbing/utils/grades/routeGrade';
import { getGradeSystemName } from '../../../services/tagging/climbing';
import { t } from '../../../services/intl';

const Container = styled.div`
  display: flex;
  gap: 8px;
`;

export const ClimbingGradeRenderer = ({ k, v }) => {
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
