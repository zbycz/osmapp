import React from 'react';
import styled from '@emotion/styled';
import { Halt, HaltSection } from './Halt';
import { useFeatureContext } from '../../../utils/FeatureContext';
import { useUserThemeContext } from '../../../../helpers/theme';
import { getBgColor } from '../routes/LineNumber';
import { Feature } from '../../../../services/types';
import Link from 'next/link';

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
  stop: Feature;
  isFirst: boolean;
  isLast: boolean;
};

export const StationItem = ({ stop, isFirst, isLast }: ItemProps) => {
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
      <Halt color={color} isFirst={isFirst} isLast={isLast} />
      <div
        style={{
          padding: '0.5rem 0',
        }}
      >
        <Link href={`${stop.osmMeta.type}/${stop.osmMeta.id}`}>
          {stop.tags.name}
        </Link>
      </div>
    </li>
  );
};
