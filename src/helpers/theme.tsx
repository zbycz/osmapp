import Cookies from 'js-cookie';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { grey, red } from '@material-ui/core/colors';
import React, { createContext, useContext, useMemo, useState } from 'react';
import { useMediaQuery } from '@material-ui/core';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';

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
      hover: '#f2f3f2',
      searchBox: '#eb5757',
      mapFooter: '#f8f4f0', // same as osm-bright
    },
    text: {
      panelHeading: 'rgba(0, 0, 0, 0.7)',
      primary: '#000',
      primaryInvert: '#fff',
    },
    appBackground: '#f8f4f0',
    panelBackground: '#fafafa',
    link: '#0078a8',
    invertFilter: 'invert(0)',
  } as unknown,
});

const darkTheme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: {
      main: '#ffb74d',
    },
    secondary: {
      main: '#737373',
    },
    error: {
      main: red.A400,
    },
    background: {
      default: grey['800'],
      hover: grey['700'],
      searchBox: '#963838',
      mapFooter: grey['800'],
    },
    text: {
      panelHeading: 'rgba(255, 255, 255, 0.85)',
      primary: '#fff',
      primaryInvert: '#000',
    },
    appBackground: grey['900'],
    panelBackground: grey['800'],
    link: '#0fbbff',
    invertFilter: 'invert(1)',
  } as unknown,
});

type UserTheme = 'system' | 'light' | 'dark';

type UserThemeContextType = {
  userTheme: UserTheme;
  setUserTheme: (choice: UserTheme) => void;
  theme: typeof lightTheme | typeof darkTheme;
  currentTheme: 'light' | 'dark';
};

export const UserThemeContext = createContext<UserThemeContextType>(undefined);

const useGetCurrentTheme = (userTheme: UserTheme) => {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  return useMemo(() => {
    if (userTheme === 'system') {
      return prefersDarkMode ? 'dark' : 'light';
    }
    return userTheme;
  }, [userTheme, prefersDarkMode]);
};

export const UserThemeProvider = ({ children, userThemeCookie }) => {
  const [userTheme, setUserThemeState] = useState<UserTheme>(
    userThemeCookie ?? 'system',
  );
  const currentTheme = useGetCurrentTheme(userTheme);
  const theme = currentTheme === 'dark' ? darkTheme : lightTheme;

  const setUserTheme = (choice: UserTheme) => {
    setUserThemeState(choice);
    Cookies.set('userTheme', choice, { expires: 30 * 12 * 10, path: '/' });
  };

  return (
    <UserThemeContext.Provider
      value={{
        userTheme,
        setUserTheme,
        currentTheme,
        theme,
      }}
    >
      <ThemeProvider theme={theme}>
        <StyledThemeProvider theme={theme}>{children}</StyledThemeProvider>
      </ThemeProvider>
    </UserThemeContext.Provider>
  );
};

export const useUserThemeContext = () => useContext(UserThemeContext);
