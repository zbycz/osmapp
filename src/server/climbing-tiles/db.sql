create table if not exists public.climbing_features
(
  id        SERIAL           primary key,
  type      text             not null,
  lon       double precision not null,
  lat       double precision not null,
  "osmType" text             not null,
  "osmId"   bigint           not null,
  name      text,
  count     integer,
  geojson   json             not null
);

create table if not exists public.climbing_tiles_stats
(
  id                 SERIAL                                 primary key,
  timestamp          timestamp with time zone default now() not null,
  osm_data_timestamp timestamp with time zone               not null,
  build_log          text,
  build_duration     bigint                                 not null,
  max_size           bigint                                 not null,
  max_size_zxy       text                                   not null,
  max_time           bigint                                 not null,
  max_time_zxy       text                                   not null,
  prev_tiles_stats   text
);

create table if not exists public.climbing_tiles_cache
(
  zxy           text not null       primary key,
  tile_geojson  text not null,
  duration      integer,
  feature_count integer
);
