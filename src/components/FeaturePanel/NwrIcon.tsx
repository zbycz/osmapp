import CircleIcon from '@mui/icons-material/Circle';
import TimelineIcon from '@mui/icons-material/Timeline';
import HubIcon from '@mui/icons-material/Hub';
import { Tooltip } from '@mui/material';
import React from 'react';
import { t } from '../../services/intl';
import { OsmType } from '../../services/types';
import { getApiId, getUrlOsmId } from '../../services/helpers';

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

const getTooltip = (osmType: OsmType, shortId?: string) => {
  const { label, description } = typeMap[osmType];
  const english = label.toLowerCase() === osmType ? '' : ` (${osmType})`;
  const longId = getUrlOsmId(getApiId(shortId));

  return (
    <>
      OSM {label}
      {english}
      <br />
      {description}
      {shortId ? (
        <>
          <br />
          {shortId.includes('-') ? 'Local' : 'OSM'} ID: {longId}
        </>
      ) : null}
    </>
  );
};

type Props = {
  osmType?: OsmType;
  shortId?: string;
  color?: string;
  fontSize?: string;
  hideNode?: boolean;
};

export const NwrIcon = ({
  osmType: osmTypeProp,
  shortId,
  color,
  fontSize,
  hideNode,
}: Props) => {
  const osmType = shortId ? getApiId(shortId).type : osmTypeProp;
  const typeMapElement = typeMap[osmType];

  if (!typeMapElement) {
    return null;
  }

  if (hideNode && osmType === 'node') {
    return null;
  }

  if (shortId && osmTypeProp) {
    throw new Error('Only one of `shortId` and `osmType` is allowed');
  }

  const { Icon, scale } = typeMapElement;
  return (
    <Tooltip title={getTooltip(osmType, shortId)}>
      <Icon
        fontSize={fontSize || 'inherit'}
        color={color || 'secondary'}
        sx={{ transform: `scale(${scale || 1})` }}
      />
    </Tooltip>
  );
};
