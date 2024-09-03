import * as React from 'react';
import {
  Box,
  Checkbox,
  FormControlLabel,
  FormGroup,
  TextField,
  Autocomplete,
} from '@mui/material';
import { Star } from '@mui/icons-material';
import { LayerIndex } from './helpers/loadLayers';
import { isViewInsideBbox } from './helpers';
import { useMapStateContext } from '../utils/MapStateContext';
import { t } from '../../services/intl';

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
  const [showOnlyAllowedForOsm, setShowOnlyAllowedForOsm] =
    React.useState(false);
  const [currentlyVisible, setCurrentlyVisible] = React.useState(true);
  const { view } = useMapStateContext();

  return (
    <div>
      <Autocomplete
        options={index
          .filter(({ overlay }) => !overlay)
          .filter((ind) =>
            showOnlyAllowedForOsm
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
        renderInput={(params) => <TextField {...params} label="Layer" />}
        getOptionLabel={getLayerLabel}
        renderOption={(props, option) => (
          <Box component="li" {...props}>
            <span
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem',
              }}
            >
              {option.best && <Star />}
              {getLayerLabel(option)}
            </span>
          </Box>
        )}
      />

      <FormGroup row>
        <FormControlLabel
          control={
            <Checkbox
              checked={showOnlyAllowedForOsm}
              onChange={({ target: { checked } }) =>
                setShowOnlyAllowedForOsm(checked)
              }
            />
          }
          label={t('layerswitcher.compatible_license')}
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
          label={t('layerswitcher.layers_in_area')}
        />
      </FormGroup>
    </div>
  );
};
