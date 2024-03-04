import { useTheme } from '@material-ui/core';
import { useClimbingContext } from './contexts/ClimbingContext';

export const useConfig = () => {
  const theme: any = useTheme();
  const { photoZoom } = useClimbingContext();

  const activeColor = theme.palette.climbing.active;
  const inactiveColor = theme.palette.climbing.inactive;
  const borderColor = theme.palette.climbing.border;
  const selectedColor = theme.palette.climbing.selected;

  return {
    pathBorderColor: borderColor,
    pathBorderColorSelected: inactiveColor,
    pathStrokeColor: inactiveColor,
    pathStrokeColorSelected: selectedColor,
    routeNumberBackgroundSelected: activeColor,
    routeNumberBackground: inactiveColor,
    routeNumberTextColorSelected: inactiveColor,
    routeNumberTextColor: activeColor,
    routeNumberBorderColorSelected: inactiveColor,
    routeNumberBorderColor: activeColor,
    anchorColor: inactiveColor,
    anchorColorSelected: activeColor,
    anchorBorderColor: borderColor,
    anchorBorderColorSelected: inactiveColor,

    pathBorderWidth: 5 / photoZoom.scale,
    pathBorderOpacity: 1,
    pathStrokeWidth: 4 / photoZoom.scale,
  };
};
