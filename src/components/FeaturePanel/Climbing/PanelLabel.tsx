import React from 'react';
import styled from '@emotion/styled';
import { ContentContainer } from './ContentContainer';
import { Box } from '@mui/material';

type PanelLabelProps = {
  children: React.ReactNode;
  addition?: React.ReactNode;
  border?: boolean;
};

export const Container = styled.div`
  padding: 20px 10px 4px;
`;

export const InnerContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
export const Title = styled.h2`
  margin: 0;
  align-self: center;
  font-weight: bold;
  font-size: 12px;
  text-transform: uppercase;
  color: ${({ theme }) => theme.palette.secondary.main};
`;
export const Addition = styled.div`
  color: ${({ theme }) => theme.palette.secondary.main};
`;

export const PanelLabel = ({ children, addition }: PanelLabelProps) => (
  <Box ml={2} mr={2} mt={4}>
    <ContentContainer>
      <InnerContainer>
        <Title>{children}</Title>
        <Addition>{addition}</Addition>
      </InnerContainer>
    </ContentContainer>
  </Box>
);
