import React, { useEffect, useState } from 'react';
import {
  AppBar,
  Button,
  Dialog,
  DialogContent,
  IconButton,
  Stack,
  TextField,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material';
import { getTickKey, onTickUpdate } from '../../../services/my-ticks/ticks';

import { useSnackbar } from '../../utils/SnackbarContext';
import { TickStyleSelect } from './Ticks/TickStyleSelect';
import { Tick } from './types';
import CloseIcon from '@mui/icons-material/Close';

type EditTickModalProps = {
  tick: Tick;
  isOpen: boolean;
  onClose: () => void;
};

export const EditTickModal = ({
  tick,
  isOpen,
  onClose,
}: EditTickModalProps) => {
  const { showToast } = useSnackbar();
  const [tempTick, setTempTick] = useState<Partial<Tick>>(undefined);

  useEffect(() => {
    if (tick) {
      setTempTick({
        date: tick.date,
        style: tick.style,
      });
    }
  }, [tick]);

  const updateTempTick = (key: string, value: unknown) => {
    setTempTick((tempTick) => ({
      ...tempTick,
      [key]: value,
    }));
  };

  const onTickChange = () => {
    const tickKey = tick.key ?? getTickKey(tick);

    onTickUpdate({
      tickKey,
      updatedObject: tempTick,
    });

    showToast('Tick was updated', 'success');
  };

  const handleSave = () => {
    onTickChange();
    onClose();
  };

  if (!tempTick) return null;

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <AppBar position="static" color="transparent">
        <Toolbar>
          <Stack
            direction="row"
            justifyContent="space-between"
            flex="1"
            alignItems="center"
          >
            <Typography noWrap variant="h6" component="div">
              Edit tick
            </Typography>

            <Tooltip title="Close crag detail">
              <IconButton color="primary" edge="end" onClick={onClose}>
                <CloseIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Stack>
        </Toolbar>
      </AppBar>

      <DialogContent dividers>
        <Stack spacing={2}>
          <TickStyleSelect
            value={tempTick.style}
            onChange={(e) => updateTempTick('style', e.target.value)}
          />

          <TextField
            label="Date"
            value={tempTick.date}
            onChange={(e) => {
              updateTempTick('date', e.target.value);
            }}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <Button onClick={handleSave}>Save</Button>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};
