import { useFeatureContext } from '../../../utils/FeatureContext';
import Router from 'next/router';
import { getOsmappLink } from '../../../../services/helpers';
import { useClimbingContext } from '../contexts/ClimbingContext';

export const usePhotoChange = () => {
  const { setAreRoutesLoading } = useClimbingContext();
  const { feature } = useFeatureContext();
  return (photo: string) => {
    Router.push(
      `${getOsmappLink(feature)}/climbing/photo/${photo}${window.location.hash}`,
    );
    setAreRoutesLoading(true);
  };
};
