import { Feature } from '../../../services/types';
import React from 'react';
import styled from '@emotion/styled';
import { ConvertedRouteDifficultyBadge } from '../Climbing/ConvertedRouteDifficultyBadge';
import { getDifficulties } from '../Climbing/utils/grades/routeGrade';
import CheckIcon from '@mui/icons-material/Check';
import {
  getWikimediaCommonsPhotoKeys,
  getWikimediaCommonsPhotoPathKeys,
} from '../Climbing/utils/photo';
import { RouteNumber } from '../Climbing/RouteNumber';
import { isTicked, onTickAdd } from '../../../services/ticks';
import { useFeatureContext } from '../../utils/FeatureContext';
import { getOsmappLink, getShortId } from '../../../services/helpers';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { intl, t } from '../../../services/intl';
import { IconButton, Menu, MenuItem } from '@mui/material';
import Router from 'next/router';
import { useMobileMode } from '../../helpers';
import { useSnackbar } from '../../utils/SnackbarContext';
import { useUserSettingsContext } from '../../utils/UserSettingsContext';
import Link from 'next/link';

const RoutePhoto = styled.div`
  width: 20px;
`;

const RouteName = styled.div<{ opacity: number }>`
  flex: 1;
  opacity: ${({ opacity }) => opacity};
`;

const RouteGrade = styled.div``;

const Container = styled(Link)`
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
  margin: 0px -12px;
  transition: all 0.1s;
  *,
  &:focus {
    text-decoration: none;
  }

  &:hover {
    text-decoration: none;
    background-color: rgba(0, 0, 0, 0.1);
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

export const ClimbingItem = ({
  feature,
  index,
  cragFeature,
}: {
  feature: Feature;
  index: number;
  cragFeature: Feature;
}) => {
  const routeNumber = index + 1;
  const { showToast } = useSnackbar();
  const { userSettings } = useUserSettingsContext();
  const mobileMode = useMobileMode();
  const { setPreview } = useFeatureContext();
  const { MoreMenu, handleClickMore, handleCloseMore } = useMoreMenu();

  if (!feature) return null;
  const shortOsmId = getShortId(feature.osmMeta);
  const routeDifficulties = getDifficulties(feature.tags);
  const photoPathsCount = getWikimediaCommonsPhotoPathKeys(feature.tags).length;
  const shortId = getShortId(feature.osmMeta);
  const hasTick = isTicked(shortId);

  const routeDetailUrl = `${getOsmappLink(feature)}${typeof window !== 'undefined' ? window.location.hash : ''}`;

  const handleClickItem = (event) => {
    if (event.ctrlKey || event.metaKey) return;
    event.preventDefault();
    event.stopPropagation();
    const cragFeatureLink = getOsmappLink(cragFeature);
    Router.push(`${cragFeatureLink}/climbing/route/${index}`);
  };

  const handleHover = () => feature.center && setPreview(feature);

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
    <Container
      locale={intl.lang}
      href={routeDetailUrl}
      onClick={handleClickItem}
      onMouseEnter={mobileMode ? undefined : handleHover}
      onMouseLeave={() => setPreview(null)}
    >
      <RoutePhoto>
        <RouteNumber hasCircle={photoPathsCount > 0} hasTick={hasTick}>
          {routeNumber}
        </RouteNumber>
      </RoutePhoto>
      <RouteName opacity={photoPathsCount === 0 ? 0.5 : 1}>
        {feature.tags?.name}
      </RouteName>
      <RouteGrade>
        <ConvertedRouteDifficultyBadge routeDifficulties={routeDifficulties} />
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
          component={Link}
          href={routeDetailUrl}
          locale={intl.lang}
          onClick={handleShowRouteDetail}
        >
          {t('climbingpanel.show_route_detail')}
        </MenuItem>
      </MoreMenu>
    </Container>
  );
};
