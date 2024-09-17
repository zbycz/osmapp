import styled from '@emotion/styled';
import {
  CLIMBING_ROUTE_ROW_HEIGHT,
  DIALOG_TOP_BAR_HEIGHT,
  SPLIT_PANE_DEFAULT_HEIGHT,
} from './config';
import { useClimbingContext } from './contexts/ClimbingContext';
import { invertedBoltCodeMap } from './utils/boltCodes';
import { RouteList } from './RouteList/RouteList';
import { ContentContainer } from './ContentContainer';
import { Button, ButtonGroup } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { RouteDistribution } from './RouteDistribution';
import React from 'react';

const ContentBelowRouteList = styled.div<{ $splitPaneHeight: number }>`
  min-height: calc(
    100vh -
      ${({ $splitPaneHeight }) =>
        $splitPaneHeight
          ? `${$splitPaneHeight}px`
          : SPLIT_PANE_DEFAULT_HEIGHT} -
      ${DIALOG_TOP_BAR_HEIGHT + CLIMBING_ROUTE_ROW_HEIGHT + 40}px
  );
`;
const ButtonContainer = styled.div`
  margin-bottom: 40px;
  margin-left: 40px;
`;
export const ClimbingViewContent = () => {
  const { splitPaneHeight, showDebugMenu, isEditMode, routes, setIsEditMode } =
    useClimbingContext();

  const getRoutesCsv = () => {
    const getPathString = (path) =>
      path
        ?.map(
          ({ x, y, type }) =>
            `${x},${y}${type ? invertedBoltCodeMap[type] : ''}`,
        )
        .join('|');

    const object = routes
      .map((route, _idx) => {
        const photos = Object.entries(route.paths);

        return photos.map((photoName) => [
          route.updatedTags.name,
          `File:${photoName?.[0]}`,
          getPathString(photoName?.[1]),
        ]);
      })
      .flat();
    // eslint-disable-next-line no-console
    console.table(object);
  };
  const handleEdit = () => {
    setIsEditMode(true);
  };

  return (
    <>
      <RouteList isEditable />
      <ContentBelowRouteList $splitPaneHeight={splitPaneHeight}>
        <ContentContainer>
          {!isEditMode && (
            <ButtonContainer>
              <Button
                onClick={handleEdit}
                color="primary"
                variant="contained"
                endIcon={<EditIcon />}
              >
                Edit routes
              </Button>
            </ButtonContainer>
          )}
          {showDebugMenu && (
            <>
              <br />
              <ButtonGroup variant="contained" size="small" color="primary">
                <Button size="small" onClick={getRoutesCsv}>
                  export OSM
                </Button>
              </ButtonGroup>
            </>
          )}
        </ContentContainer>
        <RouteDistribution />
      </ContentBelowRouteList>
    </>
  );
};
