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
import {
  fetchSchemaTranslations,
  getAllTranslations,
} from '../../../services/tagging/translations';
import { useQuery } from 'react-query';

const fmtRunwaySize = ({ length, width }: RunwayType) =>
  `${length || '?'} - ${width || '?'}`;

const getTranslatedSurface = async (surface: string) => {
  if (!surface) {
    return 'Unknown';
  }

  const translations = getAllTranslations();
  if (!translations) {
    await fetchSchemaTranslations();
    return getTranslatedSurface(surface);
  }

  return translations.presets.fields.surface.options[surface];
};

const Runway: React.FC<{ runway: RunwayType; showSizeColumn: boolean }> = ({
  runway,
  showSizeColumn,
}) => {
  const { data } = useQuery([runway.surface], () =>
    getTranslatedSurface(runway.surface),
  );
  return (
    <TableRow>
      <TableCell>
        <Link href={`/${runway.type}/${runway.id}`}>
          {runway.ref || 'Unknown'}
        </Link>
      </TableCell>
      {showSizeColumn && <TableCell>{fmtRunwaySize(runway)}</TableCell>}
      <TableCell style={{ textTransform: 'capitalize' }}>
        {data ?? runway.surface}
      </TableCell>
    </TableRow>
  );
};

type RunwayProps = {
  runways: RunwayType[];
};

export const SuccessRunways: React.FC<RunwayProps> = ({ runways }) => {
  const showSizeColumn = runways.some(({ length, width }) => length || width);

  return (
    <>
      <h4>{t('runway.information')}</h4>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{t('runway.runway')}</TableCell>
              {showSizeColumn && <TableCell>{t('runway.size')}</TableCell>}
              <TableCell>
                {getAllTranslations()
                  ? getAllTranslations().presets.fields.surface.label
                  : 'Surface'}
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {runways.map((runway) => (
              <Runway
                runway={runway}
                showSizeColumn={showSizeColumn}
                key={runway.id}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};
