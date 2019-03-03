// @flow

import React, { useState } from 'react';
import styled from 'styled-components';
import Edit from '@material-ui/icons/Edit';
import Cancel from '@material-ui/icons/Cancel';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';

const Wrapper = styled.div`
  position: relative;
  margin: 15px 0 0 0;

  & .show-on-hover {
    display: none !important;
  }
  &:hover .show-on-hover {
    display: block !important;
  }
`;

const StyledIconButton = styled(IconButton)`
  position: absolute !important; /* TODO mui styles takes precendence, why? */
  right: 0;
  margin-top: -12px !important;
  z-index: 2;

  svg {
    width: 16px;
    height: 16px;
  }
`;

const Label = styled.div`
  font-size: 1rem;
  line-height: 1;
  color: rgba(0, 0, 0, 0.54);

  transform: translate(0, 1.5px) scale(0.75); /* to be exactly same as TextField Label */
  transform-origin: top left;
`;

const Value = styled.div`
  font-size: 1rem;
  line-height: 1.5;
  color: rgba(0, 0, 0, 0.87);
  padding: 4px 0;

  i {
    color: rgba(0, 0, 0, 0.54);
  }
`;

export const Property = ({ label, value }) => {
  const [isInput, setIsInput] = useState(false);

  return (
    <Wrapper>
      {!isInput && (
        <>
          <StyledIconButton
            mini="true"
            onClick={() => setIsInput(true)}
            className="show-on-hover"
          >
            <Edit
              titleAccess="Upravit v živé databázi OpenStreetMap"
              nativeColor="#9e9e9e"
            />
          </StyledIconButton>
          <Label>{label}</Label>
          <Value>{value || <i>-</i>}</Value>
        </>
      )}
      {isInput && (
        <>
          <StyledIconButton mini="true" onClick={() => setIsInput(false)}>
            <Cancel titleAccess="Zrušit" nativeColor="#9e9e9e" />
          </StyledIconButton>

          <TextField // https://codesandbox.io/s/m45ywmp86j
            label={label}
            placeholder=""
            margin="none"
            autoFocus
            fullWidth
            defaultValue={value}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </>
      )}
    </Wrapper>
  );
};

export default Property;
