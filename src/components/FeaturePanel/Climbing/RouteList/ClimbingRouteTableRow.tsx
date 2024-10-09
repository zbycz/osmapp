import { Feature } from '../../../../services/types';
import React, { forwardRef } from 'react';
import styled from '@emotion/styled';
import { ConvertedRouteDifficultyBadge } from '../ConvertedRouteDifficultyBadge';
import { getDifficulties } from '../utils/grades/routeGrade';
import CheckIcon from '@mui/icons-material/Check';
import { getWikimediaCommonsPhotoPathKeys } from '../utils/photo';
import { RouteNumber } from '../RouteNumber';
import { isTicked, onTickAdd } from '../../../../services/ticks';
import { getOsmappLink, getShortId } from '../../../../services/helpers';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { intl, t } from '../../../../services/intl';
import { Chip, IconButton, Menu, MenuItem, Stack } from '@mui/material';
import Router from 'next/router';
import { useSnackbar } from '../../../utils/SnackbarContext';
import { useUserSettingsContext } from '../../../utils/UserSettingsContext';
import Link from 'next/link';
import { useEditDialogContext } from '../../helpers/EditDialogContext';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import { useMobileMode } from '../../../helpers';

const Container = styled.div`
  width: 100%;
`;
const RoutePhoto = styled.div`
  width: 20px;
`;

const RouteName = styled.div<{ opacity: number }>`
  flex: 1;
  opacity: ${({ opacity }) => opacity};
  display: flex;
  gap: 4px;
  justify-content: space-between;
`;

const RouteDescription = styled.div<{ opacity: number }>`
  font-size: 10px;
  opacity: ${({ opacity }) => opacity};
  color: ${({ theme }) => theme.palette.text.secondary};
`;

const RouteGrade = styled.div``;

const Row = styled(Link)<{ $isHoverHighlighted: boolean }>`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  flex: 1;
  gap: 12px;
  border-bottom: solid 1px ${({ theme }) => theme.palette.divider};
  color: ${({ theme }) => theme.palette.text.primary};
  cursor: pointer;
  padding: 8px 20px;
  transition: all 0.1s;
  *,
  &:focus {
    text-decoration: none;
  }

  &:hover {
    text-decoration: none;
    background-color: ${({ $isHoverHighlighted }) =>
      $isHoverHighlighted ? 'rgba(0, 0, 0, 0.1)' : ''};
  }
`;

const useMoreMenu = () => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClickMore = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    event.preventDefault();
    event.stopPropagation();
  };

  const handleCloseMore = (event) => {
    setAnchorEl(null);
    event.stopPropagation();
  };

  const MoreMenu = ({ children }) => (
    <Menu anchorEl={anchorEl} open={open} onClose={handleCloseMore}>
      {children}
    </Menu>
  );

  return { anchorEl, open, handleClickMore, handleCloseMore, MoreMenu };
};

type ClimbingTableRowProps = {
  feature: Feature;
  index: number;
  onClick: (e: any) => void;
  onMouseEnter?: (e: any) => void;
  onMouseLeave?: (e: any) => void;
  onDeselectRoute?: (e: any) => void;
  isHoverHighlighted?: boolean;
  isSelected?: boolean;
};

export const ClimbingRouteTableRow = forwardRef<
  HTMLDivElement,
  ClimbingTableRowProps
>(
  (
    {
      feature,
      index,
      onClick,
      onMouseEnter,
      onMouseLeave,
      onDeselectRoute,
      isHoverHighlighted = false,
      isSelected = false,
    },
    ref,
  ) => {
    const routeNumber = index + 1;
    const { showToast } = useSnackbar();
    const { userSettings } = useUserSettingsContext();
    const { MoreMenu, handleClickMore, handleCloseMore } = useMoreMenu();
    const { open: openEditDialog } = useEditDialogContext();
    const isMobileMode = useMobileMode();

    if (!feature) return null;
    const shortOsmId = getShortId(feature.osmMeta);
    const routeDifficulties = getDifficulties(feature.tags);
    const photoPathsCount = getWikimediaCommonsPhotoPathKeys(
      feature.tags,
    ).length;
    const shortId = getShortId(feature.osmMeta);
    const hasTick = isTicked(shortId);

    const routeDetailUrl = `${getOsmappLink(feature)}${typeof window !== 'undefined' ? window.location.hash : ''}`;

    const handleShowRouteDetail = (event) => {
      handleCloseMore(event);
      event.stopPropagation();
    };

    const handleAddTick = (event) => {
      onTickAdd({
        osmId: shortOsmId,
        style: userSettings['climbing.defaultClimbingStyle'],
      });
      showToast('Tick added!', 'success');
      handleCloseMore(event);
      event.stopPropagation();
    };

    return (
      <Container ref={ref}>
        <Row
          locale={intl.lang}
          href={routeDetailUrl}
          onClick={(e) => {
            onClick(e);
            e.preventDefault();
          }}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          $isHoverHighlighted={isHoverHighlighted}
        >
          <RoutePhoto>
            <RouteNumber hasCircle={photoPathsCount > 0} hasTick={hasTick}>
              {routeNumber}
            </RouteNumber>
          </RoutePhoto>
          <Stack justifyContent="stretch" flex={1}>
            <RouteName opacity={photoPathsCount === 0 ? 0.5 : 1}>
              {feature.tags?.name}
              {!isMobileMode && isSelected && (
                <Chip
                  label="highlighted"
                  onDelete={onDeselectRoute}
                  size="small"
                  deleteIcon={<CloseIcon />}
                  color="primary"
                  variant="outlined"
                />
              )}
            </RouteName>

            {feature.tags?.description && (
              <RouteDescription opacity={photoPathsCount === 0 ? 0.5 : 1}>
                {feature.tags?.description}
              </RouteDescription>
            )}
          </Stack>
          <RouteGrade>
            <ConvertedRouteDifficultyBadge
              routeDifficulties={routeDifficulties}
            />
          </RouteGrade>

          <IconButton color="secondary" onClick={handleClickMore}>
            <MoreHorizIcon color="secondary" />
          </IconButton>

          <MoreMenu>
            <MenuItem onClick={handleAddTick} disableRipple>
              <CheckIcon />
              {t('climbingpanel.add_tick')}
            </MenuItem>

            <MenuItem
              onClick={(e) => {
                handleShowRouteDetail(e);
                Router.push(routeDetailUrl).then(() => {
                  openEditDialog();
                });
              }}
            >
              <EditIcon />
              {t('climbingpanel.edit_route')}
            </MenuItem>
            <MenuItem
              component={Link}
              href={routeDetailUrl}
              locale={intl.lang}
              onClick={handleShowRouteDetail}
            >
              {t('climbingpanel.show_route_detail')}
            </MenuItem>
          </MoreMenu>
        </Row>
      </Container>
    );
  },
);
ClimbingRouteTableRow.displayName = 'ClimbingTableRow';
