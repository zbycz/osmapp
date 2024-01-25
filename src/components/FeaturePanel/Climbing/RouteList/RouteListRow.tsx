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
import { convertGrade } from '../utils/routeGrade';

import { toggleElementInArray } from '../utils/array';
import { ExpandedRow } from './ExpandedRow';

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
  font-weight: 900;
  color: ${({ theme }) => theme.textPrimaryDefault};
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
    isExpanded ? theme.backgroundSurfaceElevation1 : 'none'};
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
    hasPath,
    isEditMode,
    routeSelectedIndex,
    hasPathInDifferentPhotos,
    selectedRouteSystem,
    routesExpanded,
    setRoutesExpanded,
  } = useClimbingContext();

  useEffect(() => {
    if (routeSelectedIndex === index) {
      ref.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [routeSelectedIndex]);

  const isSelected = isRouteSelected(index);
  const hasRoute = hasPath(index);
  const hasRouteInDifferentPhotos = hasPathInDifferentPhotos(index);

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

  // console.log('___', routesExpanded);
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
  };

  return (
    <Container ref={ref}>
      <Row style={{ cursor: 'pointer' }}>
        {/* <Cell width={50}>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </Cell> */}
        <RouteNumberCell component="th" scope="row" width={30}>
          <RouteNumber
            isSelected={isSelected}
            hasRoute={hasRoute}
            hasRouteInDifferentPhotos={hasRouteInDifferentPhotos}
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
        <Cell width={50}>
          {getText(
            convertGrade(
              tempRoute.difficulty?.gradeSystem,
              selectedRouteSystem,
              tempRoute.difficulty?.grade,
            ),
          )}
        </Cell>

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
