import styled from '@emotion/styled';
import { useTheme } from '@emotion/react';
import React from 'react';
import {
  convertGrade,
  getDifficulty,
  getDifficultyColor,
} from '../../../services/tagging/climbing/routeGrade';
import { ContentContainer } from './ContentContainer';
import { GRADE_TABLE } from '../../../services/tagging/climbing/gradeData';
import { useUserSettingsContext } from '../../utils/userSettings/UserSettingsContext';
import {
  getGradeSystemName,
  GradeSystem,
} from '../../../services/tagging/climbing/gradeSystems';
import { Feature } from '../../../services/types';
import { convertHexToRgba } from '../../utils/colorUtils';
import { Tooltip } from '@mui/material';
import { t } from '../../../services/intl';
import { isClimbingCrag } from '../../../utils';
import { useFeatureContext } from '../../utils/FeatureContext';
import { GradeSystemSelect } from './GradeSystemSelect';
import { PanelLabel } from './PanelLabel';
import { OverpassFeature } from '../../../services/overpass/overpassSearch';

const MAX_COLUMN_HEIGHT = 40;
const NUMBER_OF_ROUTES_HEIGHT = 14;
const MAX_CHART_HEIGHT = MAX_COLUMN_HEIGHT + NUMBER_OF_ROUTES_HEIGHT;

const Container = styled.div`
  margin: 4px 0px 0px;

  padding: 0 4px 8px 16px;
  overflow: auto;
`;

const Items = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 4px;
`;

const NumberOfRoutes = styled.div`
  font-size: 8px;
  max-width: 15px;
`;
const Column = styled.div`
  flex: 1;
  gap: 4px;
  display: flex;
  flex-direction: column;
`;

const GraphItems = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 4px;
`;
const GradeSystemName = styled.div`
  color: ${({ theme }) => theme.palette.secondary.main};
  font-size: 10px;
  flex: 1;
  text-align: right;
  display: flex;
  justify-content: flex-end;
`;

const DifficultyLevel = styled.div<{ $isActive: boolean; $color: string }>`
  text-align: center;
  color: ${({ $color, $isActive, theme }) =>
    $isActive ? $color : convertHexToRgba(theme.palette.secondary.main, 0.6)};
  font-weight: ${({ $isActive }) => ($isActive ? 'bold' : 'normal')};
  font-size: 9px;
  transform: rotateZ(270deg);
`;

const StaticHeightContainer = styled.div`
  height: ${MAX_CHART_HEIGHT};
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex-direction: column;
`;

const Chart = styled.div<{ $ratio: number; $color: string }>`
  height: ${({ $ratio }) => MAX_COLUMN_HEIGHT * $ratio}px;
  background-color: ${({ $color, theme, $ratio }) =>
    $ratio === 0 ? theme.palette.secondary.main : $color};
  border-radius: 2px;
  width: 15px;
`;

const getGroupingLabel = (label: string, gradeSystem: GradeSystem) => {
  if (gradeSystem === 'saxon') {
    const match = label?.match(/^[A-Z]+/);
    return match ? match[0] : '';
  }
  if (gradeSystem === 'polish') {
    const match = label?.match(/^[A-Z]+\.?[0-9]?/);
    return match ? match[0] : '';
  }
  if (gradeSystem === 'hueco') {
    const match = label?.match(/^[A-Z0-9]+/);
    return match ? match[0] : '';
  }
  if (gradeSystem === 'yds_class') {
    const match = label?.match(/^[0-9]\.[0-9]+/);
    return match ? match[0] : '';
  }
  return String(parseFloat(label));
};

export const RouteDistribution = ({
  features,
}: {
  features: Array<Feature | OverpassFeature>;
}) => {
  const { userSettings, setUserSetting } = useUserSettingsContext();
  const gradeSystem = userSettings['climbing.gradeSystem'] || 'uiaa';

  const theme = useTheme();
  if (features?.length === 0) return null;

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
    return features?.reduce((acc, feature) => {
      const difficulty = getDifficulty(feature.tags);
      if (!difficulty) return acc;
      const convertedGrade = convertGrade(
        difficulty.gradeSystem,
        gradeSystem,
        difficulty.grade,
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

  if (
    !routeOccurrences ||
    !Object.values(routeOccurrences).find(
      (numberOfRoutes) => numberOfRoutes > 0,
    )
  )
    return null;

  const heightsRatios = Object.keys(routeOccurrences).map((key) => ({
    grade: key,
    ratio: routeOccurrences[key] / features.length,
  }));
  if (
    heightsRatios.length < 2 ||
    heightsRatios.reduce((acc, { ratio }) => acc + ratio, 0) === 0
  )
    return (
      <PanelLabel addition={<GradeSystemSelect />}>
        {t('grade_system_select.convert_grade')}
      </PanelLabel>
    );

  const getMaxHeightRatio = Math.max(
    ...heightsRatios.map(({ ratio }) => ratio),
  );
  const gradeSystemName = getGradeSystemName(gradeSystem);

  return (
    <Container>
      <ContentContainer>
        <Items>
          <GraphItems>
            {heightsRatios.map((heightRatioItem) => {
              const color = getDifficultyColor(
                {
                  gradeSystem: gradeSystem,
                  grade: heightRatioItem.grade,
                },
                theme.palette.mode,
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
                    <Chart
                      $color={color}
                      $ratio={heightRatioItem.ratio / getMaxHeightRatio}
                    />
                  </StaticHeightContainer>
                  <DifficultyLevel $color={color} $isActive={isColumnActive}>
                    {heightRatioItem.grade === 'NaN' || !heightRatioItem.grade
                      ? '?'
                      : heightRatioItem.grade}
                  </DifficultyLevel>
                </Column>
              );
            })}
          </GraphItems>
          <GradeSystemName>
            <Tooltip
              title={t('routedistribution.grade_system_description', {
                gradeSystemName,
              })}
            >
              <GradeSystemSelect size="tiny" />
            </Tooltip>
          </GradeSystemName>
        </Items>
      </ContentContainer>
    </Container>
  );
};

export const RouteDistributionInFeaturePanel = () => {
  const { feature } = useFeatureContext();
  if (!feature) return null;

  return (
    isClimbingCrag(feature) && (
      <RouteDistribution features={feature.memberFeatures} />
    )
  );
};
