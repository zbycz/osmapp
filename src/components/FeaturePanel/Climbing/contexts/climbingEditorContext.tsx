import { createContext } from 'react';
import { ClimbingRoute } from '../types';

type ImageSize = {
  width: number;
  height: number;
};
type ClimbingEditorContextType = {
  imageSize: ImageSize;
  isSelectedRouteEditable: boolean;
  routes: Array<ClimbingRoute>;
  routeSelectedIndex: number;
  pointSelectedIndex: number;
  setImageSize: (ImageSize) => void;
  setIsSelectedRouteEditable: (isSelectedRouteEditable: boolean) => void;
  setRoutes: (routes: Array<ClimbingRoute>) => void;
  setRouteSelectedIndex: (routeSelectedIndex: number) => void;
  setPointSelectedIndex: (pointSelectedIndex: number) => void;
};

export const ClimbingEditorContext = createContext<ClimbingEditorContextType>({
  imageSize: {
    width: 0,
    height: 0,
  },
  setImageSize: () => null,
  isSelectedRouteEditable: false,
  routes: [],
  routeSelectedIndex: null,
  pointSelectedIndex: null,
  setIsSelectedRouteEditable: () => null,
  setRoutes: () => null,
  setRouteSelectedIndex: () => null,
  setPointSelectedIndex: () => null,
});

export const ClimbingEditorContextProvider = ClimbingEditorContext.Provider;
