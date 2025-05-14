import React, { useEffect, useState } from 'react';
import { Box, Button, Tooltip, Typography } from '@mui/material';
import styled from '@emotion/styled';
import { allPresets } from '../../../../../services/tagging/data';
import {
  fetchSchemaTranslations,
  getPresetTermsTranslation,
  getPresetTranslation,
} from '../../../../../services/tagging/translations';
import { Preset } from '../../../../../services/tagging/types/Presets';
import { t } from '../../../../../services/intl';
import { useCurrentItem } from '../../EditContext';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { PoiIcon } from '../../../../utils/icons/PoiIcon';
import { PresetSearchBox } from './PresetSearchBox';
import { useFeatureContext } from '../../../../utils/FeatureContext';
import { useOsmAuthContext } from '../../../../utils/OsmAuthContext';
import { useBoolState } from '../../../../helpers';

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

export const useOptions = () => {
  const [options, setOptions] = useState<PresetsCache>([]);
  useEffect(() => {
    getTranslatedPresets().then((presets) => setOptions(presets));
  }, []);
  return options;
};

const SelectFieldBox = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 14px;
  border: 1px solid ${({ theme }) => theme.palette.action.disabled};
  border-radius: ${({ theme }) => theme.shape.borderRadius}px;
  min-width: 300px;
  cursor: pointer;
  background-color: ${({ theme }) => theme.palette.background.paper};
  min-height: 40px;
  transition: border-color 0.2s ease-in-out;

  &:hover {
    border-color: ${({ theme }) => theme.palette.secondary.main};
  }

  box-sizing: border-box;
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.palette.primary.main};
    border-width: 2px;
    padding: 9px 13px;
    background-position: right 7px center;
  }
`;

const Placeholder = () => (
  <Typography component="span" sx={{ color: 'text.secondary' }}>
    {t('editdialog.preset_select.placeholder')}
  </Typography>
);

const useAnchorElement = () => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return { anchorEl, handleClick, handleClose };
};

const useEnabledState = () => {
  const { feature } = useFeatureContext();
  const { loggedIn } = useOsmAuthContext();
  const [enabled, enable] = useBoolState(feature.point || !loggedIn);
  return { enabled, enable };
};

export const PresetSelect = () => {
  const { anchorEl, handleClick, handleClose } = useAnchorElement();
  const { presetKey, presetLabel } = useCurrentItem();
  const poiTags = allPresets[presetKey].tags;
  const { enabled, enable } = useEnabledState();

  return (
    <Row mb={3}>
      <LabelWrapper>
        <Typography variant="body1" component="span" color="textSecondary">
          {t('editdialog.preset_select.label')}
        </Typography>
      </LabelWrapper>

      <Tooltip
        title={enabled ? '' : t('editdialog.preset_select.change_type_warning')}
        arrow
      >
        <SelectFieldBox
          tabIndex={enabled ? 0 : undefined}
          onClick={enabled ? handleClick : undefined}
        >
          {presetKey === 'point' ? (
            <Placeholder />
          ) : (
            <div>
              <PoiIcon tags={poiTags} size={16} middle themed />
              <span style={{ paddingLeft: 5 }} />
              {presetLabel}
            </div>
          )}
          <ArrowDropDownIcon color="action" />
        </SelectFieldBox>
      </Tooltip>
      {!enabled && (
        // TODO we may warn users that this is not usual operation, if this becomes an issue
        <Box ml={1}>
          <Button color="secondary" onClick={enable}>
            {t('editdialog.preset_select.edit_button')}
          </Button>
        </Box>
      )}

      <PresetSearchBox anchorEl={anchorEl} onClose={handleClose} />
    </Row>
  );
};
