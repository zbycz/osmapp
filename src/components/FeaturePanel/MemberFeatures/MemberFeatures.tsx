import React from 'react';
import { Box, Chip, Stack } from '@mui/material';
import { getOsmappLink, getReactKey } from '../../../services/helpers';
import { useFeatureContext } from '../../utils/FeatureContext';
import { PanelLabel } from '../Climbing/PanelLabel';
import { Item } from './Item';
import { ClimbingItem } from './ClimbingItem';
import styled from '@emotion/styled';
import { GradeSystemSelect } from '../Climbing/GradeSystemSelect';
import { useUserSettingsContext } from '../../utils/UserSettingsContext';
import { Feature } from '../../../services/types';
import { isRouteMaster } from '../../../utils';
import { t } from '../../../services/intl';
import { getDividedFeaturesBySections } from '../Climbing/utils/getDividedFeaturesBySections';

const getHeading = (feature: Feature) => {
  if (feature.tags.climbing === 'crag') {
    return t('member_features.climbing');
  }
  if (isRouteMaster(feature)) {
    return t('member_features.routes');
  }
  return t('member_features.subitems');
};

const PanelAddition = () => {
  const { feature } = useFeatureContext();
  const { userSettings, setUserSetting } = useUserSettingsContext();

  if (feature.tags.climbing !== 'crag') {
    return null;
  }

  return (
    <GradeSystemSelect
      setGradeSystem={(system) => {
        setUserSetting('climbing.gradeSystem', system);
      }}
      selectedGradeSystem={userSettings['climbing.gradeSystem']}
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

  if (!memberFeatures?.length) {
    return null;
  }

  const isClimbingArea = tags.climbing === 'area';
  if (isClimbingArea) {
    return null;
  }

  const dividedFeaturesBySections =
    getDividedFeaturesBySections(memberFeatures);
  const climbingRoutesFeatures = dividedFeaturesBySections.routes;
  const otherFeatures = dividedFeaturesBySections.other;
  const headingNum = climbingRoutesFeatures.length || memberFeatures.length;

  return (
    <Box mb={1}>
      <PanelLabel addition={<PanelAddition />}>
        <Stack direction="row" gap={1.5}>
          <div>{getHeading(feature)}</div>
          <Chip
            size="small"
            variant="outlined"
            label={headingNum}
            sx={{ position: 'relative', top: -3 }}
          />
        </Stack>
      </PanelLabel>
      {climbingRoutesFeatures.length > 0 && (
        <Ul>
          {climbingRoutesFeatures.map((item, index) => (
            <ClimbingItem
              key={getReactKey(item)}
              feature={item}
              index={index}
              cragFeature={feature}
            />
          ))}
        </Ul>
      )}
      {otherFeatures.length > 0 && (
        <Ul>
          {otherFeatures.map((item) => (
            <Item key={getReactKey(item)} feature={item} />
          ))}
        </Ul>
      )}
    </Box>
  );
};
