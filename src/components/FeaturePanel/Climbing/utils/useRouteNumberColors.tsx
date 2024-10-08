import { useTheme } from '@mui/material';

type RouteNumberColorsParams = {
  isSelected?: boolean;
  hasPathOnThisPhoto?: boolean;
  isOnThisPhoto?: boolean;
  hasPathInDifferentPhoto?: boolean;
  isOnDifferentPhoto?: boolean;
};

export const useRouteNumberColors = ({
  isSelected,
  hasPathOnThisPhoto,
  isOnThisPhoto,
  hasPathInDifferentPhoto,
  isOnDifferentPhoto,
}: RouteNumberColorsParams) => {
  const theme: any = useTheme();
  const { climbing } = theme.palette;

  if (hasPathOnThisPhoto && isSelected) {
    return {
      background: climbing.secondary,
      text: climbing.primary,
      border: `solid 1px ${climbing.secondary}`,
    };
  }
  if (hasPathOnThisPhoto) {
    return {
      background: climbing.primary,
      text: climbing.secondary,
      border: `solid 1px ${climbing.primary}`,
    };
  }
  if (isOnThisPhoto) {
    return {
      background: climbing.primary,
      text: climbing.secondary,
      border: `dashed 1px ${climbing.tertiary}`,
    };
  }
  if (hasPathInDifferentPhoto) {
    return {
      background: 'transparent',
      text: climbing.secondary,
      border: `solid 1px ${climbing.tertiary}`,
    };
  }
  if (isOnDifferentPhoto) {
    return {
      background: 'transparent',
      text: climbing.secondary,
      border: `dashed 1px ${climbing.tertiary}`,
    };
  }

  return {
    background: 'transparent',
    text: climbing.secondary,
    border: 'solid 1px transparent',
  };
};
