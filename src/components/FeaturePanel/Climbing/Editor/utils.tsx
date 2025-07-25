import React from 'react';
import { useClimbingContext } from '../contexts/ClimbingContext';

export const addShortcutUnderline = (message: string, shortcut: string) => {
  const firstLetter = message.substring(0, 1);
  const rest = message.substring(1);

  if (firstLetter.toUpperCase() === shortcut.toUpperCase()) {
    return (
      <>
        <u>{shortcut}</u>
        {rest}
      </>
    );
  }

  return message;
};

export const usePointClickHandler = (index: number) => {
  const {
    pointElement,
    isPointMoving,
    setPointElement,
    setPointSelectedIndex,
    setIsPointMoving,
    setIsPointClicked,
    pointSelectedIndex,
    getMachine,
    getCurrentPath,
  } = useClimbingContext();
  const machine = getMachine();
  const path = getCurrentPath();

  return (e: any) => {
    if (isPointMoving) {
      return;
    }

    machine.execute('showPointMenu');
    const isDoubleClick = e.detail === 2;
    const lastPointIndex = path.length - 1;
    if (isDoubleClick && pointSelectedIndex === lastPointIndex) {
      machine.execute('finishRoute');
    }

    setPointElement(pointElement !== null ? null : e.currentTarget);
    setPointSelectedIndex(index);
    setIsPointMoving(false);
    setIsPointClicked(false);
    e.stopPropagation();
    e.preventDefault();
  };
};
