import React from 'react';
import styled from '@emotion/styled';
import { Stop } from './Stop';
import { useFeatureContext } from '../../../utils/FeatureContext';
import { useUserThemeContext } from '../../../../helpers/theme';
import { getBgColor } from '../routes/LineNumber';

const StationsListWrapper = styled.ul`
  list-style-type: none;
  padding: 0 0.5rem;
  display: flex;
  flex-direction: column;
`;

export const StationsList: React.FC = ({ children }) => {
  return <StationsListWrapper>{children}</StationsListWrapper>;
};

type ItemProps = {
  isFirst?: boolean;
  isLast?: boolean;
  showCircle?: boolean;
};

export const StationItem: React.FC<ItemProps> = ({
  children,
  isFirst = false,
  isLast = false,
  showCircle = true,
}) => {
  const { feature } = useFeatureContext();
  const { currentTheme } = useUserThemeContext();
  const color = getBgColor(feature.tags.colour, currentTheme === 'dark');
  return (
    <li
      style={{
        display: 'flex',
        gap: '0.5rem',
      }}
    >
      <Stop
        color={color}
        isFirst={isFirst}
        isLast={isLast}
        showCircle={showCircle}
      />
      <div
        style={{
          padding: '0.5rem 0',
        }}
      >
        {children}
      </div>
    </li>
  );
};
