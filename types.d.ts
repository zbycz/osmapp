import {
  Palette as MuiPalette,
  PaletteOptions as MuiPaletteOptions,
  TypeBackground as MuiTypeBackground,
} from '@mui/material/styles/createPalette';

declare module '@mui/material/styles' {
  interface Palette extends MuiPalette {
    tertiary: Palette['primary'];
    invertFilter: string;
    climbing: {
      primary: string;
      secondary: string;
      tertiary: string;
      tick: string;
      active: string;
      inactive: string;
      border: string;
      selected: string;
    };
  }

  interface PaletteOptions extends MuiPaletteOptions {
    tertiary?: MuiPaletteOptions['primary'];
    invertFilter?: string;
    climbing?: {
      primary: string;
      secondary: string;
      tertiary: string;
      tick: string;
      active: string;
      inactive: string;
      border: string;
      selected: string;
    };
  }

  interface TypeBackground extends MuiTypeBackground {
    elevation?: string;
    hover?: string;
    searchBox?: string;
    searchInput?: string;
    searchInputPanel?: string;
  }

  interface Theme {
    palette: Palette;
  }

  interface ThemeOptions {
    palette?: PaletteOptions;
  }
}
