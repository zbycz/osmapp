import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import React from 'react';
import styled from 'styled-components';
import { useMapStateContext } from '../utils/MapStateContext';
import { getPoiClass } from '../../services/getPoiClass';
import Maki from '../utils/Maki';

// [
//   {
//     place_id: 93538005,
//     licence:
//       'Data © OpenStreetMap contributors, ODbL 1.0. https://osm.org/copyright',
//     osm_type: 'way',
//     osm_id: 31134664,
//     boundingbox: ['50.0902337', '50.0923471', '14.3210646', '14.3216013'],
//     lat: '50.0913465',
//     lon: '14.3213162',
//     display_name:
//       'Ke Džbánu, Liboc, Praha, okres Hlavní město Praha, Hlavní město Praha, Praha, 16100, Česká republika',
//     class: 'highway',
//     type: 'residential',
//     importance: 0.19999999999999998,
//     address: {
//       road: 'Ke Džbánu',
//       suburb: 'Liboc',
//       city: 'Praha',
//       county: 'okres Hlavní město Praha',
//       state: 'Praha',
//       postcode: '16100',
//       country: 'Česká republika',
//       country_code: 'cz',
//     },
//     geojson: {
//       type: 'LineString',
//       coordinates: [
//         [14.3216013, 50.0902337],
//         [14.3210646, 50.0923471],
//       ],
//     },
//   },
// ];

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

const join = (a, sep, b) => `${a || ''}${a && b ? sep : ''}${b || ''}`;

const useMapCenter = () => {
  const {
    view: [, lat, lon],
  } = useMapStateContext();
  return { lon, lat };
};

const highlightText = (resultText, inputValue) => {
  const parts = parse(resultText, match(resultText, inputValue));
  const map = parts.map((part, index) => (
    // eslint-disable-next-line react/no-array-index-key
    <span key={index} style={{ fontWeight: part.highlight ? 700 : 400 }}>
      {part.text}
    </span>
  ));
  return map;
};

function getTextsFromAddress(address) {
  const [, resultText] = Object.entries(address)[0];
  const additionalText = join(
    join(address.road, ', ', address.state),
    ', ',
    address.country_code?.toUpperCase(),
  );
  return { resultText, additionalText };
}

export const renderOptionFactory =
  (inputValue) =>
  ({ address, class: tagKey, type: tagValue, lon, lat }) => {
    const mapCenter = useMapCenter();
    const dist = getDistance(mapCenter, { lon, lat }) / 1000;
    const distKm = dist < 10 ? Math.round(dist * 10) / 10 : Math.round(dist);

    const properties = getPoiClass({ [tagKey]: tagValue });

    const { resultText, additionalText } = getTextsFromAddress(address);

    return (
      <>
        <IconPart>
          <Maki
            ico={properties.class}
            style={{ width: '20px', height: '20px', opacity: 0.5 }}
            title={`${tagKey}=${tagValue}`}
          />
          <div>{distKm} km</div>
        </IconPart>
        <Grid item xs>
          {highlightText(resultText, inputValue)}

          <Typography variant="body2" color="textSecondary">
            {additionalText}
          </Typography>
        </Grid>
      </>
    );
  };
