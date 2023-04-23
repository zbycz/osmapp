import LinearProgress from '@material-ui/core/LinearProgress';
import React, { useEffect } from 'react';
// import styled from 'styled-components';
import Router from 'next/router';
// import { isDesktop, useBoolState } from '../helpers';
import { useBoolState } from '../helpers';

// const Wrapper = styled.div`
//   position: absolute;
//   top: 72px;
//   z-index: 1200;

//   width: 100%;
//   @media ${isDesktop} {
//     width: 410px;
//   }
// `;

export const Loading = () => {
  const [loading, start, stop] = useBoolState(false);

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

  return (
    <div className='absolute left-0 right-0 bottom-0 min-h-fit'>
      {loading && <LinearProgress />}
    </div>
  )
};
