import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import React from 'react';
import styled from 'styled-components';
import { useMapStateContext } from '../utils/MapStateContext';
import Maki from '../utils/Maki';

/** maptiler
{
      id: 'city.2273338',
      type: 'Feature',
      place_type: ['city'],
      relevance: 1,
      properties: {
        osm_id: 'relation2273338',
      },
      text: 'Praha',
      place_name: 'Praha, Region of Banská Bystrica',
      bbox: [19.47208254, 48.34734753, 19.52180047, 48.39446473],
      center: [19.4973869, 48.3708814],
      geometry: {
        type: 'Point',
        coordinates: [19.4973869, 48.3708814],
      },
      context: [
        {
          id: 'country.14296',
          osm_id: 'relation14296',
          text: 'Slovakia',
        },
        {
          id: 'state.388270',
          osm_id: 'relation388270',
          text: 'Region of Banská Bystrica',
        },
      ],
    }
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

const getMaptilerGeocoderIcon = (placeTypes) => {
  const placeType = placeTypes?.[0];
  const ico =
    placeType === 'state' || placeType === 'country'
      ? 'star'
      : placeType === 'subcity'
      ? 'city'
      : placeType;
  return ico;
};

const isCountry = (item) => item.id?.split('.')[0] === 'country';

const getAdditionalText = (context) => {
  const country = context?.filter((x) => isCountry(x)) ?? [];
  const notCountry = context?.filter((x) => !isCountry(x)) ?? [];
  const orderedContext = [...notCountry, ...country];
  return orderedContext?.map((x) => x.text).join(', ');
};

export const renderOptionFactory = () => (option) => {
  const { center, text, context, place_type: placeTypes } = option;
  const [lon, lat] = center;

  const mapCenter = useMapCenter();
  const dist = getDistance(mapCenter, { lon, lat }) / 1000;
  const distKm = dist < 10 ? Math.round(dist * 10) / 10 : Math.round(dist); // TODO save imperial to mapState and multiply 0.621371192
  const ico = getMaptilerGeocoderIcon(placeTypes);
  const additionalText = getAdditionalText(context);

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
        {text}
        <Typography variant="body2" color="textSecondary">
          {additionalText}
        </Typography>
      </Grid>
    </>
  );
};
