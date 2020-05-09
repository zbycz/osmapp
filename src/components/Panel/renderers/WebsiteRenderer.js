// @flow

import React, { useState } from 'react';
import Language from '@material-ui/icons/Language';

const protocol = /^\w+:\/\//;
const fixHttp = url => (url.match(protocol) ? url : `http://${url}`);
const displayForm = url =>
  url.replace(protocol, '').replace(/([^\/]+)\/$/, '$1');

export const WebsiteRenderer = ({ v }) => (
         <>
           <Language fontSize="small" />
           <a href={fixHttp(v)}>{displayForm(v)}</a>
         </>
       );

export default WebsiteRenderer;
