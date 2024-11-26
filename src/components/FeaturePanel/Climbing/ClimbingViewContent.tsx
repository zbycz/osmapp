import styled from '@emotion/styled';
import {
  CLIMBING_ROUTE_ROW_HEIGHT,
  DIALOG_TOP_BAR_HEIGHT,
  SPLIT_PANE_DEFAULT_SIZE,
} from './config';
import { useClimbingContext } from './contexts/ClimbingContext';
import { invertedBoltCodeMap } from './utils/boltCodes';
import { RouteList } from './RouteList/RouteList';
import { ContentContainer } from './ContentContainer';
import { Button, ButtonGroup } from '@mui/material';

import { RouteDistribution } from './RouteDistribution';
import React from 'react';
import dynamic from 'next/dynamic';
import { EditButton } from '../EditButton';
import { EditDialog } from '../EditDialog/EditDialog';
import { useGetCragViewLayout } from './utils/useCragViewLayout';

const CragMapDynamic = dynamic(() => import('./CragMap'), {
  ssr: false,
  loading: () => <div />,
});

const ContentBelowRouteList = styled.div<{
  $splitPaneSize: number;
  $cragViewLayout: 'horizontal' | 'vertical';
}>`
  min-height: ${({ $cragViewLayout, $splitPaneSize }) =>
    $cragViewLayout === 'horizontal'
      ? `
  calc(
    100vh -
      ${$splitPaneSize ? `${$splitPaneSize}px` : SPLIT_PANE_DEFAULT_SIZE} -
      ${DIALOG_TOP_BAR_HEIGHT + CLIMBING_ROUTE_ROW_HEIGHT + 40}px
  );`
      : `calc(100vh - ${DIALOG_TOP_BAR_HEIGHT + CLIMBING_ROUTE_ROW_HEIGHT + 40}px);`};
`;

export const ClimbingViewContent = ({ isMapVisible }) => {
  const { splitPaneSize, showDebugMenu, routes } = useClimbingContext();
  const cragViewLayout = useGetCragViewLayout();

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
          route.feature.tags.name,
          `File:${photoName?.[0]}`,
          getPathString(photoName?.[1]),
        ]);
      })
      .flat();
    // eslint-disable-next-line no-console
    console.table(object);
  };

  return isMapVisible ? (
    <CragMapDynamic />
  ) : (
    <>
      <RouteList isEditable />
      <ContentBelowRouteList
        $splitPaneSize={splitPaneSize}
        $cragViewLayout={cragViewLayout}
      >
        <ContentContainer>
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
        <EditButton />
        <EditDialog />
      </ContentBelowRouteList>
    </>
  );
};
