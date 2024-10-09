import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import styled from '@emotion/styled';
import { getPoiClass } from '../../../../services/getPoiClass';
import { allPresets } from '../../../../services/tagging/data';
import {
  fetchSchemaTranslations,
  getPresetTermsTranslation,
  getPresetTranslation,
} from '../../../../services/tagging/translations';
import { useFeatureContext } from '../../../utils/FeatureContext';
import { ComboSearchBox } from './ComboSearchBox';
import { useEditContext } from '../EditContext';
import { Preset } from '../../../../services/tagging/types/Presets';

export type TranslatedPreset = Preset & {
  name: string;
  icon: string;
};

type PresetCacheItem = Preset & { name: string; icon: string; terms: string[] };
type PresetsCache = PresetCacheItem[];

let presetsCache: PresetsCache | null = null;
const getPresets = async (): Promise<PresetsCache> => {
  if (presetsCache) {
    return presetsCache;
  }

  await fetchSchemaTranslations();

  // resolve symlinks to {landuse...} etc
  presetsCache = Object.values(allPresets)
    .filter(({ searchable }) => searchable === undefined || searchable)
    .filter(({ geometry }) => geometry.includes('point'))
    .filter(({ locationSet }) => !locationSet?.include)
    .filter(({ tags }) => Object.keys(tags).length > 0)
    // .map(({ name, presetKey, tags, terms }) => {
    //   const tagsAsStrings = Object.entries(tags).map(([k, v]) => `${k}=${v}`);
    //   return {
    //     key: presetKey,
    //     name: getPresetTranslation(presetKey) ?? name ?? 'x',
    //     tags,
    //     tagsAsOneString: tagsAsStrings.join(', '),
    //     texts: [
    //       ...(getPresetTermsTranslation(presetKey) ?? terms ?? 'x').split(','),
    //       ...tagsAsStrings,
    //       presetKey,
    //     ],
    //     icon: getPoiClass(tags).class,
    //   };
    // });
    .map((preset) => {
      return {
        ...preset,
        name: getPresetTranslation(preset.presetKey) ?? preset.presetKey,
        icon: getPoiClass(preset.tags).class,
        terms: getPresetTermsTranslation(preset.presetKey) ?? preset.terms,
      };
    });

  return presetsCache;
};

const Row = styled(Box)`
  display: flex;
  align-items: center;

  //first child
  & > *:first-child {
    min-width: 44px;
    margin-right: 1em;
  }
  // second child
  & > *:nth-child(2) {
    width: 100%;
  }
`;

export const FeatureTypeSelect = () => {
  const { preset, setPreset } = useEditContext();
  const [options, setOptions] = useState([]);

  const { feature } = useFeatureContext();

  useEffect(() => {
    (async () => {
      const presets = await getPresets();
      setOptions(presets);
      setPreset(
        presets.find(
          (option: PresetCacheItem) =>
            option.presetKey === feature.schema?.presetKey,
        ),
      );
    })();
  }, [feature.schema?.presetKey, setPreset]);

  if (options.length === 0) {
    return null;
  }

  return (
    <Row mb={3}>
      <Typography variant="body1" component="span" color="textSecondary">
        Typ:
      </Typography>

      <ComboSearchBox value={preset} setValue={setPreset} options={options} />
    </Row>
  );
};
