import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Typography } from '@material-ui/core';
import { fetchAroundFeature } from '../../services/osmApi';
import { useFeatureContext } from '../utils/FeatureContext';
import { Feature } from '../../services/types';
import { getShortId, getUrlOsmId } from '../../services/helpers';
import { icons } from '../../assets/icons';
import Maki from '../utils/Maki';

const useLoadingState = () => {
  const [around, setAround] = useState<Feature[]>([]);
  const [loading, setLoading] = useState(true);
  const finishAround = (payload) => {
    setLoading(false);
    setAround(payload);
  };
  const startAround = () => {
    setLoading(true);
    setAround([]);
  };
  return { around, loading, startAround, finishAround };
};

const AroundItem = ({ feature }: { feature: Feature }) => {
  const { properties, tags, osmMeta } = feature;
  const ico = icons.includes(properties.class)
    ? properties.class
    : 'information';
  const subclass = properties.subclass || '?';

  return (
    <li>
      <Maki ico={ico} />
      <Link href={`/${getUrlOsmId(osmMeta)}`}>
        {tags.name ?? subclass ?? '?'}
      </Link>
    </li>
  );
};

// TODO make SSR ?
export const ObjectsAround = () => {
  const { feature } = useFeatureContext();
  const { around, loading, startAround, finishAround } = useLoadingState();
  const [error, setError] = useState();

  useEffect(() => {
    startAround();
    setError(undefined);
    if (feature.center) {
      fetchAroundFeature(feature.center).then(finishAround, setError);
    }
  }, [getShortId(feature.osmMeta)]);

  if (!feature.center) {
    return null;
  }

  const notThisFeature = (item) =>
    getShortId(item.osmMeta) !== getShortId(feature.osmMeta);

  return (
    <>
      <Typography variant="overline" display="block" color="textSecondary">
        Objects around
      </Typography>

      {error && (
        <Typography color="secondary" paragraph>
          Error: {`${error}`.substring(0, 50)}
        </Typography>
      )}

      {loading && (
        <Typography color="secondary" paragraph>
          Loading...
        </Typography>
      )}

      {!loading && !around.length && (
        <Typography color="secondary" paragraph>
          none
        </Typography>
      )}

      <ul>
        {around.filter(notThisFeature).map((item) => (
          <AroundItem key={getShortId(item.osmMeta)} feature={item} />
        ))}
      </ul>
    </>
  );
};
