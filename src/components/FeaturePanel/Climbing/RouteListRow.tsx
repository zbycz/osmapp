import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  TextField,
} from '@material-ui/core';
import { debounce } from 'lodash';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import DeleteIcon from '@material-ui/icons/Delete';
import { ClimbingRoute } from './types';
import { useClimbingContext } from './contexts/ClimbingContext';
import { emptyRoute } from './utils/emptyRoute';
import { RouteNumber } from './RouteNumber';

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
const RouteNumberCell = styled(Cell)`
  color: #999;
  margin-left: 8px;
`;
const ExpandIcon = styled(ExpandMoreIcon)<{ isExpanded: boolean }>`
  transform: rotate(${({ isExpanded }) => (isExpanded ? 0 : 180)}deg);
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

const ExpandedRow = styled(Row)<{ isExpanded?: boolean }>`
  height: ${({ isExpanded }) => (isExpanded === false ? 0 : '100px')};
  padding-left: 40px;
  transition: all 0.3s ease-out;
  min-height: 0;
`;

const EmptyValue = styled.div`
  color: #666;
`;

export const RenderListRow = ({ route, index, onRowClick, onRouteChange }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [tempRoute, setTempRoute] = useState(emptyRoute);
  const [routeToDelete, setRouteToDelete] = useState<number | null>(null);

  const getText = (field: keyof ClimbingRoute) =>
    route[field] ? route[field] : <EmptyValue>?</EmptyValue>;

  useEffect(() => {
    setTempRoute(route);
  }, [route]);

  const {
    getMachine,
    isRouteSelected,
    hasPath,
    isEditMode,
    routeSelectedIndex,
  } = useClimbingContext();

  useEffect(() => {
    if (routeSelectedIndex === index) {
      ref.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [routeSelectedIndex]);

  const isSelected = isRouteSelected(index);
  const hasRoute = !!hasPath(index);

  const machine = getMachine();

  const hideDeleteDialog = () => {
    setRouteToDelete(null);
  };

  const onValueChange = (e, propName: keyof ClimbingRoute) => {
    onRouteChange(e, index, propName);
  };

  const stopPropagation = (e) => {
    e.stopPropagation();
  };
  const debouncedValueChange = (e, propName) =>
    debounce(() => onValueChange(e, propName), DEBOUNCE_TIME)(e);

  const onTempRouteChange = (e, propName: keyof ClimbingRoute) => {
    setTempRoute({ ...tempRoute, [propName]: e.target.value });
    debouncedValueChange(e, propName);
  };
  const onDeleteExistingRouteClick = (routeNumber: number) => {
    machine.execute('deleteRoute', { routeNumber });
    hideDeleteDialog();
  };

  const isReadOnly =
    !isEditMode ||
    (machine.currentStateName !== 'editRoute' &&
      machine.currentStateName !== 'extendRoute') ||
    !isSelected;

  return (
    <Container>
      <Row
        ref={ref}
        onClick={() => {
          onRowClick(index);
        }}
        selected={isSelected}
        style={{ cursor: 'pointer' }}
      >
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
          <RouteNumber isSelected={isSelected} hasRoute={hasRoute}>
            {index + 1}
          </RouteNumber>
        </RouteNumberCell>
        <NameCell>
          {isReadOnly ? (
            getText('name')
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
        <Cell width={60}>
          {isReadOnly ? (
            getText('difficulty')
          ) : (
            <TextField
              size="small"
              value={tempRoute.difficulty}
              placeholder="6+"
              onChange={(e) => onTempRouteChange(e, 'difficulty')}
              onClick={stopPropagation}
              style={{ paddingTop: 0 }}
            />
          )}
        </Cell>

        <Cell align="right">
          <IconButton
            onClick={(e) => {
              setIsExpanded(!isExpanded);
              stopPropagation(e);
            }}
            color="primary"
            size="small"
            title="Toggle"
          >
            <ExpandIcon isExpanded={isExpanded} />
          </IconButton>
        </Cell>
      </Row>

      <ExpandedRow isExpanded={isExpanded}>
        {isReadOnly ? (
          getText('description')
        ) : (
          <TextField
            size="small"
            value={tempRoute.description}
            onChange={(e) => onTempRouteChange(e, 'description')}
            onClick={stopPropagation}
            style={{ marginTop: 10 }}
            variant="outlined"
            label="Description"
            fullWidth
            multiline
          />
        )}
        {!isReadOnly && (
          <IconButton
            onClick={() => setRouteToDelete(index)}
            color="primary"
            size="small"
            title="Delete route"
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        )}
      </ExpandedRow>
      <Dialog
        open={routeToDelete !== null}
        onClose={hideDeleteDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Delete route?</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Do you want to delete this route?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={hideDeleteDialog} autoFocus>
            Cancel
          </Button>
          <Button
            onClick={() => onDeleteExistingRouteClick(routeToDelete)}
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};