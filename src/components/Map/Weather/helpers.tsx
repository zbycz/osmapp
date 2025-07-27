import range from 'lodash/range';
import { useUserSettingsContext } from '../../utils/userSettings/UserSettingsContext';

export const celsiusToFahrenheit = (celsius: number) => celsius * 1.8 + 32;

type ArrayValuesToObjectArray<T extends Record<string, unknown[]>> = {
  [K in keyof T]: T[K] extends (infer U)[] ? U : never;
};

export const arrayValuesToObjectArray = <T extends Record<string, unknown[]>>(
  input: T,
): ArrayValuesToObjectArray<T>[] => {
  const keys = Object.keys(input) as (keyof T)[];
  const length = (input[keys[0]] || []).length;

  return range(length).map(
    (ind) =>
      keys.reduce<Partial<ArrayValuesToObjectArray<T>>>(
        (acc, key) => ({
          ...acc,
          [key]: input[key][ind],
        }),
        {},
      ) as ArrayValuesToObjectArray<T>,
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
