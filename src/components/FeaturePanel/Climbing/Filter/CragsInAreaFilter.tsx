import { useState } from 'react';
import React from 'react';
import { CragsInAreaFilterIcon } from './CragsInAreaFilterIcon';
import { useUserSettingsContext } from '../../../utils/userSettings/UserSettingsContext';
import { FilterPopover } from './FilterPopover';
import { useMobileMode } from '../../../helpers';

export const CragsInAreaFilter = () => {
  const { climbingFilter } = useUserSettingsContext();
  const { isDefaultFilter, reset } = climbingFilter;
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [open, setOpen] = useState(false);
  const isMobileMode = useMobileMode();

  const handleToggle = (event: React.MouseEvent<HTMLElement>) => {
    setOpen(!open);
    setAnchorEl(event.currentTarget);
  };

  return (
    <>
      <CragsInAreaFilterIcon
        open={open}
        onClick={handleToggle}
        touched={!isDefaultFilter}
      />
      <FilterPopover
        anchorEl={anchorEl}
        open={open}
        setOpen={setOpen}
        placement={isMobileMode ? undefined : 'right-start'}
        offset={isMobileMode ? undefined : [-10, 15]}
      />
    </>
  );
};
