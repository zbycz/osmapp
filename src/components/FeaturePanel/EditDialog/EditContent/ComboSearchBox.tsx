import React, { useMemo, useState } from 'react';
import { InputBase, ListSubheader, MenuItem, Select } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import styled from '@emotion/styled';
import Maki from '../../../utils/Maki';
import { TranslatedPreset } from './PresetSelect';
import { Setter } from '../../../../types';
import { Preset } from '../../../../services/tagging/types/Presets';

// https://stackoverflow.com/a/70918883/671880

const containsText = (text, searchText) =>
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
  'climbing/route_bottom',
  'climbing/route',
  'climbing/crag',
  // 'climbing/area',
];

const Placeholder = styled.span`
  color: rgba(0, 0, 0, 0.54);
`;

const renderOption = (option: TranslatedPreset | null) =>
  option ? (
    <>
      <Maki ico={option.icon} size={16} middle themed />
      <span style={{ paddingLeft: 5 }} />
      {option.name}
    </>
  ) : (
    <Placeholder>Select the type</Placeholder>
  );

export const ComboSearchBox = ({
  value,
  setValue,
  options,
}: {
  value: Preset;
  setValue: Setter<Preset>;
  options: TranslatedPreset[];
}) => {
  const [searchText, setSearchText] = useState('');
  const displayedOptions = useMemo<TranslatedPreset[]>(
    () =>
      searchText.length
        ? options.filter((option) => containsText(option.name, searchText))
        : emptyOptions.map((presetKey) =>
            options.find((preset) => preset.presetKey === presetKey),
          ),
    [options, searchText],
  );

  return (
    <Select
      MenuProps={{ autoFocus: false }}
      value={value}
      onChange={(e) => {
        // @ts-ignore https://github.com/mui/material-ui/issues/14286
        setValue(e.target.value);
      }}
      onClose={() => setSearchText('')}
      renderValue={() => renderOption(value)}
      size="small"
      variant="outlined"
      fullWidth
      displayEmpty
    >
      <StyledListSubheader>
        <SearchIcon fontSize="small" />
        <InputBase
          size="small"
          autoFocus
          placeholder="Type to search..."
          fullWidth
          onChange={(e) => setSearchText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key !== 'Escape') {
              e.stopPropagation();
            }
          }}
        />
      </StyledListSubheader>
      {displayedOptions.map((option) => (
        // @ts-ignore https://github.com/mui/material-ui/issues/14286
        <MenuItem key={option.presetKey} component="li" value={option}>
          {renderOption(option)}
        </MenuItem>
      ))}
    </Select>
  );
};
