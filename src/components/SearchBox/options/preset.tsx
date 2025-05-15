import orderBy from 'lodash/orderBy';
import { diceCoefficient } from 'dice-coefficient';
import FolderIcon from '@mui/icons-material/Folder';
import { Grid, Typography } from '@mui/material';
import React from 'react';
import {
  fetchSchemaTranslations,
  getPresetTermsTranslation,
  getPresetTranslation,
} from '../../../services/tagging/translations';
import { allPresets } from '../../../services/tagging/data';
import { PresetOption } from '../types';
import { t } from '../../../services/intl';
import { highlightText, IconPart } from '../utils';
import { SEARCH_THRESHOLD } from '../consts';

let presetsForSearch: {
  key: string;
  name: string;
  tags: Record<string, string>;
  tagsAsOneString: string;
  texts: string[];
}[];
const getPresetsForSearch = async () => {
  if (presetsForSearch) {
    return presetsForSearch;
  }

  await fetchSchemaTranslations();

  // resolve symlinks to {landuse...} etc
  presetsForSearch = Object.values(allPresets)
    .filter(({ searchable }) => searchable === undefined || searchable)
    .filter(({ locationSet }) => !locationSet?.include)
    .filter(({ tags }) => Object.keys(tags).length > 0)
    .map(({ presetKey, tags, terms }) => {
      const tagsAsStrings = Object.entries(tags).map(([k, v]) => `${k}=${v}`);
      return {
        key: presetKey,
        name: getPresetTranslation(presetKey),
        tags,
        tagsAsOneString: tagsAsStrings.join(', '),
        texts: [
          ...getPresetTermsTranslation(presetKey).split(','),
          ...tagsAsStrings,
          presetKey,
        ],
      };
    });

  return presetsForSearch;
};

type PresetOptions = Promise<{
  firstTwoPresets: PresetOption[];
  restPresets: PresetOption[];
}>;

export const getPresetOptions = async (
  inputValue: string,
  threshold = SEARCH_THRESHOLD,
): PresetOptions => {
  if (inputValue.length <= 2) {
    return { firstTwoPresets: [], restPresets: [] };
  }

  const presets = await getPresetsForSearch();
  const rawResults = presets.map((preset) => {
    const nameSimilarity = diceCoefficient(preset.name, inputValue);
    const textsByOneSimilarity = preset.texts.map((term) =>
      diceCoefficient(term, inputValue),
    );
    return {
      nameSimilarity,
      textsByOneSimilarity,
      bestMatch: Math.max(...textsByOneSimilarity),
      presetForSearch: preset,
    };
  });
  const filtered = rawResults.filter(
    ({ nameSimilarity, bestMatch }) =>
      nameSimilarity > threshold || bestMatch > threshold,
  );
  const allResults = orderBy(
    filtered,
    [
      // some bestMatches are the same for many items, then sort by name. Try out *restaurant*
      ({ nameSimilarity, bestMatch }) => Math.max(nameSimilarity, bestMatch),
      ({ nameSimilarity }) => nameSimilarity,
      ({ bestMatch }) => bestMatch,
    ],
    ['desc', 'desc', 'desc'],
  ).map((result) => ({
    type: 'preset' as const,
    preset: result,
  }));

  const firstTwoPresets = allResults.slice(0, 2);
  const restPresets = allResults.slice(2);

  return { firstTwoPresets, restPresets };
};

const getAdditionalText = (preset: PresetOption['preset']) => {
  const { textsByOneSimilarity } = preset;
  const highestMatching = Math.max(...textsByOneSimilarity);

  if (preset.nameSimilarity >= highestMatching) {
    return '';
  }

  const { texts } = preset.presetForSearch;
  const matchingIndex = textsByOneSimilarity.indexOf(highestMatching);
  const matchingText = texts[matchingIndex];
  return ` (${matchingText}…)`;
};

type Props = {
  option: PresetOption;
  inputValue: string;
};

export const PresetRow = ({ option: { preset }, inputValue }: Props) => {
  const { name } = preset.presetForSearch;
  const additionalText = getAdditionalText(preset);

  return (
    <>
      <IconPart>
        <FolderIcon />
      </IconPart>
      <Grid item xs>
        {highlightText(`${name}${additionalText}`, inputValue)}
        <Typography variant="body2" color="textSecondary">
          {t('searchbox.category')}
        </Typography>
      </Grid>
    </>
  );
};
