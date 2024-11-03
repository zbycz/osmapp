type Icon = Record<'day' | 'night', { description?: string; image: string }> & {
  description?: string;
};

// From https://gist.github.com/stellasphere/9490c195ed2b53c707087c8c2db4ec0c
export const icons: Record<number, Icon> = {
  0: {
    day: {
      description: 'Sunny',
      image: 'http://openweathermap.org/img/wn/01d@2x.png',
    },
    night: {
      description: 'Clear',
      image: 'http://openweathermap.org/img/wn/01n@2x.png',
    },
  },
  1: {
    day: {
      description: 'Mainly Sunny',
      image: 'http://openweathermap.org/img/wn/01d@2x.png',
    },
    night: {
      description: 'Mainly Clear',
      image: 'http://openweathermap.org/img/wn/01n@2x.png',
    },
  },
  2: {
    description: 'Partly Cloudy',
    day: {
      image: 'http://openweathermap.org/img/wn/02d@2x.png',
    },
    night: {
      image: 'http://openweathermap.org/img/wn/02n@2x.png',
    },
  },
  3: {
    description: 'Cloudy',
    day: {
      image: 'http://openweathermap.org/img/wn/03d@2x.png',
    },
    night: {
      image: 'http://openweathermap.org/img/wn/03n@2x.png',
    },
  },
  45: {
    description: 'Foggy',
    day: {
      image: 'http://openweathermap.org/img/wn/50d@2x.png',
    },
    night: {
      image: 'http://openweathermap.org/img/wn/50n@2x.png',
    },
  },
  48: {
    description: 'Rime Fog',
    day: {
      image: 'http://openweathermap.org/img/wn/50d@2x.png',
    },
    night: {
      image: 'http://openweathermap.org/img/wn/50n@2x.png',
    },
  },
  51: {
    description: 'Light Drizzle',
    day: {
      image: 'http://openweathermap.org/img/wn/09d@2x.png',
    },
    night: {
      image: 'http://openweathermap.org/img/wn/09n@2x.png',
    },
  },
  53: {
    description: 'Drizzle',
    day: {
      image: 'http://openweathermap.org/img/wn/09d@2x.png',
    },
    night: {
      image: 'http://openweathermap.org/img/wn/09n@2x.png',
    },
  },
  55: {
    description: 'Heavy Drizzle',
    day: {
      image: 'http://openweathermap.org/img/wn/09d@2x.png',
    },
    night: {
      image: 'http://openweathermap.org/img/wn/09n@2x.png',
    },
  },
  56: {
    description: 'Light Freezing Drizzle',
    day: {
      image: 'http://openweathermap.org/img/wn/09d@2x.png',
    },
    night: {
      image: 'http://openweathermap.org/img/wn/09n@2x.png',
    },
  },
  57: {
    description: 'Freezing Drizzle',
    day: {
      image: 'http://openweathermap.org/img/wn/09d@2x.png',
    },
    night: {
      image: 'http://openweathermap.org/img/wn/09n@2x.png',
    },
  },
  61: {
    description: 'Light Rain',
    day: {
      image: 'http://openweathermap.org/img/wn/10d@2x.png',
    },
    night: {
      image: 'http://openweathermap.org/img/wn/10n@2x.png',
    },
  },
  63: {
    description: 'Rain',
    day: {
      image: 'http://openweathermap.org/img/wn/10d@2x.png',
    },
    night: {
      image: 'http://openweathermap.org/img/wn/10n@2x.png',
    },
  },
  65: {
    description: 'Heavy Rain',
    day: {
      image: 'http://openweathermap.org/img/wn/10d@2x.png',
    },
    night: {
      image: 'http://openweathermap.org/img/wn/10n@2x.png',
    },
  },
  66: {
    description: 'Light Freezing Rain',
    day: {
      image: 'http://openweathermap.org/img/wn/10d@2x.png',
    },
    night: {
      image: 'http://openweathermap.org/img/wn/10n@2x.png',
    },
  },
  67: {
    description: 'Freezing Rain',
    day: {
      image: 'http://openweathermap.org/img/wn/10d@2x.png',
    },
    night: {
      image: 'http://openweathermap.org/img/wn/10n@2x.png',
    },
  },
  71: {
    description: 'Light Snow',
    day: {
      image: 'http://openweathermap.org/img/wn/13d@2x.png',
    },
    night: {
      image: 'http://openweathermap.org/img/wn/13n@2x.png',
    },
  },
  73: {
    description: 'Snow',
    day: {
      image: 'http://openweathermap.org/img/wn/13d@2x.png',
    },
    night: {
      image: 'http://openweathermap.org/img/wn/13n@2x.png',
    },
  },
  75: {
    description: 'Heavy Snow',
    day: {
      image: 'http://openweathermap.org/img/wn/13d@2x.png',
    },
    night: {
      image: 'http://openweathermap.org/img/wn/13n@2x.png',
    },
  },
  77: {
    description: 'Snow Grains',
    day: {
      image: 'http://openweathermap.org/img/wn/13d@2x.png',
    },
    night: {
      image: 'http://openweathermap.org/img/wn/13n@2x.png',
    },
  },
  80: {
    description: 'Light Showers',
    day: {
      image: 'http://openweathermap.org/img/wn/09d@2x.png',
    },
    night: {
      image: 'http://openweathermap.org/img/wn/09n@2x.png',
    },
  },
  81: {
    description: 'Showers',
    day: {
      image: 'http://openweathermap.org/img/wn/09d@2x.png',
    },
    night: {
      image: 'http://openweathermap.org/img/wn/09n@2x.png',
    },
  },
  82: {
    description: 'Heavy Showers',
    day: {
      image: 'http://openweathermap.org/img/wn/09d@2x.png',
    },
    night: {
      image: 'http://openweathermap.org/img/wn/09n@2x.png',
    },
  },
  85: {
    description: 'Light Snow Showers',
    day: {
      image: 'http://openweathermap.org/img/wn/13d@2x.png',
    },
    night: {
      image: 'http://openweathermap.org/img/wn/13n@2x.png',
    },
  },
  86: {
    description: 'Snow Showers',
    day: {
      image: 'http://openweathermap.org/img/wn/13d@2x.png',
    },
    night: {
      image: 'http://openweathermap.org/img/wn/13n@2x.png',
    },
  },
  95: {
    description: 'Thunderstorm',
    day: {
      image: 'http://openweathermap.org/img/wn/11d@2x.png',
    },
    night: {
      image: 'http://openweathermap.org/img/wn/11n@2x.png',
    },
  },
  96: {
    description: 'Light Thunderstorms With Hail',
    day: {
      image: 'http://openweathermap.org/img/wn/11d@2x.png',
    },
    night: {
      image: 'http://openweathermap.org/img/wn/11n@2x.png',
    },
  },
  99: {
    description: 'Thunderstorm With Hail',
    day: {
      image: 'http://openweathermap.org/img/wn/11d@2x.png',
    },
    night: {
      image: 'http://openweathermap.org/img/wn/11n@2x.png',
    },
  },
};
