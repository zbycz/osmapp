import React from 'react';
import LocalPhone from '@mui/icons-material/LocalPhone';

export const WebsiteRenderer = ({ v }) => (
  <>
    <LocalPhone fontSize="small" />
    <span>
      {v.split(';').map((v2, index) => (
        <>
          {index === 0 ? '' : ', '}
          <a href={`tel:${v2}`}>{v2}</a>
        </>
      ))}
    </span>
  </>
);

export default WebsiteRenderer;
