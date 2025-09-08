import { useCurrentItem, useEditContext } from '../../context/EditContext';
import { Alert, Button } from '@mui/material';
import { NwrIcon } from '../../../NwrIcon';
import { t } from '../../../../../services/intl';
import React from 'react';
import { FeatureTags } from '../../../../../services/types';
import { getApiId } from '../../../../../services/helpers';

// TODO maybe add sport=climbing as well? but this need more testing
export const isConvertible = (shortId: string, tags: FeatureTags) =>
  shortId.startsWith('n') && ['crag', 'area'].includes(tags.climbing);

export const ConvertNodeToRelation = () => {
  const { setCurrent, removeItem } = useEditContext();
  const { shortId, tags, convertToRelation } = useCurrentItem();

  const handleConvertToRelation = async () => {
    const newShortId = await convertToRelation();
    setCurrent(newShortId);
    if (getApiId(shortId).id < 0) {
      removeItem(shortId);
    }
  };

  return (
    <Alert
      severity="info"
      icon={null}
      action={
        <Button
          onClick={handleConvertToRelation}
          color="inherit"
          variant="text"
          size="small"
          startIcon={<NwrIcon osmType="relation" color="inherit" />}
        >
          {t('editdialog.members.convert_button')}
        </Button>
      }
    >
      {tags.climbing === 'crag'
        ? t('editdialog.members.climbing_crag_convert_description')
        : t('editdialog.members.convert_description')}
    </Alert>
  );
};
