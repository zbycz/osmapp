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
  Typography,
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
import { getGlobalMap } from '../../../services/mapStorage';

export const MyTicksPage = () => {
  const [myTicksData, setMyTicksData] = useState({});
  const [heatmapData, setHeatmapData] = useState(null);
  const allTicks = getAllTicks();
  const { userSettings } = useUserSettingsContext();
  const map = getGlobalMap();

  const generateGeojsonForPoints = (features) => ({
    type: 'FeatureCollection',
    features: features.map((feature) => ({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: feature.center,
      },
      properties: {
        title: feature.tags.name,
        description: feature.tags.description,
      },
    })),
  });

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
        [getShortId(feature.osmMeta)]: feature,
      };
    }, {});
    setMyTicksData(data);
    setHeatmapData(generateGeojsonForPoints(features));
  };

  const enableHeatmap = () => {
    map.addSource('myticks', {
      type: 'geojson',
      data: heatmapData,
    });

    map.addLayer({
      id: 'myticks-heatmap',
      type: 'heatmap',
      source: 'myticks',
      paint: {
        'heatmap-weight': [
          'interpolate',
          ['linear'],
          ['get', 'mag'],
          0,
          0,
          6,
          1,
        ],
        'heatmap-color': [
          'interpolate',
          ['linear'],
          ['heatmap-density'],
          0,
          'rgba(33,102,172,0)',
          0.2,
          'rgb(103,169,207)',
          0.4,
          'rgb(209,229,240)',
          0.6,
          'rgb(253,219,199)',
          0.8,
          'rgb(239,138,98)',
          1,
          'rgb(178,24,43)',
        ],
        'heatmap-intensity': ['interpolate', ['linear'], ['zoom'], 0, 1, 9, 3],
        'heatmap-radius': ['interpolate', ['linear'], ['zoom'], 0, 2, 9, 15],
      },
    });
  };

  const removeHeatmap = () => {
    map.removeLayer('myticks-heatmap');
    map.removeSource('myticks');
  };

  const handleClose = () => {
    Router.push(`/`);
  };

  useEffect(() => {
    getOverpassData();
  }, []);

  useEffect(() => {
    if (map && heatmapData) {
      enableHeatmap();
    }
    return () => {
      if (map && heatmapData) {
        removeHeatmap();
      }
    };
  }, [myTicksData, map]);

  return (
    <ClientOnly>
      <MobilePageDrawer className="my-ticks-drawer">
        <PanelContent>
          <PanelScrollbars>
            <ClosePanelButton right onClick={handleClose} />
            <PanelSidePadding>
              <h1>{t('my_ticks.title')}</h1>
            </PanelSidePadding>
            {allTicks.length === 0 ? (
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
            ) : (
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
                      const tickFeature = myTicksData[tick.osmId];
                      const name = tickFeature?.tags?.name;
                      const grade = getRouteGrade(
                        tickFeature?.tags,
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
            )}
          </PanelScrollbars>
        </PanelContent>
      </MobilePageDrawer>
    </ClientOnly>
  );
};
