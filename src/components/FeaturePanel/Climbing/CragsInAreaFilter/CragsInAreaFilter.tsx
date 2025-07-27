import { Button } from '@mui/material';
import React from 'react';
import { t } from '../../../../services/intl';
import { MinimumRoutesFilter } from './MinimumRoutesFilter';
import { GradeFilter } from './GradeFilter';
import { CragsInAreaFilterIcon } from './CragsInAreaFilterIcon';
import { PopperWithArrow } from '../../../utils/PopperWithArrow';
import { useMobileMode } from '../../../helpers';

type CragsInAreaFilterProps = {
  setGradeInterval: (gradeInterval: number[] | null) => void;
  minimumRoutesInInterval: number;
  setMinimumRoutesInInterval: (minimumRoutesInInterval: number) => void;
  grades: string[];
  isDefaultFilter: boolean;
};

export const CragsInAreaFilter = ({
  setGradeInterval,
  minimumRoutesInInterval,
  setMinimumRoutesInInterval,
  grades,
  isDefaultFilter,
}: CragsInAreaFilterProps) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [open, setOpen] = React.useState(false);
  const isMobileMode = useMobileMode();

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setOpen(!open);
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleChangeMinimumRoutesInInterval = (
    _event: Event,
    newValue: number,
  ) => {
    setMinimumRoutesInInterval(newValue);
  };

  const handleReset = () => {
    setMinimumRoutesInInterval(1); // TODO this doesnt work
    setGradeInterval([0, grades.length - 1]);
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
        <GradeFilter />
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
