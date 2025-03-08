import { buildAddress } from './helpers';
import { iconsLookup } from '../components/utils/icons/iconsLookup';
import { FeatureTags } from './types';

const keys = [
  'aerialway',
  'amenity',
  'highway',
  'historic',
  'landuse',
  'leisure',
  'railway',
  'shop',
  'sport',
  'tourism',
  'waterway',
  'place',
  'barrier',
  'addr:street',
  'building',
  'building:part',
  'entrance',
  'boundary',
  'power',
  'natural',
  'route', // relation route=bicycle etc
  'climbing',
];

const shops = [
  'accessories',
  'antiques',
  'beauty',
  'bed',
  'boutique',
  'camera',
  'carpet',
  'charity',
  'chemist',
  'chocolate',
  'coffee',
  'computer',
  'confectionery',
  'convenience',
  'copyshop',
  'cosmetics',
  'garden_centre',
  'doityourself',
  'erotic',
  'electronics',
  'fabric',
  'florist',
  'frozen_food',
  'furniture',
  'video_games',
  'video',
  'general',
  'gift',
  'hardware',
  'hearing_aids',
  'hifi',
  'ice_cream',
  'interior_decoration',
  'jewelry',
  'kiosk',
  'lamps',
  'mall',
  'massage',
  'motorcycle',
  'mobile_phone',
  'newsagent',
  'optician',
  'outdoor',
  'perfumery',
  'perfume',
  'pet',
  'photo',
  'second_hand',
  'shoes',
  'sports',
  'stationery',
  'tailor',
  'tattoo',
  'ticket',
  'tobacco',
  'toys',
  'travel_agency',
  'watches',
  'weapons',
  'wholesale',
];

// https://github.com/openmaptiles/openmaptiles/blob/bb00b4e53fa9dbf5778b394c910c629182c441f9/layers/poi/class.sql#L33
// TODO get from here https://github.com/openmaptiles/openmaptiles/blob/1614a46/layers/poi/poi.yaml#L18
const rules = [
  {
    subclass: shops,
    resultClass: 'shop',
  },
  {
    subclass: ['townhall', 'public_building', 'courthouse', 'community_centre'],
    resultClass: 'town_hall',
  },
  {
    subclass: ['golf', 'golf_course', 'miniature_golf'],
    resultClass: 'golf',
  },
  {
    subclass: ['fast_food', 'food_court'],
    resultClass: 'fast_food',
  },
  {
    subclass: ['park', 'bbq'],
    resultClass: 'park',
  },
  {
    subclass: ['bus_stop', 'bus_station'],
    resultClass: 'bus',
  },
  {
    mappingKey: 'railway',
    subclass: ['station'],
    resultClass: 'railway',
  },
  {
    subclass: ['halt', 'tram_stop', 'subway'],
    resultClass: 'railway',
  },
  {
    mappingKey: 'aerialway',
    subclass: ['station'],
    resultClass: 'aerialway',
  },
  {
    subclass: ['subway_entrance', 'train_station_entrance'],
    resultClass: 'entrance',
  },
  {
    subclass: ['camp_site', 'caravan_site'],
    resultClass: 'campsite',
  },
  {
    subclass: ['laundry', 'dry_cleaning'],
    resultClass: 'laundry',
  },
  {
    subclass: [
      'supermarket',
      'deli',
      'delicatessen',
      'department_store',
      'greengrocer',
      'marketplace',
    ],
    resultClass: 'grocery',
  },
  {
    subclass: ['books', 'library'],
    resultClass: 'library',
  },
  {
    subclass: ['university', 'college'],
    resultClass: 'college',
  },
  {
    subclass: [
      'hotel',
      'motel',
      'bed_and_breakfast',
      'guest_house',
      'hostel',
      'chalet',
      'alpine_hut',
      'camp_site',
    ],
    resultClass: 'lodging',
  },
  {
    subclass: ['chocolate', 'confectionery'],
    resultClass: 'ice_cream',
  },
  {
    subclass: ['post_box', 'post_office'],
    resultClass: 'post',
  },
  {
    subclass: ['cafe'],
    resultClass: 'cafe',
  },
  {
    subclass: ['school', 'kindergarten'],
    resultClass: 'school',
  },
  {
    subclass: ['alcohol', 'beverages', 'wine'],
    resultClass: 'alcohol_shop',
  },
  {
    subclass: ['bar', 'nightclub'],
    resultClass: 'bar',
  },
  {
    subclass: ['marina', 'dock'],
    resultClass: 'harbor',
  },
  {
    subclass: ['car', 'car_repair', 'taxi'],
    resultClass: 'car',
  },
  {
    subclass: ['hospital', 'nursing_home', 'clinic'],
    resultClass: 'hospital',
  },
  {
    subclass: ['grave_yard', 'cemetery'],
    resultClass: 'cemetery',
  },
  {
    subclass: ['attraction', 'viewpoint'],
    resultClass: 'attraction',
  },
  {
    subclass: ['biergarten', 'pub'],
    resultClass: 'beer',
  },
  {
    subclass: ['music', 'musical_instrument'],
    resultClass: 'music',
  },
  {
    subclass: ['american_football', 'stadium', 'soccer'],
    resultClass: 'stadium',
  },
  {
    subclass: ['art', 'artwork', 'gallery', 'arts_centre'],
    resultClass: 'art_gallery',
  },
  {
    subclass: ['bag', 'clothes'],
    resultClass: 'clothing_store',
  },
  {
    subclass: ['swimming_area', 'swimming'],
    resultClass: 'swimming',
  },
  {
    subclass: ['castle', 'ruins'],
    resultClass: 'castle',
  },
  {
    mappingKey: 'place',
    resultClass: 'city',
  },
  {
    mappingKey: 'entrance',
    resultClass: 'entrance',
    resultSubclass: 'entrance',
  },
  {
    mappingKey: 'boundary',
    resultClass: 'star',
  },
  {
    mappingKey: 'building:part',
    resultClass: 'building',
    resultSubclass: 'building:part',
  },
  {
    mappingKey: 'highway',
    subclass: ['footway', 'path'],
    resultClass: 'pedestrian',
  },
  {
    subclass: 'memorial',
    resultClass: 'art_gallery',
  },
  // {
  //   mappingKey: 'climbing',
  //   resultClass: 'climbing',
  // }
];

export type PoiClass = {
  class: string;
  subclass: string;
};

export const getPoiClass = (tags: FeatureTags): PoiClass => {
  const key = keys.find((x) => x in tags); // find first matching key
  const value = tags[key]; // its value

  // find first matching rule
  const resultRule = rules.find(
    (rule) =>
      (!rule.mappingKey && rule.subclass.includes(value)) ||
      (rule.mappingKey === key && !rule.subclass) ||
      (rule.mappingKey === key && rule.subclass.includes(value)),
  );

  const subclass = value === 'yes' ? key : value;

  if (resultRule) {
    return {
      class: resultRule.resultClass, // this also determines the icon
      subclass: resultRule.resultSubclass ?? subclass,
    };
  }

  if (iconsLookup.includes(subclass)) {
    return { class: subclass, subclass };
  }

  if (iconsLookup.includes(key)) {
    return { class: key, subclass };
  }

  const address = buildAddress(tags);
  if (address) {
    return {
      class: 'home',
      subclass: address,
    };
  }

  return { class: 'marker', subclass }; // default icon
};
