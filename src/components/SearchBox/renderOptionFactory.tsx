import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import React from 'react';
import styled from 'styled-components';
import { useMapStateContext } from '../utils/MapStateContext';
import Maki from '../utils/Maki';
import { highlightText } from './highlightText';

/** maptiler
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
    }
  ]
 */

const IconPart = styled.div`
  width: 50px;
  text-align: center;
  padding-right: 10px;
  font-size: 10px;
  color: #777;
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

const getIcon = (placeType) => {
  const ico =
    placeType === 'state' || placeType === 'country'
      ? 'star'
      : placeType === 'subcity'
      ? 'city'
      : placeType;
  return ico;
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

export const renderOptionFactory = (inputValue) => (option) => {
  const { properties, geometry } = option;
  const { name: text, type } = properties;
  const [lon, lat] = geometry.coordinates;
  const mapCenter = useMapCenter();
  const dist = getDistance(mapCenter, { lon, lat }) / 1000;
  const distKm = dist < 10 ? Math.round(dist * 10) / 10 : Math.round(dist); // TODO save imperial to mapState and multiply 0.621371192
  const ico = getIcon(type);
  const additionalText = getAdditionalText(properties);

  return (
    <>
      <IconPart>
        <Maki
          ico={ico}
          style={{ width: '20px', height: '20px', opacity: 0.5 }}
          title={ico}
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
