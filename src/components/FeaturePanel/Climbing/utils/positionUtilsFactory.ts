import { Position, PositionPx } from '../types';
import { roundNumber } from './number';

export const positionUtilsFactory = ({
  editorPosition,
  imageSize,
  photoZoom,
}) => {
  const getPixelPosition = ({ x, y, ...rest }: Position): PositionPx => ({
    ...rest,
    x: imageSize.width * x,
    y: imageSize.height * y,
    units: 'px',
  });

  const getPercentagePosition = ({ x, y, ...rest }: PositionPx): Position => ({
    ...rest,
    x: roundNumber(x / imageSize.width),
    y: roundNumber(y / imageSize.height),
    units: 'percentage',
  });

  const addZoom = ({ x, y, ...rest }: PositionPx | null): PositionPx => {
    const transformedEditorPosition = {
      x: editorPosition.x + photoZoom.positionX || 0,
      y: editorPosition.y + photoZoom.positionY || 0,
    };
    const relativeNewPosition = {
      x: (x - editorPosition.x) * imageSize.scale || 1,
      y: (y - editorPosition.y) * imageSize.scale || 1,
    };

    const newPosition = {
      ...rest,
      x: transformedEditorPosition.x + relativeNewPosition.x,
      y: transformedEditorPosition.y + relativeNewPosition.y,
      units: 'px' as const,
    };
    return newPosition;
  };

  return {
    getPixelPosition,
    getPercentagePosition,
    addZoom,
  };
};
