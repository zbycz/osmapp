import React from 'react';
import { Box } from '@mui/material';
import Router from 'next/router';
import { getOsmappLink, getUrlOsmId } from '../../services/helpers';
import { useFeatureContext } from '../utils/FeatureContext';
import { Feature } from '../../services/types';
import { getLabel } from '../../helpers/featureLabel';
import { useUserThemeContext } from '../../helpers/theme';
import { useMobileMode } from '../helpers';
import Maki from '../utils/Maki';
import { PanelLabel } from './Climbing/PanelLabel';

const Item = ({ feature }: { feature: Feature }) => {
  const { currentTheme } = useUserThemeContext();
  const mobileMode = useMobileMode();
  const { setPreview } = useFeatureContext();
  const { properties, tags, osmMeta } = feature;
  const handleClick = (e) => {
    e.preventDefault();
    setPreview(null);
    Router.push(`/${getUrlOsmId(osmMeta)}${window.location.hash}`);
  };
  const handleHover = () => feature.center && setPreview(feature);

  return (
    <li>
      <a
        href={`/${getUrlOsmId(osmMeta)}`}
        onClick={handleClick}
        onMouseEnter={mobileMode ? undefined : handleHover}
        onMouseLeave={() => setPreview(null)}
      >
        <Maki
          ico={properties.class}
          title={`${Object.keys(tags).length} keys / ${
            properties.class ?? ''
          } / ${properties.subclass}`}
          invert={currentTheme === 'dark'}
        />
        {getLabel(feature)}
      </a>
    </li>
  );
};

export const MemberFeatures = () => {
  const {
    feature: { memberFeatures, tags },
  } = useFeatureContext();

  if (!memberFeatures?.length) {
    return null;
  }

  const isClimbingArea = tags.climbing === 'area';
  if (isClimbingArea) {
    return null;
  }

  const isClimbingCrag = tags.climbing === 'crag';
  const heading = isClimbingCrag ? 'Routes' : 'Subitems';

  return (
    <Box mt={4}>
      <PanelLabel>{heading}</PanelLabel>
      <ul>
        {memberFeatures.map((item) => (
          <Item key={getOsmappLink(item)} feature={item} />
        ))}
      </ul>
    </Box>
  );
};
