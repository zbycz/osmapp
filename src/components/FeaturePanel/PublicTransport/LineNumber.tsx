import React from 'react';
import { useUserThemeContext } from '../../../helpers/theme';
import styled from '@emotion/styled';

/**
 * A function to map a color name to hex. When a color is not found, it is returned as is, the same goes for hex colors.
 * @param color The color to map to hex
 * @returns The color in hex format, e.g. #ff0000
 */
function mapColorToHex(color: string) {
  switch (color.toLowerCase()) {
    case 'black':
      return '#000000';
    case 'gray':
    case 'grey':
      return '#808080';
    case 'maroon':
      return '#800000';
    case 'olive':
      return '#808000';
    case 'green':
      return '#008000';
    case 'teal':
      return '#008080';
    case 'navy':
      return '#000080';
    case 'purple':
      return '#800080';
    case 'white':
      return '#ffffff';
    case 'silver':
      return '#c0c0c0';
    case 'red':
      return '#ff0000';
    case 'yellow':
      return '#ffff00';
    case 'lime':
      return '#00ff00';
    case 'aqua':
    case 'cyan':
      return '#00ffff';
    case 'blue':
      return '#0000ff';
    case 'fuchsia':
    case 'magenta':
      return '#ff00ff';
    default:
      return color;
  }
}
/**
 * A function to determine whether the text color should be black or white
 * @param hexBgColor The background color in hex format, e.g. #ff0000
 * @returns 'black' or 'white' depending on the brightness of the background color
 */
function whiteOrBlackText(hexBgColor: string) {
  const r = parseInt(hexBgColor.slice(1, 3), 16);
  const g = parseInt(hexBgColor.slice(3, 5), 16);
  const b = parseInt(hexBgColor.slice(5, 7), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 125 ? 'black' : 'white';
}

const getBgColor = (color: string | undefined, darkmode: boolean) => {
  if (color) return mapColorToHex(color);

  return darkmode ? '#898989' : '#dddddd';
};

const LineNumberWrapper = styled.a<{
  color: string | undefined;
  darkmode: boolean;
}>`
  background-color: ${({ color, darkmode }) => getBgColor(color, darkmode)};
  color: ${({ color, darkmode }) =>
    whiteOrBlackText(getBgColor(color, darkmode))};
  padding: 0.2rem 0.4rem;
  borderradius: 0.125rem;
  display: inline;
`;

interface LineNumberProps {
  name: string;
  color: string;
  osmType: string;
  osmId: string | number;
}

export const LineNumber: React.FC<LineNumberProps> = ({
  name,
  color,
  osmType,
  osmId,
}) => {
  const { currentTheme } = useUserThemeContext();
  const darkmode = currentTheme === 'dark';

  return (
    <LineNumberWrapper
      href={`/${osmType}/${osmId}`}
      color={color}
      darkmode={darkmode}
    >
      {name}
    </LineNumberWrapper>
  );
};
