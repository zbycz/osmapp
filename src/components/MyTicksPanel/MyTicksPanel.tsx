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
import { useUserSettingsContext } from '../utils/userSettings/UserSettingsContext';
import { MobilePageDrawer } from '../utils/MobilePageDrawer';
import {
  getMyTicksFeatures,
  TickRowType,
} from '../../services/my-ticks/getMyTicks';
import { useAddHeatmap } from './useAddHeatmap';
import { useSortedTable } from './useSortedTable';
import { MyTicksRow } from './MyTicksRow';
import { MyTicksGraphs } from './MyTicksGraphs/MyTicksGraphs';
import { Feature } from '../../services/types';
import { getAllTicks, getTickKey } from '../../services/my-ticks/ticks';
import { publishDbgObject } from '../../utils';
import { getApiId, getShortId } from '../../services/helpers';
import { Tick } from '../FeaturePanel/Climbing/types';
import { getDifficulties } from '../../services/tagging/climbing/routeGrade';
import { findOrConvertRouteGrade } from '../../services/tagging/climbing/routeGrade';
import { GradeSystem } from '../../services/tagging/climbing/gradeSystems';
import { OverpassFeature } from '../../services/overpass/overpassSearch';

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

const mapFeaturesDataToTicks = (
  ticks: Tick[],
  features: OverpassFeature[],
  gradeSystem: GradeSystem,
) => {
  const featureMap = Object.keys(features).reduce((acc, key) => {
    const feature = features[key];
    return {
      ...acc,
      [getShortId(feature.osmMeta)]: feature,
    };
  }, {});

  const tickRows = ticks
    .filter((tick) => tick.osmId)
    .map((tick: Tick, index) => {
      const feature = featureMap[tick.osmId];
      const difficulties = getDifficulties(feature?.tags);
      const { routeDifficulty } = findOrConvertRouteGrade(
        difficulties,
        gradeSystem,
      );

      return {
        key: getTickKey(tick),
        name: feature?.tags?.name,
        grade: routeDifficulty.grade,
        center: feature?.center,
        index,
        date: tick.date,
        style: tick.style,
        apiId: getApiId(tick.osmId),
        tags: feature?.tags,
      };
    });

  publishDbgObject('tickRows', tickRows);

  return tickRows;
};

export const MyTicksPanel = () => {
  const [tickRows, setTickRows] = useState<TickRowType[]>([]);
  const [features, setFeatures] = useState<OverpassFeature[]>([]);
  const { userSettings } = useUserSettingsContext();

  const handleClose = () => {
    Router.push(`/`);
  };

  useEffect(() => {
    getMyTicksFeatures(userSettings).then((features) => {
      setFeatures(features);
      const allTicks = getAllTicks();
      const newTickRows = mapFeaturesDataToTicks(
        allTicks,
        features,
        userSettings['climbing.gradeSystem'],
      );
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
            <MyTicksGraphs features={features} />
          </PanelScrollbars>
        </PanelContent>
      </MobilePageDrawer>
    </ClientOnly>
  );
};
