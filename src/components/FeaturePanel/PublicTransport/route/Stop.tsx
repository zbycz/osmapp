import TripOriginIcon from '@mui/icons-material/TripOrigin';

export type StopSection = 'start' | 'middle' | 'end';

type Props = {
  color: string;
  isFirst: boolean;
  isLast: boolean;
  showCircle?: boolean;
};

export const Stop = ({ color, isFirst, isLast, showCircle = true }: Props) => (
  <div
    style={{
      width: '1rem',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    }}
  >
    <div
      style={{
        width: '4px',
        height: '100%',
        background: isFirst ? 'transparent' : color,
      }}
    />
    {showCircle && (
      <TripOriginIcon
        style={{
          color: color,
          width: '100%',
          margin: '-6px',
        }}
      />
    )}
    <div
      style={{
        width: '4px',
        height: '100%',
        background: isLast ? 'transparent' : color,
      }}
    />
  </div>
);
