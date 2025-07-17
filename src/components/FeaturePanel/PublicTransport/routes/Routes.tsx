import React, { useState } from 'react';
import { categories, LineInformation, requestLines } from './requestRoutes';
import { PublicTransportCategory } from './PublicTransportWrapper';
import { DotLoader } from '../../../helpers';
import { sortByReference } from './helpers';
import { useFeatureContext } from '../../../utils/FeatureContext';
import groupBy from 'lodash/groupBy';
import { useQuery } from 'react-query';
import { Typography } from '@mui/material';
import { useShowOnMap } from './useShowOnMap';

type PublicTransportDisplayProps = {
  routes: LineInformation[];
  geoJson: GeoJSON.FeatureCollection;
};

const defaultShown = ['subway', 'commuter', 'regional', 'trolleybus', 'bus'];

const categorizedRoutes = (routes: LineInformation[]) => {
  const grouped = groupBy(routes, ({ service }) => {
    const base = service?.split(';')[0];
    return categories.includes(base) ? base : 'unknown';
  });
  const entries = Object.entries(grouped) as [string, LineInformation[]][];
  const sortedEntries = sortByReference(
    entries,
    categories,
    ([category]) => category,
  );

  const availableCategories = sortedEntries.map(([category]) => category);
  const isShownByDefault = availableCategories.some((category) =>
    defaultShown.includes(category),
  );

  if (isShownByDefault) {
    return { sortedEntries, initialCategories: defaultShown };
  }

  return { sortedEntries, initialCategories: availableCategories.slice(0, 1) };
};

const PublicTransportDisplay = ({
  routes,
  geoJson,
}: PublicTransportDisplayProps) => {
  const { sortedEntries, initialCategories } = categorizedRoutes(routes);
  const [shownCategories, setShownCategories] = useState(initialCategories);

  useShowOnMap(geoJson, shownCategories);

  return (
    <>
      {sortedEntries.map(([category, lines]) => (
        <PublicTransportCategory
          key={category}
          category={category}
          lines={lines}
          showHeading={sortedEntries.length > 1}
          shownCategories={shownCategories}
          onChange={(categories) => {
            setShownCategories(categories);
          }}
        />
      ))}
    </>
  );
};

export const PublicTransportInner = () => {
  const { feature } = useFeatureContext();
  const { id, type } = feature.osmMeta;

  const { data, status } = useQuery([id, type], () =>
    requestLines(type, Number(id)),
  );

  return (
    <div>
      {(status === 'loading' || status === 'idle') && <DotLoader />}
      {status === 'success' && (
        <PublicTransportDisplay routes={data.routes} geoJson={data.geoJson} />
      )}
      {status === 'error' && (
        <Typography color="secondary" paragraph>
          Error
        </Typography>
      )}
    </div>
  );
};
