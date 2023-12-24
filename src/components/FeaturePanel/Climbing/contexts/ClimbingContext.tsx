import React, { createContext, useContext, useState } from 'react';
import {
  ClimbingRoute,
  PathPoints,
  Position,
  PositionPx,
  Size,
} from '../types';
import { updateElementOnIndex } from '../utils';
import { emptyRoute } from '../utils/emptyRoute';
import { routes1 } from './mock';

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
  | 'addPointInBetween'
  | 'addPointToEnd'
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

type CountPositionEntity = 'editorPosition' | 'scrollOffset';

type Machine = {
  [key in State]: Partial<Record<Action, ActionWithCallback>>;
};

type ClimbingContextType = {
  editorPosition: PositionPx;
  imageSize: ImageSize;
  isPointMoving: boolean;
  isRouteSelected: (routeNumber: number) => boolean;
  isPointSelected: (pointNumber: number) => boolean;
  hasPath: (routeNumber: number) => boolean;
  hasPathInDifferentPhotos: (routeNumber: number) => boolean;
  pointSelectedIndex: number;
  routes: Array<ClimbingRoute>;
  routeSelectedIndex: number;
  isPointClicked: boolean;
  setIsPointClicked: (isPointClicked: boolean) => void;
  setEditorPosition: (position: PositionPx) => void;
  setImageSize: (ImageSize) => void;
  splitPaneHeight: number;
  setSplitPaneHeight: (height: number) => void;
  photoPath: string;
  setPhotoPath: (path: string) => void;
  setIsPointMoving: (isPointMoving: boolean) => void;
  setPointSelectedIndex: (pointSelectedIndex: number) => void;
  setRoutes: (routes: Array<ClimbingRoute>) => void;
  setRouteSelectedIndex: (routeSelectedIndex: number) => void;
  updateRouteOnIndex: (
    routeIndex: number,
    callback?: (route: ClimbingRoute) => ClimbingRoute,
  ) => void;
  updatePathOnRouteIndex: (
    routeIndex: number,
    callback?: (path: PathPoints) => PathPoints,
  ) => void;
  getPixelPosition: (position: Position) => PositionPx;
  getPathForRoute: (route: ClimbingRoute) => PathPoints;
  getCurrentPath: () => PathPoints;
  getPercentagePosition: (position: PositionPx) => Position;
  countPositionWith: (
    entities: Array<CountPositionEntity>,
    position: PositionPx,
  ) => PositionPx;
  getMachine: () => {
    currentState: Partial<Record<Action, ActionWithCallback>>;
    currentStateName: State;
    execute: (desiredAction: Action, props?: unknown) => void;
  };
  scrollOffset: PositionPx;
  setScrollOffset: (scrollOffset: PositionPx) => void;
  findCloserPoint: (position: Position) => Position | null;
  areRoutesVisible: boolean;
  setAreRoutesVisible: (areRoutesVisible: boolean) => void;
  mousePosition: PositionPx;
  setMousePosition: (mousePosition: PositionPx | null) => void;
  pointElement: null | HTMLElement;
  setPointElement: (pointElement: null | HTMLElement) => void;
  moveRoute: (from: number, to: number) => void;
  isEditMode: boolean;
  setIsEditMode: (value: boolean | ((old: boolean) => boolean)) => void;
  viewportSize: Size;
  setViewportSize: (size: Size) => void;
  isLineInteractiveAreaHovered: boolean;
  setIsLineInteractiveAreaHovered: (
    isLineInteractiveAreaHovered: boolean,
  ) => void;
};

// @TODO generate?
export const ClimbingContext = createContext<ClimbingContextType>({
  editorPosition: { x: 0, y: 0, units: 'px' },
  imageSize: {
    width: 0,
    height: 0,
  },
  getPercentagePosition: () => null,
  mousePosition: { x: 0, y: 0, units: 'px' },
  setMousePosition: () => null,
  getPixelPosition: () => null,
  countPositionWith: () => null,
  getPathForRoute: () => null,
  getCurrentPath: () => null,
  isPointClicked: false,
  isPointMoving: false,
  isRouteSelected: () => null,
  isPointSelected: () => null,
  hasPath: () => null,
  hasPathInDifferentPhotos: () => null,
  pointSelectedIndex: null,
  routes: [],
  routeSelectedIndex: null,
  setEditorPosition: () => null,
  setImageSize: () => null,
  setIsPointClicked: () => null,
  setIsPointMoving: () => null,
  isEditMode: false,
  setIsEditMode: () => null,
  photoPath: null,
  setPhotoPath: () => null,
  setPointSelectedIndex: () => null,
  setRoutes: () => null,
  setRouteSelectedIndex: () => null,
  setSplitPaneHeight: () => null,
  splitPaneHeight: 800,
  updateRouteOnIndex: () => null,
  updatePathOnRouteIndex: () => null,
  getMachine: () => ({
    currentState: null,
    currentStateName: null,
    execute: () => null,
  }),
  scrollOffset: { x: 0, y: 0, units: 'px' },
  setScrollOffset: () => null,
  findCloserPoint: () => null,
  areRoutesVisible: true,
  setAreRoutesVisible: () => null,
  pointElement: null,
  setPointElement: () => null,
  moveRoute: () => null,
  viewportSize: { width: 0, height: 0 },
  setViewportSize: () => null,
  isLineInteractiveAreaHovered: false,
  setIsLineInteractiveAreaHovered: () => null,
});

export const ClimbingContextProvider = ({ children }) => {
  const [photoPath, setPhotoPath] = useState<string>('/images/rock2.jpg');
  const [isEditMode, setIsEditMode] = useState(false);
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [routes, setRoutes] = useState<Array<ClimbingRoute>>(routes1);
  const [splitPaneHeight, setSplitPaneHeight] = useState<number>(800);
  const [isPointMoving, setIsPointMoving] = useState<boolean>(false);
  const [isPointClicked, setIsPointClicked] = useState<boolean>(false);
  const [areRoutesVisible, setAreRoutesVisible] = useState<boolean>(true);
  const [isLineInteractiveAreaHovered, setIsLineInteractiveAreaHovered] =
    useState<boolean>(false);
  const [mousePosition, setMousePosition] = useState<PositionPx | null>(null);
  const [editorPosition, setEditorPosition] = useState<PositionPx>({
    x: 0,
    y: 0,
    units: 'px',
  });
  const [viewportSize, setViewportSize] = useState<Size>({
    width: 0,
    height: 0,
  });
  const [scrollOffset, setScrollOffset] = useState<PositionPx>({
    x: 0,
    y: 0,
    units: 'px',
  });
  const [routeSelectedIndex, setRouteSelectedIndex] = useState<number>(null);
  const [pointSelectedIndex, setPointSelectedIndex] = useState<number>(null);
  const [currentState, setCurrentState] = useState<State>('init');
  const [pointElement, setPointElement] =
    React.useState<null | HTMLElement>(null);

  const getPathOnIndex = (index: number) =>
    routes[index]?.paths[photoPath] || [];

  const getPathForRoute = (route: ClimbingRoute) =>
    route?.paths[photoPath] || [];

  const getCurrentPath = () => getPathOnIndex(routeSelectedIndex);

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

  const updatePathOnRouteIndex = (
    routeIndex: number,
    callback?: (route: PathPoints) => PathPoints,
  ) =>
    updateRouteOnIndex(routeSelectedIndex, (route) => ({
      ...route,
      paths: {
        ...route.paths,
        [photoPath]: callback(getPathOnIndex(routeIndex)),
      },
    }));

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
    setPointSelectedIndex(null);
  };

  const cancelRouteSelection = () => {
    setRouteSelectedIndex(null);
    setPointSelectedIndex(null);
  };

  const deletePoint = () => {
    updatePathOnRouteIndex(routeSelectedIndex, (path) =>
      updateElementOnIndex(path, pointSelectedIndex),
    );
    setPointSelectedIndex(null);
  };
  const cancelPointMenu = () => {
    setPointSelectedIndex(null);
  };

  const editRoute = ({ routeNumber }) => {
    setRouteSelectedIndex(routeNumber);
    setPointSelectedIndex(null);
  };

  const extendRoute = (props: { routeNumber?: number }) => {
    if (props?.routeNumber) {
      setRouteSelectedIndex(props.routeNumber);
      setPointSelectedIndex(null);
    }
    setIsLineInteractiveAreaHovered(false);
  };

  const finishRoute = () => {
    setMousePosition(null);
  };

  const createRoute = () => {
    const newIndex = routes.length;
    setRouteSelectedIndex(newIndex);
    setPointSelectedIndex(null);
    setRoutes([...routes, emptyRoute]);
  };

  const deleteRoute = ({ routeNumber }: { routeNumber?: number }) => {
    updateRouteOnIndex(routeNumber || routeSelectedIndex);
    setRouteSelectedIndex(null);
    setPointSelectedIndex(null);
  };

  const undoPoint = () => {
    updatePathOnRouteIndex(routeSelectedIndex, (path) => path.slice(0, -1));
  };

  const getPixelPosition = ({ x, y }: Position): PositionPx => ({
    x: imageSize.width * x,
    y: imageSize.height * y,
    units: 'px',
  });

  const getPercentagePosition = ({ x, y }: PositionPx): Position => ({
    x: x / imageSize.width,
    y: y / imageSize.height,
    units: 'percentage',
  });

  const countPositionWith = (
    entities: Array<CountPositionEntity>,
    position: PositionPx | null,
  ): PositionPx => {
    if (!position) return null;

    return entities.reduce((acc, entity) => {
      if (entity === 'editorPosition') {
        return {
          x: acc.x - editorPosition.x,
          y: acc.y - editorPosition.y,
          units: 'px',
        };
      }
      return {
        x: scrollOffset.x + acc.x,
        y: scrollOffset.y + acc.y,
        units: 'px',
      };
    }, position);
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
    updatePathOnRouteIndex(routeSelectedIndex, (path) =>
      updateElementOnIndex(path, pointSelectedIndex, (point) => ({
        ...point,
        type,
      })),
    );
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

  const findCloserPoint = (checkedPosition: Position) => {
    if (routeSelectedIndex === null || !checkedPosition.x || !checkedPosition.y)
      return null;

    const STICKY_THRESHOLD = 0.015;

    return routes
      .map((route, index) => {
        const isCurrentRoute = index === routeSelectedIndex;
        if (isCurrentRoute) return [];
        return getPathForRoute(route);
      })
      .flat()
      .reduce((closestPoint, point) => {
        if (!point) return closestPoint;
        const isPointNearby =
          checkedPosition.x - STICKY_THRESHOLD < point.x &&
          checkedPosition.x + STICKY_THRESHOLD > point.x &&
          checkedPosition.y - STICKY_THRESHOLD < point.y &&
          checkedPosition.y + STICKY_THRESHOLD > point.y;

        if (isPointNearby) {
          if (closestPoint) {
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

  const addPointInBetween = ({ hoveredPosition, tempPointPosition }) => {
    const position = getPercentagePosition(hoveredPosition);

    updatePathOnRouteIndex(routeSelectedIndex, (path) => [
      ...path.slice(0, tempPointPosition.lineIndex + 1),
      position,
      ...path.slice(tempPointPosition.lineIndex + 1),
    ]);
  };

  const addPointToEnd = (props: { position: PositionPx }) => {
    if (!props) return;
    const { x, y } = props.position;
    const newCoordinate = getPercentagePosition(
      countPositionWith(['scrollOffset', 'editorPosition'], {
        x,
        y,
        units: 'px',
      }),
    );

    const closestPoint = findCloserPoint(newCoordinate);

    updatePathOnRouteIndex(routeSelectedIndex, (path) => [
      ...path,
      closestPoint ?? newCoordinate,
    ]);
  };

  const commonActions: Partial<Record<Action, ActionWithCallback>> = {
    createRoute: { nextState: 'editRoute', callback: createRoute },
    editRoute: { nextState: 'editRoute', callback: editRoute },
  };

  const states: Machine = {
    init: {
      ...commonActions,
      extendRoute: { nextState: 'extendRoute', callback: extendRoute },
      routeSelect: { nextState: 'routeSelected', callback: routeSelect },
    },
    editRoute: {
      ...commonActions,
      deleteRoute: { nextState: 'init', callback: deleteRoute },
      dragPoint: { nextState: 'editRoute', callback: dragPoint },
      cancelRouteSelection: {
        nextState: 'init',
        callback: cancelRouteSelection,
      },
      addPointInBetween: {
        nextState: 'editRoute',
        callback: addPointInBetween,
      },
      showPointMenu: { nextState: 'pointMenu' },
      finishRoute: { nextState: 'editRoute', callback: finishRoute },
      extendRoute: { nextState: 'extendRoute', callback: extendRoute },
      routeSelect: { nextState: 'routeSelected', callback: routeSelect },
    },
    extendRoute: {
      ...commonActions,
      deleteRoute: { nextState: 'init', callback: deleteRoute },
      finishRoute: { nextState: 'editRoute', callback: finishRoute },
      undoPoint: { nextState: 'extendRoute', callback: undoPoint },
      showPointMenu: { nextState: 'pointMenu' },
      dragPoint: { nextState: 'extendRoute', callback: dragPoint },
      addPointInBetween: {
        nextState: 'extendRoute',
        callback: addPointInBetween,
      },
      addPointToEnd: {
        nextState: 'extendRoute',
        callback: addPointToEnd,
      },
    },
    pointMenu: {
      ...commonActions,
      changePointType: { nextState: 'editRoute', callback: changePointType },
      deletePoint: { nextState: 'editRoute', callback: deletePoint },
      cancelPointMenu: { nextState: 'editRoute', callback: cancelPointMenu },
      finishRoute: { nextState: 'editRoute', callback: finishRoute },
      extendRoute: { nextState: 'extendRoute', callback: extendRoute },
      dragPoint: { nextState: 'editRoute', callback: dragPoint },
    },
    routeSelected: {
      ...commonActions,
      routeSelect: { nextState: 'routeSelected', callback: routeSelect },
      cancelRouteSelection: {
        nextState: 'init',
        callback: cancelRouteSelection,
      },
      extendRoute: { nextState: 'extendRoute', callback: extendRoute },
    },
  };

  const getMachine = () => ({
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
        console.warn('wrong action', currentState, desiredAction);
      }
    },
  });

  const isRouteSelected = (index: number) => routeSelectedIndex === index;
  const isPointSelected = (index: number) => pointSelectedIndex === index;
  const hasPath = (index: number) => getPathOnIndex(index).length > 0;
  const hasPathInDifferentPhotos = (index: number) => {
    const paths = routes[index]?.paths;
    const availablePhotos = Object.keys(paths);
    return availablePhotos.find((availablePhotoPath) => {
      if (
        availablePhotoPath !== photoPath &&
        paths[availablePhotoPath].length > 0
      ) {
        return true;
      }
      return false;
    }, []);
  };

  const climbingState = {
    editorPosition,
    getPercentagePosition,
    getPixelPosition,
    imageSize,
    isPointClicked,
    isPointMoving,
    isRouteSelected,
    isPointSelected,
    hasPath,
    hasPathInDifferentPhotos,
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
    updatePathOnRouteIndex,
    getMachine,
    getPathForRoute,
    getCurrentPath,
    scrollOffset,
    setScrollOffset,
    findCloserPoint,
    splitPaneHeight,
    setSplitPaneHeight,
    areRoutesVisible,
    setAreRoutesVisible,
    mousePosition,
    setMousePosition,
    pointElement,
    setPointElement,
    moveRoute,
    countPositionWith,
    isEditMode,
    setIsEditMode,
    viewportSize,
    setViewportSize,
    isLineInteractiveAreaHovered,
    setIsLineInteractiveAreaHovered,
    photoPath,
    setPhotoPath,
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
