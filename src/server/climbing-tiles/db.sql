-- copy DDL to clipboard on "public" schema + Reformat in WebStorm

create table climbing_features
(
  id        serial
    primary key,
  type      text             not null,
  lon       double precision not null,
  lat       double precision not null,
  "osmType" text             not null,
  "osmId"   bigint           not null,
  name      text,
  "nameRaw" text,
  count     integer,
  geojson   json             not null
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
  id                     serial
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

