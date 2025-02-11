import React, { useEffect, useRef } from 'react';
import { IconButton, Tooltip } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { SvgIconOwnProps } from '@mui/material/SvgIcon/SvgIcon';
import { isMobileDevice, useBoolState } from '../helpers';
import styled from '@emotion/styled';

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

const StyledIconButton = styled(IconButton)<{ fontSize?: number }>`
  font-size: ${({ fontSize }) => (fontSize ? `${fontSize}px` : 'inherit')};
`;

type Props = {
  tooltip: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  color?: SvgIconOwnProps['color'];
  fontSize?: number;
};

export const TooltipButton = ({ tooltip, onClick, color, fontSize }: Props) => {
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

  const content = (
    <StyledIconButton onClick={handleClick} fontSize={fontSize}>
      <InfoOutlinedIcon fontSize="inherit" color={color} />
    </StyledIconButton>
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
      {content}
    </Tooltip>
  ) : (
    <Tooltip
      arrow
      title={tooltip}
      placement="top"
      //open={isMobile ? mobileTooltipShown : undefined} -- broken, see above
      ref={tooltipRef}
    >
      {content}
    </Tooltip>
  );
};
