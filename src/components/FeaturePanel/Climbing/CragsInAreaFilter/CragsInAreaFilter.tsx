import { Button } from '@mui/material';
import React, { useEffect } from 'react';
import { t } from '../../../../services/intl';
import { useUserSettingsContext } from '../../../utils/UserSettingsContext';
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
  uniqueValues: string[];
  setIsTouched: (isTouched: boolean) => void;
  isTouched: boolean;
};

export const CragsInAreaFilter = ({
  gradeInterval,
  setGradeInterval,
  minimumRoutesInInterval,
  setMinimumRoutesInInterval,
  uniqueValues,
  setIsTouched,
  isTouched,
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

  const handleIfTouched = ({
    gradeInterval,
    minimumRoutesInInterval,
  }: {
    gradeInterval?: number[];
    minimumRoutesInInterval?: number;
  }) => {
    if (
      gradeInterval &&
      (gradeInterval[0] !== 0 || gradeInterval[1] !== uniqueValues.length - 1)
    )
      setIsTouched(true);
    else if (minimumRoutesInInterval && minimumRoutesInInterval !== 1)
      setIsTouched(true);
    else {
      setIsTouched(false);
    }
  };

  const handleChangeGradeFilter = (
    _event: Event,
    newValue: number | number[],
  ) => {
    if (Array.isArray(newValue)) {
      handleIfTouched({ gradeInterval: newValue });
      setGradeInterval(newValue);
    }
  };
  const handleChangeMinimumRoutesInInterval = (
    _event: Event,
    newValue: number,
  ) => {
    handleIfTouched({ minimumRoutesInInterval: newValue });
    setMinimumRoutesInInterval(newValue);
  };

  const currentGradeSystem = userSettings['climbing.gradeSystem'] || 'uiaa';

  useEffect(() => {
    if (gradeInterval === null) setGradeInterval([0, uniqueValues.length - 1]);
  }, [uniqueValues, gradeInterval, currentGradeSystem, setGradeInterval]);

  if (gradeInterval === null) {
    return null;
  }
  const handleReset = () => {
    setGradeInterval([0, uniqueValues.length - 1]);
    setMinimumRoutesInInterval(1);
    setIsTouched(false);
  };

  return (
    <>
      <CragsInAreaFilterIcon
        open={open}
        onClick={handleClick}
        touched={isTouched}
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
          uniqueValues={uniqueValues}
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
