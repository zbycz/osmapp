import { useFeatureContext } from '../../utils/FeatureContext';

export const useEditDialogFeature = () => {
  const { feature } = useFeatureContext();
  return {
    feature,
    isAddPlace: feature.point,
    isUndelete: feature.deleted,
  };
};
