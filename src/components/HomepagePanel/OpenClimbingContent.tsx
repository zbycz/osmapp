import React from 'react';
import styled from 'styled-components';
import Typography from '@material-ui/core/Typography';

// @TODO unify primitive components
const Center = styled.div`
  text-align: center;
  ${({ mb }) => mb && 'margin-bottom: 2em;'}
  ${({ mt }) => mt && 'margin-top: 2em;'}
`;

export const OpenClimbingContent = () => (
  <>
    <Center mb>
      <Typography variant="h4" component="h1" color="inherit">
        openclimbing.org
      </Typography>
    </Center>
  </>
);
