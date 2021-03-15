import React from 'react';

export const MapStateContext = React.createContext(undefined);

export const MapStateProvider = ({ children, initialMapView }) => {
  const [bbox, setBbox] = React.useState();
  const [view, setView] = React.useState(initialMapView);
  const [viewForMap, setViewForMap] = React.useState(initialMapView);

  const setBothViews = React.useCallback((newView) => {
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
  };

  return (
    <MapStateContext.Provider value={mapState}>
      {children}
    </MapStateContext.Provider>
  );
};

export const useMapStateContext = () => React.useContext(MapStateContext);
