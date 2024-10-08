import Link from 'next/link';
import { Feature } from '../../../../services/types';
import { StationItem, StationsList } from './helpers';
import { IconButton, Typography } from '@mui/material';
import { t } from '../../../../services/intl';
import { getUrlOsmId } from '../../../../services/helpers';
import TurnLeftIcon from '@mui/icons-material/TurnLeft';

type ShowMoreLessButtonProps = {
  type: 'collapse' | 'expand';
  stopCount: number;
  onClick?: (e: unknown) => void;
};

const ShowMoreLessButton = ({
  type,
  onClick,
  stopCount,
}: ShowMoreLessButtonProps) => (
  <Typography variant="body2" color="textSecondary">
    <IconButton aria-label={type} onClick={onClick}>
      <TurnLeftIcon
        style={{
          transform:
            type === 'collapse' ? 'rotate(90deg) scaleY(-1)' : 'rotate(-90deg)',
        }}
      />
    </IconButton>
    {type === 'collapse'
      ? t('publictransport.visible_stops', {
          amount: stopCount - 2,
        })
      : t('publictransport.hidden_stops', {
          amount: stopCount - 2,
        })}
  </Typography>
);

const StationInner = ({
  stop,
  stopCount,
  onExpand,
  onCollapse,
}: {
  stop: Feature | 'collapse' | 'expand';
  stopCount: number;
  onExpand: () => void;
  onCollapse: () => void;
}) => {
  if (stop === 'expand') {
    return (
      <Typography variant="body2" color="textSecondary">
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
  if (stop === 'collapse') {
    return (
      <Typography variant="body2" color="textSecondary">
        <IconButton
          aria-label="expand"
          onClick={() => {
            onCollapse();
          }}
        ></IconButton>
        {t('publictransport.visible_stops', {
          amount: stopCount - 2,
        })}
      </Typography>
    );
  }

  return <Link href={getUrlOsmId(stop.osmMeta)}>{stop.tags.name}</Link>;
};

type Props = {
  stops: Feature[];
  stopCount: number;
  onExpand: () => void;
  onCollapse: () => void;
};

export const Stops = ({ stops, stopCount, onExpand, onCollapse }: Props) => {
  const hasFullLength = stops.length === stopCount;
  return (
    <StationsList>
      {stops.map((stop, i) => (
        <>
          <StationItem isFirst={i === 0} isLast={i === stops.length - 1}>
            <StationInner
              stop={stop}
              stopCount={stopCount}
              onExpand={onExpand}
              onCollapse={onCollapse}
            />
          </StationItem>
          {i === 0 && (
            <StationItem showCircle={false}>
              <ShowMoreLessButton
                type={hasFullLength ? 'collapse' : 'expand'}
                stopCount={stopCount}
                onClick={hasFullLength ? onCollapse : onExpand}
              />
            </StationItem>
          )}
        </>
      ))}
    </StationsList>
  );
};
