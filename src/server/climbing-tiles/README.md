# Climbing Tiles

Vector GEOJSON TILES of custom design:

- Almost every feature related to climbing is displayed with crag icon (▲) over the map, `climbing=area` with the double mountain icon (⛰️).
  - Areas are rendered up to two levels deep - areas and super-areas.
- Features with images are blue/red.
- Routes are colored according to their grade in any classification system.
- via ferratas and climbing gyms are shown with separate icons.
- Full definition [here](https://github.com/zbycz/osmapp/blob/bcad4d2/src/server/climbing-tiles/refreshClimbingTiles.ts#L50-L166)
- How it looks: https://wiki.openstreetmap.org/wiki/Openclimbing.org#Gallery

Since March 2026 the whole stack is based on one SQLite database ([#1466](https://github.com/zbycz/osmapp/pull/1466)). Previously we used XATA Lite free tier for ~1 year, see details at the bottom.

Three layers of caches:

1. server cache - DB table `climbing_tiles_cache`
2. cdn cache - Cloudflare cache via Page Rule
3. browser cache - both on browser level, and on the application level via `fetchJson()`

We serve ~1000 tile requests/day, server cache HITS are ~1ms, MISSes ~12ms.

## Setup

1. set ENVs \
   `NEXT_PUBLIC_ENABLE_CLIMBING_TILES=true` \
   `NEXT_PUBLIC_CLIMBING_TILES_LOCAL=true`
2. run `/api/climbing-tiles/refresh` to get data from overpass and populate the DB (in average 90 seconds for the whole refresh). The `db.sqlite` is created automatically in `/data` folder.
3. open browser and choose the `Climbing` layer - if configured correctly, second line shows refresh date, not "lite"

## Architecture Docs

`/api/climbing-tiles/refresh`:

- download overpass query – all `climbing=*` or `sport=climbing` elements and all relation members
- contruct full geometries from OSM elements - `overpassToGeojsons()`
- filter only relevant data + create SQL records
- insert the records them in `climbing_features` table
- clear `climbing_tiles_cache` table

`/api/climbing-tiles/tile`:

- we allow only zoom levels 0, 6, 9 and 12
- compute the BBOX from tile id
- fetch all `climbing_features` inside that BBOX
- for zooms 0+6 we `optimizeFeaturesToGrid()` spliting the tile to 500x500 cells, and returning only the one feature with maximal `routeCount`. Otherwise we would have to return all 60k rows for zoom 0.
- for zoom 9 we return all `type` (crags, areas, gyms) except for routes
- for zoom 12 we return even all routes
- finally we cache that tile in `climbing_tiles_cache` table

Browser

- see `climbingTilesSource.ts`
- it requests a tile Z, when it reaches zoom (Z+1) in browser - this minimizes the number of needed requests
- for all available fields see `ClimbingTilesProperties` type
- algo - see `updateData()`
  - we `computeTiles` ids needed for viewport (eg. 6/10/11, 6/10/12)
  - fetch all tiles using `getTileJson()`
  - `doClimbingFilter`
  - `constructOutlines` (these are shown onHover for area/crag relations)
  - `processFeature` - called on each feature - computes the color and grade in user's chosen grade system
  - finally `setData` in the maplibre GEOJSON source `CLIMBING_TILES_SOURCE`.

Many notes can be found in exploration pull requests - [see](https://github.com/search?q=repo%3Azbycz%2Fosmapp+in%3Atitle+climbingTiles&type=pullrequests&s=created&o=asc).

.

.

.

## OLD XATA setup, before we used local SQLite

~Our production needs were covered by [lite.xata.io free tier](https://xata.io/blog/postgres-free-tier). We served ~30 users/day = ~500 tile requests/day. XATA offers 15GB of storage (we used 23 MB) and continual uptime.~

~The response time sometimes goes up to tens of seconds, so we cache the tile in three layers: 1) DB table climbing_tiles_cache 2) Vercel CDN cache for 1h - cache hit around 20% 3) browser cache on the application level see `fetchJson()` caching implementaion.~

~With Xata we use two types of access:~

1. ~postgres connection - for refreshing tiles - inserting 65000 rows every night, split in 65 INSERT calls. Faster then REST, but can timeout in peak times.~
2. ~[REST JSON endpoint](https://lite.xata.io/docs/api-reference/db/db_branch_name/sql#sql-query) - for getting features or cached tiles.~

~There was also test of the postgres only version via NEON_DB - see [#1384](https://github.com/zbycz/osmapp/pull/1384).~
