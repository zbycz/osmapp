const withSeconds = /^(\d+):(\d{2}):(\d{2})$/;
const withHours = /^(\d{1,2}):(\d{2})$/;
const onlyMinutes = /^\d+$/;

type Interval = {
  hours: number;
  minutes: number;
  seconds: number;
};

const parseInterval = (v: string): Interval => {
  const matchWithSeconds = v.match(withSeconds);
  if (matchWithSeconds) {
    return {
      hours: parseInt(matchWithSeconds[1], 10),
      minutes: parseInt(matchWithSeconds[2], 10),
      seconds: parseInt(matchWithSeconds[3], 10),
    };
  }

  const matchWithHours = v.match(withHours);
  if (matchWithHours) {
    return {
      hours: parseInt(matchWithHours[1], 10),
      minutes: parseInt(matchWithHours[2], 10),
      seconds: 0,
    };
  }

  if (onlyMinutes.test(v)) {
    return {
      hours: 0,
      minutes: parseInt(v, 10),
      seconds: 0,
    };
  }

  throw new Error('Unparsable interval');
};

export const humanInterval = (v: string) => {
  let { hours, minutes, seconds } = parseInterval(v.trim());

  minutes += Math.floor(seconds / 60);
  seconds = seconds % 60;

  hours += Math.floor(minutes / 60);
  minutes = minutes % 60;

  let hoursStr = hours.toString().padStart(2, '0');
  let minutesStr = minutes.toString().padStart(2, '0');
  let secondsStr = seconds.toString().padStart(2, '0');

  if (seconds === 0) {
    return `${hoursStr}:${minutesStr}`;
  }
  return `${hoursStr}:${minutesStr}:${secondsStr}`;
};
