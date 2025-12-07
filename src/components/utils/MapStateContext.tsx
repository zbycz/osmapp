import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { usePersistedState } from './usePersistedState';
import { DEFAULT_MAP } from '../../config.mjs';
import { PROJECT_ID } from '../../services/project';
import { useBoolState } from '../helpers';
import { Setter } from '../../types';
import { LonLat } from '../../services/types';
import Cookies from 'js-cookie';
import Router from 'next/router';
import { getMapViewFromHash } from '../App/helpers';
import { osmappLayers } from '../LayerSwitcher/osmappLayers';
import { fakeStaticExportSkipDefaultMapView } from '../App/fakeStaticExportHelpers';

export type LayerIcon = React.ComponentType<{ fontSize: 'small' }>;

// [b.getWest(), b.getNorth(), b.getEast(), b.getSouth()]
export type Bbox = [number, number, number, number];

export type Layer = {
  type: 'basemap' | 'overlay' | 'user' | 'spacer';
  name?: string;
  secondLine?: string;
  url?: string;
  darkUrl?: string; // optional url for dark mode
  key?: string;
  Icon?: LayerIcon;
  isSatelite?: boolean;
  attribution?: string[]; // missing in spacer TODO refactor this ugly type
  maxzoom?: number;
  minzoom?: number;
  bboxes?: Bbox[];
};

// [z, lat, lon] - string because we use RoundedPosition
export type View = [string, string, string];

export type MapClickOverride =
  | ((coords: LonLat, label: string) => void)
  | undefined;
export type MapClickOverrideRef = React.MutableRefObject<MapClickOverride>;

type MapStateContextType = {
  bbox: Bbox;
  setBbox: Setter<Bbox>;
  view: View;
  setView: Setter<View>;
  viewForMap: View;
  setViewFromMap: Setter<View>;
  activeLayers: string[];
  setActiveLayers: Setter<string[]>;
  userLayers: Layer[];
  setUserLayers: Setter<Layer[]>;
  mapClickOverrideRef: MapClickOverrideRef;
  mapLoaded: boolean;
  setMapLoaded: () => void;
  allActiveLayers: Layer[];
};

export const MapStateContext = createContext<MapStateContextType>(undefined);

const usePersistMapView = (view: View) => {
  useEffect(() => {
    if (fakeStaticExportSkipDefaultMapView(view)) return;

    window.location.hash = view.join('/');
    Cookies.set('mapView', view.join('/'), { expires: 7, path: '/' }); // TODO find optimal expiration
  }, [view]);
};

const useUpdateViewFromHash = (setView: Setter<View>) => {
  useEffect(() => {
    Router.beforePopState(() => {
      const mapViewFromHash = getMapViewFromHash();
      if (mapViewFromHash) {
        setView(mapViewFromHash);
      }
      return true; // let nextjs handle the route change as well
    });
  }, [setView]);
};

const useActiveLayersState = () => {
  const isClimbing = PROJECT_ID === 'openclimbing';
  const initLayers = isClimbing
    ? ['outdoor', 'climbing']
    : [DEFAULT_MAP, 'indoor'];
  return usePersistedState('activeLayers', initLayers);
};

export const MapStateProvider: React.FC<{ initialMapView: View }> = ({
  children,
  initialMapView,
}) => {
  const [activeLayers, setActiveLayers] = useActiveLayersState();
  const [bbox, setBbox] = useState<Bbox>();
  const [view, setView] = useState(initialMapView);
  const [viewForMap, setViewForMap] = useState(initialMapView);
  const [userLayers, setUserLayers] = usePersistedState<Layer[]>(
    'userLayerIndex',
    [],
  );
  const [allActiveLayers, setAllActiveLayers] = useState<Layer[]>([]);
  const mapClickOverrideRef = useRef<MapClickOverride>();
  const [mapLoaded, setMapLoaded, setNotLoaded] = useBoolState(true);
  useEffect(setNotLoaded, [setNotLoaded]);

  useEffect(() => {
    const activeOsmappLayers = activeLayers
      .map((key) => osmappLayers[key])
      .filter((x) => x);
    const activeUserLayers = userLayers.filter(({ url }) =>
      activeLayers.includes(url),
    );
    setAllActiveLayers([...activeUserLayers, ...activeOsmappLayers]);
  }, [activeLayers, userLayers]);

  const setBothViews: Setter<View> = useCallback((newView) => {
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
    mapClickOverrideRef,
    mapLoaded,
    setMapLoaded,
    allActiveLayers,
  };

  usePersistMapView(view);
  useUpdateViewFromHash(setBothViews);

  return (
    <MapStateContext.Provider value={mapState}>
      {children}
    </MapStateContext.Provider>
  );
};

export const useMapStateContext = () => useContext(MapStateContext);
