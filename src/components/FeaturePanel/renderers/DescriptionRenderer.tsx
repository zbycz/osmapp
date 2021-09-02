import React from 'react';
import Info from '@material-ui/icons/Info';

const DescriptionRenderer = ({ v }) => (
  <>
    <Info fontSize="small" />
    {v}
  </>
);

export default DescriptionRenderer;
