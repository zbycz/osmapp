import React from 'react';

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
  const divStyle: React.CSSProperties = {
    backgroundColor: color,
    paddingBlock: '0.2rem',
    paddingInline: '0.4rem',
    borderRadius: '0.125rem',
    display: 'inline',
    color: whiteOrBlackText(color),
  };

  return <div style={divStyle}>{name}</div>;
};
