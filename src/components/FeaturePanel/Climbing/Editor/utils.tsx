import React from 'react';

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
