import React from 'react';
import styled from '@emotion/styled';

import {
  ClimbingContextProvider,
  useClimbingContext,
} from '../contexts/ClimbingContext';
import { RouteListDndContent } from './RouteListDndContent';
import { useFeatureContext } from '../../../utils/FeatureContext';
import { isClimbingRelation } from '../../../../utils';
import { getKey } from '../../../../services/helpers';

const Container = styled.div`
  padding-bottom: 20px;
  position: relative; // mobile safari fix
`;

export const RouteList = ({ isEditable }: { isEditable?: boolean }) => {
  const {
    routes,
    setRouteSelectedIndex,
    routeSelectedIndex,
    routeIndexExpanded,
  } = useClimbingContext();

  React.useEffect(() => {
    const downHandler = (e) => {
      if (routes.length === 0) return;

      if (e.key === 'ArrowDown') {
        const nextRoute = routes[routeSelectedIndex + 1];
        if (nextRoute) {
          setRouteSelectedIndex(routeSelectedIndex + 1);
          e.preventDefault();
        }
      }
      if (e.key === 'ArrowUp') {
        const prevRoute = routes[routeSelectedIndex - 1];
        if (prevRoute) {
          setRouteSelectedIndex(routeSelectedIndex - 1);
          e.preventDefault();
        }
      }
    };

    window.addEventListener('keydown', downHandler);

    return () => {
      window.removeEventListener('keydown', downHandler);
    };
  }, [routeSelectedIndex, routes, routeIndexExpanded]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Container>
      {routes.length !== 0 && <RouteListDndContent isEditable={isEditable} />}
    </Container>
  );
};

export const RouteListInPanel = () => {
  const { feature } = useFeatureContext();

  if (
    isClimbingRelation(feature) && // only for this condition is memberFeatures fetched
    feature.tags.climbing === 'crag'
  ) {
    return (
      <ClimbingContextProvider feature={feature} key={getKey(feature)}>
        <RouteList />
      </ClimbingContextProvider>
    );
  }

  return null;
};
