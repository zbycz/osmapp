import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { grey, red } from '@material-ui/core/colors';
import React, { createContext, useContext, useMemo } from 'react';
import { useMediaQuery } from '@material-ui/core';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { usePersistedState } from '../components/utils/usePersistedState';

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
      hover: grey['700'],
      searchBox: '#963838',
    },
    appBackground: grey['900'],
    panelBackground: grey['800'],
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

export const UserThemeProvider = ({ children }) => {
  const [userTheme, setUserTheme] = usePersistedState<UserTheme>(
    'userTheme',
    'system',
  );
  const currentTheme = useGetCurrentTheme(userTheme);
  const theme = currentTheme === 'dark' ? darkTheme : lightTheme;

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
