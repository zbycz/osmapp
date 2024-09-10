import * as React from 'react';
import {
  Box,
  Checkbox,
  FormControlLabel,
  FormGroup,
  TextField,
  Autocomplete,
} from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import { LayerIndex } from './helpers/loadLayers';
import { isViewInsideBbox } from './helpers';
import { useMapStateContext } from '../utils/MapStateContext';
import { t } from '../../services/intl';

export type AutocompleteOption =
  | {
      type: 'layerIndex';
      layer: LayerIndex;
    }
  | { type: 'custom' };

type SuccessLayerDataInputProps = {
  index: LayerIndex[];
  onSelect: (layer: AutocompleteOption) => void;
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

  const options = index
    .filter(({ overlay }) => !overlay)
    .filter((ind) =>
      showOnlyAllowedForOsm
        ? ind.permission_osm === 'explicit' || ind.permission_osm === 'implicit'
        : true,
    )
    .filter(({ bbox }) => {
      if (!currentlyVisible) return true;
      if (!bbox) return true;
      return bbox.some((b) => isViewInsideBbox(view, b));
    })
    .sort((a, b) => getLayerLabel(a).localeCompare(getLayerLabel(b)))
    .map((layer) => ({
      type: 'layerIndex' as const,
      layer,
    }));

  const allOptions: AutocompleteOption[] = [
    {
      type: 'custom',
    },
    ...options,
  ];

  return (
    <div>
      <Autocomplete
        options={allOptions}
        renderInput={(params) => (
          <TextField {...params} margin="dense" label="Layer" />
        )}
        getOptionLabel={(opt) => {
          if (opt.type === 'custom') return 'Custom URL';
          return getLayerLabel(opt.layer);
        }}
        onChange={(_, val) => {
          onSelect(val);
        }}
        renderOption={(props, opt) => (
          <Box component="li" {...props}>
            <span
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem',
              }}
            >
              {opt.type === 'layerIndex' ? (
                <>
                  {opt.layer.best && <StarIcon />}
                  {getLayerLabel(opt.layer)}
                </>
              ) : (
                'Custom URL'
              )}
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
