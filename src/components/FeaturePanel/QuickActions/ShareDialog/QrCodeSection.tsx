import { QRCodeSVG } from 'qrcode.react';
import { useFeatureContext } from '../../../utils/FeatureContext';
import { getFullOsmappLink } from '../../../../services/helpers';
import { useTheme } from '@emotion/react';

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
        src: 'https://openclimbing.org/openclimbing/logo/openclimbing_64.png',
        width: 32,
        height: 32,
        excavate: true,
      }}
    />
  );
};
