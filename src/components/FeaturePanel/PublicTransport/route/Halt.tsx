import TripOriginIcon from '@mui/icons-material/TripOrigin';

export type HaltSection = 'start' | 'middle' | 'end';

type Props = {
  color: string;
  isFirst: boolean;
  isLast: boolean;
};

export const Halt = ({ color, isFirst, isLast }: Props) => (
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
    <TripOriginIcon
      style={{
        color: color,
        width: '100%',
        margin: '-6px',
      }}
    />
    <div
      style={{
        width: '4px',
        height: '100%',
        background: isLast ? 'transparent' : color,
      }}
    />
  </div>
);
