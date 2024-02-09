import React, {
  createContext,
  ReactNode,
  useContext,
  useRef,
  useState,
} from 'react';
import {
  ClimbingRoute,
  GradeSystem,
  GradeTable,
  PathPoints,
  Position,
  PositionPx,
  Size,
  ZoomState,
} from '../types';
import { updateElementOnIndex } from '../utils/array';
import { findCloserPointFactory } from '../utils/findCloserPoint';
import {
  ActionWithCallback,
  getMachineFactory,
  State,
  StateAction,
} from '../utils/getMachineFactory';
import {
  CountPositionEntity,
  positionUtilsFactory,
} from '../utils/positionUtilsFactory';
import { Feature } from '../../../../services/types';
import { osmToClimbingRoutes } from './osmToClimbingRoutes';
import { publishDbgObject } from '../../../../utils';
import { getContainedSizeImage } from '../utils/image';

type ImageSize = {
  width: number;
  height: number;
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
  splitPaneHeight: number | null;
  setSplitPaneHeight: (height: number | null) => void;
  photoPaths: Array<string>;
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
  addOffsets: (
    entities: Array<CountPositionEntity>,
    position: PositionPx,
  ) => PositionPx;
  addZoom: (position: PositionPx) => PositionPx;
  getMachine: () => {
    currentState: Partial<Record<StateAction, ActionWithCallback>>;
    currentStateName: State;
    execute: (desiredAction: StateAction, props?: unknown) => void;
  };
  scrollOffset: PositionPx;
  setScrollOffset: (scrollOffset: PositionPx) => void;
  findCloserPoint: (position: Position) => Position | null;
  imageZoom: ZoomState;
  setImageZoom: (imageZoom: ZoomState) => void;
  areRoutesVisible: boolean;
  setAreRoutesVisible: (areRoutesVisible: boolean) => void;
  areRoutesLoading: boolean;
  setAreRoutesLoading: (areRoutesLoading: boolean) => void;
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
  selectedRouteSystem: GradeSystem;
  setSelectedRouteSystem: (selectedRouteSystem: GradeSystem) => void;
  routesExpanded: Array<number>;
  setRoutesExpanded: (routesExpanded: Array<number>) => void;
  handleImageLoad: () => void;
  filterDifficulty: Array<string>;
  setFilterDifficulty: (filterDifficulty: Array<string>) => void;
  photoRef: React.MutableRefObject<any>;
  getAllRoutesPhotos: () => void;
  isDifficultyHeatmapEnabled: boolean;
  setIsDifficultyHeatmapEnabled: (isDifficultyHeatmapEnabled: boolean) => void;
  showDebugMenu: boolean;
  setShowDebugMenu: (showDebugMenu: boolean) => void;
  arePointerEventsDisabled: boolean;
  setArePointerEventsDisabled: (arePointerEventsDisabled: boolean) => void;
  gradeTable: GradeTable;
  setGradeTable: (gradeTable: GradeTable) => void;
};

// @TODO generate?
export const ClimbingContext = createContext<ClimbingContextType | null>(null);

type Props = {
  children: ReactNode;
  feature: Feature;
};

export const ClimbingContextProvider = ({ children, feature }: Props) => {
  const initialRoutes = osmToClimbingRoutes(feature);
  publishDbgObject('climbingRoutes', initialRoutes);
  const photoRef = useRef(null);
  const [gradeTable, setGradeTable] = useState<GradeTable>(null);
  const [photoPaths, setPhotoPaths] = useState<Array<string>>(null);
  const [photoPath, setPhotoPath] = useState<string>(null); // photo, should be null
  const [showDebugMenu, setShowDebugMenu] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [routes, setRoutes] = useState<Array<ClimbingRoute>>(initialRoutes);
  const [splitPaneHeight, setSplitPaneHeight] = useState<number | null>(null);
  const [isPointMoving, setIsPointMoving] = useState<boolean>(false);
  const [isPointClicked, setIsPointClicked] = useState<boolean>(false);
  const [isDifficultyHeatmapEnabled, setIsDifficultyHeatmapEnabled] =
    useState<boolean>(false);
  const [areRoutesVisible, setAreRoutesVisible] = useState<boolean>(true);
  const [areRoutesLoading, setAreRoutesLoading] = useState<boolean>(true);
  const [arePointerEventsDisabled, setArePointerEventsDisabled] =
    useState<boolean>(false);
  const [isLineInteractiveAreaHovered, setIsLineInteractiveAreaHovered] =
    useState<boolean>(false);
  const [mousePosition, setMousePosition] = useState<PositionPx | null>(null);
  const [filterDifficulty, setFilterDifficulty] = useState<Array<string>>([]);
  const [routesExpanded, setRoutesExpanded] = useState<Array<number>>([]);
  const [selectedRouteSystem, setSelectedRouteSystem] =
    useState<GradeSystem>('uiaa'); // @TODO move to config
  const [editorPosition, setEditorPosition] = useState<PositionPx>({
    x: 0,
    y: 0,
    units: 'px',
  });
  const [imageZoom, setImageZoom] = useState<ZoomState>({
    scale: 1,
    positionX: 0,
    positionY: 0,
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

  const [pointElement, setPointElement] =
    React.useState<null | HTMLElement>(null);

  const getPathOnIndex = (index: number) =>
    routes[index]?.paths?.[photoPath] || [];

  const getPathForRoute = (route: ClimbingRoute) =>
    route?.paths?.[photoPath] || [];

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

  const findCloserPoint = findCloserPointFactory({
    routeSelectedIndex,
    routes,
    getPathForRoute,
  });

  const { getPixelPosition, getPercentagePosition, addOffsets, addZoom } =
    positionUtilsFactory({
      editorPosition,
      scrollOffset,
      imageSize,
      imageZoom,
    });

  const getMachine = getMachineFactory({
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
  });

  const isRouteSelected = (index: number) => routeSelectedIndex === index;
  const isPointSelected = (index: number) => pointSelectedIndex === index;
  const hasPath = (index: number) => getPathOnIndex(index).length > 0;
  const hasPathInDifferentPhotos = (index: number) => {
    const paths = routes[index]?.paths;
    if (!paths) return false;
    const availablePhotos = Object.keys(paths);
    return !!availablePhotos.find((availablePhotoPath) => {
      if (
        availablePhotoPath !== photoPath &&
        paths[availablePhotoPath]?.length > 0
      ) {
        return true;
      }
      return false;
    }, []);
  };

  const getAllRoutesPhotos = () => {
    const photos = routes.reduce((acc, route) => {
      if (!route.paths) return [];
      const routePhotos = Object.keys(route.paths);
      return [...new Set([...acc, ...routePhotos])];
    }, []);

    setPhotoPaths(photos.sort());
  };

  const handleImageLoad = () => {
    if (photoRef.current) {
      const [width, height] = getContainedSizeImage(photoRef.current);
      const { left, top } = photoRef.current.getBoundingClientRect();

      setImageSize({
        width,
        height,
      });
      setEditorPosition({ x: left, y: top, units: 'px' });
      setViewportSize({
        width: window?.innerWidth,
        height: window?.innerHeight,
      });
    }
    setAreRoutesVisible(true);
    setAreRoutesLoading(false);
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
    areRoutesVisible, // @TODO move to some settings object
    setAreRoutesVisible,
    mousePosition,
    setMousePosition,
    pointElement,
    setPointElement,
    moveRoute,
    addOffsets,
    isEditMode,
    setIsEditMode,
    viewportSize,
    setViewportSize,
    isLineInteractiveAreaHovered,
    setIsLineInteractiveAreaHovered,
    photoPath,
    photoPaths,
    setPhotoPath,
    setSelectedRouteSystem,
    selectedRouteSystem,
    routesExpanded,
    setRoutesExpanded,
    handleImageLoad,
    filterDifficulty,
    setFilterDifficulty,
    photoRef,
    areRoutesLoading,
    setAreRoutesLoading,
    imageZoom,
    setImageZoom,
    addZoom,
    getAllRoutesPhotos,
    isDifficultyHeatmapEnabled, // @TODO move to some settings object
    setIsDifficultyHeatmapEnabled,
    showDebugMenu,
    setShowDebugMenu,
    arePointerEventsDisabled,
    setArePointerEventsDisabled,
    gradeTable,
    setGradeTable,
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
