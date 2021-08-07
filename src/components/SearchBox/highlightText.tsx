import React from 'react';
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';

export const highlightText = (resultText, inputValue) => {
  const parts = parse(resultText, match(resultText, inputValue));
  const map = parts.map((part, index) => (
    // eslint-disable-next-line react/no-array-index-key
    <span key={index} style={{ fontWeight: part.highlight ? 700 : 400 }}>
      {part.text}
    </span>
  ));
  return map;
};
