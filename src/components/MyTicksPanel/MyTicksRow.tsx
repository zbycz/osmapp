import { TableCell, TableRow } from '@mui/material';
import Link from 'next/link';
import { format } from 'date-fns';
import React from 'react';
import { getUrlOsmId } from '../../services/helpers';
import { ConvertedRouteDifficultyBadge } from '../FeaturePanel/Climbing/ConvertedRouteDifficultyBadge';
import { DEFAULT_DATA_FORMAT } from '../../config.mjs';
import { useMapStateContext } from '../utils/MapStateContext';
import { getDifficulties } from '../../services/tagging/climbing/routeGrade';
import { TickStyleBadge } from '../../services/my-ticks/TickStyleBadge';
import { FetchedClimbingTick } from '../../services/my-ticks/getMyTicks';
import { TickMoreButton } from '../FeaturePanel/Climbing/TickMoreButton';

export const MyTicksRow = ({
  fetchedTick,
}: {
  fetchedTick: FetchedClimbingTick;
}) => {
  const routeDifficulties = getDifficulties(fetchedTick.tags);
  const { view } = useMapStateContext();
  const { name, style, date, apiId } = fetchedTick;

  return (
    <TableRow>
      <TableCell>
        <Link href={`/${getUrlOsmId(apiId)}#${view.join('/')}`}>{name}</Link>
      </TableCell>
      <TableCell>
        <ConvertedRouteDifficultyBadge routeDifficulties={routeDifficulties} />
      </TableCell>
      <TableCell>
        <TickStyleBadge style={style} />
      </TableCell>
      <TableCell sx={{ textAlign: 'right' }}>
        {format(date, DEFAULT_DATA_FORMAT)}
      </TableCell>
      <TableCell>
        <TickMoreButton tick={fetchedTick.tick} />
      </TableCell>
    </TableRow>
  );
};
