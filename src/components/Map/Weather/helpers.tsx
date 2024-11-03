import styled from '@emotion/styled';
import { useEffect } from 'react';

export const celsiusToFahrenheit = (celsius: number) => celsius * 1.8 + 32;

export const CenteredText = styled.h3`
  text-align: center;
`;

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
