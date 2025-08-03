import { Dialog, DialogContent, DialogTitle, IconButton } from '@mui/material';
import React from 'react';
import { t } from '../../../../services/intl';
import { LinkSection } from './LinkSection';
import { CoordinateSection } from './CoordinateSection';
import { OpenInSection } from './OpenInSection';
import { ImageAttribution } from './ImageAttribution';
import { useFeatureContext } from '../../../utils/FeatureContext';
import { getLabel } from '../../../../helpers/featureLabel';
import { useMobileMode } from '../../../helpers';
import CloseIcon from '@mui/icons-material/Close';
import { QrCodeSection } from './QrCodeSection';

type CloseButtonProps = {
  onClose: () => void;
};

export const CloseButton = ({ onClose }: CloseButtonProps) => (
  <IconButton onClick={onClose} size="small" sx={{ float: 'right' }}>
    <CloseIcon fontSize="small" />
  </IconButton>
);

type Props = {
  open: boolean;
  onClose: () => void;
};

export const ShareDialog = ({ open, onClose }: Props) => {
  const isMobileMode = useMobileMode();
  const { feature } = useFeatureContext();
  const label = getLabel(feature);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullScreen={isMobileMode}
    >
      <DialogTitle>
        <CloseButton onClose={onClose} />
        {t('featurepanel.share_button')}: {label}
      </DialogTitle>
      <DialogContent sx={isMobileMode ? undefined : { minWidth: 480 }}>
        <LinkSection />
        <QrCodeSection />
        <CoordinateSection />
        <OpenInSection />
        <ImageAttribution />
      </DialogContent>
    </Dialog>
  );
};
