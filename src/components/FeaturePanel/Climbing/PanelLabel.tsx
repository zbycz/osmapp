import React from 'react';
import styled from '@emotion/styled';
import { ContentContainer } from './ContentContainer';

type PanelLabelProps = {
  children: React.ReactNode;
  addition?: React.ReactNode;
  border?: boolean;
};

export const Container = styled.div<{ $border: boolean }>`
  ${({ $border, theme }) =>
    $border ? `border-bottom: solid 1px ${theme.palette.divider};` : ''}

  padding: 20px 10px 4px;
`;

export const InnerContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
export const Title = styled.div`
  font-weight: bold;
  color: ${({ theme }) => theme.palette.secondary.main};
`;
export const Addition = styled.div`
  color: ${({ theme }) => theme.palette.secondary.main};
`;

export const PanelLabel = ({
  children,
  addition,
  border = true,
}: PanelLabelProps) => (
  <Container $border={border}>
    <ContentContainer>
      <InnerContainer>
        <Title>{children}</Title>
        <Addition>{addition}</Addition>
      </InnerContainer>
    </ContentContainer>
  </Container>
);
