import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { grey, red } from '@material-ui/core/colors';
import { useEffect, useState } from 'react';
import { useMediaQuery } from '@material-ui/core';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';

// Create a theme instance.
const lightTheme = createMuiTheme({
  palette: {
    primary: {
      main: '#556cd6',
    },
    secondary: {
      main: '#737373',
    },
    error: {
      main: red.A400,
    },
    background: {
      default: '#fff',
    },
    appBackground: '#f8f4f0',
    panelBackground: '#fafafa',
  } as unknown,
});

const darkTheme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: {
      main: '#556cd6',
    },
    secondary: {
      main: '#737373',
    },
    error: {
      main: red.A400,
    },
    background: {
      default: grey['800'],
    },
    appBackground: grey['900'],
    panelBackground: grey['800'],
  } as unknown,
});

const getTheme = (
  userChoice: 'light' | 'dark' | 'system',
  prefersDarkMode: boolean,
) => {
  if (userChoice === 'system') {
    return prefersDarkMode ? 'dark' : 'light';
  }
  return userChoice;
};

export const ThemeContextProvider = ({ children }) => {
  const [userChoice, setUserChoice] =
    useState<'light' | 'dark' | 'system'>('system');
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [current, setCurrent] = useState(getTheme(userChoice, prefersDarkMode));

  useEffect(() => {
    setCurrent(getTheme(userChoice, prefersDarkMode));
  }, [userChoice, prefersDarkMode]);

  const theme = current === 'dark' ? darkTheme : lightTheme;

  return (
    <ThemeProvider theme={theme}>
      <StyledThemeProvider theme={theme}>{children}</StyledThemeProvider>
    </ThemeProvider>
  );
};
