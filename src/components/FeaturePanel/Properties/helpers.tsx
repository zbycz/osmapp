import { useEffect } from 'react';
import styled from '@emotion/styled';
import { Button } from '@mui/material';
import ChevronRight from '@mui/icons-material/ChevronRight';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import React from 'react';
import { t } from '../../../services/intl';

const StyledToggleButton = styled(Button)`
  svg {
    font-size: 17px;
  }
`;

export const ShowMoreButton = ({ onClick, isShown }) => (
  <StyledToggleButton onClick={onClick} aria-label="Toggle">
    {!isShown && (
      <>
        {t('show_more')} <ChevronRight fontSize="small" />
      </>
    )}
    {isShown && (
      <>
        {t('show_less')} <ExpandLessIcon fontSize="small" />
      </>
    )}
  </StyledToggleButton>
);

export function use2dContext(
  ref: React.RefObject<HTMLCanvasElement>,
  handler: (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => void,
  deps: React.DependencyList = [],
) {
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    handler(ctx, canvas);

    return () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref, ...deps]);
}
