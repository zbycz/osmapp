// @flow

import React from 'react';

export const MapStateContext = React.createContext(undefined);

export const MapStateProvider = ({ children, initialMapState }) => {
  const [view, setView] = React.useState(initialMapState);
  const [_viewForMap, setViewForMap] = React.useState(initialMapState);
  const _setView = React.useCallback(view => {
    setView(view);
    setViewForMap(view);
  }, []);
  const mapState = {
    view, // always up-to-date
    setView,
    _viewForMap, // updated only when map has to be updated
    _setViewFromMap: setView,
  };

  return <MapStateContext.Provider value={mapState} children={children} />;
};

export const useMapStateContext = () => React.useContext(MapStateContext);
