import IconButton from '@material-ui/core/IconButton';
import Router from 'next/router';
import CloseIcon from '@material-ui/icons/Close';
import React from 'react';
import { t } from '../../services/intl';
import { useMapStateContext } from '../utils/MapStateContext';

export const ClosePanelButton = ({ setInputValue }) => {
  const { view } = useMapStateContext();
  return (
    <IconButton
      aria-label={t('searchbox.close_panel')}
      onClick={(e) => {
        e.preventDefault();
        setInputValue('');
        Router.push(`/#${view.join('/')}`);
      }}
    >
      <CloseIcon />
    </IconButton>
  );
};
