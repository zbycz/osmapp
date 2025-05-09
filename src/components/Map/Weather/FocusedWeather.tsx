import { Stack } from '@mui/material';
import { DetailedWeather } from './loadWeather';
import { icons } from './icons';
import { wmoCodeForDay } from './wmoCodeForDay';
import { intl } from '../../../services/intl';
import ThermostatIcon from '@mui/icons-material/Thermostat';
import RainIcon from '@mui/icons-material/WaterDrop';
import { Temperature } from './helpers';
import { useUserThemeContext } from '../../../helpers/theme';

const InformationRow: React.FC = ({ children }) => (
  <Stack direction="row" alignItems="center" spacing={0.25}>
    {children}
  </Stack>
);

type Props = {
  dayWeather: DetailedWeather[];
  weather?: DetailedWeather;
};

export const FocusedWeather = ({ weather, dayWeather }: Props) => {
  const { currentTheme } = useUserThemeContext();

  const temperaturese = dayWeather.map(({ temperature }) => temperature);
  const heading = weather
    ? weather.time.toLocaleTimeString(intl.lang, {
        hour: 'numeric',
        minute: 'numeric',
        weekday: 'long',
      })
    : dayWeather[0].time.toLocaleDateString(intl.lang, { weekday: 'long' });
  const precipitation = weather
    ? weather.precipitationProbability
    : Math.max(
        ...dayWeather.map(
          ({ precipitationProbability }) => precipitationProbability,
        ),
      );
  const wmoCode = weather ? weather.weatherCode : wmoCodeForDay(dayWeather);
  const isDay = weather ? weather.isDay : true;
  const icon = icons[wmoCode];

  return (
    <Stack direction="row" alignItems="center" spacing={0.5}>
      <Stack
        alignItems="center"
        justifyContent="space-evenly"
        sx={{ minWidth: '120px' }}
      >
        <img
          src={icon[isDay ? 'day' : 'night'].image}
          style={{
            width: 75,
            height: 75,
            margin: '-20px',
            filter: icon[isDay ? 'day' : 'night'].filter?.[currentTheme],
          }}
        />
        {icon.description ?? icon[isDay ? 'day' : 'night'].description}
      </Stack>
      <Stack spacing={0.5}>
        <h4 style={{ margin: '0 0 0.25rem 0' }}>{heading}</h4>
        <InformationRow>
          <ThermostatIcon color="secondary" />
          {weather && (
            <Temperature precision={1} celsius={weather.temperature} />
          )}
          {!weather && (
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={0.25}>
              <span style={{ whiteSpace: 'nowrap' }}>
                <b>Lowest: </b>
                <Temperature
                  precision={1}
                  celsius={Math.min(...temperaturese)}
                />
              </span>
              <span style={{ whiteSpace: 'nowrap' }}>
                <b>Highest: </b>
                <Temperature
                  precision={1}
                  celsius={Math.max(...temperaturese)}
                />
              </span>
            </Stack>
          )}
        </InformationRow>
        <InformationRow>
          <RainIcon color="secondary" />
          <span>{precipitation}%</span>
        </InformationRow>
      </Stack>
    </Stack>
  );
};
