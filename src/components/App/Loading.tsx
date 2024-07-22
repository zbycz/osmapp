import React, { useEffect } from 'react';
import styled from 'styled-components';
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

// TODO this shows only for next.js page load, but doesnt wait for getInitialProps
export const Loading = () => {
  const [isLoadingNext, start, stop] = useBoolState(false);
  const { feature } = useFeatureContext();
  const loading = isLoadingNext || feature.loading;

  useEffect(() => {
    Router.events.on('routeChangeStart', start);
    Router.events.on('routeChangeComplete', stop);
    Router.events.on('routeChangeError', stop);

    return () => {
      Router.events.off('routeChangeStart', start);
      Router.events.off('routeChangeComplete', stop);
      Router.events.off('routeChangeError', stop);
    };
  }, []);

  return <Wrapper>{loading && <LinearProgress />}</Wrapper>;
};
