import type { LonLat } from '../../../services/types';

const createLocationClaim = (property, [longitude, latitude]: LonLat) => ({
  type: 'statement',
  mainsnak: {
    snaktype: 'value',
    property,
    datavalue: {
      type: 'globecoordinate',
      value: {
        latitude,
        longitude,
        globe: 'http://www.wikidata.org/entity/Q2',
        precision: 0.000001,
      },
    },
  },
});

export const claimsHelpers = {
  createDate: (time) => ({
    type: 'statement',
    mainsnak: {
      snaktype: 'value',
      property: 'P571', // https://www.wikidata.org/wiki/Property:P571 inception
      datavalue: { type: 'time', value: { time, timezone: 0 } },
    },
  }),
  createPhotoLocation: (lonLat: LonLat) => createLocationClaim('P1259', lonLat), // https://www.wikidata.org/wiki/Property:P1259 point of view
  createPlaceLocation: (lonLat: LonLat) => createLocationClaim('P9149', lonLat), // https://www.wikidata.org/wiki/Property:P9149 coordinates of depicted place
};
