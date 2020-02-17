// @flow

import React from 'react';

export const MapStateContext = React.createContext(undefined);

export const MapStateProvider = ({ children, initialMapState }) => {
  const [bbox, setBbox] = React.useState();
  const [view, setView] = React.useState(initialMapState);
  const [_viewForMap, _setViewForMap] = React.useState(initialMapState);
  const setBothViews = React.useCallback(view => {
    setView(view);
    _setViewForMap(view);
  }, []);
  const mapState = {
    bbox,
    setBbox,
    view, // always up-to-date (for use in react)
    setView: setBothViews,
    _viewForMap, // updated only when map has to be updated
    _setViewFromMap: setView,
  };

  return <MapStateContext.Provider value={mapState} children={children} />;
};

export const useMapStateContext = () => React.useContext(MapStateContext);
