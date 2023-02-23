import { createMuiTheme } from '@material-ui/core/styles';
import { grey, red } from '@material-ui/core/colors';

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

export const theme = !true ? lightTheme : darkTheme;
