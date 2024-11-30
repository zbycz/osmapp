import { Option } from '../SearchBox/types';
import { PointsTooFarError, Profile, RoutingResult } from './routing/types';
import { type ShowToast, useSnackbar } from '../utils/SnackbarContext';
import { useEffect, useRef } from 'react';
import Router, { useRouter } from 'next/router';
import { buildUrl, parseUrlParts } from './helpers';
import {
  destroyRouting,
  getLastMode,
  handleRouting,
} from './routing/handleRouting';
import { getOptionToLonLat } from '../SearchBox/getOptionToLonLat';
import { getLastFeature } from '../../services/lastFeatureStorage';
import { getCoordsOption } from '../SearchBox/options/coords';
import { getLabel } from '../../helpers/featureLabel';
import { t } from '../../services/intl';
import { FetchError } from '../../services/helpers';
import * as Sentry from '@sentry/nextjs';

const getRoutingFailed = (showToast: ShowToast) => {
  return (error: unknown) => {
    if (error instanceof PointsTooFarError) {
      showToast(t('directions.error.too_far'), 'warning');
    } else if (error instanceof FetchError) {
      Sentry.captureException(error);
      showToast(`${t('error')} code ${error.code}`, 'error');
    } else {
      Sentry.captureException(error);
      showToast(`${t('error')} – ${error}`, 'error');
      throw error;
    }
  };
};
export const useReactToUrl = (
  setMode: (param: ((current: string) => string) | string) => void,
  setFrom: (value: Option) => void,
  setTo: (value: Option) => void,
  setResult: (result: RoutingResult) => void,
) => {
  const { showToast } = useSnackbar();
  const initialModeWasSet = useRef(false);
  const router = useRouter();
  const urlParts = router.query.all;

  useEffect(() => {
    const [, mode, ...points] = urlParts as [string, Profile, ...string[]];
    const options = parseUrlParts(points);

    if (mode && options.length === 2) {
      setMode(mode);
      setFrom(options[0]);
      setTo(options[1]);
      handleRouting(mode, options.map(getOptionToLonLat))
        .then(setResult)
        .catch(getRoutingFailed(showToast));
    } else {
      if (initialModeWasSet.current === false && getLastMode()) {
        setMode(getLastMode());
        initialModeWasSet.current = true;
      }

      const lastFeature = getLastFeature();
      if (lastFeature) {
        setTo(getCoordsOption(lastFeature.center, getLabel(lastFeature)));
      }
    }

    return () => {
      destroyRouting();
    };
  }, [urlParts, setMode, setFrom, setTo, setResult, showToast]);
};

export const useGetOnSubmitFactory = (
  setResult: (result: RoutingResult) => void,
  setLoading: (value: ((prevState: boolean) => boolean) | boolean) => void,
) => {
  const { showToast } = useSnackbar();

  return (from: Option, to: Option, mode: Profile) => {
    if (!from || !to) {
      return;
    }
    const points = [from, to];
    const url = buildUrl(mode, points);
    if (url === Router.asPath) {
      setLoading(true);
      handleRouting(mode, points.map(getOptionToLonLat))
        .then(setResult)
        .catch(getRoutingFailed(showToast))
        .finally(() => setLoading(false));
    } else {
      Router.push(url);
    }
  };
};