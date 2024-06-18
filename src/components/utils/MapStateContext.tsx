import React, { createContext, useCallback, useContext, useState } from 'react';
import { Snackbar, Alert } from '@mui/material';
import { usePersistedState } from './usePersistedState';
import { DEFAULT_MAP } from '../../config';
import { PROJECT_ID } from '../../services/project';

export interface Layer {
  type: 'basemap' | 'overlay' | 'user' | 'spacer' | 'overlayClimbing';
  name?: string;
  url?: string;
  key?: string;
  Icon?: React.FC<any>;
  attribution?: string[]; // missing in spacer TODO refactor ugly
  maxzoom?: number;
  bbox?: number[];
}

// // [b.getWest(), b.getNorth(), b.getEast(), b.getSouth()]
// export type BBox = [number, number, number, number];
//
// // [z, lat, lon]
export type View = [string, string, string];
//
// interface MapStateContextType {
//   bbox: BBox;
//   setBbox: (bbox: BBox) => void;
//   view: View;
//   setView: (view: View) => void;
//   viewForMap: View;
//   setViewFromMap: (view: View) => void;
// }
//
// export const MapStateContext = createContext<MapStateContextType>(undefined);
export const MapStateContext = createContext(undefined);

const useActiveLayersState = () => {
  const isClimbing = PROJECT_ID === 'openclimbing';
  const initLayers = isClimbing ? ['outdoor', 'climbing'] : [DEFAULT_MAP];
  return usePersistedState('activeLayers', initLayers);
};

export const MapStateProvider = ({ children, initialMapView }) => {
  const [activeLayers, setActiveLayers] = useActiveLayersState();
  const [bbox, setBbox] = useState();
  const [view, setView] = useState(initialMapView);
  const [viewForMap, setViewForMap] = useState(initialMapView);

  const setBothViews = useCallback((newView) => {
    setView(newView);
    setViewForMap(newView);
  }, []);

  const [open, setOpen] = React.useState(false);
  const [msg, setMsg] = React.useState(undefined);

  const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  const showToast = (message) => {
    setMsg(message);
    setOpen(true);
  };

  const mapState = {
    bbox,
    setBbox,
    view, // always up-to-date (for use in react)
    setView: setBothViews,
    viewForMap, // updated only when map has to be updated
    setViewFromMap: setView,
    activeLayers,
    setActiveLayers,
    showToast,
  };

  return (
    <MapStateContext.Provider value={mapState}>
      {children}
      <Snackbar open={open} autoHideDuration={10000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={msg?.type} variant="filled">
          {msg?.content}
        </Alert>
      </Snackbar>
    </MapStateContext.Provider>
  );
};

export const useMapStateContext = () => useContext(MapStateContext);
