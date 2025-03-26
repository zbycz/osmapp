import React, { useEffect, useState } from 'react';
import Router from 'next/router';
import {
  Paper,
  Table,
  TableBody,
  TableContainer,
  Typography,
} from '@mui/material';
import { t } from '../../services/intl';
import { ClosePanelButton } from '../utils/ClosePanelButton';
import {
  PanelContent,
  PanelScrollbars,
  PanelSidePadding,
} from '../utils/PanelHelpers';
import { ClientOnly } from '../helpers';
import { useUserSettingsContext } from '../utils/UserSettingsContext';
import { MobilePageDrawer } from '../utils/MobilePageDrawer';
import { getMyTicks, TickRowType } from '../../services/my-ticks/getMyTicks';
import { useAddHeatmap } from './useAddHeatmap';
import { useSortedTable } from './useSortedTable';
import { MyTicksRow } from './MyTicksRow';
import Link from 'next/link';

function NoTicksContent() {
  return (
    <PanelSidePadding>
      <Typography variant="body1" gutterBottom>
        {t('my_ticks.no_ticks_paragraph1')}
      </Typography>

      <Typography
        variant="caption"
        display="block"
        gutterBottom
        color="secondary"
      >
        {t('my_ticks.no_ticks_paragraph2')}
      </Typography>
    </PanelSidePadding>
  );
}

export const MyTicksPanel = () => {
  const [tickRows, setTickRows] = useState<TickRowType[]>([]);
  const { userSettings } = useUserSettingsContext();

  const handleClose = () => {
    Router.push(`/`);
  };

  useEffect(() => {
    getMyTicks(userSettings).then((newTickRows) => {
      setTickRows(newTickRows);
    });
  }, [userSettings]);
  useAddHeatmap(tickRows);

  const { visibleRows, tableHeader } = useSortedTable(tickRows);

  return (
    <ClientOnly>
      <MobilePageDrawer className="my-ticks-drawer">
        <PanelContent>
          <PanelScrollbars>
            <ClosePanelButton right onClick={handleClose} />
            <PanelSidePadding>
              <h1>{t('my_ticks.title')}</h1>
            </PanelSidePadding>
            {tickRows.length === 0 ? (
              <NoTicksContent />
            ) : (
              <TableContainer component={Paper}>
                <Table size="small">
                  {tableHeader}
                  <TableBody>
                    {visibleRows.map((tickRow) => (
                      <MyTicksRow tickRow={tickRow} key={tickRow.key} />
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </PanelScrollbars>
        </PanelContent>
      </MobilePageDrawer>
    </ClientOnly>
  );
};
