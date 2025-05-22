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

type GradingType = 'single' | 'avg' | 'min' | 'max';

const getType = (k: string): GradingType => {
  if (k.endsWith(':max')) return 'max';
  if (k.endsWith(':min')) return 'min';
  if (k.endsWith(':mean')) return 'avg';
  return 'single';
};

const typeToLabel: Record<GradingType, string> = {
  single: t('climbing_renderer.climbing_grade_single'),
  avg: t('climbing_renderer.climbing_grade_average'),
  min: t('climbing_renderer.climbing_grade_minimum'),
  max: t('climbing_renderer.climbing_grade_maximum'),
};

export const ClimbingGradeRenderer = ({ k, v }) => {
  const routeDifficulties = getDifficulties({ [k]: v });
  const gradeSystemName = getGradeSystemName(getGradeSystemFromOsmTag(k));
  const type = getType(k);
  const label = typeToLabel[type];

  return (
    <Container>
      <RouteDifficultyBadge routeDifficulty={routeDifficulties[0]} />
      <span>
        {label} ({gradeSystemName})
      </span>
    </Container>
  );
};
