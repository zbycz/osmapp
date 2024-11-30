import { Option } from '../SearchBox/types';
import { RoutingResult } from './routing/types';
import { CloseButton } from './helpers';
import React, { useEffect } from 'react';
import { StyledPaper } from './Result';
import { Stack } from '@mui/material';
import { ModeToggler } from './ModeToggler';
import { DirectionsAutocomplete } from './DirectionsAutocomplete';
import { t } from '../../services/intl';
import { LoadingButton } from '@mui/lab';
import SearchIcon from '@mui/icons-material/Search';
import { getCoordsOption } from '../SearchBox/options/coords';
import { useMapStateContext } from '../utils/MapStateContext';
import { useDirectionsContext } from './DirectionsContext';
import { useGetOnSubmitFactory, useReactToUrl } from './useGetOnSubmit';

type Props = {
  setResult: (result: RoutingResult) => void;
  hideForm: boolean;
};

const useGlobalMapClickOverride = (
  from: Option,
  setFrom: (value: Option) => void,
  setTo: (value: Option) => void,
) => {
  const { setResult, setLoading, to, mode } = useDirectionsContext();
  const submitFactory = useGetOnSubmitFactory(setResult, setLoading);

  const { mapClickOverrideRef } = useMapStateContext();
  useEffect(() => {
    mapClickOverrideRef.current = (coords, label) => {
      const coordinates = getCoordsOption(coords, label);
      if (!from) {
        submitFactory(coordinates, to, mode);
        setFrom(coordinates);
      } else {
        submitFactory(from, coordinates, mode);
        setTo(coordinates);
      }
    };

    return () => {
      mapClickOverrideRef.current = undefined;
    };
  }, [from, mapClickOverrideRef, mode, setFrom, setTo, submitFactory, to]);
};

export const DirectionsForm = ({ setResult, hideForm }: Props) => {
  const { loading, setLoading, mode, setMode, from, setFrom, to, setTo } =
    useDirectionsContext();

  useGlobalMapClickOverride(from, setFrom, setTo);
  useReactToUrl(setMode, setFrom, setTo, setResult);

  const onSubmitFactory = useGetOnSubmitFactory(setResult, setLoading);

  if (hideForm) {
    return null;
  }

  return (
    <StyledPaper elevation={3}>
      <Stack direction="row" spacing={1} mb={2} alignItems="center">
        <ModeToggler
          value={mode}
          setMode={setMode}
          onChange={(newMode) => onSubmitFactory(from, to, newMode)}
        />
        <div style={{ flex: 1 }} />
        <div>
          <CloseButton />
        </div>
      </Stack>

      <Stack spacing={1} mb={3}>
        <DirectionsAutocomplete
          value={from}
          setValue={setFrom}
          label={t('directions.form.start_or_click')}
          pointIndex={0}
        />
        <DirectionsAutocomplete
          value={to}
          setValue={setTo}
          label={t('directions.form.destination')}
          pointIndex={1}
        />
      </Stack>

      <LoadingButton
        loading={loading}
        loadingPosition="start"
        variant="contained"
        fullWidth
        startIcon={<SearchIcon />}
        onClick={() => onSubmitFactory(from, to, mode)}
      >
        {t('directions.get_directions')}
      </LoadingButton>
    </StyledPaper>
  );
};
