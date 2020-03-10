// @flow

import React, { useState } from 'react';
import styled from 'styled-components';
import Edit from '@material-ui/icons/Edit';
import Cancel from '@material-ui/icons/Cancel';
import AccessTime from '@material-ui/icons/AccessTime';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';

import WebsiteRenderer from './renderers/WebsiteRenderer';
import OpeningHoursRenderer from './renderers/OpeningHoursRenderer';
import PhoneRenderer from './renderers/PhoneRenderer';
import LocalPhone from '@material-ui/icons/LocalPhone';
import Language from '@material-ui/icons/Language';

const Wrapper = styled.div`
  display: flex;
  position: relative;
  padding-bottom: 15px;

  .property-icon {
    position: relative;
    top: -2px;
  }

  & .show-on-hover {
    display: none !important;
  }
  &:hover .show-on-hover {
    display: block !important;
  }

  font-size: 1rem;
  color: rgba(0, 0, 0, 0.87);

  i {
    color: rgba(0, 0, 0, 0.54);
  }

  > svg {
    margin: 0 10px -6px 2px;
    opacity: 0.4;
  }
`;

const StyledIconButton = styled(IconButton)`
  position: absolute !important; /* TODO mui styles takes precendence, why? */
  right: 0;
  // margin-top: -12px !important;
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

const Value = styled.div``;

const Spacer = styled.div`
  padding: 0 0 1em 0;
`;

const DefaultRender = ({ v }) => v;
const renderers = {
  website: WebsiteRenderer,
  phone: PhoneRenderer,
  opening_hours: OpeningHoursRenderer,
};

const icon = {
  website: Language,
  phone: LocalPhone,
  opening_hours: AccessTime,
};

const StyledInput = styled(TextField)`
  margin: -3.5px -3px !important;

  input {
    font-size: 16px;
    padding: 5px 7px;
    font-family: 'Roboto', 'Helvetica', 'Arial', sans-serif;
    font-weight: 400;
    letter-spacing: 0.14994px;
    color: rgba(0, 0, 0, 0.87);
  }
`;

const Property = ({ k, v, isEditing, setEditingOn }) => {
  const Renderer = renderers[k] || DefaultRender;
  const IconComponent = icon[k];

  return (
    <Wrapper>
      <IconComponent fontSize="small" className="property-icon" />

      {!isEditing && (
        <>
          <StyledIconButton
            mini="true"
            onClick={setEditingOn}
            className="show-on-hover"
          >
            <Edit
              titleAccess="Upravit v živé databázi OpenStreetMap"
              nativecolor="#9e9e9e"
            />
          </StyledIconButton>

          {v ? <Renderer v={v} /> : <i>-</i>}
        </>
      )}
      {isEditing && (
        <>
          {/*<StyledIconButton mini="true" onClick={() => setIsInput(false)}>*/}
          {/*  <Cancel titleAccess="Zrušit" nativecolor="#9e9e9e" />*/}
          {/*</StyledIconButton>*/}

          <StyledInput // https://codesandbox.io/s/m45ywmp86j
            // label={k}
            placeholder=""
            margin="none"
            fullWidth
            variant="outlined"
            size="small"
            defaultValue={v}
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
