import Router from 'next/router';
import { useAddMapEvent } from '../../helpers';
import { getSkeleton } from '../helpers';
import { addFeatureCenterToCache } from '../../../services/osmApi';
import {
  getShortId,
  getUrlOsmId,
  isSameOsmId,
} from '../../../services/helpers';

export const useOnFeatureClicked = useAddMapEvent((map, setFeature) => ({
  eventType: 'click',
  eventHandler: async (e) => {
    const { point } = e;
    const coords = map.unproject(point).toArray();
    const features = map.queryRenderedFeatures(point);
    if (!features.length) {
      return;
    }

    const skeleton = getSkeleton(features[0], coords);
    addFeatureCenterToCache(getShortId(skeleton.osmMeta), skeleton.center);
    console.log('clicked map feature (skeleton): ', skeleton); // eslint-disable-line no-console

    if (!skeleton.nonOsmObject) {
      // router wouldnt overwrite the skeleton if the page is already loaded
      setFeature((feature) =>
        isSameOsmId(feature, skeleton) ? feature : skeleton,
      );
      addFeatureCenterToCache(getShortId(skeleton.osmMeta), skeleton.center);

      Router.push(`/${getUrlOsmId(skeleton.osmMeta)}`);
    }
  },
}));
