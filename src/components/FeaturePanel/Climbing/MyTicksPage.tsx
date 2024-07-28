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
import maplibregl from 'maplibre-gl';
import { t } from '../../../services/intl';
import { getAllTicks } from '../../../services/ticks';
import { TickRow } from './TickRow';
import { fetchJson } from '../../../services/fetch';
import {
  getOverpassUrl,
  overpassGeomToGeojson,
} from '../../../services/overpassSearch';
import { getApiId, getShortId } from '../../../services/helpers';
import {
  // getDifficulty,
  // getDifficultyColor,
  getRouteGrade,
} from './utils/grades/routeGrade';
import { ClosePanelButton } from '../../utils/ClosePanelButton';
import {
  PanelContent,
  PanelScrollbars,
  PanelSidePadding,
} from '../../utils/PanelHelpers';
import { ClientOnly } from '../../helpers';
import { useUserSettingsContext } from '../../utils/UserSettingsContext';
import { MobilePageDrawer } from '../../utils/MobilePageDrawer';
import { Feature } from '../../../services/types';
import { getGlobalMap } from '../../../services/mapStorage';

type Marker = {
  ref: maplibregl.Marker;
  feature: Feature;
};

export const MyTicksPage = () => {
  // const theme = useTheme();
  const [myTicksData, setMyTicksData] = useState({});
  const [heatmapData, setHeatmapData] = useState(null);
  const [featureMarkers, setFeatureMarkers] = useState<Array<Marker>>([]);
  const allTicks = getAllTicks();
  const { userSettings } = useUserSettingsContext();
  const map = getGlobalMap();

  const generateGeojson = (features) => {
    const geojson = {
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
    };
    return geojson;
  };
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

    setHeatmapData(generateGeojson(features));
  };

  const deleteMarkers = () => {
    featureMarkers.forEach((marker) => {
      marker.ref?.remove();
    });
  };

  useEffect(() => {
    getOverpassData();

    return () => {
      deleteMarkers();
      setFeatureMarkers([]); // Reset markers
    };
  }, []);

  useEffect(() => {
    // const showMarkers = () => {
    //   const newMarkers = allTicks
    //     .map((tick) => {
    //       const tickFeature = myTicksData[tick.osmId];
    //       const routeDifficulty = getDifficulty(tickFeature?.tags);
    //       const colorByDifficulty = getDifficultyColor(routeDifficulty, theme);
    //       const featureMarker = {
    //         color: colorByDifficulty,
    //         draggable: false,
    //       };
    //
    //       if (map && myTicksData[tick.osmId]?.center) {
    //         const markerRef = new maplibregl.Marker(featureMarker)
    //           .setLngLat(tickFeature.center)
    //           .addTo(map);
    //
    //         return { ref: markerRef, feature: tickFeature };
    //       }
    //       return null;
    //     })
    //     .filter((marker) => marker !== null);
    //
    //   setFeatureMarkers(newMarkers);
    // };

    // showMarkers();

    const enableHeatmap = () => {
      map.on('load', () => {
        map.addSource('earthquakes', {
          type: 'geojson',
          data: heatmapData,
        });

        map.addLayer({
          id: 'earthquakes-heat',
          type: 'heatmap',
          source: 'earthquakes',
          paint: {
            // Zvýraznění heatmapy podle intenzity
            'heatmap-weight': [
              'interpolate',
              ['linear'],
              ['get', 'mag'],
              0,
              0,
              6,
              1,
            ],
            // Nastavení barevné škály heatmapy
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
            // Nastavení intenzity heatmapy
            'heatmap-intensity': [
              'interpolate',
              ['linear'],
              ['zoom'],
              0,
              1,
              9,
              3,
            ],
            // Nastavení poloměru heatmapových bodů
            'heatmap-radius': [
              'interpolate',
              ['linear'],
              ['zoom'],
              0,
              2,
              9,
              15,
            ],
            // Snížení opacity heatmapy ve vyšších zoomech
            // 'heatmap-opacity': 0.8,
            // 'heatmap-opacity': [
            //   'interpolate',
            //   ['linear'],
            //   ['zoom'],
            //   13,
            //   1,
            //   15,
            //   0,
            // ],
          },
        });
      });
    };

    if (map && heatmapData) {
      enableHeatmap();
    }
  }, [myTicksData, map]);

  const handleClose = () => {
    deleteMarkers();
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
            {allTicks.length === 0 ? (
              <PanelSidePadding>
                <Typography variant="body1" gutterBottom>
                  You have no ticks so far…
                </Typography>

                <Typography
                  variant="caption"
                  display="block"
                  gutterBottom
                  color="secondary"
                >
                  Try to add one on the crag
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
