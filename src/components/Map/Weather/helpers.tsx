import { useEffect } from 'react';
import range from 'lodash/range';
import { useUserSettingsContext } from '../../utils/UserSettingsContext';

export const celsiusToFahrenheit = (celsius: number) => celsius * 1.8 + 32;

export const useClickOutside = (
  ref: React.RefObject<HTMLElement>,
  callback: () => void,
) => {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!ref.current) {
        return;
      }
      if (ref.current.contains(event.target as Node)) {
        return;
      }

      callback();
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [ref, callback]);
};

// TODO: Better naming
type TransformObject<T extends Record<string, unknown[]>> = {
  [K in keyof T]: T[K] extends (infer U)[] ? U : never;
};

export const transformObject = <T extends Record<string, unknown[]>>(
  input: T,
): TransformObject<T>[] => {
  const keys = Object.keys(input) as (keyof T)[];
  const length = (input[keys[0]] || []).length;

  return range(length).map(
    (ind) =>
      keys.reduce<Partial<TransformObject<T>>>(
        (acc, key) => ({
          ...acc,
          [key]: input[key][ind],
        }),
        {},
      ) as TransformObject<T>,
  );
};

export const sampleEvenly = <T extends any>(arr: T[], newLength: number) => {
  const arrLength = arr.length;
  const thrownAwayElementsLength = arrLength - newLength;

  const spaceBetween = thrownAwayElementsLength / newLength;

  return Array.from(
    { length: newLength },
    (_, index) => arr[Math.floor(index * (spaceBetween + 1))],
  );
};

type TemperatureProps = {
  celsius: number;
  precision?: number;
};

export const Temperature = ({ celsius, precision = 0 }: TemperatureProps) => {
  const { userSettings } = useUserSettingsContext();
  const { isImperial } = userSettings;

  const temperature = isImperial ? celsiusToFahrenheit(celsius) : celsius;
  const factor = Math.pow(10, precision);
  const roundedTemperature = Math.round(temperature * factor) / factor;

  return (
    <>
      {roundedTemperature} {isImperial ? '°F' : '°C'}
    </>
  );
};
