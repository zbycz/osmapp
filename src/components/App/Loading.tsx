import LinearProgress from '@material-ui/core/LinearProgress';
import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/router';
import { useBoolState } from '../helpers';

const Wrapper = styled.div`
  position: absolute;
  top: 72px;
  z-index: 1200;

  width: 100%;
  @media (min-width: 410px) {
    width: 410px;
  }
`;

export const Loading = () => {
  const [loading, start, stop] = useBoolState(false);
  const router = useRouter();

  useEffect(() => {
    router.events.on('routeChangeStart', start);
    router.events.on('routeChangeComplete', stop);
    router.events.on('routeChangeError', stop);

    return () => {
      router.events.off('routeChangeStart', start);
      router.events.off('routeChangeComplete', stop);
      router.events.off('routeChangeError', stop);
    };
  }, []);

  return <Wrapper>{loading && <LinearProgress />}</Wrapper>;
};
