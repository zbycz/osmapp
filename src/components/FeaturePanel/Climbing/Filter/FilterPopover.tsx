import { Button, IconButton, Stack } from '@mui/material';
import React from 'react';
import { t } from '../../../../services/intl';
import { MinimumRoutesFilter } from './MinimumRoutesFilter';
import { GradeFilter } from './GradeFilter';
import { PopperWithArrow } from '../../../utils/PopperWithArrow';
import { useUserSettingsContext } from '../../../utils/userSettings/UserSettingsContext';
import { Placement } from '@popperjs/core';
import CloseIcon from '@mui/icons-material/Close';
import { Setter } from '../../../../types';

type FilterPopoverProps = {
  anchorEl: null | HTMLElement;
  open: boolean;
  setOpen: Setter<boolean>;
  placement?: Placement;
  offset?: [number, number];
};

export const FilterPopover = ({
  anchorEl,
  open,
  setOpen,
  placement,
  offset,
}: FilterPopoverProps) => {
  const { climbingFilter } = useUserSettingsContext();
  const { reset } = climbingFilter;

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <PopperWithArrow
      title={t('crag_filter.title')}
      isOpen={open}
      anchorEl={anchorEl}
      placement={placement}
      offset={offset}
      sx={{ minWidth: 350 }}
      addition={
        <IconButton
          onClick={handleClose}
          size="small"
          color="secondary"
          sx={{ mr: 1 }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      }
    >
      <GradeFilter />
      <MinimumRoutesFilter />
      <Stack
        direction="row"
        gap={1}
        alignItems="center"
        sx={{ ml: 1, paddingBottom: 1 }}
      >
        <Button variant="contained" size="small" onClick={handleClose}>
          {t('crag_filter.done')}
        </Button>
        <Button onClick={reset} size="small" color="secondary">
          {t('crag_filter.reset')}
        </Button>
      </Stack>
    </PopperWithArrow>
  );
};
