import React from 'react';
import { useClimbingContext } from '../contexts/ClimbingContext';

export const addShortcutUnderline = (message: string, shortcut: string) => {
  const shortcutUp = shortcut.toUpperCase();
  const messageUp = message.toUpperCase();

  if (messageUp.includes(shortcutUp)) {
    const position = messageUp.indexOf(shortcutUp);
    return (
      <>
        {message.substring(0, position)}
        <u>{shortcut}</u>
        {message.substring(position + 1)}
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
