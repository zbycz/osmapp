import { Badge, Button } from '@mui/material';
import React from 'react';
import styled from '@emotion/styled';
import { useUserSettingsContext } from '../../utils/userSettings/UserSettingsContext';
import { FilterPopover } from '../../FeaturePanel/Climbing/Filter/FilterPopover';
import FilterListAltIcon from '@mui/icons-material/FilterListAlt';
import { t } from '../../../services/intl';

const StyledButton = styled(Button)`
  border-radius: 100px;
  pointer-events: all;
`;

export const MapFilter = () => {
  const { climbingFilter } = useUserSettingsContext();
  const { isDefaultFilter, isGradeIntervalDefault, isMinimumRoutesDefault } =
    climbingFilter;
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [open, setOpen] = React.useState(false);
  const handleToggle = (event: React.MouseEvent<HTMLElement>) => {
    setOpen(!open);
    setAnchorEl(event.currentTarget);
  };

  const numberOfActiveFilters = [
    isGradeIntervalDefault,
    isMinimumRoutesDefault,
  ].filter((item) => !item).length;

  return (
    <>
      <Badge
        variant="standard"
        badgeContent={numberOfActiveFilters}
        color="error"
        invisible={isDefaultFilter}
      >
        <StyledButton
          variant="contained"
          onClick={handleToggle}
          startIcon={<FilterListAltIcon fontSize="small" />}
          size="small"
        >
          {t('map.filter')}
        </StyledButton>
      </Badge>

      <FilterPopover
        anchorEl={anchorEl}
        open={open}
        setOpen={setOpen}
        offset={[0, 7]}
      />
    </>
  );
};
