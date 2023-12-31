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
  List,
  ListItem,
  TextField,
} from '@material-ui/core';
import { debounce } from 'lodash';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import DeleteIcon from '@material-ui/icons/Delete';
import { ClimbingRoute } from './types';
import { useClimbingContext } from './contexts/ClimbingContext';
import { emptyRoute } from './utils/emptyRoute';
import { RouteNumber } from './RouteNumber';
import { convertGrade } from './utils/routeGrade';
import { RouteDifficultySelect } from './RouteDifficultySelect';
import { toggleElementInArray } from './utils/array';

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
  height: ${({ isExpanded }) => (isExpanded === false ? 0 : 'auto')};
  transition: all 0.3s ease-out;
  min-height: 0;
  display: flex;
  align-items: flex-start;
  background-color: ${({ theme }) => theme.backgroundSurfaceElevation2};
`;

const Left = styled.div`
  flex: 1;
`;
const Right = styled.div`
  min-width: 120px;
`;

const Label = styled.div`
  font-size: 10px;
  color: ${({ theme }) => theme.textSubdued};
  display: block;
`;

const Value = styled.div``;

const EmptyValue = styled.div`
  color: #666;
`;

export const RenderListRow = ({ route, index, onRowClick, onRouteChange }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [tempRoute, setTempRoute] = useState(emptyRoute);
  const [routeToDelete, setRouteToDelete] = useState<number | null>(null);

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

  console.log('___', routesExpanded);
  const isExpanded = routesExpanded.indexOf(index) > -1;

  const isReadOnly =
    !isEditMode ||
    (machine.currentStateName !== 'editRoute' &&
      machine.currentStateName !== 'extendRoute') ||
    !isExpanded;

  return (
    <Container>
      <Row
        ref={ref}
        onClick={() => {
          if (isSelected) {
            setRoutesExpanded(toggleElementInArray(routesExpanded, index));
          } else {
            onRowClick(index);
          }
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
              tempRoute.difficulty.gradeSystem,
              selectedRouteSystem,
              tempRoute.difficulty.grade,
            ),
          )}
        </Cell>

        <Cell width={50}>
          <IconButton
            onClick={(e) => {
              setRoutesExpanded(toggleElementInArray(routesExpanded, index));
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
        <Left>
          <List>
            <ListItem>
              {isReadOnly ? (
                <div>
                  <Label>Description</Label>
                  <Value>{getText(tempRoute.description)}</Value>
                </div>
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
            </ListItem>
          </List>
        </Left>
        <Right>
          <List>
            <ListItem>
              {isEditMode ? (
                <RouteDifficultySelect
                  onClick={stopPropagation}
                  difficulty={tempRoute.difficulty}
                  onDifficultyChanged={(difficulty) => {
                    setTempRoute({ ...tempRoute, difficulty });
                  }}
                  routeNumber={index}
                />
              ) : (
                <div>
                  <Label>Difficulty</Label>
                  <Value>
                    {getText(tempRoute.difficulty.grade)} (
                    {getText(tempRoute.difficulty.gradeSystem)})
                  </Value>
                </div>
              )}
            </ListItem>
            <ListItem>
              {isReadOnly ? (
                <div>
                  <Label>Length</Label>
                  <Value>{getText(tempRoute.length)}</Value>
                </div>
              ) : (
                <TextField
                  size="small"
                  value={tempRoute.length}
                  onChange={(e) => onTempRouteChange(e, 'length')}
                  onClick={stopPropagation}
                  style={{ marginTop: 10 }}
                  variant="outlined"
                  label="Length"
                />
              )}
            </ListItem>
            <ListItem>
              {isReadOnly ? (
                <div>
                  <Label>Author</Label>
                  <Value>{getText(tempRoute.author)}</Value>
                </div>
              ) : (
                <TextField
                  size="small"
                  value={tempRoute.author}
                  onChange={(e) => onTempRouteChange(e, 'author')}
                  onClick={stopPropagation}
                  style={{ marginTop: 10 }}
                  variant="outlined"
                  label="Author"
                />
              )}
            </ListItem>
          </List>
        </Right>

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
