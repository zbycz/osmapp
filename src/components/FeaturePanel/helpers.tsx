import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import React from 'react';
import styled from 'styled-components';
import IconButton from '@material-ui/core/IconButton';

const urlRegExp = /^https?:\/\/.+/;

export const getUrlForTag = (k, v) => {
  if (k.match(/^:?wikipedia$/)) {
    if (v.match(/:/)) {
      const [lang, article] = v.split(':');
      return `https://${lang}.wikipedia.org/wiki/${article}`;
    }
    return `https://wikipedia.org/wiki/${v}`;
  }
  if (k.match(/^wikipedia:/) || k.match(/:wikipedia/)) {
    const lang = k.split(':').pop();
    return `https://${lang}.wikipedia.org/wiki/${v}`;
  }
  if (k.match(/^wikidata$/) || k.match(/:wikidata$/)) {
    return `https://www.wikidata.org/wiki/${v}`;
  }
  if (k.match(/^wikimedia_commons$/)) {
    return `https://commons.wikimedia.org/wiki/${v}`;
  }
  if (k === 'image' && v.match(/^File:/)) {
    return `https://commons.wikimedia.org/wiki/${v}`;
  }
  if (k === 'ref:npu') {
    const id = encodeURIComponent(v);
    return `https://pamatkovykatalog.cz/uskp/podle-relevance/1/seznam/?h=${id}&chranenoTed=1&hlObj=1&fulltext`;
  }
  if (k === 'fhrs:id') {
    return `https://ratings.food.gov.uk/business/en-GB/${v}`;
  }
  if (k === 'ref:edubase') {
    return `https://get-information-schools.service.gov.uk/Establishments/Establishment/Details/${v}`;
  }
  if (k === 'website') {
    return v.match(urlRegExp) ? v : `http://${v}`;
  }
  if (v.match(urlRegExp)) {
    return v;
  }

  return null;
};

const StyledToggleButton = styled(IconButton)`
  position: absolute !important;
  margin: -11px 0 0 0 !important;
`;
export const ToggleButton = ({ onClick, isShown }) => (
  <StyledToggleButton onClick={onClick} aria-label="Toggle">
    {!isShown && <ExpandMoreIcon fontSize="small" />}
    {isShown && <ExpandLessIcon fontSize="small" />}
  </StyledToggleButton>
);
