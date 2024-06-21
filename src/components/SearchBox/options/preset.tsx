import match from 'autosuggest-highlight/match';
import FolderIcon from '@mui/icons-material/Folder';
import { Grid, Typography } from '@mui/material';
import React from 'react';
import {
  fetchSchemaTranslations,
  getPresetTermsTranslation,
  getPresetTranslation,
} from '../../../services/tagging/translations';
import { presets } from '../../../services/tagging/data';
import { PresetOption } from '../types';
import { highlightText } from '../highlightText';
import { t } from '../../../services/intl';
import { IconPart } from '../utils';

let presetsForSearch;
const getPresetsForSearch = async () => {
  if (presetsForSearch) {
    return presetsForSearch;
  }

  await fetchSchemaTranslations();

  // resolve symlinks to {landuse...} etc
  presetsForSearch = Object.values(presets)
    .filter(({ searchable }) => searchable === undefined || searchable)
    .filter(({ locationSet }) => !locationSet?.include)
    .filter(({ tags }) => Object.keys(tags).length > 0)
    .map(({ name, presetKey, tags, terms }) => {
      const tagsAsStrings = Object.entries(tags).map(([k, v]) => `${k}=${v}`);
      return {
        key: presetKey,
        name: getPresetTranslation(presetKey) ?? name ?? 'x',
        tags,
        tagsAsOneString: tagsAsStrings.join(', '),
        texts: [
          ...(getPresetTermsTranslation(presetKey) ?? terms ?? 'x').split(','),
          ...tagsAsStrings,
          presetKey,
        ],
      };
    });

  return presetsForSearch;
};

const num = (text, inputValue) =>
  // TODO match function not always good - consider text.toLowerCase().includes(inputValue.toLowerCase());
  match(text, inputValue, {
    insideWords: true,
    findAllOccurrences: true,
  }).length;

type PresetOptions = Promise<{
  before: PresetOption[];
  after: PresetOption[];
}>;

export const getPresetOptions = async (inputValue): PresetOptions => {
  if (inputValue.length <= 2) {
    return { before: [], after: [] };
  }

  const results = (await getPresetsForSearch()).map((preset) => {
    const name = num(preset.name, inputValue) * 10;
    const textsByOne = preset.texts.map((term) => num(term, inputValue));
    const sum = name + textsByOne.reduce((a, b) => a + b, 0);
    return { name, textsByOne, sum, presetForSearch: preset };
  });

  const nameMatches = results
    .filter((result) => result.name > 0)
    .map((result) => ({ preset: result }));

  const rest = results
    .filter((result) => result.name === 0 && result.sum > 0)
    .map((result) => ({ preset: result }));

  const allResults = [...nameMatches, ...rest];
  const before = allResults.slice(0, 2);
  const after = allResults.slice(2);

  return { before, after };
};

export const renderPreset = (preset, inputValue) => {
  const { name } = preset.presetForSearch;
  const additionalText =
    preset.name === 0
      ? ` (${preset.presetForSearch.texts.find(
          (_, idx) => preset.textsByOne[idx] > 0,
        )}…)`
      : '';

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
