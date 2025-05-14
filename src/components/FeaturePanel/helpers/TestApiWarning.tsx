import { API_SERVER, USE_PROD_API } from '../../../services/osm/consts';
import { Alert, Box } from '@mui/material';
import Link from 'next/link';
import React from 'react';

export const TestApiWarning = () =>
  USE_PROD_API ? null : (
    <Box mb={2} mt={1}>
      <Alert severity="warning">
        TEST API IN USE: {API_SERVER}
        <br />
        Clicking the map will not work.
        <Link href="/relation/4305224335">Test relation</Link>/
        <Link href="/way/4307240838">way</Link>/
        <Link href="/node/4359496267">node</Link>
      </Alert>
    </Box>
  );
