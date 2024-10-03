import Link from 'next/link';
import { Feature } from '../../../../services/types';
import { StationItem, StationsList } from './helpers';
import { IconButton, Typography } from '@mui/material';
import { t } from '../../../../services/intl';
import { getUrlOsmId } from '../../../../services/helpers';
import TurnLeftIcon from '@mui/icons-material/TurnLeft';

const StationInner = ({
  stop,
  stopCount,
  onExpand,
  onCollapse,
}: {
  stop: Feature | 'hidden' | 'show-more';
  stopCount: number;
  onExpand: () => void;
  onCollapse: () => void;
}) => {
  if (stop === 'hidden') {
    return (
      <Typography variant="body1" color="textSecondary">
        <IconButton
          aria-label="expand"
          onClick={() => {
            onExpand();
          }}
        >
          <TurnLeftIcon style={{ transform: 'rotate(-90deg)' }} />
        </IconButton>
        {t('publictransport.hidden_stops', {
          amount: stopCount - 2,
        })}
      </Typography>
    );
  }
  if (stop === 'show-more') {
    return (
      <Typography variant="body2" color="textSecondary">
        <IconButton
          aria-label="expand"
          onClick={() => {
            onCollapse();
          }}
        >
          <TurnLeftIcon style={{ transform: 'rotate(90deg) scaleY(-1)' }} />
        </IconButton>
        {t('publictransport.visible_stops', {
          amount: stopCount - 2,
        })}
      </Typography>
    );
  }

  return <Link href={getUrlOsmId(stop.osmMeta)}>{stop.tags.name}</Link>;
};

type Props = {
  stops: (Feature | 'hidden' | 'show-more')[];
  stopCount: number;
  onExpand: () => void;
  onCollapse: () => void;
};

export const Stops = ({ stops, stopCount, onExpand, onCollapse }: Props) => {
  return (
    <StationsList>
      {stops.map((stop, i) => {
        return (
          <StationItem
            hold={typeof stop === 'object'}
            key={typeof stop === 'string' ? stop : getUrlOsmId(stop.osmMeta)}
            isFirst={i === 0}
            isLast={i === stops.length - 1}
            small={stop === 'show-more'}
          >
            <StationInner
              stop={stop}
              stopCount={stopCount}
              onExpand={onExpand}
              onCollapse={onCollapse}
            />
          </StationItem>
        );
      })}
    </StationsList>
  );
};
