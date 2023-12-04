import React, { createContext, useContext, useState } from 'react';
import { ClimbingRoute, Position, PositionPx, Size } from '../types';
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
  pointSelectedIndex: number;
  routes: Array<ClimbingRoute>;
  routeSelectedIndex: number;
  isPointClicked: boolean;
  setIsPointClicked: (isPointClicked: boolean) => void;
  setEditorPosition: (position: PositionPx) => void;
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
  getPixelPosition: (position: Position) => PositionPx;
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
  setIsEditMode: (isEditMode: boolean) => void;
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
  isEditMode: false,
  setIsEditMode: () => null,
  setPointSelectedIndex: () => null,
  setRoutes: () => null,
  setRouteSelectedIndex: () => null,
  setSplitPaneHeight: () => null,
  splitPaneHeight: 800,
  updateRouteOnIndex: () => null,
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
  const [isEditMode, setIsEditMode] = useState(false);
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [routes, setRoutes] = useState<Array<ClimbingRoute>>([]);
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
  const extendRoute = (props: { routeNumber?: number }) => {
    if (props?.routeNumber) setRouteSelectedIndex(props.routeNumber);
    setIsLineInteractiveAreaHovered(false);
  };

  const finishRoute = () => {
    setMousePosition(null);
  };

  const createRoute = () => {
    const newIndex = routes.length;
    setRouteSelectedIndex(newIndex);
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

  const findCloserPoint = (checkedPosition: Position) => {
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

    updateRouteOnIndex(routeSelectedIndex, (currentRoute) => ({
      ...currentRoute,
      path: [
        ...currentRoute.path.slice(0, tempPointPosition.lineIndex + 1),
        position,
        ...currentRoute.path.slice(tempPointPosition.lineIndex + 1),
      ],
    }));
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

    updateRouteOnIndex(routeSelectedIndex, (route) => ({
      ...route,
      path: [...(route?.path ?? []), closestPoint ?? newCoordinate],
    }));
  };
  const commonActions: Partial<Record<Action, ActionWithCallback>> = {
    createRoute: { nextState: 'editRoute', callback: createRoute },
    editRoute: { nextState: 'editRoute', callback: editRoute },
  };

  const states: Machine = {
    init: {
      ...commonActions,
      extendRoute: { nextState: 'extendRoute', callback: extendRoute },

      routeSelect: {
        nextState: 'routeSelected',
        callback: routeSelect,
      },
    },
    editRoute: {
      ...commonActions,
      deleteRoute: { nextState: 'init', callback: deleteRoute },
      dragPoint: { nextState: 'editRoute', callback: dragPoint },
      addPointInBetween: {
        nextState: 'editRoute',
        callback: addPointInBetween,
      },
      showPointMenu: { nextState: 'pointMenu' },
      finishRoute: { nextState: 'routeSelected', callback: finishRoute },
      extendRoute: { nextState: 'extendRoute', callback: extendRoute },
    },
    extendRoute: {
      ...commonActions,
      finishRoute: { nextState: 'routeSelected', callback: finishRoute },
      undoPoint: { nextState: 'extendRoute', callback: undoPoint },
      showPointMenu: { nextState: 'pointMenu' },
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
      cancelPointMenu: { nextState: 'editRoute' },
      finishRoute: { nextState: 'routeSelected', callback: finishRoute },
    },
    routeSelected: {
      ...commonActions,
      routeSelect: {
        nextState: 'routeSelected',
        callback: routeSelect,
      },
      cancelRouteSelection: {
        nextState: 'init',
        callback: cancelRouteSelection,
      },
      extendRoute: {
        nextState: 'extendRoute',
        callback: extendRoute,
      },
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
    getMachine,
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
