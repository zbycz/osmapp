import { API_SERVER, USE_PROD_API } from '../../../services/osmApiConsts';
import { Alert, Box } from '@mui/material';
import Link from 'next/link';
import React from 'react';

export const TestApiWarning = () =>
  USE_PROD_API ? null : (
    <Box mb={2}>
      <Alert severity="warning">
        TEST API IN USE: {API_SERVER}
        <br />
        Clicking the map will not work.
        <Link href="/relation/4305224335">Test relation</Link>
      </Alert>
    </Box>
  );
