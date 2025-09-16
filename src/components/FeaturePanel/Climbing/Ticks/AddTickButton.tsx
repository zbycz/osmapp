import React from 'react';
import { Button } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import { isTicked } from '../../../../services/my-ticks/ticks';
import { useTicksContext } from '../../../utils/TicksContext';
import { useFeatureContext } from '../../../utils/FeatureContext';
import { getShortId } from '../../../../services/helpers';

export const AddTickButton = () => {
  const { addTick } = useTicksContext();
  const { feature } = useFeatureContext();
  const shortId = getShortId(feature.osmMeta);
  const ticked = isTicked(shortId);

  return (
    <>
      <Button
        onClick={() => addTick(shortId)}
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
