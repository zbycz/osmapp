import Link from 'next/link';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import React from 'react';
import { Runway as RunwayType } from './loadRunways';
import { t } from '../../../services/intl';

const fmtRunwaySize = (runway: RunwayType) =>
  `${runway.length || '?'} - ${runway.width || '?'}`;

const Runway: React.FC<{ runway: RunwayType; showSize: boolean }> = ({
  runway,
  showSize,
}) => (
  <TableRow>
    <TableCell>
      <Link href={`/${runway.type}/${runway.id}`}>
        {runway.ref || 'Unknown'}
      </Link>
    </TableCell>
    {showSize && <TableCell>{fmtRunwaySize(runway)}</TableCell>}
    {/* TODO: Use id tagging presets to show the surface in the users language */}
    <TableCell style={{ textTransform: 'capitalize' }}>
      {runway.surface || 'Unknown'}
    </TableCell>
  </TableRow>
);

interface RunwayProps {
  runways: RunwayType[];
}

export const SuccessRunways: React.FC<RunwayProps> = ({ runways }) => {
  const showSize = runways.every(({ length, width }) => length || width);

  return (
    <>
      <h4>{t('runway.information')}</h4>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{t('runway.runway')}</TableCell>
              {showSize && <TableCell>{t('runway.size')}</TableCell>}
              <TableCell>{t('runway.surface')}</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {runways.map((runway) => (
              <Runway runway={runway} showSize={showSize} key={runway.id} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};
