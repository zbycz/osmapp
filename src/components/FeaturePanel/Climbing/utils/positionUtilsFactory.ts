import { Position, PositionPx } from '../types';
import { roundNumber } from './number';

export const positionUtilsFactory = ({
  editorPosition,
  imageSize,
  photoZoom,
}) => {
  const getPixelPosition = ({ x, y }: Position): PositionPx => ({
    x: imageSize.width * x,
    y: imageSize.height * y,
    units: 'px',
  });

  const getPercentagePosition = ({ x, y }: PositionPx): Position => ({
    x: roundNumber(x / imageSize.width),
    y: roundNumber(y / imageSize.height),
    units: 'percentage',
  });

  const addZoom = (position: PositionPx | null): PositionPx => {
    const transformedEditorPosition = {
      x: editorPosition.x + photoZoom.positionX || 0,
      y: editorPosition.y + photoZoom.positionY || 0,
    };
    const relativeNewPosition = {
      x: (position.x - editorPosition.x) * imageSize.scale || 1,
      y: (position.y - editorPosition.y) * imageSize.scale || 1,
    };

    const newPosition = {
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
