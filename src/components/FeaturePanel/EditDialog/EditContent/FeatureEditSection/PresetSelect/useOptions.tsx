import { Preset } from '../../../../../../services/tagging/types/Presets';
import {
  fetchSchemaTranslations,
  getPresetTranslation,
} from '../../../../../../services/tagging/translations';
import { allPresets } from '../../../../../../services/tagging/data';
import { useEffect, useMemo, useState } from 'react';
import { useCurrentItem } from '../../../EditContext';
import { getApiId } from '../../../../../../services/helpers';
import { OsmType } from '../../../../../../services/types';
import { PROJECT_ID } from '../../../../../../services/project';
import { geometryMatchesOsmType } from '../../../../../../services/tagging/presets';

export type TranslatedPreset = Preset & {
  name: string;
};

let presetsCache: TranslatedPreset[] | null = null;

const getTranslatedPresets = async (): Promise<TranslatedPreset[]> => {
  if (presetsCache) {
    return presetsCache;
  }

  await fetchSchemaTranslations();

  // resolve symlinks to {landuse...} etc
  presetsCache = Object.values(allPresets)
    .filter(({ locationSet }) => !locationSet?.include)
    .filter(({ tags }) => Object.keys(tags).length > 0)
    .map((preset) => {
      return {
        ...preset,
        name: getPresetTranslation(preset.presetKey),
        // TODO `terms: getPresetTermsTranslation(preset.presetKey)` like in SearchBox ?
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name));

  return presetsCache;
};

export const useOptions = () => {
  const [options, setOptions] = useState<TranslatedPreset[]>([]);
  useEffect(() => {
    getTranslatedPresets().then((presets) => setOptions(presets));
  }, []);
  return options;
};

const containsText = (text: string, searchText: string) =>
  text.toLowerCase().indexOf(searchText.toLowerCase()) > -1; // TODO maybe use more advanced matching like in SearchBox

const getEmptyOptions = (options: TranslatedPreset[], osmType: OsmType) => {
  const EMPTY_OPTIONS =
    PROJECT_ID === 'openclimbing'
      ? [
          'type/site/climbing/area',
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

  return EMPTY_OPTIONS.map((presetKey) =>
    options.find((option) => option.presetKey === presetKey),
  )
    .filter(Boolean)
    .filter(({ geometry }) => geometryMatchesOsmType(geometry, osmType)); // it won't be matched, if geometry differs
};

const getFilteredOptions = (
  options: TranslatedPreset[],
  osmType: OsmType | undefined,
  searchText: string,
) => {
  const filteredOptions = options
    .filter(({ geometry }) => geometryMatchesOsmType(geometry, osmType))
    .filter(({ searchable }) => searchable === undefined || searchable)
    .filter((option) => containsText(option.name, searchText));

  if (searchText.length <= 2) {
    return filteredOptions.splice(0, 50); // too many rows in Menu are slow
  }

  return filteredOptions;
};

export const useDisplayedOptions = (
  searchText: string,
  options: TranslatedPreset[],
): TranslatedPreset[] => {
  const { shortId } = useCurrentItem();
  const osmType = getApiId(shortId).type;

  return useMemo(() => {
    if (!options.length) {
      return [];
    }

    return searchText.length
      ? getFilteredOptions(options, osmType, searchText)
      : getEmptyOptions(options, osmType);
  }, [osmType, options, searchText]);
};
