import { Backdrop, Button, Stack, Box, Typography } from '@mui/material';
import React from 'react';
import { t, Translation } from '../../../../services/intl';
import { MinimumRoutesFilter } from './MinimumRoutesFilter';
import { GradeFilter } from './GradeFilter';
import { PopperWithArrow } from '../../../utils/PopperWithArrow';
import { useUserSettingsContext } from '../../../utils/userSettings/UserSettingsContext';
import { Placement } from '@popperjs/core';
import { Setter } from '../../../../types';
import { useMapStateContext } from '../../../utils/MapStateContext';

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

const ZoomWarning = () => {
  // First zoom level without omitted pois due to "optimization to grid"
  // - see climbingTileSource#updateData() loads tile level 9 for mapzoom >= 10
  // - see getClimbingTile() to which zoom levels "isOptimizedToGrid"
  const ZOOM_LEVEL = 10;

  const [zoom, lat, lon] = useMapStateContext().view;
  if (parseFloat(zoom) >= ZOOM_LEVEL) {
    return null;
  }
  return (
    // TODO the FilterPopover should be probably fixed to maxWidth. But maybe there is a reason.
    <Box mx={2} pb={1} sx={{ maxWidth: '300px' }}>
      <Typography variant="body2">
        <Translation
          id="crag_filter.zoom_in"
          values={{ zoom: `${ZOOM_LEVEL}+ (~3 km)` }}
          tags={{
            link: 'a href="https://community.openclimbing.org/d/12-map-filtering-is-in-beta" target="_blank"',
          }}
        />
      </Typography>
    </Box>
  );
};

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
  const { reset, isDefaultFilter } = useUserSettingsContext().climbingFilter;

  const handleClose = () => setOpen(false);

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
            <ZoomWarning />
          </Box>
        </PopperWithArrow>
      </Box>
    </Backdrop>
  );
};
