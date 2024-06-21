import React from 'react';
import { Grid, Typography } from '@mui/material';
import Maki from '../utils/Maki';
import { highlightText } from './highlightText';
import { join } from '../../utils';
import { getPoiClass } from '../../services/getPoiClass';
import { renderOverpass } from './options/overpass';
import { renderPreset } from './options/preset';
import { getDistance, IconPart, renderLoader, useMapCenter } from './utils';
import { renderStar } from './options/stars';

const getAdditionalText = (props) => {
  const address = [
    props.street,
    props.district,
    props.city,
    props.county,
    props.state,
    props.country,
  ].filter((x) => x !== undefined);
  return address.join(', ');
};

export const buildPhotonAddress = ({
  place,
  street,
  city,
  housenumber: hnum,
  streetnumber: snum,
}) => join(street ?? place ?? city, ' ', hnum ? hnum.replace(' ', '/') : snum);

/** photon
[
  {
    geometry: {
      coordinates: [16.5920871, 49.2416882],
      type: 'Point',
    },
    type: 'Feature',
    properties: {
      osm_id: 2493045013,
      country: 'Česko',
      city: 'Brno',
      countrycode: 'CZ',
      postcode: '612 00',
      county: 'Jihomoravský kraj',
      type: 'house',
      osm_type: 'N',
      osm_key: 'leisure',
      street: 'Podhájí',
      district: 'Řečkovice',
      osm_value: 'sports_centre',
      name: 'VSK MENDELU',
      state: 'Jihovýchod',
    },
  },
  // housenumber
  {
    geometry: { coordinates: [14.4036424, 50.098012], type: 'Point' },
    type: 'Feature',
    properties: {
      osm_id: 296816783,
      country: 'Czechia',
      city: 'Prague',
      countrycode: 'CZ',
      postcode: '16000',
      type: 'house',
      osm_type: 'N',
      osm_key: 'place',
      housenumber: '8',
      street: 'Dejvická',
      district: 'Dejvice',
      osm_value: 'house',
      state: 'Prague',
    },
  },
];
 */
const renderGeocoder = (option, currentTheme, inputValue) => {
  const { geometry, properties } = option;
  const { name, osm_key: tagKey, osm_value: tagValue } = properties;

  const [lon, lat] = geometry.coordinates;
  const mapCenter = useMapCenter();
  const dist = getDistance(mapCenter, { lon, lat }) / 1000;
  const distKm = dist < 10 ? Math.round(dist * 10) / 10 : Math.round(dist); // TODO save imperial to mapState and multiply 0.621371192

  const text = name || buildPhotonAddress(properties);
  const additionalText = getAdditionalText(properties);
  const poiClass = getPoiClass({ [tagKey]: tagValue });

  return (
    <>
      <IconPart>
        <Maki
          ico={poiClass.class}
          style={{ width: '20px', height: '20px', opacity: 0.5 }}
          title={`${tagKey}=${tagValue}`}
          invert={currentTheme === 'dark'}
        />
        <div>{distKm} km</div>
      </IconPart>
      <Grid item xs>
        {highlightText(text, inputValue)}
        <Typography variant="body2" color="textSecondary">
          {additionalText}
        </Typography>
      </Grid>
    </>
  );
};

const renderOption = (inputValue, currentTheme, option) => {
  const { preset, overpass, star, loader } = option;
  if (overpass) {
    return renderOverpass(overpass);
  }

  if (star) {
    return renderStar(star);
  }

  if (loader) {
    return renderLoader();
  }

  if (preset) {
    return renderPreset(preset, inputValue);
  }

  return renderGeocoder(option, currentTheme, inputValue);
};

export const renderOptionFactory =
  (inputValue, currentTheme) => (props, option) =>
    (
      // eslint-disable-next-line react/jsx-props-no-spreading
      <li {...props}>{renderOption(inputValue, currentTheme, option)}</li>
    );
