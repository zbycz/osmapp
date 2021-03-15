
import styled from 'styled-components';
import IconButton from '@material-ui/core/IconButton';
import Edit from '@material-ui/icons/Edit';
import * as React from 'react';

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

const FeatureHeading = ({ title }) => (
  <Wrapper>
    <StyledIconButton mini="true" className="show-on-hover">
      <Edit
        titleAccess="Upravit v živé databázi OpenStreetMap"
        nativecolor="#9e9e9e"
      />
    </StyledIconButton>
    {title}
  </Wrapper>
);

export default FeatureHeading;
