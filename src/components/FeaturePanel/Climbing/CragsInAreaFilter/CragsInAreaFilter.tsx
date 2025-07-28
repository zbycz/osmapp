import { Button } from '@mui/material';
import React from 'react';
import { t } from '../../../../services/intl';
import { MinimumRoutesFilter } from './MinimumRoutesFilter';
import { GradeFilter } from './GradeFilter';
import { CragsInAreaFilterIcon } from './CragsInAreaFilterIcon';
import { PopperWithArrow } from '../../../utils/PopperWithArrow';
import { useMobileMode } from '../../../helpers';
import { useUserSettingsContext } from '../../../utils/userSettings/UserSettingsContext';

export const CragsInAreaFilter = () => {
  const { climbingFilter } = useUserSettingsContext();
  const { isDefaultFilter, reset } = climbingFilter;
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [open, setOpen] = React.useState(false);
  const isMobileMode = useMobileMode();

  const handleToggle = (event: React.MouseEvent<HTMLElement>) => {
    setOpen(!open);
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <CragsInAreaFilterIcon
        open={open}
        onClick={handleToggle}
        touched={!isDefaultFilter}
      />
      <PopperWithArrow
        title={t('crag_filter.title')}
        isOpen={open}
        anchorEl={anchorEl}
        placement={isMobileMode ? undefined : 'right-start'}
        offset={isMobileMode ? undefined : [-10, 15]}
        sx={{ minWidth: 350 }}
        addition={
          <Button onClick={reset} size="small" color="secondary">
            {t('crag_filter.reset')}
          </Button>
        }
      >
        <GradeFilter />
        <MinimumRoutesFilter />
        <Button variant="contained" sx={{ ml: 1, mb: 1 }} onClick={handleClose}>
          {t('crag_filter.done')}
        </Button>
      </PopperWithArrow>
    </>
  );
};
