import React, { useState } from 'react';
import styled from 'styled-components';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  List,
  ListItem,
  TextField,
} from '@material-ui/core';

import DeleteIcon from '@material-ui/icons/Delete';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import AddIcon from '@material-ui/icons/Add';
import Router from 'next/router';
import { RouteDifficultySelect } from '../RouteDifficultySelect';
import { useClimbingContext } from '../contexts/ClimbingContext';
import { RouteInDifferentPhotos } from './RouteInDifferentPhotos';
import { Label } from './Label';
import { getOsmappLink } from '../../../../services/helpers';
import { onTickAdd } from '../utils/ticks';
import { MyTicks } from './MyTicks';

const Left = styled.div`
  flex: 1;
`;
const Right = styled.div`
  min-width: 120px;
`;
const Flex = styled.div`
  display: flex;
  align-items: flex-start;
`;

const ExpandedRowContainer = styled.div<{ isExpanded?: boolean }>`
  height: ${({ isExpanded }) => (isExpanded === false ? 0 : 'auto')};
  transition: all 0.1s ease-in-out;
  min-height: 0;
  overflow: hidden;
  margin-left: 26px;
`;

const Value = styled.div``;

export const ExpandedRow = ({
  tempRoute,
  getText,
  onTempRouteChange,
  setTempRoute,
  stopPropagation,
  isReadOnly,
  index,
  isExpanded,
  osmId,
}) => {
  const { isEditMode, getMachine } = useClimbingContext();
  const machine = getMachine();
  const [routeToDelete, setRouteToDelete] = useState<number | null>(null);

  const hideDeleteDialog = () => {
    setRouteToDelete(null);
  };

  const onDeleteExistingRouteClick = (routeNumber: number) => {
    machine.execute('deleteRoute', { routeNumber });
    hideDeleteDialog();
  };
  const onNodeDetailClick = () => {
    Router.push(`${getOsmappLink(tempRoute.feature)}${window.location.hash}`);
  };

  return (
    <>
      <ExpandedRowContainer isExpanded={isExpanded}>
        <Flex>
          <Left>
            <List>
              {tempRoute.description && (
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
              )}
              <ListItem>
                <RouteInDifferentPhotos
                  route={tempRoute}
                  stopPropagation={stopPropagation}
                />
              </ListItem>
              <ListItem>
                {!isReadOnly && (
                  <Button
                    onClick={() => setRouteToDelete(index)}
                    color="primary"
                    size="small"
                    startIcon={<DeleteIcon fontSize="small" />}
                  >
                    Delete route
                  </Button>
                )}
              </ListItem>
            </List>
          </Left>
          <Right>
            <List>
              {isEditMode && (
                <ListItem>
                  <RouteDifficultySelect
                    onClick={stopPropagation}
                    difficulty={tempRoute.difficulty}
                    onDifficultyChanged={(difficulty) => {
                      setTempRoute({ ...tempRoute, difficulty });
                    }}
                    routeNumber={index}
                  />
                </ListItem>
              )}
              {tempRoute.length && (
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
              )}
              {tempRoute.author && (
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
              )}
              <ListItem>
                <Button
                  onClick={onNodeDetailClick}
                  color="secondary"
                  size="small"
                  variant="text"
                  endIcon={<ArrowForwardIcon />}
                >
                  Show route detail
                </Button>
              </ListItem>
              <ListItem>
                <Button
                  onClick={() => {
                    onTickAdd({ osmId });
                    // stopPropagation(e);
                  }}
                  color="secondary"
                  size="small"
                  variant="text"
                  endIcon={<AddIcon />}
                >
                  Add tick
                </Button>
              </ListItem>
            </List>
          </Right>
        </Flex>
        <MyTicks osmId={osmId} />
      </ExpandedRowContainer>
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
    </>
  );
};
