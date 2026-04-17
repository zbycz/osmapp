import { QRCodeSVG } from 'qrcode.react';
import { useTheme } from '@emotion/react';

type Props = {
  payload: string;
  image?: string;
};

export const QrCode = ({ payload, image }: Props) => {
  const theme = useTheme();
  const imageSettings = image
    ? { src: image, width: 32, height: 32, excavate: true }
    : undefined;

  return (
    <QRCodeSVG
      value={payload}
      size={128}
      level="M"
      bgColor="transparent"
      fgColor={theme.palette.text.primary}
      imageSettings={imageSettings}
    />
  );
};
