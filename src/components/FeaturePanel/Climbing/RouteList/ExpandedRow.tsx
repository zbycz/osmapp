import React, { useState } from 'react';
import styled from 'styled-components';

import DeleteIcon from '@mui/icons-material/Delete';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import {
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Stack,
} from '@mui/material';
import Link from 'next/link';
import { RouteDifficultySelect } from '../RouteDifficultySelect';
import { useClimbingContext } from '../contexts/ClimbingContext';
import { RouteInDifferentPhotos } from './RouteInDifferentPhotos';
import { Label } from './Label';
import { getOsmappLink } from '../../../../services/helpers';
import { MyRouteTicks } from '../Ticks/MyRouteTicks';

const Flex = styled.div`
  display: flex;
  align-items: flex-start;
`;

const ExpandedRowContainer = styled.div<{ $isExpanded?: boolean }>`
  height: ${({ $isExpanded }) => ($isExpanded === false ? 0 : 'auto')};
  transition: all 0.1s ease-in-out;
  min-height: 0;
  overflow: hidden;
  margin-left: 26px;
`;

const Item = styled.div``;
const Value = styled.div``;
const BottomBar = styled.div`
  display: flex;
  gap: 12px;
  justify-content: space-between;
  margin-right: 20px;
  margin-bottom: 8px;
`;

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

  return (
    <>
      <ExpandedRowContainer $isExpanded={isExpanded}>
        <Flex>
          <Stack
            component="form"
            sx={{
              width: '25ch',
            }}
            spacing={2}
            noValidate
            autoComplete="off"
          >
            <Item>
              {isReadOnly && tempRoute.description && (
                <div>
                  <Label>Description</Label>
                  <Value>{getText(tempRoute.description)}</Value>
                </div>
              )}
              {isEditMode && (
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
            </Item>

            <Item>
              <RouteInDifferentPhotos
                route={tempRoute}
                stopPropagation={stopPropagation}
              />
            </Item>

            {isEditMode && (
              <Item>
                <RouteDifficultySelect
                  onClick={stopPropagation}
                  difficulty={tempRoute.difficulty}
                  onDifficultyChanged={(difficulty) => {
                    setTempRoute({ ...tempRoute, difficulty });
                  }}
                  routeNumber={index}
                />
              </Item>
            )}
            {tempRoute.length && (
              <Item>
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
              </Item>
            )}

            <Item>
              {isReadOnly && tempRoute.author && (
                <div>
                  <Label>Author</Label>
                  <Value>{getText(tempRoute.author)}</Value>
                </div>
              )}
              {isEditMode && (
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
            </Item>
          </Stack>
        </Flex>
        <BottomBar>
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

          {tempRoute.feature ? (
            <Link
              href={`${getOsmappLink(tempRoute.feature)}${
                window.location.hash
              }`}
            >
              <Button
                color="primary"
                size="small"
                variant="outlined"
                endIcon={<ArrowForwardIcon />}
              >
                Detail
              </Button>
            </Link>
          ) : null}
        </BottomBar>
        <MyRouteTicks shortOsmId={osmId} />
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
