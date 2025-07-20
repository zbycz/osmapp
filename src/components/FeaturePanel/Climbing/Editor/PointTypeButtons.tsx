import { useClimbingContext } from '../contexts/ClimbingContext';
import React from 'react';
import { PointType } from '../types';
import { Button } from '@mui/material';
import { t } from '../../../../services/intl';
import { Setter } from '../../../../types';
import { addShortcutUnderline } from './utils';

type ButtonDef = {
  type: PointType | 'none';
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
  {
    type: 'none',
    message: t('climbingpanel.climbing_point_none'),
    shortcut: 'n',
  },
];

type Props = {
  setShowRouteMarksMenu: Setter<boolean>;
};

export const PointTypeButtons = ({ setShowRouteMarksMenu }: Props) => {
  const { getMachine } = useClimbingContext();
  const machine = getMachine();

  const onPointTypeChange = (type: PointType | 'none') => {
    machine.execute('changePointType', { type: type === 'none' ? null : type });
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
