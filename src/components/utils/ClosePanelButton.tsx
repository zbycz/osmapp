// import IconButton from '@material-ui/core/IconButton';
// import CloseIcon from '@material-ui/icons/Close';
import React from 'react';
import { t } from '../../services/intl';

export const ClosePanelButton = ({ onClick, right = false }) => (
  <div 
    onClick={onClick} 
    className={`flex items-center justify-center w-8 h-8 hover:bg-zinc-600/50 transition-all rounded-md ${right ? '' : ''}`}
    aria-label={t('close_panel')}
  >
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
      <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z" clipRule="evenodd" />
    </svg>

  {/* <IconButton
      aria-label={t('close_panel')}
      onClick={onClick}
      style={{
        ...(right ? { position: 'absolute', right: 0 } : {}),
        ...style,
      }}
    >
    <CloseIcon />
  </IconButton> */}
  </div>

);
