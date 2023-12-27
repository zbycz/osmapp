import { Position, PositionPx } from '../types';

export type CountPositionEntity = 'editorPosition' | 'scrollOffset';

export const positionUtilsFactory = ({
  editorPosition,
  scrollOffset,
  imageSize,
}) => {
  const getPixelPosition = ({ x, y }: Position): PositionPx => ({
    x: imageSize.width * x,
    y: imageSize.height * y,
    units: 'px',
  });

  const getPercentagePosition = ({ x, y }: PositionPx): Position => ({
    x: x / imageSize.width,
    y: y / imageSize.height,
    units: 'percentage',
  });

  const addOffsets = (
    offsets: Array<CountPositionEntity>,
    position: PositionPx | null,
  ): PositionPx => {
    if (!position) return null;

    return offsets.reduce((acc, offset) => {
      if (offset === 'editorPosition') {
        return {
          x: acc.x - editorPosition.x,
          y: acc.y - editorPosition.y,
          units: 'px',
        };
      }
      return {
        x: scrollOffset.x + acc.x,
        y: scrollOffset.y + acc.y,
        units: 'px',
      };
    }, position);
  };

  return {
    getPixelPosition,
    getPercentagePosition,
    addOffsets,
  };
};
