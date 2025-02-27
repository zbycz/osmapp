import { Stack, Typography, Button, SxProps, Theme } from '@mui/material';
import { DetailedWeather } from './loadWeather';
import { wmoCodeForDay } from './wmoCodeForDay';
import { icons } from './icons';
import { Temperature } from './helpers';
import { intl } from '../../../services/intl';
import { useUserThemeContext } from '../../../helpers/theme';

type ButtonProps = {
  weatherConditions: DetailedWeather[];
  onClick: () => void;
  sx: SxProps<Theme>;
  isCurrent: boolean;
};

const DayButton = ({
  onClick,
  weatherConditions,
  sx,
  isCurrent,
}: ButtonProps) => {
  const { currentTheme } = useUserThemeContext();
  const temps = weatherConditions.map(({ temperature }) => temperature);
  const maxTemp = Math.max(...temps);
  const minTemp = Math.min(...temps);
  const wmoCode = wmoCodeForDay(weatherConditions);
  const icon = icons[wmoCode];

  return (
    <Button
      variant="outlined"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
        padding: '0.2rem',
        borderRadius: '0',
        boxShadow: 'none',
        backgroundColor: (theme) =>
          isCurrent ? theme.palette.background.elevation : 'transparent',
        ...sx,
      }}
      onClick={onClick}
    >
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={0.5}>
        <img
          src={icon.day.image}
          alt={icon.description ?? icon.day.description}
          style={{
            width: 50,
            margin: -5,
            filter: icon.day.filter?.[currentTheme],
          }}
        />
        <Stack alignItems="center">
          <span>
            <Temperature celsius={maxTemp} />
          </span>
          <Typography variant="body2" color="textSecondary" fontSize="0.75rem">
            <Temperature celsius={minTemp} />
          </Typography>
        </Stack>
      </Stack>
      {weatherConditions[0].time.toLocaleDateString(intl.lang, {
        weekday: 'short',
      })}
    </Button>
  );
};

const getBorderRadius = (
  index: number,
  totalLength: number,
  radius: number,
) => {
  // TODO make this with pure CSS - use pseudo class :first-child (or :first-of-type to satisfy Emotion styled components)
  if (index === 0) {
    return `${radius}px 0 0 ${radius}px`;
  }
  if (index === totalLength - 1) {
    return `0 ${radius}px ${radius}px 0`;
  }
  return '0';
};

type Props = {
  data: Record<string, DetailedWeather[]>;
  current: string;
  onSelect: (weekdayIndex: string) => void;
};

export const DaySelector = ({ data, current, onSelect }: Props) => {
  const entries = Object.entries(data);

  // TODO refactor this to ToggleButtonGroup and ToggleButtons
  return (
    <Stack direction="row">
      {entries.map(([weekdayIndex, weatherConditions], i) => (
        <DayButton
          key={weekdayIndex}
          onClick={() => {
            onSelect?.(weekdayIndex);
          }}
          isCurrent={weekdayIndex === current}
          weatherConditions={weatherConditions}
          sx={{
            borderRadius: getBorderRadius(i, entries.length, 4),
            marginLeft: '-1px', // collapses borders from two adjacent buttons
          }}
        />
      ))}
    </Stack>
  );
};
