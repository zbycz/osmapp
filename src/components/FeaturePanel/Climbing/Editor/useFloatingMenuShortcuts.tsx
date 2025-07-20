import { PointType } from '../types';
import React from 'react';

export const useFloatingMenuShortcuts = (
  onPointTypeChange: (type: PointType) => void,
  onContinueClimbingRouteClick: () => void,
  isUndoVisible: boolean,
  handleUndo: (e) => void,
  isDoneVisible: boolean,
  onFinishClimbingRouteClick: () => void,
) => {
  React.useEffect(() => {
    const downHandler = (e) => {
      if (e.key === 'b') {
        onPointTypeChange('bolt');
      }
      if (e.key === 'a') {
        onPointTypeChange('anchor');
      }
      if (e.key === 's') {
        onPointTypeChange('sling');
      }
      if (e.key === 'p') {
        onPointTypeChange('piton');
      }
      if (e.key === 'u') {
        onPointTypeChange('unfinished');
      }
      if (e.key === 'n') {
        onPointTypeChange(null);
      }
      if (e.key === 'e') {
        onContinueClimbingRouteClick();
      }
      if (isUndoVisible && e.key === 'z' && e.metaKey) {
        handleUndo(e);
      }
      if (isDoneVisible && (e.key === 'Enter' || e.key === 'Escape')) {
        onFinishClimbingRouteClick();
      }
    };

    window.addEventListener('keydown', downHandler);

    return () => {
      window.removeEventListener('keydown', downHandler);
    };
  }, [
    handleUndo,
    isDoneVisible,
    isUndoVisible,
    onContinueClimbingRouteClick,
    onFinishClimbingRouteClick,
    onPointTypeChange,
  ]);
};
