import { PROJECT_ID, PROJECT_NAME } from '../services/project';
import React from 'react';

export const OpenSearch = () => {
  if (PROJECT_ID === 'osmapp') {
    return (
      <link
        rel="search"
        type="application/opensearchdescription+xml"
        title={PROJECT_NAME}
        href="/osmapp/opensearch.xml"
      />
    );
  }
  return null;
};
