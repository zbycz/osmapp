import React from 'react';
import styled from '@emotion/styled';
import { iconsLookup } from './iconsLookup';
import { useUserThemeContext } from '../../../helpers/theme';

const MakiImg = styled.img<{ $invert: boolean; $withMarginRight?: boolean }>`
  line-height: 14px;

  user-select: none;
  ${({ $invert }) => $invert && 'filter: invert(100%);'}
  ${({ $withMarginRight }) => $withMarginRight && 'margin-right: 6px;'}
`;

type MakiProps = {
  ico: string;
  invert?: boolean;
  title?: string | undefined;
  style?: React.CSSProperties | undefined;
  size?: number;
  middle?: boolean | undefined;
  themed?: boolean;
  withMarginRight?: boolean;
};

export const Maki = ({
  ico,
  invert = false,
  title = undefined,
  style = undefined,
  size = 12,
  middle = undefined,
  themed = false,
  withMarginRight = true,
}: MakiProps) => {
  const { currentTheme } = useUserThemeContext();
  const invertFinal = themed ? currentTheme === 'dark' : invert;

  const icon = iconsLookup.includes(ico) ? ico : 'information';

  return (
    <MakiImg
      src={`/icons/${icon}_11.svg`}
      alt={ico}
      title={title ?? ico}
      $invert={invertFinal}
      style={{ ...style, verticalAlign: middle ? 'middle' : undefined }}
      width={size}
      height={size}
      $withMarginRight={withMarginRight}
    />
  );
};
