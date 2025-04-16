import React from 'react';
import { renderTag } from '../Properties/renderTag';
import { WikipediaIcon } from '../../../assets/WikipediaIcon';

export const WikidataRenderer = ({ k, v }) => (
  <>
    <WikipediaIcon width={20} height={20} />
    {renderTag(k, v, true)}
  </>
);
