import { Button } from '@mui/material';
import React, { useEffect } from 'react';
import { t } from '../../../../services/intl';
import { useUserSettingsContext } from '../../../utils/userSettings/UserSettingsContext';
import { MinimumRoutesFilter } from './MinimumRoutesFilter';
import { GradeFilter } from './GradeFilter';
import { CragsInAreaFilterIcon } from './CragsInAreaFilterIcon';
import { PopperWithArrow } from '../../../utils/PopperWithArrow';
import { useMobileMode } from '../../../helpers';

type CragsInAreaFilterProps = {
  gradeInterval: number[] | null;
  setGradeInterval: (gradeInterval: number[] | null) => void;
  minimumRoutesInInterval: number;
  setMinimumRoutesInInterval: (minimumRoutesInInterval: number) => void;
  uniqueGrades: string[];
  isDefaultFilter: boolean;
};

export const CragsInAreaFilter = ({
  gradeInterval,
  setGradeInterval,
  minimumRoutesInInterval,
  setMinimumRoutesInInterval,
  uniqueGrades,
  isDefaultFilter,
}: CragsInAreaFilterProps) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [open, setOpen] = React.useState(false);
  const { userSettings } = useUserSettingsContext();
  const isMobileMode = useMobileMode();

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setOpen(!open);
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleChangeGradeFilter = (
    _event: Event,
    newValue: number | number[],
  ) => {
    if (Array.isArray(newValue)) {
      setGradeInterval(newValue);
    }
  };
  const handleChangeMinimumRoutesInInterval = (
    _event: Event,
    newValue: number,
  ) => {
    setMinimumRoutesInInterval(newValue);
  };

  const currentGradeSystem = userSettings['climbing.gradeSystem'] || 'uiaa';

  useEffect(() => {
    if (gradeInterval === null) setGradeInterval([0, uniqueGrades.length - 1]);
  }, [uniqueGrades, gradeInterval, currentGradeSystem, setGradeInterval]);

  if (gradeInterval === null) {
    return null;
  }
  const handleReset = () => {
    setGradeInterval([0, uniqueGrades.length - 1]);
    setMinimumRoutesInInterval(1);
  };

  return (
    <>
      <CragsInAreaFilterIcon
        open={open}
        onClick={handleClick}
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
          <Button onClick={handleReset} size="small" color="secondary">
            {t('crag_filter.reset')}
          </Button>
        }
      >
        <GradeFilter
          uniqueValues={uniqueGrades}
          currentGradeSystem={currentGradeSystem}
          gradeInterval={gradeInterval}
          onChange={handleChangeGradeFilter}
        />
        <MinimumRoutesFilter
          minimumRoutesInInterval={minimumRoutesInInterval}
          onChange={handleChangeMinimumRoutesInInterval}
        />
        <Button variant="contained" sx={{ ml: 1, mb: 1 }} onClick={handleClose}>
          {t('crag_filter.done')}
        </Button>
      </PopperWithArrow>
    </>
  );
};
