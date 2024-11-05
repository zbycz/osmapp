import { Stack } from '@mui/material';
import { DetailedWeather } from './loadWeather';
import { icons } from './icons';
import { wmoCodeForDay } from './wmoCodeForDay';
import { intl } from '../../../services/intl';
import Thermostat from '@mui/icons-material/Thermostat';
import Rain from '@mui/icons-material/WaterDrop';
import { Temperature } from './helpers';

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
      <Stack alignItems="center" justifyContent="space-evenly">
        <img
          src={icon[isDay ? 'day' : 'night'].image}
          style={{ width: 75, height: 75, margin: '-20%' }}
        />
        {icon.description ?? icon[isDay ? 'day' : 'night'].description}
      </Stack>
      <Stack spacing={0.5}>
        <h4 style={{ margin: '0 0 0.25rem 0' }}>{heading}</h4>
        <InformationRow>
          <Thermostat />
          {weather && (
            <Temperature precision={1} celsius={weather.temperature} />
          )}
          {!weather && (
            <>
              <span>
                <b>Lowest: </b>
                <Temperature
                  precision={1}
                  celsius={Math.min(...temperaturese)}
                />
              </span>
              <span>
                <b>Highest: </b>
                <Temperature
                  precision={1}
                  celsius={Math.max(...temperaturese)}
                />
              </span>
            </>
          )}
        </InformationRow>
        <InformationRow>
          <Rain />
          <span>{precipitation}%</span>
        </InformationRow>
      </Stack>
    </Stack>
  );
};
