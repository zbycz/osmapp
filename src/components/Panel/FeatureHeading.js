// @flow

import styled from 'styled-components';
import IconButton from '@material-ui/core/IconButton';
import Edit from '@material-ui/icons/Edit';
import * as React from 'react';
import Input from '@material-ui/core/Input';
import TextField from '@material-ui/core/TextField';

const Wrapper = styled.div`
  font-size: 36px;
  line-height: 0.98;
  color: rgba(0, 0, 0, 0.7);
  position: relative;
  padding-bottom: 30px;

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

  svg {
    width: 16px;
    height: 16px;
  }
`;
const StyledInput = styled(TextField)`
  margin: -9px -7px !important;

  input {
    font-size: 36px;
    padding: 5px 7px;
    font-family: "Roboto", "Helvetica", "Arial", sans-serif;
    font-weight: 400;
    letter-spacing: 0.14994px;
    color: rgba(0, 0, 0, 0.7);
  }

`;

const FeatureHeading = ({ title, isEditing, setEditingOn }) => (
  <Wrapper>
    <StyledIconButton mini="true" className="show-on-hover" onClick={setEditingOn}>
      <Edit
        titleAccess="Upravit v živé databázi OpenStreetMap"
        nativecolor="#9e9e9e"
      />
    </StyledIconButton>
    {!isEditing && title}
    {isEditing && <StyledInput defaultValue={title} fullWidth autoFocus
                               variant="outlined"
                               size="small"
    />}
  </Wrapper>
);

export default FeatureHeading;
