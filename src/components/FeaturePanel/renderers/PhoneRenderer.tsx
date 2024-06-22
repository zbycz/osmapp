import React from 'react';
import LocalPhone from '@mui/icons-material/LocalPhone';

export const WebsiteRenderer = ({ v }) => (
  <>
    <LocalPhone fontSize="small" />
    <span>
      {v.split(';').map((number, index) => (
        // eslint-disable-next-line react/no-array-index-key
        <React.Fragment key={`${index}${number}`}>
          {index === 0 ? '' : ', '}
          <a href={`tel:${number}`}>{number}</a>
        </React.Fragment>
      ))}
    </span>
  </>
);

export default WebsiteRenderer;
