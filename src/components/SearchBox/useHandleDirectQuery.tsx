import { Option } from './types';
import { useRouter } from 'next/router';
import { Setter } from '../../types';
import { useMapStateContext } from '../utils/MapStateContext';
import { useEffect, useRef } from 'react';
import { getFirstOption } from './useGetOptions';
import { useStarsContext } from '../utils/StarsContext';

export const useHandleDirectQuery = (
  onSelected: (_: null, option: Option) => void,
  setInputValue: Setter<string>,
  setIsLoading: Setter<boolean>,
) => {
  const { stars } = useStarsContext();
  const { bbox, view } = useMapStateContext();
  const lastQuery = useRef<string | undefined>();
  const router = useRouter();
  const query = router.query.qd;

  useEffect(() => {
    (async () => {
      if (typeof query !== 'string' || !bbox) {
        return;
      }

      if (lastQuery.current === query) {
        return;
      }

      lastQuery.current = query;
      setInputValue(query);
      setIsLoading(true);

      const foundOption = await getFirstOption(query, stars, view);
      setIsLoading(false);
      if (foundOption) {
        onSelected(null, foundOption);
      }
    })();
  }, [bbox, onSelected, query, setInputValue, setIsLoading, stars, view]);
};
