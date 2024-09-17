import React, { useState } from 'react';
import styled from '@emotion/styled';

import DeleteIcon from '@mui/icons-material/Delete';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import {
  List,
  ListItem,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import { RouteDifficultySelect } from '../RouteDifficultySelect';
import { useClimbingContext } from '../contexts/ClimbingContext';
import { RouteInDifferentPhotos } from './RouteInDifferentPhotos';
import { Label } from './Label';
import { getOsmappLink } from '../../../../services/helpers';
import { MyRouteTicks } from '../Ticks/MyRouteTicks';
import Link from 'next/link';
import { EmptyValue } from './EmptyValue';
import { ClimbingRoute } from '../types';
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

const ExpandedRowContainer = styled.div<{ $isExpanded?: boolean }>`
  height: ${({ $isExpanded }) => ($isExpanded === false ? 0 : 'auto')};
  transition: all 0.1s ease-in-out;
  min-height: 0;
  overflow: hidden;
  margin-left: 26px;
`;

const Value = styled.div``;

type Props = {
  tempRoute: ClimbingRoute;
  onTempRouteChange: (e: any, key: string) => void;
  stopPropagation: (e: React.MouseEvent) => void;
  isReadOnly: boolean;
  index: number;
  isExpanded: boolean;
  osmId: string;
};

export const ExpandedRow = ({
  tempRoute,
  onTempRouteChange,
  stopPropagation,
  isReadOnly,
  index,
  isExpanded,
  osmId,
}: Props) => {
  const { isEditMode, getMachine, updateRouteOnIndex } = useClimbingContext();

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
          <Left>
            <List>
              <ListItem>
                {!isEditMode && tempRoute.updatedTags.description && (
                  <div>
                    <Label>Description</Label>
                    <Value>
                      {tempRoute.updatedTags.description || <EmptyValue />}
                    </Value>
                  </div>
                )}
                {isEditMode && (
                  <TextField
                    size="small"
                    value={tempRoute.updatedTags.description}
                    onChange={(e) => {
                      onTempRouteChange(e, 'description');
                    }}
                    onClick={stopPropagation}
                    style={{ marginTop: 10 }}
                    variant="outlined"
                    label="Description"
                    fullWidth
                    multiline
                  />
                )}
              </ListItem>

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
                      // setTempRoute({ ...tempRoute, difficulty });
                      // onTempRouteChange
                    }}
                    routeNumber={index}
                  />
                </ListItem>
              )}
              {tempRoute.updatedTags.length && (
                <ListItem>
                  {isReadOnly ? (
                    <div>
                      <Label>Length</Label>
                      <Value>
                        {tempRoute.updatedTags.length || <EmptyValue />}
                      </Value>
                    </div>
                  ) : (
                    <TextField
                      size="small"
                      value={tempRoute.updatedTags.length}
                      onChange={(e) => onTempRouteChange(e, 'length')}
                      onClick={stopPropagation}
                      style={{ marginTop: 10 }}
                      variant="outlined"
                      label="Length"
                    />
                  )}
                </ListItem>
              )}

              <ListItem>
                {isReadOnly && tempRoute.updatedTags.author && (
                  <div>
                    <Label>Author</Label>
                    <Value>
                      {tempRoute.updatedTags.author || <EmptyValue />}
                    </Value>
                  </div>
                )}
                {isEditMode && (
                  <TextField
                    size="small"
                    value={tempRoute.updatedTags.author}
                    onChange={(e) => onTempRouteChange(e, 'author')}
                    onClick={stopPropagation}
                    style={{ marginTop: 10 }}
                    variant="outlined"
                    label="Author"
                  />
                )}
              </ListItem>
              <ListItem>
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
              </ListItem>
            </List>
          </Right>
        </Flex>
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
