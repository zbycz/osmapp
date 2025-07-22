import { Grid, Typography } from '@mui/material';
import { Feature, LonLat } from '../../../services/types';
import { Setter } from '../../../types';
import { CoordsOption } from '../types';
import { IconPart } from '../utils';
import TravelExploreIcon from '@mui/icons-material/TravelExplore';
import { getCoordsFeature } from '../../../services/getCoordsFeature';
import { t } from '../../../services/intl';
import { OpenLocationCode } from 'open-location-code';
import { getRoundedPosition, roundedToDeg } from '../../../utils';
import { getGlobalMap } from '../../../services/mapStorage';

const olc = new OpenLocationCode();

const olcDecoder = (inputValue: string): LonLat | null => {
  try {
    const { longitudeLo, latitudeLo } = olc.decode(inputValue);
    return [longitudeLo, latitudeLo];
  } catch {
    return null;
  }
};

const regex =
  /^(-?\d{1,3}(?:(?:\.|,)\d+)?)°(?:\s|,|;)+(-?\d{1,3}(?:(?:\.|,)\d+)?)°/;

const isValidCoord = ([lon, lat]: LonLat) => {
  const validLon = lon < 180 && lon > -180;
  const validLat = lat < 90 && lat > -90;
  return validLon && validLat;
};

export const getCoordsOption = (inputValue: string): CoordsOption[] => {
  const olcDecoded = olcDecoder(inputValue);
  if (olcDecoded) {
    return [
      {
        type: 'coords',
        coords: {
          center: olcDecoded,
          label: inputValue.trim().toUpperCase(),
          sublabel: 'OpenLocationCode',
        },
      },
    ];
  }
  const matches = inputValue.match(regex);
  if (!matches) {
    return [];
  }

  const [_, c1Str, c2Str] = matches;
  const c1 = Number(c1Str);
  const c2 = Number(c2Str);
  const coords = [
    [c2, c1],
    [c1, c2],
  ].filter((c) => isValidCoord(c));
  return coords.map((coord) => ({
    type: 'coords',
    coords: {
      center: coord,
      label: `${coord[1]}° ${coord[0]}°`,
      sublabel: t('searchbox.coordinate_subtitle'),
    },
  }));
};

export const coordsOptionsSelected = (
  { coords }: CoordsOption,
  setFeature: Setter<Feature>,
) => {
  const newFeature = getCoordsFeature([
    `${coords.center[0]}`,
    `${coords.center[1]}`,
  ]);
  setFeature(newFeature);
};

type Props = {
  option: CoordsOption;
};

export const CoordsRow = ({ option: { coords } }: Props) => (
  <>
    <IconPart>
      <TravelExploreIcon />
    </IconPart>
    <Grid size={12}>
      <span style={{ fontWeight: 700 }}>{coords.label}</span>
      <Typography variant="body2" color="textSecondary">
        {coords.sublabel}
      </Typography>
    </Grid>
  </>
);

export const getDirectionsCoordsOption = (
  center: LonLat,
  label?: string,
): CoordsOption => ({
  type: 'coords',
  coords: {
    center,
    label:
      label ||
      roundedToDeg(getRoundedPosition(center, getGlobalMap().getZoom())),
    sublabel: label || t('searchbox.coordinate_subtitle'),
  },
});
