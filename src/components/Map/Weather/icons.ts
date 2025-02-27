type Icon = Record<
  'day' | 'night',
  {
    image: string;
    description?: string;
    filter?: { dark?: string; light?: string };
  }
> & {
  description?: string;
};

const sunny = (description: string) => ({
  day: {
    description,
    image: 'https://openweathermap.org/img/wn/01d@2x.png',
  },
  night: {
    description: 'Clear',
    image: 'https://openweathermap.org/img/wn/01n@2x.png',
    filter: { dark: 'brightness(1.75)' },
  },
});
const drizzle = (description: string) => ({
  description,
  day: {
    image: 'https://openweathermap.org/img/wn/09d@2x.png',
    filter: { light: 'brightness(0.75)', dark: 'brightness(2)' },
  },
  night: {
    image: 'https://openweathermap.org/img/wn/09n@2x.png',
    filter: { light: 'brightness(0.75)', dark: 'brightness(2)' },
  },
});
const rain = (description: string) => ({
  description,
  day: {
    image: 'https://openweathermap.org/img/wn/10d@2x.png',
    filter: {
      light: 'brightness(0.75) saturate(1.5)',
      dark: 'brightness(1.75) saturate(0.75)',
    },
  },
  night: {
    image: 'https://openweathermap.org/img/wn/10n@2x.png',
    filter: {
      light: 'brightness(0.75)',
      dark: 'brightness(1.75)',
    },
  },
});
const snow = (description: string) => ({
  description,
  day: {
    image: 'https://openweathermap.org/img/wn/13d@2x.png',
    filter: { dark: 'invert(1) brightness(1.25)' },
  },
  night: {
    image: 'https://openweathermap.org/img/wn/13n@2x.png',
    filter: { dark: 'invert(1) brightness(1.25)' },
  },
});
const thunderstorm = (description: string) => ({
  description,
  day: {
    image: 'https://openweathermap.org/img/wn/11d@2x.png',
    filter: {
      light: 'brightness(0.75) saturate(1.5)',
      dark: 'brightness(1.5) saturate(1.25)',
    },
  },
  night: {
    image: 'https://openweathermap.org/img/wn/11n@2x.png',
    filter: {
      light: 'brightness(0.75) saturate(1.5)',
      dark: 'brightness(1.5) saturate(1.25)',
    },
  },
});

// From https://gist.github.com/stellasphere/9490c195ed2b53c707087c8c2db4ec0c
export const icons: Record<number, Icon> = {
  0: sunny('Sunny'),
  1: sunny('Mainly Sunny'),
  2: {
    description: 'Partly Cloudy',
    day: {
      image: 'https://openweathermap.org/img/wn/02d@2x.png',
      filter: { light: 'brightness(0.75) saturate(1.5)' },
    },
    night: {
      image: 'https://openweathermap.org/img/wn/02n@2x.png',
      filter: { light: 'brightness(0.75)' },
    },
  },
  3: {
    description: 'Cloudy',
    day: {
      image: 'https://openweathermap.org/img/wn/03d@2x.png',
      filter: { light: 'brightness(0.75)' },
    },
    night: {
      image: 'https://openweathermap.org/img/wn/03n@2x.png',
      filter: { light: 'brightness(0.75)' },
    },
  },
  45: {
    description: 'Foggy',
    day: {
      image: 'https://openweathermap.org/img/wn/50d@2x.png',
      filter: { dark: 'brightness(2)' },
    },
    night: {
      image: 'https://openweathermap.org/img/wn/50n@2x.png',
      filter: { dark: 'brightness(2)' },
    },
  },
  48: {
    description: 'Rime Fog',
    day: {
      image: 'https://openweathermap.org/img/wn/50d@2x.png',
      filter: { dark: 'brightness(2)' },
    },
    night: {
      image: 'https://openweathermap.org/img/wn/50n@2x.png',
      filter: { dark: 'brightness(2)' },
    },
  },
  51: drizzle('Light Drizzle'),
  53: drizzle('Drizzle'),
  55: drizzle('Heavy Drizzle'),
  56: drizzle('Light Freezing Drizzle'),
  57: drizzle('Freezing Drizzle'),
  61: {
    description: 'Light Rain',
    day: {
      image: 'https://openweathermap.org/img/wn/10d@2x.png',
    },
    night: {
      image: 'https://openweathermap.org/img/wn/10n@2x.png',
    },
  },
  63: rain('Rain'),
  65: rain('Heavy Rain'),
  66: rain('Light Freezing Rain'),
  67: rain('Freezing Rain'),
  71: snow('Light Snow'),
  73: snow('Snow'),
  75: snow('Heavy Snow'),
  77: snow('Snow Grains'),
  80: drizzle('Light Showers'),
  81: drizzle('Showers'),
  82: drizzle('Heavy Showers'),
  85: snow('Light Snow Showers'),
  86: snow('Snow Showers'),
  95: thunderstorm('Thunderstorm'),
  96: thunderstorm('Light Thunderstorms With Hail'),
  99: thunderstorm('Thunderstorm With Hail'),
};
