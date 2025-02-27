import React from 'react';
import Language from '@mui/icons-material/Language';

const protocol = /^\w+:\/\//;
const fixHttp = (url: string) => (url.match(protocol) ? url : `http://${url}`);
const displayForm = (url: string) =>
  decodeURI(url.replace(protocol, '').replace(/([^/]+)\/$/, '$1'));

export const WebsiteRenderer = ({ v }) => (
  <>
    <Language fontSize="small" />
    <a href={fixHttp(v)} target="_blank">
      {displayForm(v)}
    </a>
  </>
);
