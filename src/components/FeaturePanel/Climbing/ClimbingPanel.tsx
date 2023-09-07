import React, { useState } from 'react';
import styled from 'styled-components';
import { PanelScrollbars, PanelWrapper } from '../../utils/PanelHelpers';
import { RoutePaths } from './RoutePaths';

type PointType = 'anchor' | 'bolt-hanger' | 'bolt' | 'piton';

type PathPoints = Array<{
  x: number;
  y: number;
  type?: PointType;
  note?: string;
}>;

const IMAGE_WIDTH = 410;

const Container = styled.div`
  position: relative;
`;

const Image = styled.img`
  width: ${IMAGE_WIDTH}px;
`;

export const ClimbingPanel = () => {
  const [pathData] = useState<Array<PathPoints>>([
    [
      { x: 0.9342, y: 0.8333 },
      { x: 0.5342, y: 0.5333, type: 'bolt' },
      { x: 0.3342, y: 0.2333, type: 'anchor', note: 'knížka' },
    ],
    [
      { x: 0.8342, y: 0.8333 },
      { x: 0.5542, y: 0.7333, type: 'bolt' },
      { x: 0.7742, y: 0.2333, type: 'anchor', note: 'knížka' },
    ],
  ]);

  return (
    <PanelWrapper>
      <PanelScrollbars>
        <Container>
          <Image src="https://www.skalnioblasti.cz/image.php?typ=skala&id=13516" />
          <RoutePaths data={pathData} />
        </Container>
      </PanelScrollbars>
    </PanelWrapper>
  );
};
