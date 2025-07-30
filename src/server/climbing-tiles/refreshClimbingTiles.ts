import { OsmResponse, overpassToGeojsons } from './overpass/overpassToGeojsons';
import { encodeUrl } from '../../helpers/utils';
import { fetchJson } from '../../services/fetch';
import format from 'pg-format';
import { closeClient, getClient } from './db';
import { queryTileStats, updateStats } from './utils';
import { chunk } from 'lodash';
import { readFileSync } from 'fs';
import {
  buildLogFactory,
  centerGeometry,
  recordsFactory,
} from './refreshClimbingTilesHelpers';
import { cacheTile000 } from './getClimbingTile';

const fetchFromOverpass = async () => {
  if (process.env.NODE_ENV === 'development') {
    console.log('fetchFromOverpass: Using cache in ../overpass.json'); //eslint-disable-line no-console
    return JSON.parse(readFileSync('../overpass.json', 'utf8'));
  }

  // takes about 42 secs, 25MB; in May25 = 25MB - 217k items->55k records
  const query = `[out:json][timeout:100];(nwr["climbing"];nwr["sport"="climbing"];);(._;>>;);out qt;`;
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

  // writeFileSync('../overpass.json', JSON.stringify(data));
  return data;
};

// (splitting this function doesn't make sense - it has very simple structure)
// eslint-disable-next-line max-lines-per-function
const getNewRecords = (data: OsmResponse, log: (message: string) => void) => {
  const geojsons = overpassToGeojsons(data, log); // 300 ms on 200k items
  const { records, addRecord, addRecordWithLine } = recordsFactory(log);

  for (const node of geojsons.node) {
    if (!node.tags || node.tags.climbing === 'no') continue;
    if (node.tags.climbing === 'area') {
      addRecord('area', node);
    }

    //
    else if (
      node.tags.climbing === 'crag' ||
      node.tags.climbing === 'boulder' ||
      node.tags.natural === 'peak'
    ) {
      addRecord('crag', node);
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
        addRecord('crag', node); //this needs tweaking
      }
    }

    // 150 k nodes (probably geometries of ways, etc)
    else {
      //addRecord('_otherNodes', node);
    }
  }

  for (const way of geojsons.way) {
    if (!way.tags || way.tags.climbing === 'no') continue;

    //
    if (way.tags.climbing === 'route' || way.tags.highway === 'via_ferrata') {
      addRecordWithLine('route', way);
    }

    //
    else if (way.tags.leisure || way.tags.building) {
      addRecord('gym', centerGeometry(way));
    }

    //
    else if (way.tags.climbing === 'area') {
      addRecord('area', centerGeometry(way)); // way climbing=area probably doesnt exist
    }

    //
    else if (way.tags.climbing || way.tags.sport === 'climbing') {
      addRecord('crag', centerGeometry(way));
    }

    // TODO 900 ways – parts of some climbing relations
    else {
      //addRecord('_otherWays', centerGeometry(way));
      // TODO way/167416816 is natural=cliff with parent relation type=site
    }
  }

  for (const relation of geojsons.relation) {
    if (!relation.tags || relation.tags.climbing === 'no') continue;

    // usually climbing=route + route=via_ferrata
    if (
      relation.tags.route === 'via_ferrata' ||
      relation.tags.via_ferrata_scale
    ) {
      addRecord('ferrata', centerGeometry(relation));
    }

    // climbing=area, boulder, crag, route
    else if (relation.tags.climbing === 'area') {
      addRecord('area', centerGeometry(relation));
    }

    //
    else if (
      relation.tags.climbing ||
      relation.tags.sport === 'climbing' ||
      relation.tags.type === 'site' ||
      relation.tags.type === 'multipolygon'
    ) {
      addRecord('crag', centerGeometry(relation));
    }

    // TODO 4 items to debug
    else {
      // addRecord('_otherRelations', centerGeometry(relation));
    }

    // TODO no center -> write to log
  }

  return records;
};

export const refreshClimbingTiles = async () => {
  const { getBuildLog, log } = buildLogFactory();
  const start = performance.now();
  const client = await getClient();
  const tileStats = await queryTileStats(client);

  const data = await fetchFromOverpass();
  log(`Overpass elements: ${data.elements.length}`);

  const records = getNewRecords(data, log); // ~ 55k records
  log(`Records: ${records.length}`);

  const columns = Object.keys(records[0]);
  const chunks = chunk(records, 1000); // XATA max size is probably 4 MB, but it was out of memory on 1.8MB as well. This produces queries about 0.4 MB big

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

  log('Caching tile 0/0/0');
  await cacheTile000(records);

  const buildDuration = Math.round(performance.now() - start);
  log(`Duration: ${buildDuration} ms`);
  log('Done.');

  await updateStats(data, getBuildLog(), buildDuration, tileStats, records);
  await closeClient(client);

  return getBuildLog();
};
