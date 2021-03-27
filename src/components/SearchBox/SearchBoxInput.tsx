import styled from 'styled-components';
import Paper from '@material-ui/core/Paper';
import SearchIcon from '@material-ui/icons/Search';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import React from 'react';
import InputBase from '@material-ui/core/InputBase';

const StyledPaper = styled(Paper)`
  padding: 2px 4px;
  display: flex;
  align-items: center;
`;

const SearchIconButton = styled(IconButton)`
  svg {
    transform: scaleX(-1);
    filter: FlipH;
    -ms-filter: 'FlipH';
  }
`;

const SearchInput = styled(InputBase)`
  flex: 1;
`;

const ClosePanelButton = ({ setFeature, setInputValue }) => (
  <IconButton
    aria-label="Zavřít panel"
    onClick={(e) => {
      e.preventDefault();
      setFeature(null);
      setInputValue('');
    }}
  >
    <CloseIcon />
  </IconButton>
);

export const SearchBoxInput = ({
  params,
  setInputValue,
  feature,
  setFeature,
}) => {
  const { InputLabelProps, InputProps, ...restParams } = params; // TODO passing all props causes warning... (why?)

  const onChange = (e) => setInputValue(e.target.value);
  const onFocus = (e) => e.target.select();

  return (
    <StyledPaper elevation={1} ref={params.InputProps.ref}>
      <SearchIconButton disabled>
        <SearchIcon />
      </SearchIconButton>
      <SearchInput
        placeholder="Prohledat OpenStreetMap"
        {...restParams} // eslint-disable-line react/jsx-props-no-spreading
        onChange={onChange}
        onFocus={onFocus}
        // autoFocus={false} // TODO it still focuses on feature close
      />
      {feature && (
        <ClosePanelButton
          setFeature={setFeature}
          setInputValue={setInputValue}
        />
      )}
    </StyledPaper>
  );
};
