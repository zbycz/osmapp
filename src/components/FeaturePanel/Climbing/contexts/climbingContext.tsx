import React, { createContext, useState } from 'react';
import { ClimbingRoute, Position } from '../types';
import { updateElementOnIndex } from '../utils';

type ImageSize = {
  width: number;
  height: number;
};

type State = 'editRoute' | 'init' | 'pointMenu' | 'routeSelected';

type Action =
  | 'addPoint'
  | 'cancelPointMenu'
  | 'cancelRouteSelection'
  | 'changePointType'
  | 'createRoute'
  | 'deletePoint'
  | 'deleteRoute'
  | 'dragPoint'
  | 'editRoute'
  | 'finishRoute'
  | 'routeSelect'
  | 'showPointMenu'
  | 'undoPoint';

type ActionWithCallback = {
  nextState: State;
  callback: (props: unknown) => void;
};

type Machine = {
  [key in State]: Partial<Record<Action, ActionWithCallback>>;
};

type ClimbingContextType = {
  editorPosition: Position;
  imageSize: ImageSize;
  isPointMoving: boolean;
  isRouteSelected: (routeNumber: number) => boolean;
  isSelectedRouteEditable: boolean;
  pointSelectedIndex: number;
  routes: Array<ClimbingRoute>;
  routeSelectedIndex: number;
  isPointClicked: boolean;
  setIsPointClicked: (isPointClicked: boolean) => void;
  setEditorPosition: (position: Position) => void;
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
  getPixelPosition: (position: Position) => Position;
  getPercentagePosition: (position: Position) => Position;
  useMachine: () => {
    currentState: Partial<Record<Action, ActionWithCallback>>;
    execute: (desiredAction: Action, props?: unknown) => void;
  };
};

export const ClimbingContext = createContext<ClimbingContextType>({
  editorPosition: { x: 0, y: 0 },
  imageSize: {
    width: 0,
    height: 0,
  },
  getPercentagePosition: () => null,
  getPixelPosition: () => null,
  isPointClicked: false,
  isPointMoving: false,
  isRouteSelected: () => null,
  isSelectedRouteEditable: false,
  pointSelectedIndex: null,
  routes: [],
  routeSelectedIndex: null,
  setEditorPosition: () => null,
  setImageSize: () => null,
  setIsPointClicked: () => null,
  setIsPointMoving: () => null,
  setIsSelectedRouteEditable: () => null,
  setPointSelectedIndex: () => null,
  setRoutes: () => null,
  setRouteSelectedIndex: () => null,
  updateRouteOnIndex: () => null,
  useMachine: () => ({ currentState: null, execute: () => null }),
});

export const ClimbingContextProvider = ({ children }) => {
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [isSelectedRouteEditable, setIsSelectedRouteEditable] = useState(false);
  const [routes, setRoutes] = useState<Array<ClimbingRoute>>([]);
  const [isPointMoving, setIsPointMoving] = useState<boolean>(false);
  const [isPointClicked, setIsPointClicked] = useState<boolean>(false);
  const [editorPosition, setEditorPosition] = useState<Position>({
    x: 0,
    y: 0,
  });
  const [routeSelectedIndex, setRouteSelectedIndex] = useState<number>(null);
  const [pointSelectedIndex, setPointSelectedIndex] = useState<number>(null);
  const [currentState, setCurrentState] = useState<State>('init');

  const routeSelect = ({ routeNumber }) => {
    console.log('______TEST');
    setRouteSelectedIndex(routeNumber);
  };
  const states: Machine = {
    init: {
      createRoute: { nextState: 'editRoute', callback: () => null },
      routeSelect: {
        nextState: 'routeSelected',
        callback: routeSelect,
      },
    },
    editRoute: {
      deleteRoute: { nextState: 'init', callback: () => null },
      undoPoint: { nextState: 'editRoute', callback: () => null },
      dragPoint: { nextState: 'editRoute', callback: () => null },
      addPoint: { nextState: 'editRoute', callback: () => null },
      showPointMenu: { nextState: 'pointMenu', callback: () => null },
      finishRoute: { nextState: 'routeSelected', callback: () => null },
    },
    pointMenu: {
      changePointType: { nextState: 'editRoute', callback: () => null },
      deletePoint: { nextState: 'editRoute', callback: () => null },
      cancelPointMenu: { nextState: 'editRoute', callback: () => null },
      finishRoute: { nextState: 'routeSelected', callback: () => null },
    },
    routeSelected: {
      routeSelect: {
        nextState: 'routeSelected',
        callback: routeSelect,
      },
      cancelRouteSelection: { nextState: 'init', callback: () => null },
      editRoute: { nextState: 'editRoute', callback: () => null },
    },
  };

  const useMachine = () => ({
    currentState: states[currentState],
    execute: (desiredAction: Action, props?: unknown) => {
      if (desiredAction in states[currentState]) {
        const { nextState, callback } = states[currentState][desiredAction];
        setCurrentState(nextState);
        console.log('______CHANGE STATE____!', desiredAction, nextState, props);
        callback(props);
        // return states[desiredState];
      }
      // return null;
    },
  });

  const isRouteSelected = (routeNumber: number) =>
    routeSelectedIndex === routeNumber;

  const getPercentagePosition = ({ x, y }: Position) => ({
    x: x / imageSize.width,
    y: y / imageSize.height,
  });

  const getPixelPosition = ({ x, y }: Position) => ({
    x: imageSize.width * x,
    y: imageSize.height * y,
  });

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
    getPercentagePosition,
    getPixelPosition,
    imageSize,
    isPointClicked,
    isPointMoving,
    isRouteSelected,
    isSelectedRouteEditable,
    pointSelectedIndex,
    routes,
    routeSelectedIndex,
    setEditorPosition,
    setImageSize,
    setIsPointClicked,
    setIsPointMoving,
    setIsSelectedRouteEditable,
    setPointSelectedIndex,
    setRoutes,
    setRouteSelectedIndex,
    updateRouteOnIndex,
    useMachine,
  };

  return (
    <ClimbingContext.Provider value={climbingState}>
      {children}
    </ClimbingContext.Provider>
  );
};
