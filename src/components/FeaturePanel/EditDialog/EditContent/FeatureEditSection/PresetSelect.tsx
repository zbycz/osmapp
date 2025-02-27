import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import styled from '@emotion/styled';
import { getPoiClass } from '../../../../../services/getPoiClass';
import { allPresets } from '../../../../../services/tagging/data';
import {
  fetchSchemaTranslations,
  getPresetTermsTranslation,
  getPresetTranslation,
} from '../../../../../services/tagging/translations';
import { useFeatureContext } from '../../../../utils/FeatureContext';
import { PresetSearchBox } from './PresetSearchBox';
import { Preset } from '../../../../../services/tagging/types/Presets';
import { getPresetForFeature } from '../../../../../services/tagging/presets';
import { Feature, FeatureTags } from '../../../../../services/types';
import { t } from '../../../../../services/intl';
import { Setter } from '../../../../../types';
import { useCurrentItem } from './CurrentContext';

export type TranslatedPreset = Preset & {
  name: string;
};

type PresetCacheItem = Preset & { name: string; terms: string[] };
type PresetsCache = PresetCacheItem[];

let presetsCache: PresetsCache | null = null;
const getTranslatedPresets = async (): Promise<PresetsCache> => {
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
        name: getPresetTranslation(preset.presetKey) ?? preset.presetKey,
        terms: getPresetTermsTranslation(preset.presetKey) ?? preset.terms,
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name));

  return presetsCache;
};

const Row = styled(Box)`
  display: flex;
  align-items: center;
`;

const LabelWrapper = styled.div`
  min-width: 44px;
  margin-right: 1em;
`;

export const useMatchTags = (
  feature: Feature,
  tags: FeatureTags,
  setPreset: Setter<string>,
) => {
  useEffect(() => {
    (async () => {
      const updatedFeature: Feature = {
        ...feature,
        ...(feature.point ? { osmMeta: { type: 'node', id: -1 } } : {}),
        tags,
      };
      const foundPreset = getPresetForFeature(updatedFeature); // takes ~ 1 ms
      const translatedPreset = (await getTranslatedPresets()).find(
        (option) => option.presetKey === foundPreset.presetKey,
      );
      setPreset(translatedPreset?.presetKey ?? '');
    })();
  }, [tags, feature, setPreset]);
};

export const useOptions = () => {
  const [options, setOptions] = useState<PresetsCache>([]);
  useEffect(() => {
    getTranslatedPresets().then((presets) => setOptions(presets));
  }, []);
  return options;
};

export const PresetSelect = () => {
  const { tags } = useCurrentItem();
  const [preset, setPreset] = useState('');
  const { feature } = useFeatureContext();
  const options = useOptions();
  useMatchTags(feature, tags, setPreset);

  if (options.length === 0) {
    return null;
  }

  return (
    <Row mb={3}>
      <LabelWrapper>
        <Typography variant="body1" component="span" color="textSecondary">
          {t('editdialog.preset_select.label')}
        </Typography>
      </LabelWrapper>

      <PresetSearchBox value={preset} setValue={setPreset} options={options} />
    </Row>
  );
};
