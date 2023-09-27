import { createContext } from 'react';
import { ClimbingRoute } from '../types';

type ImageSize = {
  width: number;
  height: number;
};
export type EditorPosition = { top: number; left: number };

type ClimbingContextType = {
  imageSize: ImageSize;
  isSelectedRouteEditable: boolean;
  routes: Array<ClimbingRoute>;
  routeSelectedIndex: number;
  pointSelectedIndex: number;
  editorPosition: EditorPosition;
  setEditorPosition: (position: EditorPosition) => void;
  setImageSize: (ImageSize) => void;
  setIsSelectedRouteEditable: (isSelectedRouteEditable: boolean) => void;
  setRoutes: (routes: Array<ClimbingRoute>) => void;
  setRouteSelectedIndex: (routeSelectedIndex: number) => void;
  setPointSelectedIndex: (pointSelectedIndex: number) => void;
  updateRouteOnIndex: (
    routeIndex: number,
    callback?: (route: ClimbingRoute) => ClimbingRoute,
  ) => void;
};

export const ClimbingContext = createContext<ClimbingContextType>({
  imageSize: {
    width: 0,
    height: 0,
  },
  setImageSize: () => null,
  isSelectedRouteEditable: false,
  routes: [],
  routeSelectedIndex: null,
  pointSelectedIndex: null,
  editorPosition: { top: 0, left: 0 },
  setEditorPosition: () => null,
  setIsSelectedRouteEditable: () => null,
  setRoutes: () => null,
  setRouteSelectedIndex: () => null,
  setPointSelectedIndex: () => null,
  updateRouteOnIndex: () => null,
});

export const ClimbingContextProvider = ClimbingContext.Provider;
