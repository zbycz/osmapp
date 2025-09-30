import { QRCodeSVG } from 'qrcode.react';
import { useFeatureContext } from '../../../utils/FeatureContext';
import { getFullOsmappLink } from '../../../../services/helpers';
import { useTheme } from '@emotion/react';
import { PROJECT_ID } from '../../../../services/project';

const getLogoSrc = () => {
  if (PROJECT_ID === 'openclimbing') {
    return '/openclimbing/logo/openclimbing_64.png';
  }
  return '/osmapp/logo/osmapp_64.png';
};

export const QrCodeSection = () => {
  const { feature } = useFeatureContext();
  const url = getFullOsmappLink(feature);
  const theme = useTheme();

  return (
    <QRCodeSVG
      value={url}
      size={128}
      level="M"
      bgColor="transparent"
      fgColor={theme.palette.text.primary}
      imageSettings={{
        src: getLogoSrc(),
        width: 32,
        height: 32,
        excavate: true,
      }}
    />
  );
};
