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
import { t } from '../../services/intl';
import { TooltipButton } from '../utils/TooltipButton';
import { useQuery } from 'react-query';
import { fetchJson } from '../../services/fetch';
import { ClimbingStatsResponse } from '../../types';
import { nl2br } from '../utils/nl2br';

const getLocalTime = (lastRefresh: string) =>
  lastRefresh ? new Date(lastRefresh).toLocaleString() : null;

const fetchClimbingStats = () =>
  fetchJson<ClimbingStatsResponse>('/api/climbing-tiles/stats');

const ClimbingSecondary = () => {
  const { data, error, isFetching } = useQuery([], () => fetchClimbingStats());

  if (isFetching) {
    return null;
  }

  if (error) {
    return <>{`${error}`}</>;
  }

  const { lastRefresh, osmDataTimestamp, devStats } = data;

  const tooltip = (
    <>
      Refreshed: 1× / night
      <br />
      Last refresh: {getLocalTime(lastRefresh)}
      <br />
      OSM timestamp: {getLocalTime(osmDataTimestamp)}
      {/*<br /><a href="">Refresh now</a>*/}
      <br />
      <br />
      Dev stats: {nl2br(JSON.stringify(devStats, null, 2))}
      <br />
    </>
  );

  return (
    <>
      2025-02-10 15:23
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
