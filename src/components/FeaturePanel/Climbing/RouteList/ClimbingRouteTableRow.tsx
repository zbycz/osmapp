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
import { useClimbingContext } from '../contexts/ClimbingContext';

const Container = styled.div`
  width: 100%;
`;
const RouteNumberContainer = styled.div`
  width: 22px;
`;
const SelectedButtonContainer = styled.div`
  position: absolute;
  right: 0;
`;
const StyledChip = styled(Chip)`
  font-size: 11px;
  font-weight: 600;
  height: 18px;
`;

const RouteNameContainer = styled.div`
  flex: 1;
  display: flex;
  gap: 8px;
  position: relative;
  align-items: center;
  user-select: text;
`;

const RouteDescriptionContainer = styled.div`
  font-size: 10px;
  color: ${({ theme }) => theme.palette.text.secondary};
  user-select: text;
`;

const RouteAuthorContainer = styled(RouteDescriptionContainer)``;

const RouteGradeContainer = styled.div``;

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

type MoreMenuProps = {
  feature: Feature;
  onTickAdd: (shortOsmId) => void;
};
const MoreMenu = ({ feature, onTickAdd }: MoreMenuProps) => {
  const { MoreMenu, handleClickMore, handleCloseMore } = useMoreMenu();
  const { open: openEditDialog } = useEditDialogContext();
  const shortOsmId = getShortId(feature.osmMeta);
  const routeDetailUrl = getRouteDetailUrl(feature);

  const handleShowRouteDetail = (event) => {
    handleCloseMore(event);
    event.stopPropagation();
  };

  const handleAddTick = (event) => {
    onTickAdd(shortOsmId);
    handleCloseMore(event);
    event.stopPropagation();
  };

  return (
    <>
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
    </>
  );
};

const getRouteDetailUrl = (feature: Feature) =>
  `${getOsmappLink(feature)}${typeof window !== 'undefined' ? window.location.hash : ''}`;

const SelectedButton = () => {
  const { setRouteSelectedIndex } = useClimbingContext();

  const handleDeselectRoute = (e) => {
    setRouteSelectedIndex(null);
    e.preventDefault();
  };

  return (
    <SelectedButtonContainer>
      <Tooltip title="Deselect route">
        <StyledChip
          label="selected"
          onDelete={handleDeselectRoute}
          size="small"
          deleteIcon={<CloseIcon />}
          color="secondary"
          variant="filled"
        />
      </Tooltip>
    </SelectedButtonContainer>
  );
};

const RouteDescription = ({ feature }: { feature: Feature }) =>
  feature.tags?.description ? (
    <RouteDescriptionContainer>
      <Typography variant="inherit" component="p">
        {feature.tags?.description}
      </Typography>
    </RouteDescriptionContainer>
  ) : null;

const RouteAuthor = ({ feature }: { feature: Feature }) =>
  feature.tags?.author ? (
    <RouteAuthorContainer>{feature.tags?.author}</RouteAuthorContainer>
  ) : null;

const RouteName = (props: { feature: Feature; selected: boolean }) => {
  const isMobileMode = useMobileMode();
  return (
    <RouteNameContainer>
      <Typography variant="inherit" component="h3">
        {props.feature.tags?.name}
      </Typography>
      <ClimbingBadges feature={props.feature} />

      {!isMobileMode && props.selected && <SelectedButton />}
    </RouteNameContainer>
  );
};

const RouteGrade = ({ feature }: { feature: Feature }) => {
  const routeDifficulties = getDifficulties(feature.tags);
  return (
    <RouteGradeContainer>
      <ConvertedRouteDifficultyBadge routeDifficulties={routeDifficulties} />
    </RouteGradeContainer>
  );
};

type Props = {
  feature: Feature;
  index: number;
  onClick: (e: any) => void;
  onMouseEnter?: (e: any) => void;
  onMouseLeave?: (e: any) => void;
  isHoverHighlighted?: boolean;
  isSelected?: boolean;
  isHrefLinkVisible?: boolean;
};

export const ClimbingRouteTableRow = forwardRef<HTMLDivElement, Props>(
  (
    {
      feature,
      index,
      onClick,
      onMouseEnter,
      onMouseLeave,
      isHoverHighlighted = false,
      isSelected = false,
      isHrefLinkVisible = true,
    },
    ref,
  ) => {
    const { climbingFilter } = useUserSettingsContext();
    const { gradeInterval } = climbingFilter;
    const [minIndex, maxIndex] = gradeInterval;
    const { onTickAdd, EditTickModal } = useAddTick();

    if (!feature) {
      return null;
    }

    const photoPathsCount = getWikimediaCommonsPhotoPathKeys(
      feature.tags,
    ).length;
    const shortId = getShortId(feature.osmMeta);
    const hasTick = isTicked(shortId);
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
            href={isHrefLinkVisible ? getRouteDetailUrl(feature) : undefined}
            // @ts-ignore
            locale={isHrefLinkVisible ? intl.lang : undefined}
          >
            <RouteNumberContainer>
              <RouteNumber hasCircle={photoPathsCount > 0} hasTick={hasTick}>
                {index + 1}
              </RouteNumber>
            </RouteNumberContainer>
            <Stack justifyContent="stretch" flex={1}>
              <RouteName feature={feature} selected={isSelected} />
              <RouteDescription feature={feature} />
              <RouteAuthor feature={feature} />
            </Stack>
            <RouteGrade feature={feature} />
            <MoreMenu feature={feature} onTickAdd={onTickAdd} />
          </Row>
        </Container>
        <EditTickModal />
      </>
    );
  },
);
ClimbingRouteTableRow.displayName = 'ClimbingTableRow';
