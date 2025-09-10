import React from 'react';
import { Button } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import { isTicked } from '../../../../services/my-ticks/ticks';
import { useUserSettingsContext } from '../../../utils/userSettings/UserSettingsContext';
import { useTicksContext } from './TicksContext';

export const AddTickButton = ({ shortOsmId }) => {
  const ticked = isTicked(shortOsmId);
  const { userSettings } = useUserSettingsContext();
  const { onNewTickAdd } = useTicksContext();

  return (
    <>
      <Button
        onClick={() =>
          onNewTickAdd(
            shortOsmId,
            userSettings['climbing.defaultClimbingStyle'],
          )
        }
        color="secondary"
        size="small"
        variant="text"
        endIcon={<CheckIcon color={ticked ? 'primary' : undefined} />}
      >
        Add tick
      </Button>
    </>
  );
};
