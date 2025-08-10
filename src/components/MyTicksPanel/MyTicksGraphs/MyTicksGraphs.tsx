import { RouteDistribution } from '../../FeaturePanel/Climbing/RouteDistribution';
import React from 'react';
import { Typography } from '@mui/material';
import { PanelSidePadding } from '../../utils/PanelHelpers';
import { OverpassFeature } from '../../../services/overpass/overpassSearch';

type MyTicksGraphsProps = {
  features: OverpassFeature[];
};

export const MyTicksGraphs = ({ features }: MyTicksGraphsProps) => {
  if (features.length === 0) {
    return null;
  }

  return (
    <>
      <PanelSidePadding>
        <Typography variant="h6" mt={2}>
          Routes distribution
        </Typography>
      </PanelSidePadding>
      <RouteDistribution features={features} />
    </>
  );
};
