import React from 'react';
import { getUrlOsmId } from '../../services/helpers';
import { EditDialog } from './EditDialog/EditDialog';
import { useFeatureContext } from '../utils/FeatureContext';
import { EditButton } from './EditButton';

export const SuggestEdit = () => {
  const { feature } = useFeatureContext();
  const { point, osmMeta, deleted } = feature;

  return (
    <>
      <div style={{ textAlign: 'center' }}>
        <EditButton isAddPlace={point} isUndelete={deleted} />

        <EditDialog
          feature={feature}
          isAddPlace={point}
          isUndelete={deleted}
          key={
            getUrlOsmId(osmMeta) + (deleted && 'del') // we need to refresh inner state
          }
        />
      </div>
    </>
  );
};
