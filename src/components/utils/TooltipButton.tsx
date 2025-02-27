import React, { useEffect, useRef } from 'react';
import { IconButton, SxProps, Theme, Tooltip } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { isMobileDevice, useBoolState } from '../helpers';

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

type Props = {
  tooltip: React.ReactNode;
  sx?: SxProps<Theme>;
};

/**
 * Button with InfoIcon, which works on both desktop and mobile.
 * (Desktop onHover, Mobile onClick)
 */
export const TooltipButton = ({ tooltip, sx }: Props) => {
  const isMobile = isMobileDevice();
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [mobileTooltipShown, show, hide] = useBoolState(false);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (isMobile) {
      show();
    }
    e.stopPropagation();
  };

  useClickAwayListener(tooltipRef, hide, isMobile);

  const button = (
    <IconButton onClick={handleClick} sx={sx}>
      <InfoOutlinedIcon fontSize="inherit" color="inherit" />
    </IconButton>
  );

  // There is a bug in MUI, passing `open={undefined}` prop to Tooltip makes it uninteractive TODO check again eg 6/2025, or report
  return isMobile ? (
    <Tooltip
      arrow
      title={tooltip}
      placement="top"
      open={mobileTooltipShown}
      ref={tooltipRef}
    >
      {button}
    </Tooltip>
  ) : (
    <Tooltip
      arrow
      title={tooltip}
      placement="top"
      //open={isMobile ? mobileTooltipShown : undefined} -- broken, see above
      ref={tooltipRef}
    >
      {button}
    </Tooltip>
  );
};
