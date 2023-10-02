import React, { createContext, useState } from 'react';
import { ClimbingRoute, EditorPosition } from '../types';
import { updateElementOnIndex } from '../utils';

type ImageSize = {
  width: number;
  height: number;
};

type ClimbingContextType = {
  editorPosition: EditorPosition;
  imageSize: ImageSize;
  isPointMoving: boolean;
  isRouteSelected: (routeNumber: number) => boolean;
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
  isRouteSelected: () => null,
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

export const ClimbingContextProvider = ({ children }) => {
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [isSelectedRouteEditable, setIsSelectedRouteEditable] = useState(false);
  const [routes, setRoutes] = useState<Array<ClimbingRoute>>([]);
  const [isPointMoving, setIsPointMoving] = useState<boolean>(false);
  const [editorPosition, setEditorPosition] = useState<EditorPosition>({
    top: 0,
    left: 0,
  });
  const [routeSelectedIndex, setRouteSelectedIndex] = useState<number>(null);
  const [pointSelectedIndex, setPointSelectedIndex] = useState<number>(null);

  const isRouteSelected = (routeNumber: number) =>
    routeSelectedIndex === routeNumber;

  const updateRouteOnIndex = (
    routeIndex: number,
    callback?: (route: ClimbingRoute) => ClimbingRoute,
  ) => {
    const updatedArray = updateElementOnIndex<ClimbingRoute>(
      routes,
      routeIndex,
      callback,
    );
    setRoutes(updatedArray);
  };

  const climbingState = {
    editorPosition,
    imageSize,
    isPointMoving,
    isSelectedRouteEditable,
    pointSelectedIndex,
    routes,
    routeSelectedIndex,
    setEditorPosition,
    setImageSize,
    setIsPointMoving,
    setIsSelectedRouteEditable,
    setPointSelectedIndex,
    setRoutes,
    setRouteSelectedIndex,
    updateRouteOnIndex,
    isRouteSelected,
  };

  return (
    <ClimbingContext.Provider value={climbingState}>
      {children}
    </ClimbingContext.Provider>
  );
};
