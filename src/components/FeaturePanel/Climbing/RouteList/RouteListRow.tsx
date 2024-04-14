/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { IconButton, TextField } from '@material-ui/core';
import { debounce } from 'lodash';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { ClimbingRoute } from '../types';
import { useClimbingContext } from '../contexts/ClimbingContext';
import { emptyRoute } from '../utils/emptyRoute';
import { RouteNumber } from '../RouteNumber';

import { toggleElementInArray } from '../utils/array';
import { ExpandedRow } from './ExpandedRow';
import { RouteDifficultyBadge } from '../RouteDifficultyBadge';
import { getShortId } from '../../../../services/helpers';

const DEBOUNCE_TIME = 1000;
const Container = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const Cell = styled.div<{ width: number; align: 'center' | 'left' | 'right' }>`
  width: ${({ width }) => width}px;
  text-align: ${({ align }) => align};
`;
const NameCell = styled(Cell)`
  flex: 1;
`;
const DifficultyCell = styled(Cell)`
  margin-right: 8px;
`;
const RouteNumberCell = styled(Cell)`
  color: #999;
  margin-left: 8px;
`;
const ExpandIcon = styled(ExpandMoreIcon)<{ isExpanded: boolean }>`
  transform: rotate(${({ isExpanded }) => (isExpanded ? 180 : 0)}deg);
  transition: all 0.3s ease !important;
`;

const Row = styled.div<{ isExpanded?: boolean }>`
  min-height: 40px;
  background-color: ${({ isExpanded, theme }) =>
    isExpanded ? theme.palette.action.selected : 'none'};
  overflow: hidden;

  width: 100%;
  display: flex;
  align-items: center;
  gap: 4px;
`;

const EmptyValue = styled.div`
  color: #666;
`;

export const RenderListRow = ({
  route,
  index,
  onRouteChange,
  stopPropagation,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [tempRoute, setTempRoute] = useState<ClimbingRoute>(emptyRoute);

  const getText = (text: string) => text || <EmptyValue>?</EmptyValue>;

  useEffect(() => {
    setTempRoute(route);
  }, [route]);

  const {
    getMachine,
    isRouteSelected,
    isEditMode,
    routeSelectedIndex,
    selectedRouteSystem,
    routesExpanded,
    setRoutesExpanded,
    getPhotoInfoForRoute,
  } = useClimbingContext();

  useEffect(() => {
    if (routeSelectedIndex === index) {
      ref.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [routeSelectedIndex]);
  const osmId = getShortId(route.feature?.osmMeta) ?? null;
  const isSelected = isRouteSelected(index);
  const photoInfoForRoute = getPhotoInfoForRoute(index);

  const machine = getMachine();

  const onValueChange = (e, propName: keyof ClimbingRoute) => {
    onRouteChange(e, index, propName);
  };

  const debouncedValueChange = (e, propName) =>
    debounce(() => onValueChange(e, propName), DEBOUNCE_TIME)(e);

  const onTempRouteChange = (e, propName: keyof ClimbingRoute) => {
    setTempRoute({ ...tempRoute, [propName]: e.target.value });
    debouncedValueChange(e, propName);
  };

  const isExpanded = routesExpanded.indexOf(index) > -1;

  const isReadOnly =
    !isEditMode ||
    (machine.currentStateName !== 'editRoute' &&
      machine.currentStateName !== 'extendRoute') ||
    !isExpanded;
  const expandedRowProps = {
    tempRoute,
    getText,
    onTempRouteChange,
    setTempRoute,
    stopPropagation,
    isReadOnly,
    index,
    isExpanded,
    osmId,
  };

  return (
    <Container ref={ref}>
      <Row style={{ cursor: 'pointer' }}>
        <RouteNumberCell component="th" scope="row" width={30}>
          <RouteNumber
            isSelected={isSelected}
            photoInfoForRoute={photoInfoForRoute}
            osmId={osmId}
          >
            {index + 1}
          </RouteNumber>
        </RouteNumberCell>
        <NameCell>
          {isReadOnly ? (
            getText(tempRoute.name)
          ) : (
            <TextField
              size="small"
              value={tempRoute.name}
              placeholder="No name"
              onChange={(e) => onTempRouteChange(e, 'name')}
              onClick={stopPropagation}
              fullWidth
            />
          )}
        </NameCell>
        <DifficultyCell width={50}>
          <RouteDifficultyBadge
            routeDifficulty={tempRoute.difficulty}
            selectedRouteSystem={selectedRouteSystem}
          />
        </DifficultyCell>

        <Cell width={50}>
          <IconButton
            onClick={(e) => {
              setRoutesExpanded(toggleElementInArray(routesExpanded, index));
              stopPropagation(e);
            }}
            size="small"
            title="Toggle"
          >
            <ExpandIcon isExpanded={isExpanded} />
          </IconButton>
        </Cell>
      </Row>

      <ExpandedRow {...expandedRowProps} />
    </Container>
  );
};
