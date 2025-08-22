import { Feature } from '../../../../services/types';
import React, { forwardRef } from 'react';
import styled from '@emotion/styled';
import { ConvertedRouteDifficultyBadge } from '../ConvertedRouteDifficultyBadge';
import {
  getDifficulties,
  getGradeIndexFromTags,
} from '../../../../services/tagging/climbing/routeGrade';
import CheckIcon from '@mui/icons-material/Check';
import { getWikimediaCommonsPhotoPathKeys } from '../utils/photo';
import { RouteNumber } from '../RouteNumber';
import { isTicked } from '../../../../services/my-ticks/ticks';
import { getOsmappLink, getShortId } from '../../../../services/helpers';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { intl, t } from '../../../../services/intl';
import {
  Chip,
  IconButton,
  MenuItem,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import Router from 'next/router';
import { useUserSettingsContext } from '../../../utils/userSettings/UserSettingsContext';
import Link from 'next/link';
import { useEditDialogContext } from '../../helpers/EditDialogContext';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import { useMobileMode } from '../../../helpers';
import { ClimbingBadges } from '../ClimbingBadges';
import { useMoreMenu } from '../useMoreMenu';
import { useAddTick } from '../Ticks/AddTickButton';

const Container = styled.div`
  width: 100%;
`;
const RouteNumberContainer = styled.div`
  width: 22px;
`;
const SelectedButton = styled.div`
  position: absolute;
  right: 0;
`;
const StyledChip = styled(Chip)`
  font-size: 11px;
  font-weight: 600;
  height: 18px;
`;

const RouteName = styled.div`
  flex: 1;
  display: flex;
  gap: 8px;
  position: relative;
  align-items: center;
  user-select: text;
`;

const RouteDescription = styled.div`
  font-size: 10px;
  color: ${({ theme }) => theme.palette.text.secondary};
  user-select: text;
`;

const RouteAuthor = styled(RouteDescription)``;

const RouteGrade = styled.div``;

const Row = styled('a', {
  shouldForwardProp: (prop) => !prop.startsWith('$'),
})<{ $isHoverHighlighted: boolean; $isVisible: boolean }>`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  flex: 1;
  gap: 12px;
  border-bottom: solid 1px ${({ theme }) => theme.palette.divider};
  color: ${({ theme }) => theme.palette.text.primary};
  cursor: pointer;
  padding: 8px;
  transition: all 0.1s;
  opacity: ${({ $isVisible }) => ($isVisible ? 1 : 0.2)};
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

type ClimbingTableRowProps = {
  feature: Feature;
  index: number;
  onClick: (e: any) => void;
  onMouseEnter?: (e: any) => void;
  onMouseLeave?: (e: any) => void;
  onDeselectRoute?: (e: any) => void;
  isHoverHighlighted?: boolean;
  isSelected?: boolean;
  isHrefLinkVisible?: boolean;
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
      isHrefLinkVisible = true,
    },
    ref,
  ) => {
    const routeNumber = index + 1;
    const { MoreMenu, handleClickMore, handleCloseMore } = useMoreMenu();
    const { open: openEditDialog } = useEditDialogContext();
    const isMobileMode = useMobileMode();
    const { climbingFilter } = useUserSettingsContext();
    const { gradeInterval } = climbingFilter;
    const [minIndex, maxIndex] = gradeInterval;
    const { onTickAdd, EditTickModal } = useAddTick();

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
      onTickAdd(shortOsmId);
      handleCloseMore(event);
      event.stopPropagation();
    };
    const linkProps = {
      href: routeDetailUrl,
      locale: intl.lang,
    };

    const gradeIndex = getGradeIndexFromTags(feature.tags);
    const isVisible =
      !gradeIndex || (gradeIndex >= minIndex && gradeIndex <= maxIndex);

    return (
      <>
        <Container ref={ref}>
          <Row
            $isVisible={isVisible}
            onClick={(e) => {
              onClick(e);
              e.preventDefault();
            }}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            $isHoverHighlighted={isHoverHighlighted}
            as={isHrefLinkVisible ? 'a' : 'div'}
            {...(isHrefLinkVisible ? linkProps : {})}
          >
            <RouteNumberContainer>
              <RouteNumber hasCircle={photoPathsCount > 0} hasTick={hasTick}>
                {routeNumber}
              </RouteNumber>
            </RouteNumberContainer>
            <Stack justifyContent="stretch" flex={1}>
              <RouteName>
                <Typography variant="inherit" component="h3">
                  {feature.tags?.name}
                </Typography>
                <ClimbingBadges feature={feature} />

                {!isMobileMode && isSelected && (
                  <SelectedButton>
                    <Tooltip title="Deselect route">
                      <StyledChip
                        label="selected"
                        onDelete={onDeselectRoute}
                        size="small"
                        deleteIcon={<CloseIcon />}
                        color="secondary"
                        variant="filled"
                      />
                    </Tooltip>
                  </SelectedButton>
                )}
              </RouteName>

              {feature.tags?.description && (
                <RouteDescription>
                  <Typography variant="inherit" component="p">
                    {feature.tags?.description}
                  </Typography>
                </RouteDescription>
              )}
              {feature.tags?.author && (
                <RouteAuthor>{feature.tags?.author}</RouteAuthor>
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
        <EditTickModal />
      </>
    );
  },
);
ClimbingRouteTableRow.displayName = 'ClimbingTableRow';
