import { useCallback, useEffect, useState } from 'react';
import { useUserSettingsContext } from '../../../utils/UserSettingsContext';
import { DEFAULT_CRAG_VIEW_LAYOUT } from '../ClimbingView';
import { useClimbingContext } from '../contexts/ClimbingContext';

const CRAG_VIEW_LAYOUT_BREAKPOINT = 1080;

export const useGetCragViewLayout = () => {
  const [cragViewLayout, setCragViewLayout] = useState<
    'horizontal' | 'vertical'
  >(DEFAULT_CRAG_VIEW_LAYOUT);
  const { userSettings } = useUserSettingsContext();
  const { loadPhotoRelatedData, viewportSize } = useClimbingContext();

  const checkCragViewLayout = useCallback(() => {
    if (userSettings['climbing.cragViewLayout'] === 'auto') {
      setCragViewLayout(
        viewportSize.width >= CRAG_VIEW_LAYOUT_BREAKPOINT
          ? 'vertical'
          : 'horizontal',
      );
    } else {
      setCragViewLayout(
        userSettings['climbing.cragViewLayout'] ?? DEFAULT_CRAG_VIEW_LAYOUT,
      );
    }

    // @TODO remove timeout
    setTimeout(() => {
      loadPhotoRelatedData();
    }, 200);
  }, [userSettings, viewportSize.width]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    checkCragViewLayout();
  }, [checkCragViewLayout]);
  return cragViewLayout;
};
