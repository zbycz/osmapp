import { useState } from 'react';
import React from 'react';
import { Box, Button, Tooltip, Typography } from '@mui/material';
import styled from '@emotion/styled';
import { allPresets } from '../../../../../../services/tagging/data';
import { t } from '../../../../../../services/intl';
import { useCurrentItem } from '../../../EditContext';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { PoiIcon } from '../../../../../utils/icons/PoiIcon';
import { PresetMenu } from './PresetMenu';
import { useFeatureContext } from '../../../../../utils/FeatureContext';
import { useOsmAuthContext } from '../../../../../utils/OsmAuthContext';
import { useBoolState } from '../../../../../helpers';

const Row = styled(Box)`
  display: flex;
  align-items: center;
`;

const LabelWrapper = styled.div`
  min-width: 44px;
  margin-right: 1em;
`;
const TypeLabel = () => (
  <LabelWrapper>
    <Typography variant="body1" component="span" color="textSecondary">
      {t('editdialog.preset_select.label')}
    </Typography>
  </LabelWrapper>
);

const QuasiSelectBox = styled(Box)`
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

const useAnchorElement = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
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

const EnableButton = (props: { onClick: () => void }) => (
  // TODO we may warn users that this is not usual operation, if this becomes an issue
  <Box ml={1}>
    <Button color="secondary" onClick={props.onClick}>
      {t('editdialog.preset_select.edit_button')}
    </Button>
  </Box>
);

const Placeholder = () => (
  <Typography component="span" sx={{ color: 'text.secondary' }}>
    {t('editdialog.preset_select.placeholder')}
  </Typography>
);

export const PresetSelect = () => {
  const { anchorEl, handleClick, handleClose } = useAnchorElement();
  const { presetKey, presetLabel } = useCurrentItem();
  const poiTags = allPresets[presetKey].tags;
  const { enabled, enable } = useEnabledState();

  return (
    <Row mb={3}>
      <TypeLabel />
      <Tooltip
        arrow
        title={enabled ? '' : t('editdialog.preset_select.change_type_warning')}
      >
        <QuasiSelectBox
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
        </QuasiSelectBox>
      </Tooltip>

      {!enabled && <EnableButton onClick={enable} />}

      <PresetMenu anchorEl={anchorEl} onClose={handleClose} />
    </Row>
  );
};
