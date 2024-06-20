import { Autocomplete } from '@material-ui/lab';
import {
  Box,
  Checkbox,
  FormControlLabel,
  FormGroup,
  TextField,
} from '@material-ui/core';
import * as React from 'react';
import { Star } from '@material-ui/icons';
import { LayerIndex } from './helpers/loadLayers';
import { isViewInsideBbox } from './helpers';
import { useMapStateContext } from '../utils/MapStateContext';

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
  const [showAllowedForOsm, setShowAllowedForOsm] = React.useState(true);
  const [currentlyVisible, setCurrentlyVisible] = React.useState(true);
  const { view } = useMapStateContext();

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
              checked={currentlyVisible}
              onChange={({ target: { checked } }) =>
                setCurrentlyVisible(checked)
              }
            />
          }
          label="Only currently visible layers"
        />
      </FormGroup>

      <Autocomplete
        options={index
          .filter(({ overlay }) => !overlay)
          .filter((ind) =>
            showAllowedForOsm
              ? ind.permission_osm === 'explicit' ||
                ind.permission_osm === 'implicit'
              : true,
          )
          .filter(({ bbox }) => {
            if (!currentlyVisible) return true;
            if (!bbox) return true;

            return bbox.some((b) => isViewInsideBbox(view, b));
          })
          .sort((a, b) => getLayerLabel(a).localeCompare(getLayerLabel(b)))}
        onChange={(_, val) => {
          const newLayer =
            typeof val === 'string' ? index.find((l) => l.name === val) : val;
          onSelect(newLayer);
        }}
        // eslint-disable-next-line react/jsx-props-no-spreading
        renderInput={(params) => <TextField {...params} label="Layer" />}
        getOptionLabel={getLayerLabel}
        renderOption={(props) => (
          // eslint-disable-next-line react/jsx-props-no-spreading
          <Box component="li" {...props}>
            <span
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem',
              }}
            >
              {props.best && <Star />}
              {getLayerLabel(props)}
            </span>
          </Box>
        )}
      />
    </div>
  );
};
