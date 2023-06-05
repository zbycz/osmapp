import throttle from 'lodash/throttle';
import { fetchJson } from '../../services/fetch';
import { useMapStateContext } from '../utils/MapStateContext';

// get the photon search url with the entered query
const getApiUrlFromQuery = (query, view) => {
  const [zoom, lat, lon] = view;
  const lvl = Math.max(0, Math.min(16, Math.round(zoom)));
  return `https://photon.komoot.io/api/?q=${query}&lon=${lon}&lat=${lat}&zoom=${lvl}`;
};

// fetch search result choices from photon
export const fetchChoices = throttle(async (query, view, setChoices) => {
  const searchResponse = await fetchJson(getApiUrlFromQuery(query, view));
  const choices = searchResponse.features;
  setChoices(choices || []);
}, 400);


// for choices
export const getDistance = (point1, point2) => {
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

export const useMapCenter = () => {
  const {
    view: [, lat, lon],
  } = useMapStateContext();
  return { lon, lat };
};

export const getAdditionalText = (props) => {
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