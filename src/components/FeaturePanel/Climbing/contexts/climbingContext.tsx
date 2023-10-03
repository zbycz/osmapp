import React, { createContext, useState } from 'react';
import { ClimbingRoute, Position } from '../types';
import { updateElementOnIndex } from '../utils';

type ImageSize = {
  width: number;
  height: number;
};

type State =
  | 'editRoute'
  | 'init'
  | 'pointMenu'
  | 'routeSelected'
  | 'routeSelected';

type Action =
  | 'addPoint'
  | 'cancelPointMenu'
  | 'cancelRouteSelection'
  | 'changePointType'
  | 'changeRouteSelection'
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
  callback: () => void;
};

type Machine = {
  [key in State]: Partial<Record<Action, ActionWithCallback>>;
};

const states: Machine = {
  init: {
    createRoute: { nextState: 'editRoute', callback: () => null },
    routeSelect: { nextState: 'routeSelected', callback: () => null },
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
    changeRouteSelection: { nextState: 'routeSelected', callback: () => null },
    cancelRouteSelection: { nextState: 'init', callback: () => null },
    editRoute: { nextState: 'editRoute', callback: () => null },
  },
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
    currentState: ActionWithCallback;
    execute: (desiredAction: Action) => void;
  };
};

export const ClimbingContext = createContext<ClimbingContextType>({
  editorPosition: { x: 0, y: 0 },
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
  getPixelPosition: () => null,
  getPercentagePosition: () => null,
  useMachine: () => ({ currentState: null, execute: () => null }),
});

console.log(states);

// const {machine} = useMachine()
// machine.init();

export const ClimbingContextProvider = ({ children }) => {
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [isSelectedRouteEditable, setIsSelectedRouteEditable] = useState(false);
  const [routes, setRoutes] = useState<Array<ClimbingRoute>>([]);
  const [isPointMoving, setIsPointMoving] = useState<boolean>(false);
  const [editorPosition, setEditorPosition] = useState<Position>({
    x: 0,
    y: 0,
  });
  const [routeSelectedIndex, setRouteSelectedIndex] = useState<number>(null);
  const [pointSelectedIndex, setPointSelectedIndex] = useState<number>(null);
  const [currentState, setCurrentState] = useState<State>('init');

  const useMachine = () => ({
    currentState: states[currentState],
    execute: (desiredAction: Action) => {
      if (desiredAction in states[currentState]) {
        const { nextState } = states[currentState][desiredAction];
        setCurrentState(nextState);
        console.log('______CHANGE STATE____', desiredAction, nextState);
        // return states[desiredState];
      }
      // return null;
    },
  });

  // const machine = useMachine();
  // machine.createRoute.callback();

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
    getPixelPosition,
    getPercentagePosition,
    useMachine,
  };

  return (
    <ClimbingContext.Provider value={climbingState}>
      {children}
    </ClimbingContext.Provider>
  );
};
