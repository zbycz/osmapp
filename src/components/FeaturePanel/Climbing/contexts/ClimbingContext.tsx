import React, { createContext, useContext, useState } from 'react';
import { ClimbingRoute, Position } from '../types';
import { updateElementOnIndex } from '../utils';
import { emptyRoute } from '../utils/emptyRoute';

type ImageSize = {
  width: number;
  height: number;
};

type State =
  | 'editRoute'
  | 'extendRoute'
  | 'init'
  | 'pointMenu'
  | 'routeSelected';

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
  | 'extendRoute'
  | 'finishRoute'
  | 'routeSelect'
  | 'showPointMenu'
  | 'undoPoint';

type ActionWithCallback = {
  nextState: State;
  callback?: (props: unknown) => void;
};

type Machine = {
  [key in State]: Partial<Record<Action, ActionWithCallback>>;
};

type ClimbingContextType = {
  editorPosition: Position;
  imageSize: ImageSize;
  isPointMoving: boolean;
  isRouteSelected: (routeNumber: number) => boolean;
  pointSelectedIndex: number;
  routes: Array<ClimbingRoute>;
  routeSelectedIndex: number;
  isPointClicked: boolean;
  setIsPointClicked: (isPointClicked: boolean) => void;
  setEditorPosition: (position: Position) => void;
  setImageSize: (ImageSize) => void;
  splitPaneHeight: number;
  setSplitPaneHeight: (height: number) => void;
  setIsPointMoving: (isPointMoving: boolean) => void;

  setPointSelectedIndex: (pointSelectedIndex: number) => void;
  setRoutes: (routes: Array<ClimbingRoute>) => void;
  setRouteSelectedIndex: (routeSelectedIndex: number) => void;
  updateRouteOnIndex: (
    routeIndex: number,
    callback?: (route: ClimbingRoute) => ClimbingRoute,
  ) => void;
  getPixelPosition: (position: Position) => Position;
  getPercentagePosition: (position: Position) => Position;
  getPositionWithoutEditor: (position: Position) => Position;
  useMachine: () => {
    currentState: Partial<Record<Action, ActionWithCallback>>;
    currentStateName: State;
    execute: (desiredAction: Action, props?: unknown) => void;
  };
  scrollOffset: Position;
  setScrollOffset: (scrollOffset: Position) => void;
  findClosestPoint: (position: Position) => Position | null;
  areRoutesVisible: boolean;
  setAreRoutesVisible: (areRoutesVisible: boolean) => void;
  mousePosition: Position;
  setMousePosition: (mousePosition: Position | null) => void;
  pointElement: null | HTMLElement;
  setPointElement: (pointElement: null | HTMLElement) => void;
  moveRoute: (from: number, to: number) => void;
};

export const ClimbingContext = createContext<ClimbingContextType>({
  editorPosition: { x: 0, y: 0 },
  imageSize: {
    width: 0,
    height: 0,
  },
  getPercentagePosition: () => null,
  mousePosition: { x: 0, y: 0 },
  setMousePosition: () => null,
  getPixelPosition: () => null,
  getPositionWithoutEditor: () => null,
  isPointClicked: false,
  isPointMoving: false,
  isRouteSelected: () => null,
  pointSelectedIndex: null,
  routes: [],
  routeSelectedIndex: null,
  setEditorPosition: () => null,
  setImageSize: () => null,
  setIsPointClicked: () => null,
  setIsPointMoving: () => null,
  setPointSelectedIndex: () => null,
  setRoutes: () => null,
  setRouteSelectedIndex: () => null,
  setSplitPaneHeight: () => null,
  splitPaneHeight: 800,
  updateRouteOnIndex: () => null,
  useMachine: () => ({
    currentState: null,
    currentStateName: null,
    execute: () => null,
  }),
  scrollOffset: { x: 0, y: 0 },
  setScrollOffset: () => null,
  findClosestPoint: () => null,
  areRoutesVisible: true,
  setAreRoutesVisible: () => null,
  pointElement: null,
  setPointElement: () => null,
  moveRoute: () => null,
});

export const ClimbingContextProvider = ({ children }) => {
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [routes, setRoutes] = useState<Array<ClimbingRoute>>([]);
  const [splitPaneHeight, setSplitPaneHeight] = useState<number>(800);
  const [isPointMoving, setIsPointMoving] = useState<boolean>(false);
  const [isPointClicked, setIsPointClicked] = useState<boolean>(false);
  const [areRoutesVisible, setAreRoutesVisible] = useState<boolean>(true);
  const [mousePosition, setMousePosition] = useState<Position | null>(null);
  const [editorPosition, setEditorPosition] = useState<Position>({
    x: 0,
    y: 0,
  });
  const [scrollOffset, setScrollOffset] = useState<Position>({
    x: 0,
    y: 0,
  });
  const [routeSelectedIndex, setRouteSelectedIndex] = useState<number>(null);
  const [pointSelectedIndex, setPointSelectedIndex] = useState<number>(null);
  const [currentState, setCurrentState] = useState<State>('init');
  const [pointElement, setPointElement] =
    React.useState<null | HTMLElement>(null);

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

  const moveRoute = (fromIndex: number, toIndex: number) => {
    if (
      fromIndex < routes.length &&
      toIndex < routes.length &&
      fromIndex >= 0 &&
      toIndex >= 0
    ) {
      const itemToMove = routes[fromIndex];
      const newArray = routes.filter((_, index) => index !== fromIndex); // Vytvoří nové pole bez přesunutého prvku
      newArray.splice(toIndex, 0, itemToMove); // Vloží prvek na novou pozici
      setRoutes(newArray);
    }
  };

  const routeSelect = ({ routeNumber }) => {
    setRouteSelectedIndex(routeNumber);
  };

  const cancelRouteSelection = () => {
    setRouteSelectedIndex(null);
  };

  const deletePoint = () => {
    updateRouteOnIndex(routeSelectedIndex, (currentRoute) => ({
      ...currentRoute,
      path: updateElementOnIndex(currentRoute.path, pointSelectedIndex),
    }));
    setPointSelectedIndex(null);
  };

  const editRoute = () => {};
  const extendRoute = () => {};

  const finishRoute = () => {
    setMousePosition(null);
  };

  const createRoute = () => {
    setRouteSelectedIndex(routes.length);
    setRoutes([...routes, emptyRoute]);
  };

  const deleteRoute = () => {
    updateRouteOnIndex(routeSelectedIndex);
    setRouteSelectedIndex(null);
  };

  const undoPoint = () => {
    updateRouteOnIndex(routeSelectedIndex, (route) => ({
      ...route,
      path: route.path.slice(0, -1),
    }));
  };

  const getPixelPosition = ({ x, y }: Position) => ({
    x: imageSize.width * x,
    y: imageSize.height * y,
  });

  const getPercentagePosition = ({ x, y }: Position) => ({
    x: x / imageSize.width,
    y: y / imageSize.height,
  });

  const getPositionWithoutEditor = (position: Position | null) => {
    if (!position) return null;
    const { x, y } = position;
    return {
      x: x - editorPosition.x,
      y: y - editorPosition.y,
    };
  };

  const dragPoint = () => {
    // setIsPointMoving(true);
    // const newCoordinate = getPercentagePosition({
    //   x: position.x - editorPosition.x,
    //   y: position.y - editorPosition.y,
    // });
    // updateRouteOnIndex(routeSelectedIndex, (route) => ({
    //   ...route,
    //   path: updateElementOnIndex(route.path, pointSelectedIndex, (point) => ({
    //     ...point,
    //     x: newCoordinate.x,
    //     y: newCoordinate.y,
    //   })),
    // }));
  };

  const changePointType = ({ type }) => {
    updateRouteOnIndex(routeSelectedIndex, (currentRoute) => ({
      ...currentRoute,
      path: updateElementOnIndex(
        currentRoute.path,
        pointSelectedIndex,
        (point) => ({
          ...point,
          type,
        }),
      ),
    }));
  };

  const getCloserPoint = ({
    to,
    point1,
    point2,
  }: {
    to: Position;
    point1: Position;
    point2: Position;
  }) => {
    const distanceTo1 = Math.sqrt(point1.x - to.x ** 2 + point1.y - to.y ** 2);
    const distanceTo2 = Math.sqrt(point2.x - to.x ** 2 + point2.y - to.y ** 2);

    if (distanceTo1 < distanceTo2) {
      return point1;
    }
    return point2;
  };

  // @TODO findCloserPoint
  const findClosestPoint = (checkedPosition: Position) => {
    // PositionPx
    if (!routeSelectedIndex) return null;

    const STICKY_THRESHOLD = 0.015;

    return routes
      .map((route, index) => {
        const isCurrentRoute = index === routeSelectedIndex;
        if (isCurrentRoute) return [];
        return route.path;
      })
      .flat()
      .reduce((closestPoint, point) => {
        const isPointNearby =
          checkedPosition.x - STICKY_THRESHOLD < point.x &&
          checkedPosition.x + STICKY_THRESHOLD > point.x &&
          checkedPosition.y - STICKY_THRESHOLD < point.y &&
          checkedPosition.y + STICKY_THRESHOLD > point.y;

        if (isPointNearby) {
          console.log(
            '_____isPointNearby',
            closestPoint,
            checkedPosition,
            point,
          );
          if (closestPoint) {
            // console.log('_____closestPoint');
            return getCloserPoint({
              to: checkedPosition,
              point1: closestPoint,
              point2: point,
            });
          }
          return point;
        }
        return closestPoint;
      }, null);
  };

  const states: Machine = {
    init: {
      createRoute: { nextState: 'extendRoute', callback: createRoute },
      editRoute: { nextState: 'editRoute', callback: editRoute },
      routeSelect: {
        nextState: 'routeSelected',
        callback: routeSelect,
      },
    },
    editRoute: {
      deleteRoute: { nextState: 'init', callback: deleteRoute },

      dragPoint: { nextState: 'editRoute', callback: dragPoint },
      addPoint: { nextState: 'editRoute', callback: () => null },
      showPointMenu: { nextState: 'pointMenu' },
      finishRoute: { nextState: 'routeSelected', callback: finishRoute },
      extendRoute: { nextState: 'extendRoute', callback: extendRoute },
    },
    extendRoute: {
      finishRoute: { nextState: 'routeSelected', callback: finishRoute },
      undoPoint: { nextState: 'extendRoute', callback: undoPoint },
    },
    pointMenu: {
      changePointType: { nextState: 'editRoute', callback: changePointType },
      deletePoint: { nextState: 'editRoute', callback: deletePoint },
      cancelPointMenu: { nextState: 'editRoute' },
      finishRoute: { nextState: 'routeSelected', callback: finishRoute },
    },
    routeSelected: {
      createRoute: { nextState: 'extendRoute', callback: createRoute },
      routeSelect: {
        nextState: 'routeSelected',
        callback: routeSelect,
      },
      cancelRouteSelection: {
        nextState: 'init',
        callback: cancelRouteSelection,
      },
      editRoute: { nextState: 'editRoute', callback: editRoute },
    },
  };

  // @TODO rename
  const useMachine = () => ({
    currentState: states[currentState],
    currentStateName: currentState,
    execute: (desiredAction: Action, props?: unknown) => {
      if (desiredAction in states[currentState]) {
        const { nextState, callback } = states[currentState][desiredAction];
        setCurrentState(nextState);
        console.log(
          '______CHANGE STATE____!',
          desiredAction,
          nextState,
          props,
          callback ? 'callback' : 'no callback',
          routeSelectedIndex,
          pointSelectedIndex,
        );
        if (callback) callback(props);
      } else {
        console.log('wrong action', currentState, desiredAction);
      }
    },
  });

  const isRouteSelected = (routeNumber: number) =>
    routeSelectedIndex === routeNumber;

  const climbingState = {
    editorPosition,
    getPercentagePosition,
    getPixelPosition,
    imageSize,
    isPointClicked,
    isPointMoving,
    isRouteSelected,
    pointSelectedIndex,
    routes,
    routeSelectedIndex,
    setEditorPosition,
    setImageSize,
    setIsPointClicked,
    setIsPointMoving,
    setPointSelectedIndex,
    setRoutes,
    setRouteSelectedIndex,
    updateRouteOnIndex,
    useMachine,
    scrollOffset,
    setScrollOffset,
    findClosestPoint,
    splitPaneHeight,
    setSplitPaneHeight,
    areRoutesVisible,
    setAreRoutesVisible,
    mousePosition,
    setMousePosition,
    pointElement,
    setPointElement,
    moveRoute,
    getPositionWithoutEditor,
  };

  return (
    <ClimbingContext.Provider value={climbingState}>
      {children}
    </ClimbingContext.Provider>
  );
};

export const useClimbingContext = () => {
  const context = useContext(ClimbingContext);
  if (!context) {
    throw new Error(
      'useClimbingContext must be used within a ClimbingProvider',
    );
  }
  return context;
};
