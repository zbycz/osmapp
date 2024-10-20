import { parseInt } from 'lodash';
import { fetchJson } from '../fetch';
import { getImageFromCenterFactory } from './getImageFromCenter';

const KARTAVIEW_BASE = 'https://kartaview.org';

type KartaViewResponse = {
  currentPageItems: KartaViewImage[];
  totalFilteredItems: [string];
};

type KartaViewImage = {
  id: string;
  sequence_id: string;
  sequence_index: string;
  orgCode: string;
  lat: string;
  lng: string;
  field_of_view: any;
  name: string;
  lth_name: string;
  th_name: string;
  date_added: string;
  timestamp: string;
  match_segment_id: any;
  match_lat: string;
  match_lng: string;
  way_id: string;
  shot_date: string;
  heading: string;
  headers: any;
  gps_accuracy: any;
  projection: string;
  username: string;
};

export const getKartaViewImage = getImageFromCenterFactory('KartaView', {
  getImages: async (poiCoords) => {
    const bbox = {
      left: poiCoords[0] - 0.0004,
      bottom: poiCoords[1] - 0.0004,
      right: poiCoords[0] + 0.0004,
      top: poiCoords[1] + 0.0004,
    };

    const apiImages = await fetchJson<KartaViewResponse>(
      `${KARTAVIEW_BASE}/1.0/list/nearby-photos/`,
      {
        method: 'POST',
        body: new URLSearchParams({
          ipp: '40',
          page: '1',
          bbTopLeft: `${bbox.top},${bbox.left}`,
          bbBottomRight: `${bbox.bottom},${bbox.right}`,
        }),
      },
    );
    return apiImages.currentPageItems;
  },
  getImageCoords: ({ lng, lat }) => [parseInt(lng), parseInt(lat)],
  getImageAngle: ({ heading }) => parseInt(heading),
  isPano: () => false,
  getImageUrl: ({ name }) => `${KARTAVIEW_BASE}/${name}`,
  getImageDate: ({ timestamp }) => new Date(parseInt(timestamp) * 1000),
  getImageLink: ({ id }) => id,
  getImageLinkUrl: ({ sequence_id, sequence_index }) =>
    `https://kartaview.org/details/${sequence_id}/${sequence_index}`,
  getPanoUrl: () => '',
});
