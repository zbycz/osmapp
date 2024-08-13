import React, { useEffect } from 'react';
import styled from '@emotion/styled';
import Router from 'next/router';
import { LinearProgress } from '@mui/material';
import { isDesktop, useBoolState } from '../helpers';
import { useFeatureContext } from '../utils/FeatureContext';

const Wrapper = styled.div`
  position: absolute;
  top: 0;
  z-index: 1200;

  width: 100%;
  @media ${isDesktop} {
    width: 410px;
  }
`;

const useStateWithTimeout = () => {
  const [loading, start, stop] = useBoolState(false);
  const timeout = React.useRef<NodeJS.Timeout>();
  return {
    loading,
    start: () => {
      timeout.current = setTimeout(start, 300);
    },
    stop: () => {
      if (timeout.current) {
        clearTimeout(timeout.current);
        timeout.current = undefined;
      }
      stop();
    },
  };
};

const useIsLoadingNext = () => {
  const { loading, start, stop } = useStateWithTimeout();
  useEffect(() => {
    Router.events.on('routeChangeStart', start);
    Router.events.on('routeChangeComplete', stop); // for some reason this doesn't wait for getInitialProps
    Router.events.on('routeChangeError', stop);

    return () => {
      Router.events.off('routeChangeStart', start);
      Router.events.off('routeChangeComplete', stop);
      Router.events.off('routeChangeError', stop);
    };
  }, []);
  return loading;
};

const useIsLoadingFeature = () => {
  const { loading, start, stop } = useStateWithTimeout();
  const { feature } = useFeatureContext();
  useEffect(() => {
    if (!feature) return;
    if (feature.skeleton) {
      start();
    } else {
      stop();
    }
  }, [feature]);
  return loading;
};

export const Loading = () => {
  const isLoadingNext = useIsLoadingNext();
  const isLoadingFeature = useIsLoadingFeature();
  return (
    <Wrapper>
      {(isLoadingNext || isLoadingFeature) && <LinearProgress />}
    </Wrapper>
  );
};
