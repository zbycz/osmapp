import type { LonLat } from '../../../services/types';

const locationFactory =
  (property: string) =>
  ([longitude, latitude]: LonLat) => ({
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

const createDate = (time: string) => ({
  type: 'statement',
  mainsnak: {
    snaktype: 'value',
    property: 'P571',
    datavalue: {
      type: 'time', // https://www.wikidata.org/wiki/Help:Dates
      value: {
        time: `+${time.split('T')[0]}T00:00:00Z`,
        timezone: 0,
        before: 0,
        after: 0,
        precision: 11, // wikidata can't do hours, minutes, seconds
        calendarmodel: 'http://www.wikidata.org/entity/Q1985727',
      },
    },
  },
});

export const claimsHelpers = {
  /** https://www.wikidata.org/wiki/Property:P571 inception */
  createDate,

  /** https://www.wikidata.org/wiki/Property:P1259 point of view */
  createPhotoLocation: locationFactory('P1259'),

  /** https://www.wikidata.org/wiki/Property:P9149 coordinates of depicted place */
  createPlaceLocation: locationFactory('P9149'),
};
