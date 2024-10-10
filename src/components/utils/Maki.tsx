import React from 'react';
import styled from '@emotion/styled';
import { icons } from '../../assets/icons';
import { useUserThemeContext } from '../../helpers/theme';

const MakiImg = styled.img<{ $invert: boolean }>`
  line-height: 14px;
  margin-right: 6px;
  user-select: none;
  ${({ $invert }) => $invert && 'filter: invert(100%);'}
`;

type MakiProps = {
  ico: string;
  invert?: boolean;
  title?: string | undefined;
  style?: React.CSSProperties | undefined;
  size?: number;
  middle?: boolean | undefined;
  themed?: boolean;
};

const Maki = ({
  ico,
  invert = false,
  title = undefined,
  style = undefined,
  size = 11,
  middle = undefined,
  themed = false,
}: MakiProps) => {
  const { currentTheme } = useUserThemeContext();
  const invertFinal = themed ? currentTheme === 'dark' : invert;

  const icon = icons.includes(ico) ? ico : 'information';
  // console.log(icon, ' was: ',ico)
  return (
    <MakiImg
      src={`/icons/${icon}_11.svg`}
      alt={ico}
      title={title ?? ico}
      $invert={invertFinal}
      style={{ ...style, verticalAlign: middle ? 'middle' : undefined }}
      width={size}
      height={size}
    />
  );
};

export default Maki;
