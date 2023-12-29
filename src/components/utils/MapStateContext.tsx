import React, { createContext, useCallback, useContext, useState } from 'react';
import { Snackbar } from '@mui/material';
import { Alert } from '@mui/lab';
import { usePersistedState } from './usePersistedState';
import { DEFAULT_MAP } from '../../config';

export interface Layer {
  type: 'basemap' | 'overlay' | 'user' | 'spacer';
  name?: string;
  url?: string;
  key?: string;
  Icon?: React.FC<any>;
  attribution?: string[]; // missing in spacer TODO refactor ugly
  maxzoom?: number;
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

export const MapStateProvider = ({ children, initialMapView }) => {
  const [activeLayers, setActiveLayers] = usePersistedState('activeLayers', [
    DEFAULT_MAP,
  ]);
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
