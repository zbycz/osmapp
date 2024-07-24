import React, { useEffect, useState } from 'react';
import Router from 'next/router';
import {
  TableHead,
  TableRow,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  Paper,
} from '@mui/material';
import { t } from '../../../services/intl';
import { getAllTicks } from '../../../services/ticks';
import { TickRow } from './TickRow';
import { fetchJson } from '../../../services/fetch';
import {
  getOverpassUrl,
  overpassGeomToGeojson,
} from '../../../services/overpassSearch';
import { getApiId, getShortId } from '../../../services/helpers';
import { getRouteGrade } from './utils/grades/routeGrade';
import { ClosePanelButton } from '../../utils/ClosePanelButton';
import {
  PanelContent,
  PanelScrollbars,
  PanelSidePadding,
} from '../../utils/PanelHelpers';
import { ClientOnly } from '../../helpers';
import { useUserSettingsContext } from '../../utils/UserSettingsContext';
import { MobilePageDrawer } from '../../utils/MobilePageDrawer';

export const MyTicksPage = () => {
  const [myTicksData, setMyTicksData] = useState({});
  const allTicks = getAllTicks();
  const { userSettings } = useUserSettingsContext();

  const getOverpassData = async () => {
    const queryTicks = allTicks
      .map(({ osmId }) => {
        if (!osmId) return '';
        const { id } = getApiId(osmId);
        return `node(${id});`;
      })
      .join('');
    const query = `[out:json];(${queryTicks});out body qt;`;
    const overpass = await fetchJson(getOverpassUrl(query));

    const features = overpassGeomToGeojson(overpass);

    const data = Object.keys(features).reduce((acc, key) => {
      const feature = features[key];
      return {
        ...acc,
        [getShortId(feature.osmMeta)]: feature.tags,
      };
    }, {});
    setMyTicksData(data);
  };

  useEffect(() => {
    getOverpassData();
  }, []);

  const handleClose = () => {
    Router.push(`/`);
  };

  return (
    <ClientOnly>
      <MobilePageDrawer className="my-ticks-drawer">
        <PanelContent>
          <PanelScrollbars>
            <ClosePanelButton right onClick={handleClose} />
            <PanelSidePadding>
              <h1>{t('my_ticks.title')}</h1>
            </PanelSidePadding>
            <TableContainer component={Paper}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>{t('my_ticks.route_name')}</TableCell>
                    <TableCell>{t('my_ticks.route_grade')}</TableCell>
                    <TableCell>{t('my_ticks.route_style')}</TableCell>
                    <TableCell>{t('my_ticks.route_date')}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {allTicks.map((tick, index) => {
                    const tickData = myTicksData[tick.osmId];
                    const name = tickData?.name;
                    const grade = getRouteGrade(
                      tickData,
                      userSettings['climbing.gradeSystem'],
                    );

                    return (
                      <TickRow
                        key={`${tick.osmId}-${tick.date}`}
                        name={name}
                        grade={grade}
                        gradeSystem={userSettings['climbing.gradeSystem']}
                        tick={tick}
                        index={index}
                        isNameVisible
                        isReadOnly
                      />
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </PanelScrollbars>
        </PanelContent>
      </MobilePageDrawer>
    </ClientOnly>
  );
};
