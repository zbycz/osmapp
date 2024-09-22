import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { usePersistedState } from './usePersistedState';
import { DEFAULT_MAP } from '../../config.mjs';
import { PROJECT_ID } from '../../services/project';
import { useBoolState } from '../helpers';

export interface Layer {
  type: 'basemap' | 'overlay' | 'user' | 'spacer' | 'overlayClimbing';
  name?: string;
  url?: string;
  key?: string;
  Icon?: React.ReactNode;
  attribution?: string[]; // missing in spacer TODO refactor ugly
  maxzoom?: number;
  bboxes?: number[][];
}

// [b.getWest(), b.getNorth(), b.getEast(), b.getSouth()]
export type Bbox = [number, number, number, number];

// [z, lat, lon] - string because we use RoundedPosition
export type View = [string, string, string];

type MapStateContextType = {
  bbox: Bbox;
  setBbox: (bbox: Bbox) => void;
  view: View;
  setView: (view: View) => void;
  viewForMap: View;
  setViewFromMap: (view: View) => void;
  activeLayers: string[];
  setActiveLayers: (layers: string[] | ((prev: string[]) => string[])) => void;
  userLayers: Layer[];
  setUserLayers: (param: Layer[] | ((current: Layer[]) => Layer[])) => void;
  mapLoaded: boolean;
  setMapLoaded: () => void;
};

export const MapStateContext = createContext<MapStateContextType>(undefined);

const useActiveLayersState = () => {
  const isClimbing = PROJECT_ID === 'openclimbing';
  const initLayers = isClimbing ? ['outdoor', 'climbing'] : [DEFAULT_MAP];
  return usePersistedState('activeLayers', initLayers);
};

export const MapStateProvider = ({ children, initialMapView }) => {
  const [activeLayers, setActiveLayers] = useActiveLayersState();
  const [bbox, setBbox] = useState<Bbox>();
  const [view, setView] = useState(initialMapView);
  const [viewForMap, setViewForMap] = useState(initialMapView);
  const [userLayers, setUserLayers] = usePersistedState<Layer[]>(
    'userLayerIndex',
    [],
  );

  const [mapLoaded, setMapLoaded, setNotLoaded] = useBoolState(true);
  useEffect(setNotLoaded, [setNotLoaded]);

  const setBothViews = useCallback((newView) => {
    setView(newView);
    setViewForMap(newView);
  }, []);

  const mapState: MapStateContextType = {
    bbox,
    setBbox,
    view, // always up-to-date (for use in react)
    setView: setBothViews,
    viewForMap, // updated only when map has to be updated
    setViewFromMap: setView,
    activeLayers,
    setActiveLayers,
    userLayers,
    setUserLayers,
    mapLoaded,
    setMapLoaded,
  };

  return (
    <MapStateContext.Provider value={mapState}>
      {children}
    </MapStateContext.Provider>
  );
};

export const useMapStateContext = () => useContext(MapStateContext);
