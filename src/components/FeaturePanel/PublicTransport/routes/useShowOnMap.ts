import { useEffect } from 'react';
import { getOverpassSource } from '../../../../services/mapStorage';

export const useShowOnMap = (
  routes: GeoJSON.FeatureCollection,
  visiblCategories: string[],
) => {
  useEffect(() => {
    if (!routes) {
      return;
    }

    const filteredRoutes = routes.features.filter(({ properties }) =>
      visiblCategories.includes(properties.service),
    );
    const source = getOverpassSource();
    source?.setData({
      type: 'FeatureCollection',
      features: filteredRoutes,
    });
    return () => {
      source?.setData({ type: 'FeatureCollection', features: [] });
    };
  }, [routes, visiblCategories]);
};
