import { uniqBy } from 'lodash';
import { useRouter } from 'next/router';
import { useEffect, useRef } from 'react';

import { getLabel } from '../../helpers/featureLabel';
import { getLastFeature } from '../../services/lastFeatureStorage';
import { Setter } from '../../types';
import { getOptionToLonLat } from '../SearchBox/getOptionToLonLat';
import { getCoordsOption } from '../SearchBox/options/coords';
import { Option } from '../SearchBox/types';
import { useSnackbar } from '../utils/SnackbarContext';

import { getOnrejected, parseUrlParts } from './helpers';
import {
  destroyRouting,
  getLastMode,
  handleRouting,
} from './routing/handleRouting';
import { Profile, RoutingResult } from './routing/types';

export const useReactToUrl = (
  setMode: Setter<string>,
  setPoints: Setter<Option[]>,
  setResult: Setter<RoutingResult>,
) => {
  const { showToast } = useSnackbar();
  const initialModeWasSet = useRef(false);
  const router = useRouter();
  const urlParts = router.query.all;

  useEffect(() => {
    const [, mode, ...points] = urlParts as [string, Profile, ...string[]];
    // points somehow has only one item with all subpoints in one string
    const options = parseUrlParts(points.flatMap((str) => str.split('/')));

    if (mode && options.length >= 2) {
      setMode(mode);
      setPoints(options);
      handleRouting(mode, options.map(getOptionToLonLat))
        .then(setResult)
        .catch(getOnrejected(showToast));
    } else {
      if (initialModeWasSet.current === false && getLastMode()) {
        setMode(getLastMode());
        initialModeWasSet.current = true;
      }

      const lastFeature = getLastFeature();
      if (lastFeature) {
        const option = getCoordsOption(
          lastFeature.center,
          getLabel(lastFeature),
        );
        setPoints((prev) => {
          const noDoubledUndefined = prev.reduce<Option[]>(
            (acc, cur, index, array) =>
              cur === undefined && cur === array[index - 1]
                ? acc
                : [...acc, cur],
            [],
          );
          return [...noDoubledUndefined, option];
        });
      }
    }

    return () => {
      destroyRouting();
    };
  }, [urlParts, setMode, setPoints, setResult, showToast]);
};
