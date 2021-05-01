import React, { Fragment } from 'react';

export const nl2br = (text) =>
  text.split('\n').map((line, idx) => (
    // eslint-disable-next-line react/no-array-index-key
    <Fragment key={idx}>
      {idx > 0 && <br />}
      {line}
    </Fragment>
  ));
