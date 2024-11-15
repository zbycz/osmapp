import orderBy from 'lodash/orderBy';
import { DetailedWeather } from './loadWeather';
import { isAfter, set } from 'date-fns';

export const wmoCodeForDay = (weatherConditions: DetailedWeather[]) => {
  const ratedWeatherConditions = weatherConditions.map((weather) => {
    const comparisonTime = set(weather.time, {
      hours: 15,
      minutes: 0,
      seconds: 0,
      milliseconds: 0,
    });
    const distanceMs = isAfter(weather.time, comparisonTime)
      ? weather.time.getTime() - comparisonTime.getTime()
      : comparisonTime.getTime() - weather.time.getTime();
    const distanceHours = distanceMs / 1_000 / 60 / 60;

    return {
      ...weather,
      rating: 12 - distanceHours,
    };
  });

  const codeRatings = ratedWeatherConditions.reduce<Record<number, number>>(
    (ratings, weather) => {
      const weatherCodeRating = ratings[weather.weatherCode] ?? 0;
      return {
        ...ratings,
        [weather.weatherCode]: weatherCodeRating + weather.rating,
      };
    },
    {},
  );

  const [[code]] = orderBy(
    Object.entries(codeRatings),
    ([_, rating]) => rating,
    'desc',
  );
  return parseInt(code);
};
