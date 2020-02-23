// @flow

import React, { useState } from 'react';
import LocalPhone from '@material-ui/icons/LocalPhone';

export const WebsiteRenderer = ({ v }) => (
  <>
    <LocalPhone />

    <a href={`tel:${v}`}>{v}</a>
  </>
);

export default WebsiteRenderer;
