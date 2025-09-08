import React, { useState } from 'react';
import { Menu, MenuItem } from '@mui/material';
import { PoiIcon } from '../../../../../utils/icons/PoiIcon';
import { useCurrentItem } from '../../../context/EditContext';
import {
  TranslatedPreset,
  useDisplayedOptions,
  useOptions,
} from './useOptions';
import { SearchRow } from './SearchRow';
import { allPresets } from '../../../../../../services/tagging/data';

const useGetOnClick = () => {
  const { presetKey, setTagsEntries } = useCurrentItem();

  return (newPreset: TranslatedPreset) => {
    const oldPreset = allPresets[presetKey];
    const toRemove = oldPreset
      ? (oldPreset.addTags ?? oldPreset.tags ?? {})
      : {};

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

export const PresetMenu = ({ anchorEl, onClose }: Props) => {
  const [searchText, setSearchText] = useState('');
  const options = useOptions();
  const displayedOptions = useDisplayedOptions(searchText, options);
  const handleClick = useGetOnClick();

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
      {displayedOptions.map((option) => {
        return (
          <MenuItem
            key={option.presetKey}
            component="li"
            onClick={() => {
              handleClick(option);
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
