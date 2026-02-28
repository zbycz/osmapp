-- SQLite create

CREATE TABLE climbing_features
(
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  type            TEXT    NOT NULL,
  lon             REAL    NOT NULL,
  lat             REAL    NOT NULL,
  "osmType"       TEXT    NOT NULL,
  "osmId"         INTEGER NOT NULL,
  name            TEXT,
  "routeCount"    INTEGER,
  "nameRaw"       TEXT,
  "hasImages"     INTEGER, -- SQLite nemá Boolean, používá se 0/1
  line            TEXT,    -- JSON se v SQLite ukládá jako TEXT
  "gradeTxt"      TEXT,
  "gradeId"       INTEGER,
  "histogramCode" TEXT,
  "parentId"      INTEGER
);

CREATE TABLE climbing_tiles_cache
(
  zxy           TEXT NOT NULL PRIMARY KEY,
  tile_geojson  TEXT NOT NULL,
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
  timestamp   TEXT    NOT NULL, -- SQLite nemá specializovaný Timestamp, používá ISO8601 string
  style       TEXT,
  "myGrade"   TEXT,
  note        TEXT,
  pairing     TEXT              -- JSON uložen jako TEXT
);
