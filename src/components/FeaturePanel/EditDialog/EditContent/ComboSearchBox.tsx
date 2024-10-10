import React, { useMemo, useState } from 'react';
import { InputBase, ListSubheader, MenuItem, Select } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import styled from '@emotion/styled';
import Maki from '../../../utils/Maki';
import { TranslatedPreset } from './FeatureTypeSelect';
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
  & :first-child {
    margin-right: 11px;
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

const renderOption = (option) =>
  option && (
    <>
      <Maki ico={option.icon} size={16} middle themed />
      <span style={{ paddingLeft: 5 }} />
      {option.name}
    </>
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
        <MenuItem
          key={option.presetKey}
          component="li"
          // @ts-ignore https://github.com/mui/material-ui/issues/14286
          value={option}
        >
          {renderOption(option)}
        </MenuItem>
      ))}
    </Select>
  );
};
