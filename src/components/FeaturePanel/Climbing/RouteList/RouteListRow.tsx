/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect, useRef, useState } from 'react';
import styled from '@emotion/styled';
import { debounce } from 'lodash';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { IconButton, TextField } from '@mui/material';
import { ClimbingRoute } from '../types';
import { useClimbingContext } from '../contexts/ClimbingContext';
import { getEmptyRoute } from '../utils/getEmptyRoute';
import { RouteNumber } from '../RouteNumber';
import { ExpandedRow } from './ExpandedRow';
import { ConvertedRouteDifficultyBadge } from '../ConvertedRouteDifficultyBadge';
import { getShortId } from '../../../../services/helpers';
import { getDifficulties } from '../utils/grades/routeGrade';
import { isTicked } from '../../../../services/ticks';
import { getWikimediaCommonsPhotoPathKeys } from '../utils/photo';
import { useUserSettingsContext } from '../../../utils/UserSettingsContext';
import { CLIMBING_ROUTE_ROW_HEIGHT } from '../config';
import { EmptyValue } from './EmptyValue';

const DEBOUNCE_TIME = 5000;
const Container = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const Cell = styled.div<{ $width?: number }>`
  ${({ $width }) => ($width ? `width: ${$width}px;` : '')}
`;
const NameCell = styled(Cell)`
  flex: 1;
  display: flex;
  gap: 8px;
  justify-content: space-between;
`;
const Opacity = styled.div<{ opacity: number }>`
  opacity: ${({ opacity }) => opacity};
`;
const DifficultyCell = styled(Cell)`
  margin-right: 8px;
`;
const RouteNumberCell = styled(Cell)`
  color: #999;
  margin-left: 8px;
  margin-right: 8px;
`;
const ExpandIcon = styled(ExpandMoreIcon)<{ $isExpanded: boolean }>`
  transform: rotate(${({ $isExpanded }) => ($isExpanded ? 180 : 0)}deg);
  transition: all 0.3s ease !important;
`;

const Row = styled.div<{ $isExpanded?: boolean }>`
  min-height: ${CLIMBING_ROUTE_ROW_HEIGHT}px;
  background-color: ${({ $isExpanded, theme }) =>
    $isExpanded ? theme.palette.action.selected : 'none'};
  overflow: hidden;

  width: 100%;
  display: flex;
  align-items: center;
  gap: 4px;
`;

const useTempState = (routeId: string) => {
  const { routes, updateRouteOnIndex } = useClimbingContext();
  const route = routes.find((route) => route.id === routeId);
  const [tempRoute, setTempRoute] = useState<ClimbingRoute>(route);

  const onValueChange = (e, propName: keyof ClimbingRoute) => {
    const index = routes.findIndex((route) => route.id === routeId);
    updateRouteOnIndex(index, (route) => ({
      ...route,
      updatedTags: {
        ...route.updatedTags,
        [propName]: e.target.value,
      },
    }));
  };

  const debouncedValueChange = (e, propName) =>
    debounce(() => onValueChange(e, propName), DEBOUNCE_TIME)(e);

  const onTempRouteChange = (e, propName: string) => {
    setTempRoute((prevValue) => ({
      ...prevValue,
      updatedTags: {
        ...prevValue.updatedTags,
        [propName]: e.target.value,
      },
    }));
    debouncedValueChange(e, propName);
  };

  return { tempRoute, onTempRouteChange };
};

type Props = {
  routeId: string;
  stopPropagation: (e: React.MouseEvent) => void;
  parentRef: React.RefObject<HTMLDivElement>;
};

export const RenderListRow = ({
  routeId,
  stopPropagation,
  parentRef,
}: Props) => {
  const ref = useRef<HTMLDivElement>(null);
  const { userSettings } = useUserSettingsContext();

  const { tempRoute, onTempRouteChange } = useTempState(routeId);

  const {
    routes,
    getMachine,
    isEditMode,
    routeSelectedIndex,
    routeIndexExpanded,
    setRouteIndexExpanded,
    setRouteListTopOffset,
  } = useClimbingContext();

  const index = routes.findIndex((route) => route.id === routeId);
  const route = routes[index];

  useEffect(() => {
    if (
      userSettings['climbing.selectRoutesByScrolling'] &&
      ref.current &&
      parentRef.current
    ) {
      const elementRect = ref.current.getBoundingClientRect();
      const parentRect = parentRef.current.getBoundingClientRect();
      const relativeTop = elementRect.top - parentRect.top;

      setRouteListTopOffset(index, relativeTop);
    }
  }, [
    index,
    parentRef,
    setRouteListTopOffset,
    routeIndexExpanded,
    userSettings,
  ]);

  useEffect(() => {
    if (
      !userSettings['climbing.selectRoutesByScrolling'] &&
      routeSelectedIndex === index
    ) {
      ref.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [routeSelectedIndex]); // eslint-disable-line react-hooks/exhaustive-deps

  const osmId = route.feature?.osmMeta
    ? getShortId(route.feature.osmMeta)
    : null;

  const machine = getMachine();

  const isExpanded = routeIndexExpanded === index;

  const isReadOnly =
    !isEditMode ||
    (machine.currentStateName !== 'editRoute' &&
      machine.currentStateName !== 'extendRoute') ||
    !isExpanded;
  const routeDifficulties = getDifficulties(tempRoute.feature?.tags);
  const hasTick = isTicked(osmId);

  const photoPathsCount = getWikimediaCommonsPhotoPathKeys(
    tempRoute?.feature?.tags || {},
  ).length;

  return (
    <Container ref={ref}>
      <Row style={{ cursor: 'pointer' }}>
        <RouteNumberCell>
          <RouteNumber hasCircle={photoPathsCount > 0} hasTick={hasTick}>
            {index + 1}
          </RouteNumber>
        </RouteNumberCell>
        <NameCell>
          {isReadOnly ? (
            <Opacity opacity={photoPathsCount === 0 ? 0.5 : 1}>
              {tempRoute.updatedTags.name || <EmptyValue />}
            </Opacity>
          ) : (
            <TextField
              size="small"
              value={tempRoute.updatedTags.name}
              placeholder="No name"
              onChange={(e) => onTempRouteChange(e, 'name')}
              onClick={stopPropagation}
              fullWidth
            />
          )}
        </NameCell>
        <DifficultyCell $width={50}>
          <ConvertedRouteDifficultyBadge
            routeDifficulties={routeDifficulties}
          />
        </DifficultyCell>

        <Cell $width={50}>
          <IconButton
            onClick={(e) => {
              setRouteIndexExpanded(
                routeIndexExpanded === index ? null : index,
              );
              stopPropagation(e);
            }}
            size="small"
            title="Toggle"
          >
            <ExpandIcon $isExpanded={isExpanded} />
          </IconButton>
        </Cell>
      </Row>

      <ExpandedRow
        {...{
          tempRoute,
          onTempRouteChange,
          stopPropagation,
          isReadOnly,
          index,
          isExpanded,
          osmId,
        }}
      />
    </Container>
  );
};
