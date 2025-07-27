import React from 'react';
import { Button } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import { isTicked, onTickAdd } from '../../../../services/my-ticks/ticks';
import { useSnackbar } from '../../../utils/SnackbarContext';
import { useUserSettingsContext } from '../../../utils/userSettings/UserSettingsContext';

export const AddTickButton = ({ shortOsmId }) => {
  const { showToast } = useSnackbar();
  const { userSettings } = useUserSettingsContext();
  const ticked = isTicked(shortOsmId);

  return (
    <Button
      onClick={() => {
        onTickAdd({
          osmId: shortOsmId,
          style: userSettings['climbing.defaultClimbingStyle'],
        });
        showToast('Tick added!', 'success');
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
