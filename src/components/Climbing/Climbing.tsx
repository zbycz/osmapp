import { useFeatureContext } from '../utils/FeatureContext';
import { useRouter } from 'next/router';
import { ClimbingContextProvider } from '../FeaturePanel/Climbing/contexts/ClimbingContext';
import { ClimbingCragDialog } from '../FeaturePanel/Climbing/ClimbingCragDialog';
import React from 'react';
import { getReactKey } from '../../services/helpers';

// TODO perhaps rename this to ClimbingDialog (and the folder as well)

export const Climbing = () => {
  const { feature } = useFeatureContext();

  const router = useRouter();
  const isClimbingDialogShown = router.query.all?.[2] === 'climbing';
  const photo =
    router.query.all?.[3] === 'photo' ? router.query.all?.[4] : undefined;
  const routeNumber =
    router.query.all?.[3] === 'route' ? router.query.all?.[4] : undefined;
  const edit = router.query.all?.[3] === 'edit';

  if (!isClimbingDialogShown) {
    return null;
  }

  return (
    <ClimbingContextProvider feature={feature} key={getReactKey(feature)}>
      <ClimbingCragDialog
        photo={photo}
        routeNumber={routeNumber ? parseFloat(routeNumber) : undefined}
        edit={edit}
      />
    </ClimbingContextProvider>
  );
};
