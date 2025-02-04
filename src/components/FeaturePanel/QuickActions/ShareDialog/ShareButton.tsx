import { QuickActionButton } from '../QuickActionButton';
import IosShareIcon from '@mui/icons-material/IosShare';
import React from 'react';
import { useBoolState } from '../../../helpers';
import { t } from '../../../../services/intl';
import { ShareDialog } from './ShareDialog';

export const ShareButton = () => {
  const [opened, open, close] = useBoolState(false);

  return (
    <>
      <QuickActionButton
        label={t('featurepanel.share_button')}
        icon={IosShareIcon}
        onClick={open}
      />
      <ShareDialog open={opened} onClose={close} />
    </>
  );
};
