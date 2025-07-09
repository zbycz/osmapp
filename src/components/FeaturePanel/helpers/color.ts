/**
 * A function to map a color name to hex.
 * @param color The color to map to hex
 * @returns The color in hex format, e.g. #ff0000
 */
export function osmColorToHex(color: string) {
  if (/^#[0-9A-Fa-f]{6}$/.test(color)) {
    return color.toLowerCase();
  }

  const ctx = document?.createElement('canvas').getContext('2d');
  if (!ctx) {
    return color.toLowerCase();
  }

  ctx.fillStyle = color;
  return ctx.fillStyle;
}

/**
 * A function to determine whether the text color should be black or white
 * @param hexBgColor The background color in hex format, e.g. #ff0000
 * @returns 'black' or 'white' depending on the brightness of the background color
 */
export function whiteOrBlackText(hexBgColor: string) {
  const r = parseInt(hexBgColor.slice(1, 3), 16);
  const g = parseInt(hexBgColor.slice(3, 5), 16);
  const b = parseInt(hexBgColor.slice(5, 7), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 125 ? 'black' : 'white';
}
