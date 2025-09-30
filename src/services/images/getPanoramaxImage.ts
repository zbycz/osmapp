import { fetchJson } from '../fetch';
import { t } from '../intl';
import { getImageFromCenterFactory } from './getImageFromCenterFactory';

type PanoramaxImage = {
  id: string;
  assets: Record<'hd' | 'sd' | 'thumb', { href: string }>;
  geometry: {
    type: 'Point';
    coordinates: [number, number];
  };
  properties: {
    datetime: string;
    'view:azimuth': number;
    'pers:interior_orientation': {
      field_of_view: number;
    };
    license: string;
  };
  links: {
    rel: string;
    href: string;
    title?: string;
    type?: string;
  }[];
};

type PanoramaxResponse = {
  features: PanoramaxImage[];
};

export const getPanoramaxImage = getImageFromCenterFactory('Panoramax', {
  getImages: async (poiCoords) => {
    const apiResponse = await fetchJson<PanoramaxResponse>(
      `https://api.panoramax.xyz/api/search?place_position=${poiCoords[0]},${poiCoords[1]}&place_distance=3-40&place_fov_tolerance=50`,
    );
    return apiResponse.features;
  },
  getImageCoords: ({ geometry }) => geometry.coordinates,
  getImageAngle: ({ properties }) => properties['view:azimuth'],
  isPano: ({ properties }) =>
    properties['pers:interior_orientation'].field_of_view === 360,
  getImageUrl: ({ assets }) => assets.sd.href,
  getImageDate: ({ properties }) => new Date(properties.datetime),
  getImageLink: ({ id }) => id,
  getImageLinkUrl: ({ id, geometry: { coordinates } }) =>
    `https://api.panoramax.xyz/#focus=pic&map=17.44/${coordinates[0]}/${coordinates[0]}&pic=${id}`,
  getPanoUrl: ({ assets }) => assets.hd.href,
  getDescription: ({ links, properties: { license } }, description) => {
    const licenseHref = links.find(({ rel }) => rel === 'license')?.href;
    const licenseHtml = licenseHref
      ? `<a href="${licenseHref}">${license}</a>`
      : license;

    return `${description}<br>${t('featurepanel.image_license', { license: licenseHtml })}`;
  },
});
