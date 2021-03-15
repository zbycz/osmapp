import React from 'react';
import LocalPhone from '@material-ui/icons/LocalPhone';

export const WebsiteRenderer = ({ v }) => (
  <>
    <LocalPhone fontSize="small" />

    <a href={`tel:${v}`}>{v}</a>
  </>
);

export default WebsiteRenderer;
