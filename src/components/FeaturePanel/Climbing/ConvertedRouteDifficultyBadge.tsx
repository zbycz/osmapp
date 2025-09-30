import React from 'react';
import styled from '@emotion/styled';
import { findOrConvertRouteGrade } from '../../../services/tagging/climbing/routeGrade';
import { getGradeSystemName } from '../../../services/tagging/climbing/gradeSystems';
import { useUserSettingsContext } from '../../utils/userSettings/UserSettingsContext';
import { RouteDifficulty } from './types';
import { RouteDifficultyBadge } from './RouteDifficultyBadge';

const TooltipGradeItemContainer = styled.div`
  white-space: nowrap;
`;

const GradeValue = styled.span`
  font-family: monospace;
  font-weight: bold;
`;

const WarningText = styled.span`
  color: ${({ theme }) => theme.palette.primary.main};
  font-weight: bold;
  font-style: italic;
`;

const TooltipGradeItem = ({
  difficulty,
  isConverted = false,
}: {
  difficulty: RouteDifficulty;
  isConverted?: boolean;
}) => {
  const name = getGradeSystemName(difficulty.gradeSystem);
  return (
    <TooltipGradeItemContainer>
      <GradeValue>{difficulty.grade}</GradeValue> according to{' '}
      <strong>{name || difficulty.gradeSystem}</strong>{' '}
      {isConverted && <WarningText>(converted)</WarningText>}
      {difficulty.grade.includes('~') && <WarningText>(estimated)</WarningText>}
    </TooltipGradeItemContainer>
  );
};

type Props = {
  routeDifficulties?: RouteDifficulty[];
};

export const ConvertedRouteDifficultyBadge = ({ routeDifficulties }: Props) => {
  const { userSettings } = useUserSettingsContext();
  const selectedRouteSystem = userSettings['climbing.gradeSystem'];
  const { isConverted, routeDifficulty } = findOrConvertRouteGrade(
    routeDifficulties,
    selectedRouteSystem,
  );

  return (
    <RouteDifficultyBadge
      routeDifficulty={routeDifficulty}
      tooltip={
        <>
          <TooltipGradeItem
            difficulty={routeDifficulty}
            isConverted={isConverted}
          />
          {routeDifficulties &&
            routeDifficulties
              .filter(
                (difficulty) =>
                  difficulty.gradeSystem !== routeDifficulty?.gradeSystem,
              )
              .map((difficulty) => (
                <TooltipGradeItem
                  difficulty={difficulty}
                  key={`${difficulty.grade}-${difficulty.gradeSystem}`}
                />
              ))}
        </>
      }
    />
  );
};
