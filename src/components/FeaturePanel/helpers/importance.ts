import sumBy from 'lodash/sumBy';
import { isPublictransportRoute, isRouteMaster } from '../../../utils';

const amenityImportance = {
  restaurant: 50,
  cafe: 50,
  fast_food: 40,
  school: 35,
  pharmacy: 35,
  library: 35,
  place_of_worship: 30,
  bank: 30,
  hospital: 30,
  clinic: 30,
  charging_station: 25,
  shelter: 20,
  fuel: 20,
  toilets: 20,
  atm: 20,
  police: 21,
  fire_station: 21,
  parking: 15,
  bicycle_parking: 15,
  recycling: 15,
  kindergarten: 15,
  post_box: 10,
  drinking_water: 10,
  vending_machine: 10,
  hunting_stand: 10,
  bench: 10,
  waste_basket: 10,
  parking_space: -15,
};

const wikiImportance =
  (fallback: number) => (_: string, tags: Record<string, string>) => {
    if (tags.wikipedia && tags.wikimedia_commons && tags.wikidata) {
      // will be applied 3 times so divide it by 3
      return 110 / 3;
    }
    if (
      [tags.wikipedia, tags.wikimedia_commons, tags.wikidata].filter((v) => v)
        .length === 2
    ) {
      return 85 / 2;
    }
    if (isPublictransportRoute({ tags })) {
      return 30;
    }
    if (isRouteMaster({ tags, osmMeta: { type: 'relation' } })) {
      return 20;
    }
    return fallback;
  };

const importantKeys: Record<
  string,
  number | ((value: string, tags: Record<string, string>) => number)
> = {
  wikipedia: wikiImportance(65),
  wikimedia_commons: wikiImportance(60),
  image: 50,
  museum: 45,
  shop: 40,
  wikidata: wikiImportance(40),
  tourism: 40,
  opening_hours: 30,
  fee: 30,
  leisure: 25,
  name: 20,
  religion: 10,
  sport: 10,
  phone: 10,
  website: 10,
  'contact:phone': 10,
  'contact:website': 10,
  amenity: (val) => amenityImportance[val] ?? 5,
  direction: 5,
  material: 5,
  aeroway: 3,

  natural: (val) => (val === 'tree' ? -5 : 0),
  noname: (val) => (val === 'yes' ? -10 : 0),
  highway: -10,
  public_transport: -10,
};

export const getImportance = (tags: Record<string, string>) => {
  const keyImportance = sumBy(Object.entries(tags), ([key, val]) => {
    const value = importantKeys[key] ?? 0;
    if (typeof value === 'number') {
      return value;
    }
    return value(val, tags);
  });
  return keyImportance;
};
