import { useEditContext } from '../../context/EditContext';
import { useEffect, useState } from 'react';
import { Feature } from '../../../../../services/types';
import { getApiId } from '../../../../../services/helpers';
import { fetchParentFeatures } from '../../../../../services/osm/fetchParentFeatures';
import { fetchWays } from '../../../../../services/osm/fetchWays';

export const useGetParents = () => {
  const { current } = useEditContext();
  const [parents, setParents] = useState<Feature[]>([]);

  useEffect(() => {
    (async () => {
      setParents([]);
      if (getApiId(current).id < 0) {
        return;
      }
      const [parentFeatures, waysFeatures] = await Promise.all([
        fetchParentFeatures(getApiId(current)),
        fetchWays(getApiId(current)),
      ]);
      setParents([...parentFeatures, ...waysFeatures]);
    })();
  }, [current]);
  return parents;
};
