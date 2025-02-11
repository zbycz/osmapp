import React from 'react';
import {
  Checkbox,
  ListItemButton,
  ListItemSecondaryAction,
  ListItemText,
  Typography,
} from '@mui/material';
import { LayerIcon, Spacer, StyledList } from './helpers';
import { Layer, useMapStateContext } from '../utils/MapStateContext';
import { dotToOptionalBr } from '../helpers';
import { intl, t, Translation } from '../../services/intl';
import { TooltipButton } from '../utils/TooltipButton';
import { useQuery } from 'react-query';
import { fetchJson } from '../../services/fetch';
import type { ClimbingStatsResponse } from '../../types';
import { nl2br } from '../utils/nl2br';

const getLocalTime = (lastRefresh: string) =>
  lastRefresh ? new Date(lastRefresh).toLocaleString(intl.lang) : null;

const fetchClimbingStats = () =>
  fetchJson<ClimbingStatsResponse>('/api/climbing-tiles/stats');

const ClimbingSecondary = () => {
  const { data, error, isFetching } = useQuery([], () => fetchClimbingStats());

  if (isFetching) {
    return null;
  }

  if (error) {
    console.error('Error fetching climbing stats', error); // eslint-disable-line no-console
    return null;
  }

  const { lastRefresh, osmDataTimestamp, devStats } = data;
  const tooltip = (
    <>
      <Translation
        id="climbing_tiles.stats"
        values={{
          lastRefresh: getLocalTime(lastRefresh),
          osmTime: getLocalTime(osmDataTimestamp),
        }}
      />
      <br />
      <br />
      Dev stats:{' '}
      {nl2br(
        Object.entries(devStats)
          .map(([k, v]) => `${k}: ${v}`)
          .join('\n'),
      )}
      <br />
    </>
  );

  return (
    <>
      {getLocalTime(osmDataTimestamp).replace(/:\d+( [APM]+)?$/, '$1')}
      <TooltipButton fontSize={14} tooltip={tooltip} />
    </>
  );
};

const OverlayItem = ({ layer }: { layer: Layer }) => {
  const { activeLayers, setActiveLayers } = useMapStateContext();
  const { key, name, Icon } = layer;

  const handleClick = (e: React.MouseEvent) => {
    setActiveLayers((prev) =>
      prev.includes(key)
        ? prev.filter((layer) => layer !== key)
        : prev.concat(key),
    );
    e.stopPropagation();
  };
  const selected = activeLayers.includes(key);
  const secondary = key === 'climbing' ? <ClimbingSecondary /> : undefined;

  return (
    <ListItemButton onClick={handleClick} key={key}>
      <LayerIcon Icon={Icon} />
      <ListItemText primary={dotToOptionalBr(name)} secondary={secondary} />
      <ListItemSecondaryAction>
        <Checkbox edge="end" checked={selected} onClick={handleClick} />
      </ListItemSecondaryAction>
    </ListItemButton>
  );
};

type Props = {
  overlayLayers: Layer[];
};

export const Overlays = ({ overlayLayers }: Props) => (
  <>
    <Typography
      variant="overline"
      display="block"
      color="textSecondary"
      style={{ padding: '1em 0 0 1em' }}
    >
      {t('layerswitcher.overlays')}
    </Typography>

    <StyledList dense suppressHydrationWarning>
      {overlayLayers.map((layer) =>
        layer.type === 'spacer' ? (
          <Spacer key={layer.key} />
        ) : (
          <OverlayItem key={layer.key} layer={layer} />
        ),
      )}
    </StyledList>
  </>
);
