-- Right click on "public" schema, SQL Scripts/Generate DDL to clipboard
-- + Reformat in WebStorm

create sequence climbing_tiles_stats_id_seq
  as integer
  start with 209;

alter sequence climbing_tiles_stats_id_seq owner to xata_owner_bb_3id0nfvj551arc4a8j3li4ee7s;

create table climbing_features
(
  id              serial
    primary key,
  type            text             not null,
  lon             double precision not null,
  lat             double precision not null,
  "osmType"       text             not null,
  "osmId"         bigint           not null,
  name            text,
  "routeCount"    integer,
  "nameRaw"       text,
  "hasImages"     boolean,
  line            json,
  "gradeTxt"      text,
  "gradeId"       integer,
  "histogramCode" text,
  "parentId"      bigint
);

alter table climbing_features
  owner to xata_owner_bb_3id0nfvj551arc4a8j3li4ee7s;

create table climbing_tiles_cache
(
  zxy           text not null
    primary key,
  tile_geojson  text not null,
  duration      integer,
  feature_count integer
);

alter table climbing_tiles_cache
  owner to xata_owner_bb_3id0nfvj551arc4a8j3li4ee7s;

create table climbing_tiles_stats
(
  id                     integer default nextval('climbing_tiles_stats_id_seq'::regclass) not null
    primary key,
  timestamp              text,
  osm_data_timestamp     text,
  build_log              text,
  build_duration         bigint,
  max_size               bigint,
  max_size_zxy           text,
  max_time               bigint,
  max_time_zxy           text,
  groups_count           integer,
  groups_with_name_count integer,
  routes_count           integer
);

alter table climbing_tiles_stats
  owner to xata_owner_bb_3id0nfvj551arc4a8j3li4ee7s;

alter sequence climbing_tiles_stats_id_seq owned by climbing_tiles_stats.id;

create table climbing_ticks
(
  id          serial
    primary key,
  "osmUserId" bigint                   not null,
  "osmType"   text,
  "osmId"     bigint,
  timestamp   timestamp with time zone not null,
  style       text,
  "myGrade"   text,
  note        text,
  pairing     json
);

alter table climbing_ticks
  owner to xata_owner_bb_3id0nfvj551arc4a8j3li4ee7s;

