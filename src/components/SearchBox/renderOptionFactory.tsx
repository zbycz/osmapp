import React from 'react';
import { OverpassRow } from './options/overpass';
import { PresetRow } from './options/preset';
import { LoaderRow } from './utils';
import { StarRow } from './options/stars';
import { GeocoderRow } from './options/geocoder';
import { Option } from './types';
import { OsmRow } from './options/osm';
import { CoordsRow } from './options/coords';

type Props = {
  option: Option;
  inputValue: string;
};

const Row = ({ option, inputValue }: Props) => {
  switch (option.type) {
    case 'geocoder':
      return <GeocoderRow option={option} inputValue={inputValue} />;
    case 'preset':
      return <PresetRow option={option} inputValue={inputValue} />;
    case 'star':
      return <StarRow option={option} inputValue={inputValue} />;
    case 'overpass':
      return <OverpassRow option={option} />;
    case 'osm':
      return <OsmRow option={option} />;
    case 'coords':
      return <CoordsRow option={option} />;
    case 'loader':
      return <LoaderRow />;
  }
};

export const renderOptionFactory = (inputValue: string) => {
  const renderOptionFn = ({ key, ...props }, option: Option) => (
    <li key={key} {...props}>
      <Row option={option} inputValue={inputValue} />
    </li>
  );
  return renderOptionFn;
};
