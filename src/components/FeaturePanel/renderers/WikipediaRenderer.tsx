import React from 'react';
import { WikipediaIcon } from '../../../assets/WikipediaIcon';
import { renderTag } from '../Properties/renderTag';

export const WikipediaRenderer = ({ k, v }) => (
  <>
    <WikipediaIcon width={20} height={20} />
    {renderTag(k, v)}
  </>
);
