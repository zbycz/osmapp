import { TableCell, TableRow } from '@mui/material';
import Link from 'next/link';
import { format } from 'date-fns';
import React from 'react';
import { TickRowType } from '../../services/my-ticks/getMyTicks';
import { getUrlOsmId } from '../../services/helpers';
import { ConvertedRouteDifficultyBadge } from '../FeaturePanel/Climbing/ConvertedRouteDifficultyBadge';
import { DEFAULT_DATA_FORMAT } from '../../config.mjs';
import { useMapStateContext } from '../utils/MapStateContext';
import { getDifficulties } from '../FeaturePanel/Climbing/utils/grades/routeGrade';

export const MyTicksRow = ({ tickRow }: { tickRow: TickRowType }) => {
  const routeDifficulties = getDifficulties(tickRow.tags);
  const { view } = useMapStateContext();
  const { name, style, date, apiId } = tickRow;

  return (
    <TableRow>
      <TableCell>
        <Link href={`/${getUrlOsmId(apiId)}#${view.join('/')}`}>{name}</Link>
      </TableCell>
      <TableCell>
        <ConvertedRouteDifficultyBadge routeDifficulties={routeDifficulties} />
      </TableCell>
      <TableCell>{style}</TableCell>
      <TableCell>{format(date, DEFAULT_DATA_FORMAT)}</TableCell>
    </TableRow>
  );
};
