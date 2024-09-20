import styled from '@emotion/styled';
import {
  DirectionsAutocomplete,
  getOptionToLonLat,
} from './DirectionsAutocomplete';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Stack } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { t } from '../../services/intl';
import { ModeToggler } from './ModeToggler';
import Router, { useRouter } from 'next/router';
import {
  destroyRouting,
  getLastMode,
  handleRouting,
} from './routing/handleRouting';
import { getLabel } from '../../helpers/featureLabel';
import { getLastFeature } from '../../services/lastFeatureStorage';
import { Result, StyledPaper } from './Result';
import {
  buildUrl,
  CloseButton,
  getStarOption,
  Option,
  parseUrlParts,
} from './helpers';
import { PointsTooFarError, Profile, RoutingResult } from './routing/types';
import { useBoolState, useMobileMode } from '../helpers';
import { LoadingButton } from '@mui/lab';
import { type Severity, useSnackbar } from '../utils/SnackbarContext';
import { FetchError } from '../../services/helpers';
import * as Sentry from '@sentry/nextjs';

const Wrapper = styled(Stack)`
  position: absolute;
  top: 8px;
  left: 8px;
  z-index: 1001; // over the LayerSwitcherButton
  width: 340px;
`;

const getOnrejected = (
  showToast: (message: string, severity?: Severity) => void,
) => {
  return (error) => {
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

const useReactToUrl = (
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
        .catch(getOnrejected(showToast));
    } else {
      if (initialModeWasSet.current === false && getLastMode()) {
        setMode(getLastMode());
        initialModeWasSet.current = true;
      }

      const lastFeature = getLastFeature();
      if (lastFeature) {
        setTo(getStarOption(lastFeature.center, getLabel(lastFeature)));
      }
    }

    return () => {
      destroyRouting();
    };
  }, [urlParts, setMode, setFrom, setTo, setResult, showToast]);
};

const useGetOnSubmit = (
  from: Option,
  to: Option,
  mode: Profile,
  setResult: (result: RoutingResult) => void,
  setLoading: (value: ((prevState: boolean) => boolean) | boolean) => void,
) => {
  const { showToast } = useSnackbar();

  return () => {
    if (!from || !to) {
      return;
    }
    const points = [from, to];
    const url = buildUrl(mode, points);
    if (url === Router.asPath) {
      setLoading(true);
      handleRouting(mode, points.map(getOptionToLonLat))
        .then(setResult)
        .catch(getOnrejected(showToast))
        .finally(() => setLoading(false));
    } else {
      Router.push(url);
    }
  };
};

type Props = {
  setResult: (result: RoutingResult) => void;
  hideForm: boolean;
};

// generated by https://v0.dev/chat/3MwraSQEqCc
export const DirectionsForm = ({ setResult, hideForm }: Props) => {
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<Profile>('car');
  const [from, setFrom] = useState<Option>();
  const [to, setTo] = useState<Option>();

  useReactToUrl(setMode, setFrom, setTo, setResult);
  const onSubmit = useGetOnSubmit(from, to, mode, setResult, setLoading);

  if (hideForm) {
    return null;
  }

  return (
    <StyledPaper elevation={3}>
      <Stack direction="row" spacing={1} mb={2} alignItems="center">
        <ModeToggler value={mode} setMode={setMode} />
        <div style={{ flex: 1 }} />
        <div>
          <CloseButton />
        </div>
      </Stack>

      <Stack spacing={1} mb={3}>
        <DirectionsAutocomplete
          value={from}
          setValue={setFrom}
          label={t('directions.form.starting_point')}
        />
        <DirectionsAutocomplete
          value={to}
          setValue={setTo}
          label={t('directions.form.destination')}
        />
      </Stack>

      <LoadingButton
        loading={loading}
        loadingPosition="start"
        variant="contained"
        fullWidth
        startIcon={<SearchIcon />}
        onClick={onSubmit}
      >
        {t('directions.get_directions')}
      </LoadingButton>
    </StyledPaper>
  );
};

export const DirectionsBox = () => {
  const isMobileMode = useMobileMode();
  const [result, setResult] = useState<RoutingResult>(null);
  const [revealed, revealForm, hide] = useBoolState(false); // mobile only
  const hideForm = isMobileMode && result && !revealed;

  const setResultAndHide = useCallback(
    (result: RoutingResult) => {
      setResult(result);
      hide();
    },
    [hide],
  );

  return (
    <Wrapper spacing={1}>
      <DirectionsForm setResult={setResultAndHide} hideForm={hideForm} />
      {result && (
        <Result result={result} revealForm={!revealed && revealForm} />
      )}
    </Wrapper>
  );
};
