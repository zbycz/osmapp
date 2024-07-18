import React from 'react';
import { useEditDialogFeature } from '../utils';
import { useEditContext } from '../EditContext';
import {
  ChangeLocationEditor,
  DialogHeading,
  PlaceCancelledToggle,
} from '../components';
import { t } from '../../../../services/intl';

export const OptionsEditor = () => {
  const { feature, isAddPlace, isUndelete } = useEditDialogFeature();
  const {
    location,
    setLocation,
    tags: { cancelled, toggleCancelled },
  } = useEditContext();

  return (
    <>
      {!isAddPlace && !isUndelete && (
        <>
          <DialogHeading>{t('editdialog.options_heading')}</DialogHeading>
          <PlaceCancelledToggle
            cancelled={cancelled}
            toggle={toggleCancelled}
          />
          <ChangeLocationEditor
            location={location}
            setLocation={setLocation}
            feature={feature}
          />
        </>
      )}
    </>
  );
};
