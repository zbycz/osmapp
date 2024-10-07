import React from 'react';
import { Box } from '@mui/material';
import { getOsmappLink } from '../../../services/helpers';
import { useFeatureContext } from '../../utils/FeatureContext';
import { PanelLabel } from '../Climbing/PanelLabel';
import { Item } from './Item';
import { ClimbingItem } from './ClimbingItem';
import styled from '@emotion/styled';
import { GradeSystemSelect } from '../Climbing/GradeSystemSelect';
import { useUserSettingsContext } from '../../utils/UserSettingsContext';
import { Feature } from '../../../services/types';
import { isRouteMaster } from '../../../utils';
import { GradeSystem } from '../Climbing/utils/grades/gradeData';

const getHeading = (feature: Feature) => {
  if (feature.tags.climbing === 'crag') {
    return 'Climbing routes';
  }
  if (isRouteMaster(feature)) {
    return 'Routes';
  }
  return 'Subitems';
};

type PanelAdditionProps = {
  feature: Feature;
  gradeSystem: string;
  onSetGradeSystem: (GradeSystem: GradeSystem) => void;
};

const PanelAddition = ({
  onSetGradeSystem,
  gradeSystem,
  feature: { tags },
}: PanelAdditionProps) => {
  if (tags.climbing !== 'crag') {
    return null;
  }

  return (
    <GradeSystemSelect
      setGradeSystem={onSetGradeSystem}
      selectedGradeSystem={gradeSystem}
    />
  );
};

const Ul = styled.ul`
  padding: 0;
  list-style: none;
`;

export const MemberFeatures = () => {
  const { feature } = useFeatureContext();
  const { memberFeatures, tags } = feature;

  const { userSettings, setUserSetting } = useUserSettingsContext();

  if (!memberFeatures?.length) {
    return null;
  }

  const isClimbingArea = tags.climbing === 'area';
  if (isClimbingArea) {
    return null;
  }

  const isClimbingCrag = tags.climbing === 'crag';

  return (
    <Box mb={1}>
      <PanelLabel
        addition={
          <PanelAddition
            feature={feature}
            gradeSystem={userSettings['climbing.gradeSystem']}
            onSetGradeSystem={(system) => {
              setUserSetting('climbing.gradeSystem', system);
            }}
          />
        }
      >
        {getHeading(feature)} ({memberFeatures.length})
      </PanelLabel>
      <Ul>
        {memberFeatures.map((item, index) =>
          isClimbingCrag ? (
            <ClimbingItem
              key={getOsmappLink(item)}
              feature={item}
              index={index}
              cragFeature={feature}
            />
          ) : (
            <Item key={getOsmappLink(item)} feature={item} />
          ),
        )}
      </Ul>
    </Box>
  );
};
