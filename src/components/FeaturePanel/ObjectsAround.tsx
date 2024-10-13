import React from 'react';
import { Box, Typography } from '@mui/material';
import Router from 'next/router';
import { fetchAroundFeature } from '../../services/osmApi';
import { useFeatureContext } from '../utils/FeatureContext';
import { Feature } from '../../services/types';
import { getOsmappLink, getUrlOsmId } from '../../services/helpers';
import Maki from '../utils/Maki';
import { t } from '../../services/intl';
import { DotLoader, useMobileMode } from '../helpers';
import { getLabel } from '../../helpers/featureLabel';
import { useUserThemeContext } from '../../helpers/theme';
import { useQuery } from 'react-query';
import { getImportance } from './helpers/importance';

const AroundItem = ({ feature }: { feature: Feature }) => {
  const { currentTheme } = useUserThemeContext();
  const mobileMode = useMobileMode();
  const { setPreview } = useFeatureContext();
  const { properties, tags, osmMeta } = feature;
  const handleClick: React.MouseEventHandler<HTMLAnchorElement> = (e) => {
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

const getFeatures = (
  around: Feature[],
  advanced: boolean,
  feature: Feature,
) => {
  const sorted = around.sort(
    (a, b) => getImportance(b.tags) - getImportance(a.tags),
  );
  if (advanced) {
    return sorted;
  }

  return sorted
    .filter((item) => {
      if (getOsmappLink(item) === getOsmappLink(feature)) return false;
      if (!item.properties.subclass && Object.keys(item.tags).length <= 2)
        return false;
      if (item.properties.subclass === 'building:part') return false;
      return true;
    })
    .slice(0, 15);
};

export const ObjectsAround = ({ advanced }) => {
  const { feature } = useFeatureContext();

  const {
    data: around,
    error,
    isFetching,
  } = useQuery([feature], () => fetchAroundFeature(feature.center), {
    initialData: [],
  });

  if (!feature.center) {
    return null;
  }

  const features = getFeatures(around, advanced, feature);

  return (
    <Box mt={4} mb={4}>
      <Typography variant="overline" display="block" color="textSecondary">
        {t('featurepanel.objects_around')}
      </Typography>

      {error && (
        <Typography color="secondary" paragraph>
          Could not load nearby objects
        </Typography>
      )}

      {isFetching && !features.length && (
        <Typography color="secondary" paragraph>
          {t('loading')}
          <DotLoader />
        </Typography>
      )}

      {!isFetching && !error && !features.length && (
        <Typography color="secondary" paragraph>
          N/A
        </Typography>
      )}

      <ul>
        {features.map((item) => (
          <AroundItem key={getOsmappLink(item)} feature={item} />
        ))}
      </ul>
    </Box>
  );
};
