import React, { useEffect, useState } from 'react';
import {
  AppBar,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  IconButton,
  Stack,
  TextField,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material';
import { useSnackbar } from '../../utils/SnackbarContext';
import { TickStyleSelect } from './Ticks/TickStyleSelect';
import CloseIcon from '@mui/icons-material/Close';
import { ClimbingTick } from '../../../types';
import { clone } from 'lodash';
import { TickStyle } from './types';
import { useTicksContext } from '../../utils/TicksContext';

type EditTickModalProps = {
  tickId: number;
  data: ClimbingTick[];
  isFetching: boolean;
  onClose: () => void;
};

const EditTickHeader = (props: { onClose: () => void }) => (
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
          <IconButton color="primary" edge="end" onClick={props.onClose}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Stack>
    </Toolbar>
  </AppBar>
);

const TickFields = ({
  tempTick,
  updateTempTick,
}: {
  tempTick: ClimbingTick;
  updateTempTick: <T extends keyof ClimbingTick>(
    key: T,
    value: ClimbingTick[T],
  ) => void;
}) => (
  <>
    <TickStyleSelect
      value={tempTick.style as TickStyle}
      onChange={(e) => updateTempTick('style', e.target.value)}
    />

    <TextField
      label="Date"
      value={tempTick.timestamp}
      onChange={(e) => {
        updateTempTick('timestamp', e.target.value);
      }}
      InputLabelProps={{
        shrink: true,
      }}
    />

    <TextField
      label="My grade"
      value={tempTick.myGrade}
      onChange={(e) => {
        updateTempTick('myGrade', e.target.value);
      }}
      InputLabelProps={{
        shrink: true,
      }}
    />

    <TextField
      label="Note for other climbers"
      value={tempTick.note}
      onChange={(e) => {
        updateTempTick('note', e.target.value);
      }}
      InputLabelProps={{
        shrink: true,
      }}
    />
  </>
);

const useTempTick = () => {
  const { editedTickId, ticks, isFetching } = useTicksContext();
  const [tempTick, setTempTick] = useState<ClimbingTick>(undefined);

  useEffect(() => {
    if (editedTickId && !isFetching) {
      const found = ticks.find((tick) => tick.id === editedTickId);
      if (found) {
        setTempTick(clone(found));
      }
    }
  }, [ticks, isFetching, editedTickId]);

  const updateTempTick = (key: string, value: unknown) => {
    setTempTick((tempTick) => ({
      ...tempTick,
      [key]: value,
    }));
  };
  return { tempTick, updateTempTick };
};

export const EditTickModal = () => {
  const { updateTick, editedTickId, setEditedTickId } = useTicksContext();
  const { showToast } = useSnackbar();
  const { tempTick, updateTempTick } = useTempTick();
  const [loading, setLoading] = useState<boolean>(false);
  const onClose = () => {
    setEditedTickId(null);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await updateTick(tempTick);
      showToast('Tick was updated', 'success');
    } catch (e) {
      showToast(`Error: ${e}`, 'error');
    } finally {
      setLoading(false);
      onClose();
    }
  };

  return (
    <Dialog open={!!editedTickId} onClose={onClose}>
      <EditTickHeader onClose={onClose} />
      <DialogContent dividers>
        {tempTick ? (
          <Stack spacing={2}>
            <TickFields tempTick={tempTick} updateTempTick={updateTempTick} />
            <Button onClick={handleSave} loading={loading}>
              Save
            </Button>
          </Stack>
        ) : (
          <CircularProgress />
        )}
      </DialogContent>
    </Dialog>
  );
};
