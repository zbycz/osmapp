import React from 'react';
import Language from '@mui/icons-material/Language';
import { displayForm, protocol } from './helpers';
import { PROJECT_ID } from '../../../services/project';

const fixHttp = (url: string) => (url.match(protocol) ? url : `http://${url}`);

export const WebsiteRenderer = ({ v }) => {
  const isOpenClimbing = PROJECT_ID === 'openclimbing';

  if (isOpenClimbing && v.startsWith('https://openclimbing.org/')) {
    return null;
  }

  return (
    <>
      <Language fontSize="small" />
      <a href={fixHttp(v)} target="_blank">
        {displayForm(v)}
      </a>
    </>
  );
};
