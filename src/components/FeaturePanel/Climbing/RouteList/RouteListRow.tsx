/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { debounce } from 'lodash';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CheckIcon from '@mui/icons-material/Check';
import { TextField, Tooltip, IconButton } from '@mui/material';
import { ClimbingRoute } from '../types';
import { useClimbingContext } from '../contexts/ClimbingContext';
import { emptyRoute } from '../utils/emptyRoute';
import { RouteNumber } from '../RouteNumber';
import { toggleElementInArray } from '../utils/array';
import { ExpandedRow } from './ExpandedRow';
import { RouteDifficultyBadge } from '../RouteDifficultyBadge';
import { getShortId } from '../../../../services/helpers';
import { isTicked } from '../../../../services/ticks';
import { getDifficulties } from '../utils/grades/routeGrade';

const DEBOUNCE_TIME = 1000;
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
const DifficultyCell = styled(Cell)`
  margin-right: 8px;
`;
const RouteNumberCell = styled(Cell)`
  color: #999;
  margin-left: 8px;
`;
const ExpandIcon = styled(ExpandMoreIcon)<{ $isExpanded: boolean }>`
  transform: rotate(${({ $isExpanded }) => ($isExpanded ? 180 : 0)}deg);
  transition: all 0.3s ease !important;
`;

const Row = styled.div<{ $isExpanded?: boolean }>`
  min-height: 40px;
  background-color: ${({ $isExpanded, theme }) =>
    $isExpanded ? theme.palette.action.selected : 'none'};
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
    routesExpanded,
    setRoutesExpanded,
    getPhotoInfoForRoute,
  } = useClimbingContext();

  useEffect(() => {
    if (routeSelectedIndex === index) {
      ref.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [routeSelectedIndex]);
  const osmId = route.feature?.osmMeta
    ? getShortId(route.feature.osmMeta)
    : null;
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
  const ticked = isTicked(osmId);
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
  const routeDifficulties = getDifficulties(tempRoute.feature?.tags);

  return (
    <Container ref={ref}>
      <Row style={{ cursor: 'pointer' }}>
        <RouteNumberCell $width={30}>
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
          {ticked && (
            <Tooltip title="You ticked this route">
              <CheckIcon color="primary" style={{ marginRight: 20 }} />
            </Tooltip>
          )}
        </NameCell>
        <DifficultyCell $width={50}>
          <RouteDifficultyBadge routeDifficulties={routeDifficulties} />
        </DifficultyCell>

        <Cell $width={50}>
          <IconButton
            onClick={(e) => {
              setRoutesExpanded(toggleElementInArray(routesExpanded, index));
              stopPropagation(e);
            }}
            size="small"
            title="Toggle"
          >
            <ExpandIcon $isExpanded={isExpanded} />
          </IconButton>
        </Cell>
      </Row>

      <ExpandedRow {...expandedRowProps} />
    </Container>
  );
};
