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
  setImageSize: (ImageSize) => void;
  setIsSelectedRouteEditable: (isSelectedRouteEditable: boolean) => void;
  setRoutes: (routes: Array<ClimbingRoute>) => void;
  setRouteSelectedIndex: (routeSelectedIndex: number) => void;
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
  setIsSelectedRouteEditable: () => null,
  setRoutes: () => null,
  setRouteSelectedIndex: () => null,
});

export const ClimbingEditorContextProvider = ClimbingEditorContext.Provider;
