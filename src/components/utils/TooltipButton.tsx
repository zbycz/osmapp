import React, { useEffect, useRef } from 'react';
import { IconButton, Tooltip } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { SvgIconOwnProps } from '@mui/material/SvgIcon/SvgIcon';
import { isMobileDevice, useBoolState } from '../helpers';
import styled from '@emotion/styled';

type Props = {
  tooltip: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  color?: SvgIconOwnProps['color'];
};

const useClickAwayListener = (
  tooltipRef: React.MutableRefObject<HTMLDivElement>,
  hide: () => void,
  isMobile: boolean,
) => {
  useEffect(() => {
    const clickAway = (e: MouseEvent) => {
      if (e.target instanceof Node && !tooltipRef.current.contains(e.target)) {
        hide();
      }
    };

    if (isMobile) {
      window.addEventListener('click', clickAway);
    }

    return () => {
      if (isMobile) {
        window.removeEventListener('click', clickAway);
      }
    };
  }, [hide, isMobile, tooltipRef]);
};

const StyledIconButton = styled(IconButton)`
  font-size: inherit;
`;

export const TooltipButton = ({ tooltip, onClick, color }: Props) => {
  const isMobile = isMobileDevice();
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [mobileTooltipShown, show, hide] = useBoolState(false);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(e);
    if (isMobile) {
      show();
    }
    e.stopPropagation();
  };

  useClickAwayListener(tooltipRef, hide, isMobile);

  return (
    <Tooltip
      arrow
      title={tooltip}
      placement="top"
      open={isMobile ? mobileTooltipShown : undefined}
      ref={tooltipRef}
    >
      <StyledIconButton onClick={handleClick}>
        <InfoOutlinedIcon fontSize="small" color={color} />
      </StyledIconButton>
    </Tooltip>
  );
};
