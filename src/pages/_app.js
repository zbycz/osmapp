// @flow

import * as React from 'react';
import App, { Container } from 'next/app';
import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  html, body, #__next {
    margin: 0;
    padding: 0;
    height: 100%;
    border: 0;
    font-family: 'Roboto', sans-serif;
  }
`;

export default class MyApp extends App {
  static async getInitialProps({ Component, router, ctx }) {
    const pageProps = Component.getInitialProps
      ? await Component.getInitialProps(ctx)
      : {};
    return { pageProps };
  }

  render() {
    const { Component, pageProps } = this.props;

    return (
      <Container>
        <Component {...pageProps} />
        <GlobalStyle />
      </Container>
    );
  }
}
