import {
  Box,
  Divider,
  Fade,
  lighten,
  Paper,
  Popper,
  Stack,
  Typography,
} from '@mui/material';
import React from 'react';
import styled from '@emotion/styled';
import { Placement } from '@popperjs/core';

const styles = {
  arrow: {
    position: 'absolute',
    fontSize: 7,
    width: '3em',
    height: '3em',
    '&::before': {
      content: '""',
      margin: 'auto',
      display: 'block',
      width: 0,
      height: 0,
      borderStyle: 'solid',
    },
  },
};

const ELEVATION = 1;

const StyledPopper = styled(Popper)(({ theme }) => {
  const bg = lighten(theme.palette.background.paper, ELEVATION * 0.05);
  return {
    '&[data-popper-placement*="bottom"] .arrow': {
      top: 0,
      left: 0,
      marginTop: '-0.9em',
      width: '3em',
      height: '1em',
      '&::before': {
        borderWidth: '0 1em 1em 1em',
        borderColor: `transparent transparent ${bg} transparent`,
      },
    },
    '&[data-popper-placement*="top"] .arrow': {
      bottom: 0,
      left: 0,
      marginBottom: '-0.9em',
      width: '3em',
      height: '1em',
      '&::before': {
        borderWidth: '1em 1em 0 1em',
        borderColor: `${bg} transparent transparent transparent`,
      },
    },
    '&[data-popper-placement*="right"] .arrow': {
      left: 0,
      marginLeft: '-0.9em',
      height: '3em',
      width: '1em',
      '&::before': {
        borderWidth: '1em 1em 1em 0',
        borderColor: `transparent ${bg} transparent transparent`,
      },
    },
    '&[data-popper-placement*="left"] .arrow': {
      right: 0,
      marginRight: '-0.9em',
      height: '3em',
      width: '1em',
      '&::before': {
        borderWidth: '1em 0 1em 1em',
        borderColor: `transparent transparent transparent ${bg}`,
      },
    },
  };
});

type PopperWithArrowProps = {
  children: React.ReactNode;
  addition?: React.ReactNode;
  isOpen: boolean;
  anchorEl: any;
  title: React.ReactNode;
  placement?: Placement;
  offset?: number[];
  sx?: React.CSSProperties;
};

export const PopperWithArrow = ({
  children,
  addition,
  isOpen,
  anchorEl,
  title,
  placement,
  offset = [0, 0],
  sx,
}: PopperWithArrowProps) => {
  const [arrowRef, setArrowRef] = React.useState<HTMLElement | null>(null);

  return (
    <StyledPopper
      open={isOpen}
      anchorEl={anchorEl}
      transition
      placement={placement}
      modifiers={[
        {
          name: 'offset',
          options: {
            offset,
          },
        },
        {
          name: 'arrow',
          options: {
            enabled: true,
            element: arrowRef,
          },
        },
      ]}
      sx={{ zIndex: 1300, ...sx }}
    >
      {({ TransitionProps }) => (
        <Fade {...TransitionProps} timeout={350}>
          <div>
            <Box
              component="span"
              className="arrow"
              ref={setArrowRef}
              sx={styles.arrow}
            />

            <Paper elevation={ELEVATION}>
              {title && (
                <>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Typography
                      variant="subtitle1"
                      fontWeight={900}
                      ml={2}
                      mr={1}
                      mt={1}
                      mb={1}
                    >
                      {title}
                    </Typography>
                    {addition}
                  </Stack>
                  <Divider />
                </>
              )}
              {children}
            </Paper>
          </div>
        </Fade>
      )}
    </StyledPopper>
  );
};
