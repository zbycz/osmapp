import Cookies from 'js-cookie';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { grey, red } from '@material-ui/core/colors';
import React, { createContext, useContext, useMemo, useState } from 'react';
import { useMediaQuery } from '@material-ui/core';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';

// @TODO: Fix theme types according to https://mui.com/material-ui/customization/theming/#typescript

const lightTheme = createMuiTheme({
  palette: {
    primary: {
      main: '#556cd6',
    },
    secondary: {
      main: '#737373',
    },
    tertiary: {
      main: '#0078a8',
    },
    error: {
      main: red.A400,
    },
    background: {
      default: '#f6f6f6ff',
      paper: '#fafafa',
      hover: '#f2f3f2',
      searchBox: '#eb5757',
    },
    invertFilter: 'invert(0)',
    climbing: {
      text: '#0f6148ff',
      active: '#00854dff',
      inactive: '#f6f6f6ff',
      border: '#555555ff',
      selected: '#000000',
    },
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
    tertiary: {
      main: '#0fbbff',
    },
    error: {
      main: red.A400,
    },

    background: {
      default: '#303030',
      paper: '#424242',
      hover: grey['700'],
      searchBox: '#963838',
    },
    invertFilter: 'invert(1)',
    climbing: {
      text: '#61dbb7ff',
      active: '#2fbc81ff',
      inactive: '#0a0a0aff',
      border: '#ffffffff',
      selected: '#fff',
    },
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
