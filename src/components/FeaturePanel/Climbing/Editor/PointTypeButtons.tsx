import { useClimbingContext } from '../contexts/ClimbingContext';
import React from 'react';
import { PointType } from '../types';
import { Button } from '@mui/material';
import { t } from '../../../../services/intl';
import { Setter } from '../../../../types';

type ButtonDef = {
  type: PointType;
  message: string;
  shortcut: string;
};

const pointTypes: Array<ButtonDef> = [
  {
    type: 'bolt',
    message: t('climbingpanel.climbing_point_bolt'),
    shortcut: 'b',
  },
  {
    type: 'anchor',
    message: t('climbingpanel.climbing_point_anchor'),
    shortcut: 'a',
  },
  {
    type: 'sling',
    message: t('climbingpanel.climbing_point_sling'),
    shortcut: 's',
  },
  {
    type: 'piton',
    message: t('climbingpanel.climbing_point_piton'),
    shortcut: 'p',
  },
  {
    type: 'unfinished',
    message: t('climbingpanel.climbing_point_unfinished'),
    shortcut: 'u',
  },
];

const addShortcutUnderline = (message: string, shortcut: string) => {
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

type Props = {
  setShowRouteMarksMenu: Setter<boolean>;
};

export const PointTypeButtons = ({ setShowRouteMarksMenu }: Props) => {
  const { getMachine } = useClimbingContext();
  const machine = getMachine();

  const onPointTypeChange = (type: PointType) => {
    machine.execute('changePointType', { type });
    setShowRouteMarksMenu(false);
  };

  return (
    <>
      {pointTypes.map(({ message, type, shortcut }) => (
        <Button key={type} onClick={() => onPointTypeChange(type)}>
          {addShortcutUnderline(message, shortcut)}
        </Button>
      ))}
    </>
  );
};
