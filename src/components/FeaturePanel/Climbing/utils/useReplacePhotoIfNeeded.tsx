import { useFeatureContext } from '../../../utils/FeatureContext';
import { useClimbingContext } from '../contexts/ClimbingContext';
import { getOsmappLink } from '../../../../services/helpers';
import { useRouter } from 'next/router';

type UseReplacePhotoIfNeededProps = {
  selectedIndex: number;
  isPhotoLoading?: boolean;
  setIsPhotoLoading?: (isPhotoLoading: boolean) => void;
};

export const useReplacePhotoIfNeeded = () => {
  const { feature } = useFeatureContext();
  const { photoPath, routes } = useClimbingContext();
  const router = useRouter();

  return ({
    selectedIndex,
    isPhotoLoading = false,
    setIsPhotoLoading,
  }: UseReplacePhotoIfNeededProps) => {
    const selectedRoute = routes[selectedIndex];
    const photos = selectedRoute?.paths ? Object.keys(selectedRoute.paths) : [];

    if (!photos.includes(photoPath) && selectedIndex > -1 && !isPhotoLoading) {
      if (photos.length > 0) {
        const featureLink = getOsmappLink(feature);
        router.replace(`${featureLink}/climbing/photo/${photos[0]}`);
        setIsPhotoLoading?.(true);
      }
    }
  };
};
