import { useClimbingContext } from '../contexts/ClimbingContext';
import React from 'react';
import { LineType } from '../types';
import { Button } from '@mui/material';
import { t } from '../../../../services/intl';
import { Setter } from '../../../../types';

type ButtonDef = {
  previousLineType: LineType;
  message: string;
};

const lineTypes: Array<ButtonDef> = [
  {
    previousLineType: 'solid',
    message: t('climbingpanel.climbing_line_solid'),
  },
  {
    previousLineType: 'dotted',
    message: t('climbingpanel.climbing_line_dotted'),
  },
];

type Props = {
  setShowLineTypeMenu: Setter<boolean>;
};

export const LineTypeButtons = ({ setShowLineTypeMenu }: Props) => {
  const { machine } = useClimbingContext();

  const onLineTypeChange = (previousLineType: LineType | 'none') => {
    machine.execute('changeLineType', {
      previousLineType: previousLineType === 'solid' ? null : previousLineType,
    });
    setShowLineTypeMenu(false);
  };

  return (
    <>
      {lineTypes.map(({ message, previousLineType }) => (
        <Button
          key={previousLineType}
          onClick={() => onLineTypeChange(previousLineType)}
        >
          {message}
        </Button>
      ))}
    </>
  );
};
