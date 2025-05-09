import CircleIcon from '@mui/icons-material/Circle';
import TimelineIcon from '@mui/icons-material/Timeline';
import HubIcon from '@mui/icons-material/Hub';
import { Tooltip } from '@mui/material';
import React from 'react';
import { t } from '../../services/intl';
import { OsmType } from '../../services/types';
import { fontSize } from '@mui/system';
import { getApiId } from '../../services/helpers';

export const getOsmTypeFromShortId = (shortId: string): OsmType =>
  getApiId(shortId).type;

type TypeMap = {
  [key: string]: {
    Icon: React.ElementType;
    scale?: number;
    label: string;
    description: string;
  };
};

const typeMap: TypeMap = {
  node: {
    Icon: CircleIcon,
    scale: 0.7,
    label: t('osmtype.node'),
    description: t('osmtype.node.description'),
  },
  way: {
    Icon: TimelineIcon,
    label: t('osmtype.way'),
    description: t('osmtype.way.description'),
  },
  relation: {
    Icon: HubIcon,
    label: t('osmtype.relation'),
    description: t('osmtype.relation.description'),
  },
};

type Props = {
  osmType: OsmType;
  color?: string;
  fontSize?: string;
};

export const NwrIcon = ({ osmType, color, fontSize }: Props) => {
  const type = typeMap[osmType];
  if (!type) {
    return null;
  }

  const { Icon, scale, label, description } = type;
  const english = label.toLowerCase() === osmType ? '' : ` (${osmType})`;

  return (
    <Tooltip
      title={
        <>
          OSM {label}
          {english}
          <br />
          {description}
        </>
      }
    >
      <Icon
        fontSize={fontSize || 'inherit'}
        color={color || 'secondary'}
        sx={{ transform: `scale(${scale || 1})` }}
      />
    </Tooltip>
  );
};
