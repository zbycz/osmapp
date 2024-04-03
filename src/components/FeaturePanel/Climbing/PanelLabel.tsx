import React from 'react';
import styled from 'styled-components';
import { ContentContainer } from './ContentContainer';

type PanelLabelProps = {
  children: React.ReactNode;
  addition?: React.ReactNode;
};

export const Container = styled.div`
  border-bottom: solid 1px ${({ theme }) => theme.palette.divider};
  padding: 20px 10px 4px;
`;

export const InnerContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;
export const Title = styled.div`
  font-weight: bold;
  color: ${({ theme }) => theme.palette.secondary.main};
`;
export const Addition = styled.div`
  color: ${({ theme }) => theme.palette.secondary.main};
`;

export const PanelLabel = ({ children, addition }: PanelLabelProps) => (
  <Container>
    <ContentContainer>
      <InnerContainer>
        <Title>{children}</Title>
        <Addition>{addition}</Addition>
      </InnerContainer>
    </ContentContainer>
  </Container>
);
