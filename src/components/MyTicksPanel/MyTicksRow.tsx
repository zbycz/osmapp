import { TableCell, TableRow } from '@mui/material';
import Link from 'next/link';
import { format } from 'date-fns';
import React from 'react';
import { TickRowType } from '../../services/my-ticks/getMyTicks';
import { useUserSettingsContext } from '../utils/UserSettingsContext';
import { getUrlOsmId } from '../../services/helpers';
import { RouteDifficultyBadge } from '../FeaturePanel/Climbing/RouteDifficultyBadge';
import { DEFAULT_DATA_FORMAT } from '../../config';
import { useMapStateContext } from '../utils/MapStateContext';

export const MyTicksRow = ({ tickRow }: { tickRow: TickRowType }) => {
  const { userSettings } = useUserSettingsContext();
  const { view } = useMapStateContext();
  const { name, grade, style, date, apiId } = tickRow;

  return (
    <TableRow>
      <TableCell>
        <Link href={`/${getUrlOsmId(apiId)}#${view.join('/')}`}>{name}</Link>
      </TableCell>
      <TableCell>
        <RouteDifficultyBadge
          routeDifficulty={{
            grade,
            gradeSystem: userSettings['climbing.gradeSystem'],
          }}
        />
      </TableCell>
      <TableCell>{style}</TableCell>
      <TableCell>{format(date, DEFAULT_DATA_FORMAT)}</TableCell>
    </TableRow>
  );
};
