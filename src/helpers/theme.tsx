import Cookies from 'js-cookie';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { grey, red } from '@material-ui/core/colors';
import React, { createContext, useContext, useMemo, useState } from 'react';
import { useMediaQuery } from '@material-ui/core';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';

// @TODO lets define design properly, this is just a copy&paste
const customTheme = {
  light: {
    transparent: '#00000000',
    backgroundSurfaceElevationNegative: '#eeeeeeff',
    backgroundSurfaceElevation0: '#f6f6f6ff',
    backgroundSurfaceElevation1: '#ffffffff',
    backgroundSurfaceElevation2: '#f6f6f6ff',
    backgroundSurfaceElevation3: '#ffffffff',
    backgroundPrimaryDefault: '#0f6148ff',
    backgroundPrimaryPressed: '#0a4231ff',
    backgroundPrimarySubtleOnElevation0: '#d6efe8ff',
    backgroundPrimarySubtleOnElevation1: '#f0f9f6ff',
    backgroundSecondaryDefault: '#00854dff',
    backgroundSecondaryPressed: '#004d2dff',
    backgroundTertiaryDefaultOnElevation0: '#eeeeeeff',
    backgroundTertiaryDefaultOnElevation1: '#f6f6f6ff',
    backgroundTertiaryPressedOnElevation0: '#e2e2e2ff',
    backgroundTertiaryPressedOnElevation1: '#eeeeeeff',
    backgroundNeutralBold: '#171717ff',
    backgroundNeutralSubdued: '#cbcbcbff',
    backgroundNeutralDisabled: '#eeeeeeff',
    backgroundNeutralSubtleOnElevation0: '#eeeeeeff',
    backgroundNeutralSubtleOnElevation1: '#f6f6f6ff',
    backgroundAlertRedBold: '#cd4949ff',
    backgroundAlertRedSubtleOnElevation0: '#f3d3d3ff',
    backgroundAlertRedSubtleOnElevation1: '#fbefefff',
    backgroundAlertYellowBold: '#f7bf2fff',
    backgroundAlertYellowSubtleOnElevation0: '#fdeec9ff',
    backgroundAlertYellowSubtleOnElevation1: '#fef9ebff',
    backgroundAlertBlueBold: '#0078acff',
    backgroundAlertBlueSubtleOnElevation0: '#d5e9f1ff',
    backgroundAlertBlueSubtleOnElevation1: '#f0f7faff',
    backGroundOnboardingCard: '#FFFFFFBD',
    textDefault: '#171717ff',
    textDefaultInverse: '#ffffffff',
    textSubdued: '#616161ff',
    textSecondaryHighlight: '#00854dff',
    textOnPrimary: '#ffffffff',
    textOnSecondary: '#ffffffff',
    textOnTertiary: '#333333ff',
    textDisabled: '#999999ff',
    textPrimaryDefault: '#0f6148ff',
    textPrimaryPressed: '#0a4231ff',
    textAlertRed: '#ac3939ff',
    textAlertYellow: '#c28c00ff',
    textAlertBlue: '#00597fff',
    iconDefault: '#171717ff',
    iconSubdued: '#616161ff',
    iconOnPrimary: '#ffffffff',
    iconOnSecondary: '#ffffffff',
    iconOnTertiary: '#333333ff',
    iconDisabled: '#999999ff',
    iconPrimaryDefault: '#0f6148ff',
    iconPrimaryPressed: '#0a4231ff',
    iconAlertRed: '#ac3939ff',
    iconAlertYellow: '#c28c00ff',
    iconAlertBlue: '#00597fff',
    gradientNeutralBottomFadeSurfaceElevation1Start: '#FFFFFF33',
    gradientNeutralBottomFadeSurfaceElevation1End: '#FFFFFF',
    borderFocus: '#e2e2e2ff',
    borderDashed: '#cbcbcbff',
    borderOnElevation0: '#e2e2e2ff',
    borderOnElevation1: '#eeeeeeff',
    borderInverse: '#555555ff',
    borderSecondary: '#00854dff',
    borderAlertRed: '#cd4949ff',
    borderSubtleInverted: '#ffffff99',
  },
  dark: {
    transparent: '#00000000',
    backgroundSurfaceElevationNegative: '#000000ff',
    backgroundSurfaceElevation0: '#0a0a0aff',
    backgroundSurfaceElevation1: '#161716ff',
    backgroundSurfaceElevation2: '#1c1e1cff',
    backgroundSurfaceElevation3: '#242524ff',
    backgroundPrimaryDefault: '#61dbb7ff',
    backgroundPrimaryPressed: '#a7f1dbff',
    backgroundPrimarySubtleOnElevation0: '#0d211bff',
    backgroundPrimarySubtleOnElevation1: '#0e2f25ff',
    backgroundSecondaryDefault: '#2fbc81ff',
    backgroundSecondaryPressed: '#74dcb1ff',
    backgroundTertiaryDefaultOnElevation0: '#161716ff',
    backgroundTertiaryDefaultOnElevation1: '#1c1e1cff',
    backgroundTertiaryPressedOnElevation0: '#1c1e1cff',
    backgroundTertiaryPressedOnElevation1: '#242524ff',
    backgroundNeutralBold: '#ffffffff',
    backgroundNeutralSubdued: '#373938ff',
    backgroundNeutralDisabled: '#242524ff',
    backgroundNeutralSubtleOnElevation0: '#161716ff',
    backgroundNeutralSubtleOnElevation1: '#1c1e1cff',
    backgroundAlertRedBold: '#ac3e3eff',
    backgroundAlertRedSubtleOnElevation0: '#220c0cff',
    backgroundAlertRedSubtleOnElevation1: '#2d1010ff',
    backgroundAlertYellowBold: '#cb9b20ff',
    backgroundAlertYellowSubtleOnElevation0: '#281e06ff',
    backgroundAlertYellowSubtleOnElevation1: '#352808ff',
    backgroundAlertBlueBold: '#1a6e92ff',
    backgroundAlertBlueSubtleOnElevation0: '#071d27ff',
    backgroundAlertBlueSubtleOnElevation1: '#092734ff',
    backGroundOnboardingCard: '#000000BD',
    textDefault: '#ffffffff',
    textDefaultInverse: '#ffffffff',
    textSubdued: '#a2a4a3ff',
    textSecondaryHighlight: '#2fbc81ff',
    textOnPrimary: '#000000ff',
    textOnSecondary: '#000000ff',
    textOnTertiary: '#e1e1e1ff',
    textDisabled: '#6a6c6bff',
    textPrimaryDefault: '#61dbb7ff',
    textPrimaryPressed: '#a7f1dbff',
    textAlertRed: '#c66262ff',
    textAlertYellow: '#c29729ff',
    textAlertBlue: '#2290bfff',
    iconDefault: '#ffffffff',
    iconSubdued: '#a2a4a3ff',
    iconOnPrimary: '#000000ff',
    iconOnSecondary: '#000000ff',
    iconOnTertiary: '#e1e1e1ff',
    iconDisabled: '#6a6c6bff',
    iconPrimaryDefault: '#61dbb7ff',
    iconPrimaryPressed: '#a7f1dbff',
    iconAlertRed: '#c66262ff',
    iconAlertYellow: '#c29729ff',
    iconAlertBlue: '#2290bfff',
    gradientNeutralBottomFadeSurfaceElevation1Start: '#00000033',
    gradientNeutralBottomFadeSurfaceElevation1End: '#000000',
    borderFocus: '#242524ff',
    borderDashed: '#242524ff',
    borderOnElevation0: '#1c1e1cff',
    borderOnElevation1: '#242524ff',
    borderInverse: '#ffffffff',
    borderSecondary: '#2fbc81ff',
    borderAlertRed: '#ac3e3eff',
    borderSubtleInverted: '#00000099',
  },
};

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
    panelScrollCover: 'rgba(0, 0, 0, 0.2)',
    link: '#0078a8',
    invertFilter: 'invert(0)',
  } as unknown,
  ...customTheme.light,
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
    panelScrollCover: 'rgba(255, 255, 255, 0.3)',
    link: '#0fbbff',
    invertFilter: 'invert(1)',
  } as unknown,
  ...customTheme.dark,
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
