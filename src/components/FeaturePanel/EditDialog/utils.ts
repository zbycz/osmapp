import { useFeatureContext } from '../../utils/FeatureContext';
import { useBoolState } from '../../helpers';
import React, { useCallback, useEffect } from 'react';

export const useEditDialogFeature = () => {
  const { feature } = useFeatureContext();
  return {
    feature,
    isAddPlace: feature.point,
    isUndelete: feature.deleted,
  };
};
