import React, { useEffect, useState } from 'react';
import Router from 'next/router';
import {
  CircularProgress,
  Paper,
  Stack,
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
  FetchedClimbingTick,
} from '../../services/my-ticks/getMyTicks';
import { useAddHeatmap } from './useAddHeatmap';
import { useSortedTable } from './useSortedTable';
import { MyTicksRow } from './MyTicksRow';
import { publishDbgObject } from '../../utils';
import { getApiId, getShortId } from '../../services/helpers';
import { getDifficulties } from '../../services/tagging/climbing/routeGrade';
import { findOrConvertRouteGrade } from '../../services/tagging/climbing/routeGrade';
import { GradeSystem } from '../../services/tagging/climbing/gradeSystems';
import { OverpassFeature } from '../../services/overpass/overpassSearch';
import { useTicksContext } from '../utils/TicksContext';
import { ClimbingTick } from '../../types';
import { TickStyle } from '../FeaturePanel/Climbing/types';
import { MyTicksGraphs } from './MyTicksGraphs/MyTicksGraphs';

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
  ticks: ClimbingTick[],
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
    .filter((tick) => tick.shortId)
    .map((tick: ClimbingTick, index) => {
      const feature = featureMap[tick.shortId];
      const difficulties = getDifficulties(feature?.tags);
      const { routeDifficulty } = findOrConvertRouteGrade(
        difficulties,
        gradeSystem,
      );

      return {
        key: `${tick.shortId}-${tick.timestamp}`, // TODO tick.id
        name: feature?.tags?.name,
        grade: routeDifficulty.grade,
        center: feature?.center,
        index,
        date: tick.timestamp,
        style: tick.style as TickStyle,
        apiId: getApiId(tick.shortId),
        tags: feature?.tags,
        tick,
      };
    });

  publishDbgObject('tickRows', tickRows);

  return tickRows;
};

const MyTicksContent = ({
  fetchedTicks,
  features,
}: {
  fetchedTicks: FetchedClimbingTick[];
  features: OverpassFeature[];
}) => {
  const { visibleRows, tableHeader } = useSortedTable(fetchedTicks);

  return (
    <>
      {fetchedTicks?.length === 0 ? (
        <NoTicksContent />
      ) : (
        <TableContainer component={Paper}>
          <Table size="small">
            {tableHeader}
            <TableBody>
              {visibleRows.map((tickRow) => (
                <MyTicksRow fetchedTick={tickRow} key={tickRow.tick.id} />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      <MyTicksGraphs features={features} />
    </>
  );
};

export const MyTicksPanel = () => {
  const [fetchedTicks, setFetchedTicks] = useState<FetchedClimbingTick[]>([]);
  const [features, setFeatures] = useState<OverpassFeature[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { userSettings } = useUserSettingsContext();
  const { ticks } = useTicksContext();

  const handleClose = () => {
    Router.push(`/`);
  };

  useEffect(() => {
    setIsLoading(true);
    if (ticks.length === 0) return;

    getMyTicksFeatures(ticks).then((features) => {
      setFeatures(features);
      const newTickRows = mapFeaturesDataToTicks(
        ticks,
        features,
        userSettings['climbing.gradeSystem'],
      );
      setFetchedTicks(newTickRows);
      setIsLoading(false);
    });
  }, [ticks, userSettings]);
  useAddHeatmap(fetchedTicks);

  if (fetchedTicks?.length === 0) {
    return null;
  }

  return (
    <ClientOnly>
      <MobilePageDrawer className="my-ticks-drawer">
        <PanelContent>
          <PanelScrollbars>
            <ClosePanelButton right onClick={handleClose} />
            <PanelSidePadding>
              <h1>{t('my_ticks.title')}</h1>
            </PanelSidePadding>

            {isLoading ? (
              <Stack justifyContent="center" alignItems="center" height="100%">
                <CircularProgress />
              </Stack>
            ) : (
              <MyTicksContent fetchedTicks={fetchedTicks} features={features} />
            )}
          </PanelScrollbars>
        </PanelContent>
      </MobilePageDrawer>
    </ClientOnly>
  );
};
