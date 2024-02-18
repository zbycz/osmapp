import React from 'react';

export const PublicTransportWrapper = ({ children }) => {
  const divStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'start',
    justifyContent: 'start',
    gap: '0.5rem',
    flexWrap: 'wrap',
  };

  return <div style={divStyle}>{children}</div>;
};
