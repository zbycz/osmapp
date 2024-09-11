import { StyledPaper, TopPanel } from '../helpers';
import { useMobileMode } from '../../helpers';
import {
  Autocomplete,
  Button,
  IconButton,
  InputBase,
  ToggleButtonGroup,
} from '@mui/material';
import { t } from '../../../services/intl';
import CloseIcon from '@mui/icons-material/Close';
import React, { useEffect, useRef, useState } from 'react';
import {
  buildPhotonAddress,
  fetchGeocoderOptions,
  GEOCODER_ABORTABLE_QUEUE,
  renderGeocoder,
  useInputValueState,
} from '../options/geocoder';
import { useMapCenter } from '../utils';
import { useUserThemeContext } from '../../../helpers/theme';
import { useMapStateContext } from '../../utils/MapStateContext';
import { useStarsContext } from '../../utils/StarsContext';
import { abortFetch } from '../../../services/fetch';
import { getStarsOptions } from '../options/stars';
import { renderOptionFactory } from '../renderOptionFactory';
import styled from '@emotion/styled';
import DirectionsWalkIcon from '@mui/icons-material/DirectionsWalk';
import DirectionsBikeIcon from '@mui/icons-material/DirectionsBike';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { css } from '@emotion/react';
import SearchIcon from '@mui/icons-material/Search';

type Props = {
  toggleDirections: () => void;
};

const CloseButton = (props: { onClick: () => void }) => (
  <div>
    <IconButton aria-label={t('close_panel')} onClick={props.onClick}>
      <CloseIcon />
    </IconButton>
  </div>
);

const DirectionsInput = ({ params, setInputValue, autocompleteRef, label }) => {
  const { InputLabelProps, InputProps, ...restParams } = params;

  useEffect(() => {
    // @ts-ignore
    params.InputProps.ref(autocompleteRef.current);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const onChange = (e) => setInputValue(e.target.value);
  const onFocus = (e) => e.target.select();

  return (
    <InputBase
      {...restParams} // eslint-disable-line react/jsx-props-no-spreading
      sx={{
        height: '40px',
        padding: '0 10px',
      }}
      placeholder={label}
      onChange={onChange}
      onFocus={onFocus}
    />
  );
};

const useOptions = (inputValue: string, setOptions) => {
  const { view } = useMapStateContext();
  const { stars } = useStarsContext();

  useEffect(() => {
    (async () => {
      abortFetch(GEOCODER_ABORTABLE_QUEUE);

      if (inputValue === '') {
        setOptions(getStarsOptions(stars));
        return;
      }

      fetchGeocoderOptions(inputValue, view, setOptions, [], []);
    })();
  }, [inputValue, stars]); // eslint-disable-line react-hooks/exhaustive-deps
};

const Row = styled.div`
  width: 100%;
`;

const DirectionsAutocomplete = ({ label }: { label: string }) => {
  const autocompleteRef = useRef();
  const { inputValue, setInputValue } = useInputValueState();
  const [options, setOptions] = useState([]);
  const mapCenter = useMapCenter();
  const { currentTheme } = useUserThemeContext();

  useOptions(inputValue, setOptions);

  const getOptionLabel = (option) =>
    option.properties?.name ||
    (option.star && option.star.label) ||
    (option.properties && buildPhotonAddress(option.properties)) ||
    '';
  return (
    <Row ref={autocompleteRef}>
      <Autocomplete
        inputValue={inputValue}
        options={options}
        value={null}
        filterOptions={(x) => x}
        getOptionLabel={getOptionLabel}
        getOptionKey={(option) => JSON.stringify(option)}
        onChange={(event, option) => {
          console.log('selected', option);
          setInputValue(getOptionLabel(option));
        }}
        autoComplete
        disableClearable
        autoHighlight
        clearOnEscape
        // freeSolo
        renderInput={(params) => (
          <DirectionsInput
            params={params}
            setInputValue={setInputValue}
            autocompleteRef={autocompleteRef}
            label={label}
          />
        )}
        renderOption={renderOptionFactory(inputValue, currentTheme, mapCenter)}
      />
    </Row>
  );
};

const Divider = styled.div`
  width: 100%;
  border-bottom: 1px #ceabab solid;
`;

const FlexRow = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
`;

const StyledIconButton = styled(IconButton, {
  shouldForwardProp: (prop) => prop !== '$selected',
})<{ $selected: boolean }>`
  color: ${({ $selected, theme }) =>
    $selected ? '#fff' : theme.palette.text.secondary};
`;

const SearchButton = styled(Button)`
  color: #fff;
`;

export const DirectionsBox = ({ toggleDirections }: Props) => {
  const isMobileMode = useMobileMode();

  const [mode, setMode] = useState<string>('walk');

  return (
    <TopPanel $isMobileMode={false}>
      <FlexRow>
        <StyledPaper $column elevation={1}>
          <DirectionsAutocomplete label={t('directions.from')} />
          <Divider />
          <DirectionsAutocomplete label={t('directions.to')} />
        </StyledPaper>
        <CloseButton onClick={toggleDirections} />
      </FlexRow>
      <div style={{ height: 8 }} />
      <FlexRow>
        <StyledIconButton
          $selected={mode === 'bike'}
          onClick={() => setMode('bike')}
        >
          <DirectionsBikeIcon />
        </StyledIconButton>
        <StyledIconButton
          $selected={mode === 'walk'}
          onClick={() => setMode('walk')}
        >
          <DirectionsWalkIcon />
        </StyledIconButton>
        <StyledIconButton
          $selected={mode === 'car'}
          onClick={() => setMode('car')}
        >
          <DirectionsCarIcon />
        </StyledIconButton>

        <div style={{ flex: 1 }} />

        <SearchButton
          variant="text"
          startIcon={<SearchIcon />}
          color="secondary"
        >
          Search directions
        </SearchButton>
      </FlexRow>
    </TopPanel>
  );
};
