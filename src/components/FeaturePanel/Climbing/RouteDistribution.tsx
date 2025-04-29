import styled from '@emotion/styled';
import { useTheme } from '@emotion/react';
import React from 'react';
import {
  ClimbingContextProvider,
  useClimbingContext,
} from './contexts/ClimbingContext';
import { convertGrade, getDifficultyColor } from './utils/grades/routeGrade';
import { ContentContainer } from './ContentContainer';
import { GRADE_TABLE } from './utils/grades/gradeData';
import { useUserSettingsContext } from '../../utils/UserSettingsContext';
import { isClimbingRelation } from '../../../utils';
import { getReactKey } from '../../../services/helpers';
import { useFeatureContext } from '../../utils/FeatureContext';
import { GradeSystem } from '../../../services/tagging/climbing';

const MAX_HEIGHT = 100;

const Container = styled.div`
  margin: 16px 12px 12px;
`;

const Items = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 4px;
`;

const NumberOfRoutes = styled.div`
  text-align: center;
  font-size: 9px;
`;
const Column = styled.div`
  flex: 1;
`;
const DifficultyLevel = styled.div<{ $isActive: boolean; $color: string }>`
  text-align: center;
  color: ${({ $color, $isActive, theme }) =>
    $isActive ? $color : theme.palette.secondary.main};
  font-weight: bold;
  font-size: 11px;
`;

const StaticHeightContainer = styled.div`
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex-direction: column;
`;

const Chart = styled.div<{ $ratio: number; $color: string }>`
  height: ${({ $ratio }) => MAX_HEIGHT * $ratio}px;
  background-color: ${({ $color, theme, $ratio }) =>
    $ratio === 0 ? theme.palette.secondary.main : $color};
  border-radius: 2px;
  width: 100%;
`;

const getGroupingLabel = (label: string, gradeSystem: GradeSystem) => {
  if (gradeSystem === 'saxon') {
    const match = label.match(/^[A-Z]+/);
    return match ? match[0] : '';
  }
  if (gradeSystem === 'hueco') {
    const match = label.match(/^[A-Z0-9]+/);
    return match ? match[0] : '';
  }
  return String(parseFloat(label));
};

export const RouteDistribution = () => {
  const { userSettings } = useUserSettingsContext();
  const gradeSystem = userSettings['climbing.gradeSystem'] || 'uiaa';

  const theme = useTheme();
  const { routes } = useClimbingContext();
  if (routes.length === 0) return null;

  const prepareOccurrenceStructure = () =>
    GRADE_TABLE[gradeSystem].reduce<{ [grade: string]: number }>(
      (acc, grade) => ({
        ...acc,
        [getGroupingLabel(grade, gradeSystem)]: 0,
      }),
      {},
    );

  const getOccurrences = () => {
    const structure = prepareOccurrenceStructure();
    return routes.reduce((acc, route) => {
      if (!route.difficulty) return acc;
      const convertedGrade = convertGrade(
        route.difficulty.gradeSystem,
        gradeSystem,
        route.difficulty.grade,
      );
      const newGrade = getGroupingLabel(convertedGrade, gradeSystem);
      if (!structure) return {};
      const updatedKey = Object.keys(structure).find(
        (grade) => grade === newGrade,
      );
      if (updatedKey === undefined) return acc;
      return { ...acc, [updatedKey]: acc[updatedKey] + 1 };
    }, structure);
  };

  const routeOccurrences = getOccurrences();

  if (!routeOccurrences) return null;

  const heightsRatios = Object.keys(routeOccurrences).map((key) => ({
    grade: key,
    ratio: routeOccurrences[key] / routes.length,
  }));
  if (heightsRatios.length < 2) return null;

  return (
    <Container>
      <ContentContainer>
        <Items>
          {heightsRatios.map((heightRatioItem) => {
            const color = getDifficultyColor(
              {
                gradeSystem: gradeSystem,
                grade: heightRatioItem.grade,
              },
              theme,
            );
            const numberOfRoutesKey = Object.keys(routeOccurrences).find(
              (key) => key === heightRatioItem.grade,
            );
            const numberOfRoutes = routeOccurrences[numberOfRoutesKey];
            const isColumnActive = numberOfRoutes > 0;
            return (
              <Column key={heightRatioItem.grade}>
                <StaticHeightContainer>
                  {numberOfRoutes > 0 && (
                    <NumberOfRoutes>{numberOfRoutes}x</NumberOfRoutes>
                  )}
                  <Chart $color={color} $ratio={heightRatioItem.ratio} />
                </StaticHeightContainer>
                <DifficultyLevel $color={color} $isActive={isColumnActive}>
                  {heightRatioItem.grade === 'NaN'
                    ? '?'
                    : heightRatioItem.grade}
                </DifficultyLevel>
              </Column>
            );
          })}
        </Items>
      </ContentContainer>
    </Container>
  );
};

export const RouteDistributionInPanel = () => {
  const { feature } = useFeatureContext();

  if (
    isClimbingRelation(feature) && // only for this condition is memberFeatures fetched
    feature.tags.climbing === 'crag'
  ) {
    return (
      <ClimbingContextProvider feature={feature} key={getReactKey(feature)}>
        <RouteDistribution />
      </ClimbingContextProvider>
    );
  }

  return null;
};
