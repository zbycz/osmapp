import React from 'react';
import styled from 'styled-components';

type Props = {
  children: string;
  isCurrentPhoto: boolean;
  onClick: () => void;
};

const Container = styled.div<{ isCurrentPhoto: boolean }>`
  display: block;
  background: ${({ isCurrentPhoto, theme }) =>
    isCurrentPhoto ? theme.backgroundNeutralSubdued : 'transparent'};
  color: ${({ isCurrentPhoto, theme }) =>
    isCurrentPhoto ? theme.textDefault : theme.textSubdued};
  border-radius: 6px;
  padding: 1px 4px;
  font-size: 12px;
  cursor: pointer;
`;

export const PhotoLink = ({ children, isCurrentPhoto, onClick }: Props) => (
  <Container isCurrentPhoto={isCurrentPhoto} onClick={onClick}>
    {children.split('/').pop()}
  </Container>
);
