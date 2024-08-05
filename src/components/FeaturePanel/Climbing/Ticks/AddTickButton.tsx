import React from 'react';
import { Button } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import { isTicked, onTickAdd } from '../../../../services/ticks';
import { useSnackbar } from '../../../utils/SnackbarContext';
import { useUserSettingsContext } from '../../../utils/UserSettingsContext';

export const AddTickButton = ({ shortOsmId }) => {
  const showSnackbar = useSnackbar();
  const { userSettings } = useUserSettingsContext();
  const ticked = isTicked(shortOsmId);

  return (
    <Button
      onClick={() => {
        onTickAdd({
          osmId: shortOsmId,
          style: userSettings['climbing.defaultClimbingStyle'],
        });
        showSnackbar('Tick added!', 'success');
      }}
      color="secondary"
      size="small"
      variant="text"
      endIcon={<CheckIcon color={ticked ? 'primary' : undefined} />}
    >
      Add tick
    </Button>
  );
};
