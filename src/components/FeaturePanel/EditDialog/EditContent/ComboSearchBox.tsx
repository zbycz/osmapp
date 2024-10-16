import React, { useMemo, useState } from 'react';
import {
  Box,
  Button,
  InputBase,
  ListSubheader,
  MenuItem,
  Select,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import styled from '@emotion/styled';
import Maki from '../../../utils/Maki';
import { TranslatedPreset } from './PresetSelect';
import { Setter } from '../../../../types';
import { t } from '../../../../services/intl';
import { SelectChangeEvent } from '@mui/material/Select/SelectInput';
import { useEditContext } from '../EditContext';
import { useBoolState } from '../../../helpers';
import { useFeatureContext } from '../../../utils/FeatureContext';
import { PROJECT_ID } from '../../../../services/project';
import { useOsmAuthContext } from '../../../utils/OsmAuthContext';

// https://stackoverflow.com/a/70918883/671880

const containsText = (text: string, searchText: string) =>
  text.toLowerCase().indexOf(searchText.toLowerCase()) > -1;

const StyledListSubheader = styled(ListSubheader)`
  display: flex;
  align-items: center;
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
  padding: 6px 13px;
  & > svg:first-of-type {
    margin-right: 8px;
  }
`;

const emptyOptions = [
  'amenity/cafe',
  'amenity/restaurant',
  'amenity/fast_food',
  'amenity/bar',
  'shop',
  'leisure/park',
  'amenity/place_of_worship',
  ...(PROJECT_ID === 'openclimbing'
    ? [
        'climbing/route_bottom',
        'climbing/route',
        'climbing/crag',
        // 'climbing/area',
      ]
    : []),
];

const Placeholder = styled.span`
  color: ${({ theme }) => theme.palette.text.secondary};
`;

const renderOption = (option: TranslatedPreset | '') =>
  !option ? (
    <Placeholder>{t('editdialog.preset_select.placeholder')}</Placeholder>
  ) : (
    <>
      <Maki ico={option.icon} size={16} middle themed />
      <span style={{ paddingLeft: 5 }} />
      {option.name}
    </>
  );

const getFilteredOptions = (
  options: TranslatedPreset[],
  searchText: string,
) => {
  const filteredOptions = options.filter((option) =>
    containsText(option.name, searchText),
  );

  if (searchText.length <= 2) {
    return filteredOptions.splice(0, 50); // too many rows in select are slow
  }

  return filteredOptions;
};

const useDisplayedOptions = (searchText: string, options: TranslatedPreset[]) =>
  useMemo<TranslatedPreset[]>(
    () =>
      searchText.length
        ? getFilteredOptions(options, searchText)
        : emptyOptions.map((presetKey) =>
            options.find((preset) => preset.presetKey === presetKey),
          ),
    [options, searchText],
  );

const SearchRow = ({
  onChange,
}: {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => (
  <StyledListSubheader>
    <SearchIcon fontSize="small" />
    <InputBase
      size="small"
      autoFocus
      placeholder={t('editdialog.preset_select.search_placeholder')}
      fullWidth
      onChange={onChange}
      onKeyDown={(e) => {
        if (e.key !== 'Escape') {
          e.stopPropagation();
        }
      }}
    />
  </StyledListSubheader>
);

const useGetOnChange = (
  value: TranslatedPreset | '',
  setValue: Setter<TranslatedPreset | ''>,
) => {
  const { setTagsEntries } = useEditContext().tags;

  return (e: SelectChangeEvent<TranslatedPreset | ''>) => {
    const oldValue = value;
    if (oldValue) {
      Object.entries(oldValue.addTags ?? oldValue.tags ?? {}).forEach((tag) => {
        setTagsEntries((state) =>
          state.filter(([key, value]) => key !== tag[0] && value !== tag[1]),
        );
      });
    }

    const newValue = e.target.value as unknown as TranslatedPreset; // https://github.com/mui/material-ui/issues/14286
    if (newValue) {
      const newTags = Object.entries(newValue.addTags ?? newValue.tags ?? {});
      setTagsEntries((state) => [...newTags, ...state]);
    }
    setValue(newValue);
  };
};

const getPaperMaxHeight = (
  selectRef: React.MutableRefObject<HTMLDivElement>,
) => {
  if (!selectRef.current) {
    return undefined;
  }
  const BOTTOM_PADDING = 50;
  const rect = selectRef.current.getBoundingClientRect();
  const height = window.innerHeight - (rect.top + rect.height) - BOTTOM_PADDING;
  return {
    style: {
      maxHeight: height,
    },
  };
};
export const ComboSearchBox = ({
  value,
  setValue,
  options,
}: {
  value: TranslatedPreset | '';
  setValue: Setter<TranslatedPreset | ''>;
  options: TranslatedPreset[];
}) => {
  const selectRef = React.useRef<HTMLDivElement>(null);
  const { feature } = useFeatureContext();
  const { loggedIn } = useOsmAuthContext();
  const [enabled, enable] = useBoolState(feature.point || !loggedIn);

  const [searchText, setSearchText] = useState('');
  const displayedOptions = useDisplayedOptions(searchText, options);

  const onChange = useGetOnChange(value, setValue);

  // console.log(selectRef.current.getBoundingClientRect());
  return (
    <>
      <Select
        disabled={!enabled}
        MenuProps={{
          autoFocus: false,
          slotProps: {
            paper: getPaperMaxHeight(selectRef),
          },
        }}
        value={value}
        onChange={onChange}
        onClose={() => setSearchText('')}
        renderValue={() => renderOption(value)}
        size="small"
        variant="outlined"
        fullWidth
        displayEmpty
        ref={selectRef}
      >
        <SearchRow onChange={(e) => setSearchText(e.target.value)} />
        {displayedOptions.map((option) => (
          // @ts-ignore https://github.com/mui/material-ui/issues/14286
          <MenuItem key={option.presetKey} component="li" value={option}>
            {renderOption(option)}
          </MenuItem>
        ))}
      </Select>
      {!enabled && (
        <Box ml={1}>
          <Button color="secondary" onClick={enable}>
            Edit
          </Button>
        </Box>
      )}
    </>
  );
};
