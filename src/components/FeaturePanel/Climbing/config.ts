import { useTheme } from '@mui/material';
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

    anchorColor: inactiveColor,
    anchorColorSelected: activeColor,
    anchorBorderColor: borderColor,
    anchorBorderColorSelected: inactiveColor,

    pathBorderWidth: 5.1 / photoZoom.scale,
    pathBorderOpacity: 1,
    pathStrokeWidth: 3.5 / photoZoom.scale,
  };
};

export const CLIMBING_ROUTE_ROW_HEIGHT = 50;
export const DIALOG_TOP_BAR_HEIGHT = 56;
export const SPLIT_PANE_DEFAULT_HEIGHT = '60vh';
