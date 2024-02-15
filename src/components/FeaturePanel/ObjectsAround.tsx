import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import Router from 'next/router';
import { fetchAroundFeature } from '../../services/osmApi';
import { useFeatureContext } from '../utils/FeatureContext';
import { Feature } from '../../services/types';
import { getOsmappLink, getUrlOsmId } from '../../services/helpers';
import Maki from '../utils/Maki';
import { t } from '../../services/intl';
import { FetchError } from '../../services/fetch';
import { trimText, useMobileMode } from '../helpers';
import { getLabel } from '../../helpers/featureLabel';
import { useUserThemeContext } from '../../helpers/theme';

const useLoadingState = () => {
  const [around, setAround] = useState<Feature[]>([]);
  const [error, setError] = useState();
  const [loading, setLoading] = useState(true);
  const finishAround = (payload) => {
    setLoading(false);
    setAround(payload);
  };
  const startAround = () => {
    setLoading(true);
    setAround([]);
    setError(undefined);
  };
  const failAround = (err) => {
    setError(err instanceof FetchError ? err.message : err);
    setLoading(false);
  };
  return { around, error, loading, startAround, finishAround, failAround };
};

const AroundItem = ({ feature }: { feature: Feature }) => {
  const { currentTheme } = useUserThemeContext();
  const mobileMode = useMobileMode();
  const { setPreview } = useFeatureContext();
  const { properties, tags, osmMeta } = feature;
  const handleClick = (e) => {
    e.preventDefault();
    setPreview(null);
    Router.push(`/${getUrlOsmId(osmMeta)}${window.location.hash}`);
  };
  const handleHover = () =>
    feature.center && setPreview({ ...feature, noPreviewButton: true });

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

// TODO make SSR ?
export const ObjectsAround = ({ advanced }) => {
  const { feature } = useFeatureContext();
  const { around, loading, error, startAround, finishAround, failAround } =
    useLoadingState();

  useEffect(() => {
    startAround();
    if (feature.center) {
      fetchAroundFeature(feature.center).then(finishAround, failAround); // TODO fix op on unmounted tree (react-query?)
    }
  }, [getOsmappLink(feature)]);

  if (!feature.center) {
    return null;
  }

  const features = advanced
    ? around
    : around
        .filter((item: Feature) => {
          if (getOsmappLink(item) === getOsmappLink(feature)) return false;
          if (!item.properties.subclass && Object.keys(item.tags).length <= 2)
            return false;
          if (item.properties.subclass === 'building:part') return false;
          return true;
        })
        .sort(
          (a, b) =>
            (b.properties.class === 'home' ? -5 : Object.keys(b.tags).length) - // leave address points at the bottom
            Object.keys(a.tags).length,
        )
        .slice(0, 10);

  return (
    <Box mt={4} mb={4}>
      <Typography variant="overline" display="block" color="textSecondary">
        {t('featurepanel.objects_around')}
      </Typography>

      {error && (
        <Typography color="secondary" paragraph>
          {t('error')}: {trimText(error, 50)}
        </Typography>
      )}

      {loading && (
        <Typography color="secondary" paragraph>
          {t('loading')}
          <span className="dotloader">.</span>
          <span className="dotloader">.</span>
          <span className="dotloader">.</span>
        </Typography>
      )}

      {!loading && !error && !features.length && (
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
