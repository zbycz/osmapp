import { createContext } from 'react';
import { ClimbingRoute, EditorPosition } from '../types';

type ImageSize = {
  width: number;
  height: number;
};

type ClimbingContextType = {
  editorPosition: EditorPosition;
  imageSize: ImageSize;
  isPointMoving: boolean;
  isSelectedRouteEditable: boolean;
  pointSelectedIndex: number;
  routes: Array<ClimbingRoute>;
  routeSelectedIndex: number;
  setEditorPosition: (position: EditorPosition) => void;
  setImageSize: (ImageSize) => void;
  setIsPointMoving: (isPointMoving: boolean) => void;
  setIsSelectedRouteEditable: (isSelectedRouteEditable: boolean) => void;
  setPointSelectedIndex: (pointSelectedIndex: number) => void;
  setRoutes: (routes: Array<ClimbingRoute>) => void;
  setRouteSelectedIndex: (routeSelectedIndex: number) => void;
  updateRouteOnIndex: (
    routeIndex: number,
    callback?: (route: ClimbingRoute) => ClimbingRoute,
  ) => void;
};

export const ClimbingContext = createContext<ClimbingContextType>({
  editorPosition: { top: 0, left: 0 },
  imageSize: {
    width: 0,
    height: 0,
  },
  isPointMoving: false,
  isSelectedRouteEditable: false,
  pointSelectedIndex: null,
  routes: [],
  routeSelectedIndex: null,
  setEditorPosition: () => null,
  setImageSize: () => null,
  setIsPointMoving: () => null,
  setIsSelectedRouteEditable: () => null,
  setPointSelectedIndex: () => null,
  setRoutes: () => null,
  setRouteSelectedIndex: () => null,
  updateRouteOnIndex: () => null,
});

export const ClimbingContextProvider = ClimbingContext.Provider;
