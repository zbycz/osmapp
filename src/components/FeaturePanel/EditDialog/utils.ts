import { useFeatureContext } from '../../utils/FeatureContext';
import { useEditContext } from './context/EditContext';
import { useEditDialogContext } from '../helpers/EditDialogContext';

export const useEditDialogFeature = () => {
  const { feature } = useFeatureContext();
  return {
    feature,
    isAddPlace: feature.point,
    isUndelete: feature.deleted,
  };
};

export const useEditDialogClose = () => {
  const { items } = useEditContext();
  const isModified = items.some(({ modified }) => modified);
  const { close } = useEditDialogContext();

  return () => {
    if (
      isModified &&
      window.confirm(
        'Your changes are not saved. Are you sure you want to close this dialog?',
      ) === false
    ) {
      return;
    }
    close();
  };
};
