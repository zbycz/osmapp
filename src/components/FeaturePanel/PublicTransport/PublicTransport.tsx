import groupBy from 'lodash/groupBy';
import { useQuery } from 'react-query';
import React from 'react';
import { Typography } from '@mui/material';
import { LineInformation, requestLines } from './requestRoutes';
import { PublicTransportCategory } from './PublicTransportWrapper';
import { FeatureTags } from '../../../services/types';
import { DotLoader } from '../../helpers';
import { sortByReference } from './helpers';
import { useFeatureContext } from '../../utils/FeatureContext';
import { getOverpassSource } from '../../../services/mapStorage';
import { EMPTY_GEOJSON_SOURCE } from '../../Map/consts';

interface PublicTransportProps {
  tags: FeatureTags;
}

const categories = [
  'tourism',
  'subway',
  'commuter',
  'regional',
  'long_distance',
  'high_speed',
  'night',
  'car',
  'car_shuttle',
  'bus',
  'unknown',
];

const PublicTransportDisplay = ({ routes }) => {
  const grouped = groupBy(routes, ({ service }) => {
    const base = service?.split(';')[0];
    return categories.includes(base) ? base : 'unknown';
  });
  const entries = Object.entries(grouped) as [string, LineInformation[]][];
  const sorted = sortByReference(entries, categories, ([category]) => category);

  return (
    <>
      {sorted.map(([category, lines]) => (
        <PublicTransportCategory
          key={category}
          category={category}
          lines={lines}
          showHeading={entries.length > 1}
        />
      ))}
    </>
  );
};

const PublicTransportInner = () => {
  const { feature } = useFeatureContext();
  const { id, type } = feature.osmMeta;

  const { data, status } = useQuery([id, type], () =>
    requestLines(type, Number(id)),
  );

  React.useEffect(() => {
    if (!data) {
      return;
    }

    const source = getOverpassSource();
    source?.setData(data.geoJson);

    return () => {
      source?.setData({ type: 'FeatureCollection', features: [] });
    };
  }, [data]);

  return (
    <div>
      {(status === 'loading' || status === 'idle') && <DotLoader />}
      {status === 'success' && <PublicTransportDisplay routes={data.routes} />}
      {status === 'error' && (
        <Typography color="secondary" paragraph>
          Error
        </Typography>
      )}
    </div>
  );
};

export const PublicTransport: React.FC<PublicTransportProps> = ({ tags }) => {
  const isPublicTransport =
    Object.keys(tags).includes('public_transport') ||
    tags.railway === 'station' ||
    tags.railway === 'halt';

  if (!isPublicTransport) {
    return null;
  }

  return <PublicTransportInner />;
};
