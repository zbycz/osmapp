// @flow

import React, { useState } from 'react';

const protocol = /^\w+:\/\//;
const fixHttp = url => (url.match(protocol) ? url : `http://${url}`);
const displayForm = url =>
  url.replace(protocol, '').replace(/([^\/]+)\/$/, '$1');

export const WebsiteRenderer = ({ v }) => (
  <a href={fixHttp(v)}>{displayForm(v)}</a>
);

export default WebsiteRenderer;
