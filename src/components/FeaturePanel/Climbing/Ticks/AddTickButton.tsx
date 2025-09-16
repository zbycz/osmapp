import React, { useState } from 'react';
import { Button } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import { useSnackbar } from '../../../utils/SnackbarContext';
import { useOsmAuthContext } from '../../../utils/OsmAuthContext';
import { useTicksContext } from '../../../utils/TicksContext';
import { useFeatureContext } from '../../../utils/FeatureContext';
import { getShortId } from '../../../../services/helpers';

export const AddTickButton = () => {
  const { addTick, isTicked } = useTicksContext();
  const { feature } = useFeatureContext();
  const { loggedIn } = useOsmAuthContext();
  const { showToast } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const ticked = isTicked(getShortId(feature.osmMeta));

  const onClick = async () => {
    if (!loggedIn) {
      showToast('Please log in to add tick.', 'warning');
      return;
    }

    setLoading(true);
    try {
      await addTick(getShortId(feature.osmMeta));
    } catch (e) {
      showToast(`Error: ${e}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        onClick={onClick}
        color="secondary"
        size="small"
        variant="text"
        endIcon={<CheckIcon color={ticked ? 'success' : undefined} />}
        loading={loading}
      >
        Add tick
      </Button>
    </>
  );
};
