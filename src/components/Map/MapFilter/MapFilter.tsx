import { useState } from 'react';
import { Badge, Tooltip, IconButton } from '@mui/material';
import React from 'react';
import styled from '@emotion/styled';
import { useUserSettingsContext } from '../../utils/userSettings/UserSettingsContext';
import { FilterPopover } from '../../FeaturePanel/Climbing/Filter/FilterPopover';
import FilterListAltIcon from '@mui/icons-material/FilterListAlt';
import { t } from '../../../services/intl';
import { convertHexToRgba } from '../../utils/colorUtils';
import { useMobileMode } from '../../helpers';

const StyledIconButton = styled(IconButton, {
  shouldForwardProp: (prop) => !prop.startsWith('$'),
})<{ $isOpened: boolean }>`
  pointer-events: all;
  &,
  &:hover {
    background-color: ${({ theme, $isOpened }) =>
      $isOpened
        ? theme.palette.background.paper
        : convertHexToRgba(theme.palette.background.paper, 0.8)};
  }
`;

type MapFilterButtonProps = {
  onClick: (event: React.MouseEvent<HTMLElement>) => void;
  open: boolean;
};
const MapFilterButton = ({ open, onClick }: MapFilterButtonProps) => {
  const isMobileMode = useMobileMode();
  const { isDefaultFilter, isGradeIntervalDefault, isMinimumRoutesDefault } =
    useUserSettingsContext().climbingFilter;
  const numberOfActiveFilters = [
    isGradeIntervalDefault,
    isMinimumRoutesDefault,
  ].filter((item) => !item).length;

  return (
    <Badge
      variant="standard"
      badgeContent={numberOfActiveFilters}
      color="error"
      invisible={isDefaultFilter}
    >
      <Tooltip title={t('map.filter')} arrow>
        <StyledIconButton
          onClick={onClick}
          $isOpened={open}
          size={isMobileMode ? 'large' : 'medium'}
        >
          <FilterListAltIcon fontSize="small" />
        </StyledIconButton>
      </Tooltip>
    </Badge>
  );
};

export const MapFilter = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [open, setOpen] = useState(false);
  const handleToggle = (event: React.MouseEvent<HTMLElement>) => {
    setOpen(!open);
    setAnchorEl(event.currentTarget);
  };

  return (
    <>
      <MapFilterButton open={open} onClick={handleToggle} />

      <FilterPopover
        anchorEl={anchorEl}
        open={open}
        setOpen={setOpen}
        offset={[-40, 7]}
        placement="bottom"
      />
    </>
  );
};
