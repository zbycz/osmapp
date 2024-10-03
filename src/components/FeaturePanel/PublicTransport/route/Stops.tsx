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
}: {
  stop: Feature | 'hidden';
  stopCount: number;
  onExpand: () => void;
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

  return <Link href={getUrlOsmId(stop.osmMeta)}>{stop.tags.name}</Link>;
};

type Props = {
  stops: (Feature | 'hidden')[];
  stopCount: number;
  onExpand: () => void;
};

export const Stops = ({ stops, stopCount, onExpand }: Props) => {
  return (
    <StationsList>
      {stops.map((stop, i) => {
        return (
          <StationItem
            hold={stop !== 'hidden'}
            key={stop === 'hidden' ? stop : getUrlOsmId(stop.osmMeta)}
            isFirst={i === 0}
            isLast={i === stops.length - 1}
          >
            <StationInner
              stop={stop}
              stopCount={stopCount}
              onExpand={onExpand}
            />
          </StationItem>
        );
      })}
    </StationsList>
  );
};
