import React from 'react';
import Language from '@mui/icons-material/Language';
import { displayForm, protocol } from './helpers';

const fixHttp = (url: string) => (url.match(protocol) ? url : `http://${url}`);

export const WebsiteRenderer = ({ v }) => (
  <>
    <Language fontSize="small" />
    <a href={fixHttp(v)} target="_blank">
      {displayForm(v)}
    </a>
  </>
);
