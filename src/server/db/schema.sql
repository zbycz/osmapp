-- SQLite schema v1

CREATE TABLE climbing_features
(
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  type            TEXT    NOT NULL,
  lon             REAL    NOT NULL,
  lat             REAL    NOT NULL,
  "osmType"       TEXT    NOT NULL,
  "osmId"         INTEGER NOT NULL,
  name            TEXT, -- name with diacritics - ONLY IF it differs from nameRaw
  "nameRaw"       TEXT, -- name without diacritics (always present, or NULL)
  "routeCount"    INTEGER,
  "hasImages"     INTEGER,
  line            TEXT, -- geometry coordinates JSON
  "gradeTxt"      TEXT,
  "gradeId"       INTEGER,
  "histogramCode" TEXT,
  "parentId"      INTEGER
);

CREATE TABLE climbing_tiles_cache
(
  zxy           TEXT NOT NULL PRIMARY KEY,
  tile_geojson  TEXT NOT NULL, -- JSON
  duration      INTEGER,
  feature_count INTEGER
);

CREATE TABLE climbing_tiles_stats
(
  id                     INTEGER PRIMARY KEY AUTOINCREMENT,
  timestamp              TEXT,
  osm_data_timestamp     TEXT,
  build_log              TEXT,
  build_duration         INTEGER,
  max_size               INTEGER,
  max_size_zxy           TEXT,
  max_time               INTEGER,
  max_time_zxy           TEXT,
  groups_count           INTEGER,
  groups_with_name_count INTEGER,
  routes_count           INTEGER
);

CREATE TABLE climbing_ticks
(
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  "osmUserId" INTEGER NOT NULL,
  "osmType"   TEXT,
  "osmId"     INTEGER,
  timestamp   TEXT    NOT NULL,
  style       TEXT,
  "myGrade"   TEXT,
  note        TEXT,
  pairing     TEXT
);
