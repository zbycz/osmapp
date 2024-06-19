import { Autocomplete } from '@material-ui/lab';
import {
  Checkbox,
  FormControlLabel,
  FormGroup,
  TextField,
} from '@material-ui/core';
import * as React from 'react';
import { LayerIndex } from './helpers/loadLayers';

type SuccessLayerDataInputProps = {
  index: LayerIndex[];
  onSelect: (layer: LayerIndex | undefined) => void;
};

const getLayerLabel = ({ name, country_code }: LayerIndex) => {
  if (country_code) return `${country_code} - ${name}`;

  return `Global - ${name}`;
};

export const SuccessLayerInput: React.FC<SuccessLayerDataInputProps> = ({
  index,
  onSelect,
}) => {
  const [showOnlyWorldwide, setShowOnlyWorldwide] = React.useState(true);
  const [showAllowedForOsm, setShowAllowedForOsm] = React.useState(true);

  return (
    <div>
      <FormGroup>
        <FormControlLabel
          control={
            <Checkbox
              checked={showAllowedForOsm}
              onChange={({ target: { checked } }) =>
                setShowAllowedForOsm(checked)
              }
            />
          }
          label="Allowed for the use in osm"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={showOnlyWorldwide}
              onChange={({ target: { checked } }) =>
                setShowOnlyWorldwide(checked)
              }
            />
          }
          label="Show only worldwide available"
        />
      </FormGroup>

      <Autocomplete
        options={index
          .filter(({ overlay }) => !overlay)
          .filter((ind) => (showOnlyWorldwide ? ind.default : true))
          .filter((ind) =>
            showAllowedForOsm
              ? ind.permission_osm === 'explicit' ||
                ind.permission_osm === 'implicit'
              : true,
          )
          .sort((a, b) => getLayerLabel(a).localeCompare(getLayerLabel(b)))}
        onChange={(_, val) => {
          const newLayer =
            typeof val === 'string' ? index.find((l) => l.name === val) : val;
          onSelect(newLayer);
        }}
        // eslint-disable-next-line react/jsx-props-no-spreading
        renderInput={(params) => <TextField {...params} label="Layer" />}
        getOptionLabel={getLayerLabel}
      />
    </div>
  );
};
