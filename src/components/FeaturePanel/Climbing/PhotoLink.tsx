import React from 'react';
import styled from 'styled-components';

type Props = {
  children: string | number;
  isCurrentPhoto: boolean;
  onClick: (e: any) => void;
};

const Container = styled.div<{ isCurrentPhoto: boolean }>`
  display: block;
  background: ${({ isCurrentPhoto, theme }) =>
    isCurrentPhoto ? theme.backgroundNeutralSubdued : 'transparent'};
  color: ${({ isCurrentPhoto, theme }) =>
    isCurrentPhoto ? theme.textDefault : theme.textSubdued};
  border-radius: 6px;
  padding: 2px 8px;
  font-size: 12px;
  cursor: pointer;
`;

export const PhotoLink = ({ children, isCurrentPhoto, onClick }: Props) => (
  <Container isCurrentPhoto={isCurrentPhoto} onClick={onClick}>
    {children}
  </Container>
);
