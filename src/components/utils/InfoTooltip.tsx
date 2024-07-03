import React, { MouseEventHandler } from 'react';
import { IconButton, Tooltip } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import CloseIcon from '@mui/icons-material/Close';
import { SvgIconOwnProps } from '@mui/material/SvgIcon/SvgIcon';
import { isMobileDevice, useToggleState } from '../helpers';

type Props = {
  tooltip: React.ReactNode;
  onClick?: (e: MouseEventHandler<HTMLButtonElement>) => void;
  color?: SvgIconOwnProps['color'];
};

export const InfoTooltip = ({ tooltip, onClick, color }: Props) => {
  const isMobile = isMobileDevice();
  const [mobileTooltipShown, toggleMobileTooltip] = useToggleState(false);

  const handleClick = (e) => {
    onClick?.(e);
    if (isMobile) {
      toggleMobileTooltip();
    }
  };

  return (
    <Tooltip
      arrow
      title={tooltip}
      placement="top"
      open={isMobile ? mobileTooltipShown : undefined}
    >
      <IconButton onClick={handleClick}>
        {!mobileTooltipShown && (
          <InfoOutlinedIcon fontSize="small" color={color} />
        )}
        {mobileTooltipShown && <CloseIcon fontSize="small" color={color} />}
      </IconButton>
    </Tooltip>
  );
};
