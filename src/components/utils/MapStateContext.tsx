import React, { createContext, useCallback, useContext, useState } from 'react';

export interface Layer {
  type: 'basemap' | 'overlay' | 'user' | 'spacer';
  name?: string;
  url?: string;
  key?: string;
  icon?: any;
}

// // [b.getWest(), b.getNorth(), b.getEast(), b.getSouth()]
// export type BBox = [number, number, number, number];
//
// // [z, lat, lon]
// export type View = [number, number, number];
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
  const [activeLayers, setActiveLayers] = useState([]);
  const [bbox, setBbox] = useState();
  const [view, setView] = useState(initialMapView);
  const [viewForMap, setViewForMap] = useState(initialMapView);

  const setBothViews = useCallback((newView) => {
    setView(newView);
    setViewForMap(newView);
  }, []);

  const mapState = {
    bbox,
    setBbox,
    view, // always up-to-date (for use in react)
    setView: setBothViews,
    viewForMap, // updated only when map has to be updated
    setViewFromMap: setView,
    activeLayers,
    setActiveLayers,
  };

  return (
    <MapStateContext.Provider value={mapState}>
      {children}
    </MapStateContext.Provider>
  );
};

export const useMapStateContext = () => useContext(MapStateContext);
