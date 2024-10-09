import { createContext, useContext, useState } from 'react';
import { LineInformation } from './requestRoutes';

type PublicTransportContext = {
  routes: LineInformation[];
  geojson: GeoJSON.GeoJSON;
};

const emptyPublicTransport: PublicTransportContext = {
  routes: [],
  geojson: { type: 'FeatureCollection', features: [] },
};

const publicTransportContext =
  createContext<PublicTransportContext>(emptyPublicTransport);

export const usePublicTransportContext = () =>
  useContext(publicTransportContext);

export const PublicTransportProvider: React.FC = ({ children }) => {
  const routes = useState<Routes>([]);
  return (
    <publicTransportContext.Provider value={emptyPublicTransport}>
      {children}
    </publicTransportContext.Provider>
  );
};
