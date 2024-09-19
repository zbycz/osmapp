import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import CloseIcon from '@mui/icons-material/Close';
import { SvgIconOwnProps } from '@mui/material/SvgIcon/SvgIcon';
import { isMobileDevice, useToggleState } from '../helpers';
import styled from '@emotion/styled';

type Props = {
  tooltip: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  color?: SvgIconOwnProps['color'];
};

const StyledIconButton = styled(IconButton)`
  font-size: inherit;
`;

export const TooltipButton = ({ tooltip, onClick, color }: Props) => {
  const isMobile = isMobileDevice();
  const [mobileTooltipShown, toggleMobileTooltip] = useToggleState(false);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(e);
    if (isMobile) {
      toggleMobileTooltip();
    }
    e.stopPropagation();
  };

  return (
    <Tooltip
      arrow
      title={tooltip}
      placement="top"
      open={isMobile ? mobileTooltipShown : undefined}
    >
      <StyledIconButton onClick={handleClick}>
        {!mobileTooltipShown && (
          <InfoOutlinedIcon fontSize="inherit" color={color} />
        )}
        {mobileTooltipShown && <CloseIcon fontSize="inherit" color={color} />}
      </StyledIconButton>
    </Tooltip>
  );
};
