import { Dialog, DialogContent, DialogTitle } from '@mui/material';
import React from 'react';
import { t } from '../../../../services/intl';
import { LinkSection } from './LinkSection';
import { CoordinateSection } from './CoordinateSection';
import { OpenInSection } from './OpenInSection';
import { ImageAttribution } from './ImageAttribution';
import { useFeatureContext } from '../../../utils/FeatureContext';
import { getLabel } from '../../../../helpers/featureLabel';
import { useMobileMode } from '../../../helpers';

type Props = {
  open: boolean;
  onClose: (event: {}, reason: 'backdropClick' | 'escapeKeyDown') => void;
};

export const ShareDialog = ({ open, onClose }: Props) => {
  const isMobileMode = useMobileMode();
  const { feature } = useFeatureContext();
  const label = getLabel(feature);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullScreen={isMobileMode}
    >
      <DialogTitle>
        {t('featurepanel.share_button')}: {label}
      </DialogTitle>
      <DialogContent sx={isMobileMode ? undefined : { minWidth: 420 }}>
        <LinkSection />
        <CoordinateSection />
        <OpenInSection />
        <ImageAttribution />
      </DialogContent>
    </Dialog>
  );
};
