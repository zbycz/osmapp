import { useState } from 'react';
import { PositionPx } from '../types';
import { emptyRoute } from './emptyRoute';

export type State =
  | 'editRoute'
  | 'extendRoute'
  | 'init'
  | 'pointMenu'
  | 'routeSelected';

export type StateAction =
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

export type ActionWithCallback = {
  nextState: State;
  callback?: (props: unknown) => void;
};
export type Machine = {
  [key in State]: Partial<Record<StateAction, ActionWithCallback>>;
};

export const getMachineFactory = ({
  setRouteSelectedIndex,
  setPointSelectedIndex,
  updatePathOnRouteIndex,
  updateElementOnIndex,
  routeSelectedIndex,
  pointSelectedIndex,
  setIsLineInteractiveAreaHovered,
  setMousePosition,
  setRoutes,
  routes,
  updateRouteOnIndex,
  getPercentagePosition,
  addOffsets,
  findCloserPoint,
}) => {
  const [currentState, setCurrentState] = useState<State>('init');

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

  const dragPoint = () => {};

  const changePointType = ({ type }) => {
    updatePathOnRouteIndex(routeSelectedIndex, (path) =>
      updateElementOnIndex(path, pointSelectedIndex, (point) => ({
        ...point,
        type,
      })),
    );
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
      addOffsets(['scrollOffset', 'editorPosition', 'imageContainer'], {
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

  const commonActions: Partial<Record<StateAction, ActionWithCallback>> = {
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
    execute: (desiredAction: StateAction, props?: unknown) => {
      if (desiredAction in states[currentState]) {
        const { nextState, callback } = states[currentState][desiredAction];
        setCurrentState(nextState);
        if (callback) callback(props);
      }
    },
  });
  return getMachine;
};
