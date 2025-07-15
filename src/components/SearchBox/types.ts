import { LonLat } from '../../services/types';
import { Star } from '../utils/StarsContext';
import { ASTNode } from './queryWizard/ast';
import { Bbox } from '../utils/MapStateContext';
import { ClimbingSearchRecord } from '../../types';

type GenericOption<T extends string, U extends Object | null> = {
  type: T;
} & (U extends null ? {} : Record<T, U>);

export type PhotonGeojsonFeature = {
  type: 'Feature';
  properties: {
    type: string; // house, street, city
    place: string | null | undefined;
    street: string | null | undefined;
    housenumber: string | null | undefined;
    streetnumber: string | null | undefined;
    city: string | null | undefined;
    district?: string;
    county?: string; // not sure if it ever appears
    state?: string;
    locality?: string;
    postcode?: string;
    country?: string;
    countrycode?: string;
    osm_key: string;
    osm_value: string;
    osm_type: string;
    osm_id: string;
    name: string;
    extent?: Bbox;
  };
  geometry: {
    coordinates: LonLat;
  };
};

export type PhotonResponse = {
  features: PhotonGeojsonFeature[];
};

export type GeocoderOption = GenericOption<'geocoder', PhotonGeojsonFeature>;

export type ClimbingOption = GenericOption<'climbing', ClimbingSearchRecord>;

export type OverpassOption = GenericOption<
  'overpass',
  {
    query?: string; // TODO there should be two types for "query" and "ast"
    ast?: ASTNode;
    inputValue: string;
    label: string;
  }
>;

export type PresetOption = GenericOption<
  'preset',
  {
    nameSimilarity: number;
    textsByOneSimilarity: number[];
    bestMatch: number;
    presetForSearch: {
      key: string;
      name: string;
      tags: Record<string, string>;
      tagsAsOneString: string;
      texts: string[];
    };
  }
>;

export type StarOption = GenericOption<'star', Star>;

type LoaderOption = GenericOption<'loader', null>;

export type CoordsOption = GenericOption<
  'coords',
  { center: LonLat; label: string; sublabel: string }
>;

export type OsmOption = GenericOption<
  'osm',
  {
    type: string;
    id: number;
  }
>;

/*
 * A option for the searchbox
 */
export type Option =
  | StarOption
  | CoordsOption
  | OverpassOption
  | PresetOption
  | LoaderOption
  | GeocoderOption
  | ClimbingOption
  | OsmOption;
