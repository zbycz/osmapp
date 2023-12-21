import { useTheme } from '@material-ui/core';

export const useConfig = () => {
  const theme = useTheme();

  const activeColor = theme.textSecondaryHighlight;
  const inactiveColor = theme.backgroundSurfaceElevation0;
  const borderColor = theme.borderInverse;

  return {
    pathBorderColor: borderColor,
    pathBorderColorSelected: inactiveColor,
    pathStrokeColor: inactiveColor,
    pathStrokeColorSelected: activeColor,
    routeNumberBackgroundSelected: activeColor,
    routeNumberBackground: inactiveColor,
    routeNumberTextColorSelected: inactiveColor,
    routeNumberTextColor: activeColor,
    routeNumberBorderColorSelected: inactiveColor,
    routeNumberBorderColor: activeColor,
    belayColor: inactiveColor,
    belayColorSelected: activeColor,
    belayBorderColor: borderColor,
    belayBorderColorSelected: inactiveColor,

    pathBorderWidth: 6,
    pathBorderOpacity: 0.8,
    pathStrokeWidth: 4,
  };
};
