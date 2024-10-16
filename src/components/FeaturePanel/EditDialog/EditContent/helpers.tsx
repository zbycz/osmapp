import styled from '@emotion/styled';
import { Box, Stack } from '@mui/material';
import React from 'react';

const CharacterCountContainer = styled.div`
  position: absolute;
  right: 0;
`;

type CharacterCountProps = {
  count?: number;
  max: number;
  isInputFocused: boolean;
};

export const CharacterCount = ({
  count = 0,
  max,
  isInputFocused,
}: CharacterCountProps) =>
  isInputFocused && count > 150 ? (
    <CharacterCountContainer>
      <Stack direction="row" justifyContent={'flex-end'} whiteSpace="nowrap">
        <Box color={count >= max ? 'error.main' : undefined}>
          {count} / {max}
        </Box>
      </Stack>
    </CharacterCountContainer>
  ) : null;
