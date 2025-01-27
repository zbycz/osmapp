import CircleIcon from '@mui/icons-material/Circle';
import TimelineIcon from '@mui/icons-material/Timeline';
import HubIcon from '@mui/icons-material/Hub';
import { Tooltip } from '@mui/material';
import React from 'react';
import { t } from '../../services/intl';
import { OsmType } from '../../services/types';
import { fontSize } from '@mui/system';

export const getOsmTypeFromShortId = (shortId: string) => {
  const typeMap = {
    n: 'node',
    w: 'way',
    r: 'relation',
  };
  return typeMap[shortId[0]];
};

type NwrIconProps = {
  osmType: OsmType;
  color?: string;
  fontSize?: string;
};

type TypeMap = {
  [key: string]: { name: OsmType; icon: React.ElementType; scale?: number };
};

const typeMap: TypeMap = {
  node: { name: 'node', icon: CircleIcon, scale: 0.7 },
  way: { name: 'way', icon: TimelineIcon },
  relation: { name: 'relation', icon: HubIcon },
};

export const NwrIcon = ({ osmType, color, fontSize }: NwrIconProps) => {
  const type = typeMap[osmType];
  if (!type) return null;

  const IconComponent = type.icon;
  const { name, scale } = type;

  return (
    <Tooltip title={`OSM ${t(`osmtype_${name}`)}`}>
      <IconComponent
        fontSize={fontSize || 'inherit'}
        color={color || 'secondary'}
        sx={{ transform: `scale(${scale || 1})` }}
      />
    </Tooltip>
  );
};
