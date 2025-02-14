import {
  GeojsonFeature,
  OsmResponse,
  overpassToGeojsons,
} from './overpass/overpassToGeojsons';
import { encodeUrl } from '../../helpers/utils';
import { fetchJson } from '../../services/fetch';
import { LineString, LonLat, Point } from '../../services/types';
import format from 'pg-format';
import { ClimbingFeaturesRecords, closeClient, getClient } from './db';
import { queryTileStats, updateStats } from './utils';
import { chunk } from 'lodash';
import { readFileSync } from 'fs';

const centerGeometry = (feature: GeojsonFeature): GeojsonFeature<Point> => ({
  ...feature,
  geometry: {
    type: 'Point',
    coordinates: feature.center,
  },
});

const firstPointGeometry = (
  feature: GeojsonFeature<LineString>,
): GeojsonFeature<Point> => ({
  ...feature,
  geometry: {
    type: 'Point',
    coordinates: feature.geometry.coordinates[0],
  },
});

const prepareGeojson = (
  type: string,
  { id, geometry, properties }: GeojsonFeature,
) =>
  JSON.stringify({
    type: 'Feature',
    id,
    geometry,
    properties: { ...properties, type },
  });

const fetchFromOverpass = async () => {
  if (process.env.NODE_ENV === 'development') {
    console.log('fetchFromOverpass: Using cache in ../overpass.json'); //eslint-disable-line no-console
    return JSON.parse(readFileSync('../overpass.json', 'utf8'));
  }

  // takes about 42 secs, 25MB
  const query = `[out:json][timeout:80];(nwr["climbing"];nwr["sport"="climbing"];);(._;>>;);out qt;`;
  const data = await fetchJson<OsmResponse>(
    'https://overpass-api.de/api/interpreter',
    {
      body: encodeUrl`data=${query}`,
      method: 'POST',
      nocache: true,
    },
  );

  if (data.elements.length < 1000) {
    throw new Error(
      `Overpass returned too few elements. Data:${JSON.stringify(data).substring(0, 200)}`,
    );
  }

  return data;
};

const removeDiacritics = (str: string) =>
  str?.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

const recordsFactory = () => {
  const records: ClimbingFeaturesRecords = [];
  const addRecordRaw = (
    type: string,
    coordinates: LonLat,
    feature: GeojsonFeature,
  ) => {
    const lon = coordinates[0];
    const lat = coordinates[1];
    return records.push({
      type,
      osmType: feature.osmMeta.type,
      osmId: feature.osmMeta.id,
      name: feature.tags.name,
      nameRaw: removeDiacritics(feature.tags.name),
      count: feature.properties.osmappRouteCount || 0,
      lon,
      lat,
      geojson: prepareGeojson(type, feature),
    });
  };

  const addRecord = (type: string, feature: GeojsonFeature<Point>) => {
    addRecordRaw(type, feature.geometry.coordinates, feature);
  };

  const addRecordWithLine = (type: string, way: GeojsonFeature<LineString>) => {
    addRecord(type, firstPointGeometry(way));
    addRecordRaw(type, way.center, way);
  };

  return { records, addRecord, addRecordWithLine };
};

const getNewRecords = (data: OsmResponse) => {
  const geojsons = overpassToGeojsons(data); // 300 ms on 200k items
  const { records, addRecord, addRecordWithLine } = recordsFactory();

  for (const node of geojsons.node) {
    if (!node.tags) continue;
    if (
      node.tags.climbing === 'area' ||
      node.tags.climbing === 'boulder' ||
      node.tags.climbing === 'crag' ||
      node.tags.natural === 'peak'
    ) {
      addRecord('group', node);
    }

    //
    else if (
      node.tags.climbing === 'route' ||
      node.tags.climbing === 'route_bottom'
    ) {
      addRecord('route', node);
    }

    //
    else if (node.tags.climbing === 'route_top') {
      // TODO later + update climbingLayer
    }

    //
    else if (node.tags.leisure || node.tags.building) {
      addRecord('gym', node);
    }

    //
    else if (node.tags.sport === 'climbing') {
      if (
        node.tags.opening_hours ||
        node.tags.phone ||
        node.tags['addr:street'] ||
        node.tags.man_made ||
        node.tags.name?.match(/gym/i)
      ) {
        addRecord('gym', node);
      } else {
        addRecord('group', node); //this needs tweaking
      }
    }

    // 150 k nodes (probably geometries of ways, etc)
    else {
      //addRecord('_otherNodes', node);
    }
  }

  for (const way of geojsons.way) {
    //
    if (way.tags.climbing === 'route' || way.tags.highway === 'via_ferrata') {
      addRecordWithLine('route', way);
    }

    //
    else if (way.tags.leisure || way.tags.building) {
      addRecord('gym', centerGeometry(way));
    }

    //
    else if (way.tags.climbing || way.tags.sport === 'climbing') {
      addRecord('group', centerGeometry(way));
    }

    // TODO 900 ways – parts of some climbing relations
    else {
      //addRecord('_otherWays', centerGeometry(way));
      // TODO way/167416816 is natural=cliff with parent relation type=site
    }
  }

  for (const relation of geojsons.relation) {
    if (relation.tags.climbing === 'no') {
    }

    // climbing=area, boulder, crag, route
    else if (
      relation.tags.climbing ||
      relation.tags.sport === 'climbing' ||
      relation.tags.type === 'site' ||
      relation.tags.type === 'multipolygon'
    ) {
      addRecord('group', centerGeometry(relation));
    }

    // TODO 4 items to debug
    else {
      // addRecord('_otherRelations', centerGeometry(relation));
    }

    // TODO no center -> write to log
  }

  return records;
};

const buildLogFactory = () => {
  const buildLog: string[] = [];
  const log = (message: string) => {
    buildLog.push(message);
    console.log(message); //eslint-disable-line no-console
  };
  log('Starting...');
  return { getBuildLog: () => buildLog.join('\n'), log };
};

export const refreshClimbingTiles = async () => {
  const { getBuildLog, log } = buildLogFactory();
  const start = performance.now();
  const client = await getClient();
  const tileStats = await queryTileStats(client);

  const data = await fetchFromOverpass();
  log(`Overpass elements: ${data.elements.length}`);

  const records = getNewRecords(data); // ~ 16k records
  log(`Records: ${records.length}`);

  const columns = Object.keys(records[0]);
  const chunks = chunk(records, 5000); // XATA max size is probably 4 MB, this produces queries about 2 MB big

  await client.query('TRUNCATE TABLE climbing_features');
  for (const [index, chunk] of chunks.entries()) {
    const query = format(
      'INSERT INTO climbing_features(%I) VALUES %L',
      columns,
      chunk.map((record) => Object.values(record)),
    );
    log(`SQL Query #${index + 1} length: ${query.length} chars`);
    await client.query(query);
  }

  await client.query('TRUNCATE TABLE climbing_tiles_cache');

  const buildDuration = Math.round(performance.now() - start);
  log(`Duration: ${buildDuration} ms`);
  log('Done.');

  await updateStats(data, getBuildLog(), buildDuration, tileStats, records);
  await closeClient(client);

  return getBuildLog();
};
