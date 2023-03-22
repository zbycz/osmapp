import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import React from 'react';
import styled from 'styled-components';
import { useMapStateContext } from '../utils/MapStateContext';
import Maki from '../utils/Maki';
import { highlightText } from './highlightText';
import { join } from '../../utils';
import { getPoiClass } from '../../services/getPoiClass';

/** photon
{
  "features": [
    {
      "geometry": {
        "coordinates": [
          16.5920871,
          49.2416882
        ],
        "type": "Point"
      },
      "type": "Feature",
      "properties": {
        "osm_id": 2493045013,
        "country": "Česko",
        "city": "Brno",
        "countrycode": "CZ",
        "postcode": "612 00",
        "county": "Jihomoravský kraj",
        "type": "house",
        "osm_type": "N",
        "osm_key": "leisure",
        "street": "Podhájí",
        "district": "Řečkovice",
        "osm_value": "sports_centre",
        "name": "VSK MENDELU",
        "state": "Jihovýchod"
      }
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
    }
  ]
 */

const IconPart = styled.div`
  width: 50px;
  text-align: center;
  padding-right: 10px;
  font-size: 10px;
  color: ${({ theme }) => theme.palette.text.secondary};
`;

const getDistance = (point1, point2) => {
  const lat1 = (parseFloat(point1.lat) * Math.PI) / 180;
  const lng1 = (parseFloat(point1.lon) * Math.PI) / 180;
  const lat2 = (parseFloat(point2.lat) * Math.PI) / 180;
  const lng2 = (parseFloat(point2.lon) * Math.PI) / 180;
  const latdiff = lat2 - lat1;
  const lngdiff = lng2 - lng1;

  return (
    6372795 *
    2 *
    Math.asin(
      Math.sqrt(
        Math.sin(latdiff / 2) ** 2 +
          Math.cos(lat1) * Math.cos(lat2) * Math.sin(lngdiff / 2) ** 2,
      ),
    )
  );
};

const useMapCenter = () => {
  const {
    view: [, lat, lon],
  } = useMapStateContext();
  return { lon, lat };
};

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

export const renderOptionFactory = (inputValue, currentTheme) => (option) => {
  const { properties, geometry } = option;
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
