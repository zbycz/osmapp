import React from 'react';
import { useUserThemeContext } from '../../../helpers/theme';

interface LineNumberProps {
  name: string;
  color: string;
}

/**
 * A function to determine whether the text color should be black or white
 * @param hexBgColor The background color in hex format, e.g. #ff0000
 * @returns 'black' or 'white' depending on the brightness of the background color
 */
function whiteOrBlackText(hexBgColor) {
  const r = parseInt(hexBgColor.slice(1, 3), 16);
  const g = parseInt(hexBgColor.slice(3, 5), 16);
  const b = parseInt(hexBgColor.slice(5, 7), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 125 ? 'black' : 'white';
}

export const LineNumber: React.FC<LineNumberProps> = ({ name, color }) => {
  const { currentTheme } = useUserThemeContext();
  const darkmode = currentTheme === 'dark';

  let bgcolor: string;
  if (!color) bgcolor = darkmode ? '#898989' : '#dddddd';
  // set the default color
  else bgcolor = color.toLowerCase();

  const divStyle: React.CSSProperties = {
    backgroundColor: bgcolor,
    paddingBlock: '0.2rem',
    paddingInline: '0.4rem',
    borderRadius: '0.125rem',
    display: 'inline',
    color: whiteOrBlackText(bgcolor),
  };

  return <div style={divStyle}>{name}</div>;
};
