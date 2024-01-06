import styled from 'styled-components';

export const PhotoLink = styled.div<{ isCurrentPhoto: boolean }>`
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
