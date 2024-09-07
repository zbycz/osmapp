import React from 'react';
import { Box } from '@mui/material';
import { getOsmappLink, getShortId } from '../../../services/helpers';
import { useFeatureContext } from '../../utils/FeatureContext';
import { PanelLabel } from '../Climbing/PanelLabel';
import { Item } from './Item';
import { ClimbingItem } from './ClimbingItem';
import styled from '@emotion/styled';
import { GradeSystemSelect } from '../Climbing/GradeSystemSelect';
import { useUserSettingsContext } from '../../utils/UserSettingsContext';
import { RouteDistributionInPanel } from '../Climbing/RouteDistribution';

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
  const heading = isClimbingCrag ? 'Climbing routes' : 'Subitems';

  const ItemComponent = isClimbingCrag ? ClimbingItem : Item;

  return (
    <Box mt={1}>
      <PanelLabel
        addition={
          <GradeSystemSelect
            setGradeSystem={(system) => {
              setUserSetting('climbing.gradeSystem', system);
            }}
            selectedGradeSystem={userSettings['climbing.gradeSystem']}
          />
        }
      >
        {heading} ({memberFeatures.length})
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
