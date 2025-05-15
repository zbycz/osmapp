import React, { useMemo, useState } from 'react';
import { InputBase, ListSubheader, Menu, MenuItem } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import styled from '@emotion/styled';
import { TranslatedPreset, useOptions } from './PresetSelect';
import { Setter } from '../../../../../types';
import { t } from '../../../../../services/intl';
import { PROJECT_ID } from '../../../../../services/project';
import { OsmType } from '../../../../../services/types';
import { geometryMatchesOsmType } from '../../../../../services/tagging/presets';
import { PoiIcon } from '../../../../utils/icons/PoiIcon';
import { useCurrentItem } from '../../EditContext';
import { getApiId } from '../../../../../services/helpers';

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

const getEmptyOptions = (options: TranslatedPreset[], osmType: OsmType) => {
  const EMPTY_OPTIONS =
    PROJECT_ID === 'openclimbing'
      ? [
          'climbing/area',
          'climbing/crag',
          'climbing/route_bottom',
          ...(osmType === 'way' ? ['climbing/route'] : []), // this preset has both geometris (node,way) we need it offered only for `way`
        ]
      : [
          'amenity/cafe',
          'amenity/restaurant',
          'amenity/fast_food',
          'amenity/bar',
          'shop',
          'leisure/park',
          'amenity/place_of_worship',
        ];
  const emptyOptions = EMPTY_OPTIONS.map((presetKey) =>
    options.find((option) => option.presetKey === presetKey),
  );

  return emptyOptions
    .filter(Boolean)
    .filter(({ geometry }) => geometryMatchesOsmType(geometry, osmType)) // it won't be matched, if geometry differs
    .map((option) => option.presetKey);
};

const getFilteredOptions = (
  options: TranslatedPreset[],
  searchText: string,
  osmType: OsmType | undefined,
) => {
  const filteredOptions = options
    .filter(({ geometry }) => geometryMatchesOsmType(geometry, osmType))
    .filter(({ searchable }) => searchable === undefined || searchable)
    .filter((option) => containsText(option.name, searchText))
    .map((option) => option.presetKey);

  if (searchText.length <= 2) {
    return filteredOptions.splice(0, 50); // too many rows in select are slow
  }

  return filteredOptions;
};

const useDisplayedOptions = (
  searchText: string,
  options: TranslatedPreset[],
): string[] => {
  const { shortId } = useCurrentItem();
  const osmType = getApiId(shortId).type;

  return useMemo<string[]>(() => {
    if (!options.length) {
      return [];
    }

    return searchText.length
      ? getFilteredOptions(options, searchText, osmType)
      : getEmptyOptions(options, osmType);
  }, [osmType, options, searchText]);
};

const SearchRow = ({
  searchText,
  setSearchText,
}: {
  searchText: string;
  setSearchText: Setter<string>;
}) => (
  <StyledListSubheader>
    <SearchIcon fontSize="small" />
    <InputBase
      size="small"
      autoFocus
      placeholder={t('editdialog.preset_select.search_placeholder')}
      fullWidth
      value={searchText}
      onChange={(e) => setSearchText(e.target.value)}
      onKeyDown={(e) => {
        if (e.key !== 'Escape') {
          e.stopPropagation();
        }
      }}
    />
  </StyledListSubheader>
);

const useGetOnClick = (options: TranslatedPreset[]) => {
  const { presetKey, setTagsEntries } = useCurrentItem();

  return (newPresetKey: string) => {
    const oldPreset = options.find((o) => o.presetKey === presetKey);
    const toRemove = oldPreset
      ? (oldPreset.addTags ?? oldPreset.tags ?? {})
      : {};

    const newPreset = options.find((o) => o.presetKey === newPresetKey);
    const toAdd = newPreset
      ? Object.entries(newPreset.addTags ?? newPreset.tags ?? {})
      : [];

    setTagsEntries((prev) => [
      ...toAdd,
      ...prev.filter(
        ([key, value]) => !(toRemove[key] && toRemove[key] === value),
      ),
    ]);
  };
};

const getPaperSize = (selectRef: HTMLElement) => {
  if (!selectRef) {
    return undefined;
  }
  const BOTTOM_PADDING = 50;
  const rect = selectRef.getBoundingClientRect();
  const height = window.innerHeight - (rect.top + rect.height) - BOTTOM_PADDING;
  return {
    style: {
      width: rect.width,
      maxHeight: height,
    },
  };
};

type Props = {
  anchorEl: HTMLElement;
  onClose: () => void;
};

export const PresetSearchBox = ({ anchorEl, onClose }: Props) => {
  const [searchText, setSearchText] = useState('');
  const options = useOptions();
  const displayedOptions = useDisplayedOptions(searchText, options);
  const handleClick = useGetOnClick(options);

  if (!options.length) {
    return null;
  }

  return (
    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={onClose}
      autoFocus={false}
      slotProps={{ paper: getPaperSize(anchorEl) }}
    >
      <SearchRow searchText={searchText} setSearchText={setSearchText} />
      {displayedOptions.map((optionKey) => {
        const option = options.find((o) => o.presetKey === optionKey);
        return (
          <MenuItem
            key={optionKey}
            component="li"
            onClick={() => {
              handleClick(optionKey);
              onClose();
            }}
          >
            <PoiIcon tags={option.tags} size={16} middle themed />
            <span style={{ paddingLeft: 5 }} />
            {option.name}
          </MenuItem>
        );
      })}
    </Menu>
  );
};
