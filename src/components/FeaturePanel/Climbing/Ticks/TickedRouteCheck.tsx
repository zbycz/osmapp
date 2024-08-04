import { Tooltip } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import React from 'react';
import { isTicked } from '../../../../services/ticks';

export const TickedRouteCheck = ({ osmId }) => {
  const ticked = isTicked(osmId);

  return (
    <>
      {ticked && (
        <Tooltip title="You ticked this route">
          <CheckIcon color="primary" style={{ marginRight: 20 }} />
        </Tooltip>
      )}
    </>
  );
};
