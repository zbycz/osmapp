import React from 'react';
import { TransformWrapper as Wrapper } from 'react-zoom-pan-pinch';
import { useClimbingContext } from './contexts/ClimbingContext';
import { ZoomState } from './types';

export const TransformWrapper = ({ children }) => {
  const {
    setArePointerEventsDisabled,
    setPhotoZoom,
    isEditMode,
    isPanningDisabled,
  } = useClimbingContext();

  const startPointerEvents = () => {
    setArePointerEventsDisabled(false);
  };
  const stopPointerEvents = () => {
    setArePointerEventsDisabled(true);
  };

  return (
    <Wrapper
      doubleClick={{
        disabled: isEditMode,
        mode: 'toggle',
        step: 1,
        animationTime: 150,
      }}
      onWheelStart={stopPointerEvents}
      onWheelStop={startPointerEvents}
      onPinchingStart={stopPointerEvents}
      onPinchingStop={startPointerEvents}
      onZoomStart={stopPointerEvents}
      onZoomStop={startPointerEvents}
      onPanningStart={startPointerEvents}
      onPanningStop={startPointerEvents}
      disablePadding
      panning={{ disabled: isPanningDisabled }}
      wheel={{ step: 100 }}
      centerOnInit
      onTransformed={(_ref, state: ZoomState) => {
        setPhotoZoom(state);
      }}
    >
      {children}
    </Wrapper>
  );
};
