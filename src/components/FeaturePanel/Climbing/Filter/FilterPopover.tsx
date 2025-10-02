import { Backdrop, Button, Stack, Box } from '@mui/material';
import React from 'react';
import { t } from '../../../../services/intl';
import { MinimumRoutesFilter } from './MinimumRoutesFilter';
import { GradeFilter } from './GradeFilter';
import { PopperWithArrow } from '../../../utils/PopperWithArrow';
import { useUserSettingsContext } from '../../../utils/userSettings/UserSettingsContext';
import { Placement } from '@popperjs/core';
import { Setter } from '../../../../types';

const ResetButton = (props: { onClick: () => void }) => (
  <Button onClick={props.onClick} size="small" color="secondary">
    {t('crag_filter.reset')}
  </Button>
);

const DoneButton = (props: { onClick: () => void }) => (
  <Button
    variant="contained"
    size="small"
    onClick={props.onClick}
    sx={{ mr: 1 }}
  >
    {t('crag_filter.done')}
  </Button>
);

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
  const { reset, isDefaultFilter } = climbingFilter;

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Backdrop
      sx={(theme) => ({
        color: '#fff',
        zIndex: theme.zIndex.drawer + 1,
        pointerEvents: 'all',
      })}
      open={open}
      onClick={handleClose}
    >
      <Box onClick={(e) => e.stopPropagation()}>
        <PopperWithArrow
          title={t('crag_filter.title')}
          isOpen={open}
          anchorEl={anchorEl}
          placement={placement}
          offset={offset}
          sx={{ minWidth: 350 }}
          addition={
            <Stack direction="row" gap={1} alignItems="center">
              {!isDefaultFilter && <ResetButton onClick={reset} />}
              <DoneButton onClick={handleClose} />
            </Stack>
          }
        >
          <Box>
            <GradeFilter />
            <MinimumRoutesFilter />
          </Box>
        </PopperWithArrow>
      </Box>
    </Backdrop>
  );
};
