import { Position, PositionPx } from '../types';
import { roundNumber } from './number';

export type CountPositionEntity = 'editorPosition' | 'scrollOffset';

export const positionUtilsFactory = ({
  editorPosition,
  scrollOffset,
  imageSize,
  imageZoom,
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
  const addZoom = (position: PositionPx | null): PositionPx => {
    // editorPosition,position,imageZoom
    const transformedEditorPosition = {
      x: editorPosition.x + imageZoom.positionX || 0,
      y: editorPosition.y + imageZoom.positionY || 0,
    };
    console.log('___1', transformedEditorPosition);
    const relativeNewPosition = {
      x: (position.x - editorPosition.x) * imageSize.scale || 1,
      y: (position.y - editorPosition.y) * imageSize.scale || 1,
    };
    console.log(
      '___2',
      relativeNewPosition,
      position.x,
      editorPosition.x,
      imageSize.scale,
    );
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
    addOffsets,
    addZoom,
  };
};
