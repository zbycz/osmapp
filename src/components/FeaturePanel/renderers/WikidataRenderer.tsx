import React from 'react';
import { renderValue } from '../helpers/renderValue';
import { WikipediaIcon } from '../../../assets/WikipediaIcon';

export const WikidataRenderer = ({ k, v }) => (
  <>
    <WikipediaIcon width={20} height={20} />
    {renderValue(k, v)}
  </>
);
