import React from 'react';
import Document, { Head, Main, NextScript } from 'next/document';
import { ServerStyleSheets } from '@material-ui/core/styles';
import { ServerStyleSheet } from 'styled-components';

import theme from '../src/helpers/theme';

const AsyncStyle = ({ href }) => (
  <>
    <link
      rel="preload"
      href={href}
      as="style"
      onLoad="this.onload=null;this.rel='stylesheet'"
    />
    <noscript>
      <link rel="stylesheet" href={href} />
    </noscript>
  </>
);

export default class MyDocument extends Document {
  render() {
    return (
      <html lang="en">
        <Head>
          <meta charSet="utf-8" />
          <meta
            name="viewport"
            content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no"
          />
          {/* PWA primary color = theme.palette.primary.main */}
          {/*<meta name="theme-color" content="#eb5757" /> too light*/}
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
          />
          <AsyncStyle href="https://api.mapbox.com/mapbox-gl-js/v1.6.1/mapbox-gl.css" />
          <link rel="shortcut icon" href="/static/logo_64.png" />
          <link rel="preconnect" href="https://maps.tilehosting.com" />
          <link rel="preconnect" href="https://api.maptiler.com" />
          <link rel="preconnect" href="https://openmaptiles.github.io" />
          <link rel="preconnect" href="https://a.mapillary.com" />
          <link rel="preconnect" href="https://images.mapillary.com" />
          <link rel="preconnect" href="https://commons.wikimedia.org" />
          <link rel="preconnect" href="https://www.wikidata.org" />
          <link rel="preconnect" href="https://en.wikidata.org" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </html>
    );
  }
}

MyDocument.getInitialProps = async ctx => {
  // Resolution order
  //
  // On the server:
  // 1. app.getInitialProps
  // 2. page.getInitialProps
  // 3. document.getInitialProps
  // 4. app.render
  // 5. page.render
  // 6. document.render
  //
  // On the server with error:
  // 1. document.getInitialProps
  // 2. app.render
  // 3. page.render
  // 4. document.render
  //
  // On the client
  // 1. app.getInitialProps
  // 2. page.getInitialProps
  // 3. app.render
  // 4. page.render

  // Render app and page and get the context of the page with collected side effects.
  const sheets = new ServerStyleSheets();
  const sheets2 = new ServerStyleSheet(); // styled-components
  const originalRenderPage = ctx.renderPage;

  ctx.renderPage = () =>
    originalRenderPage({
      enhanceApp: App => props =>
        sheets.collect(sheets2.collectStyles(<App {...props} />)),
    });

  const initialProps = await Document.getInitialProps(ctx);

  return {
    ...initialProps,
    // Styles fragment is rendered after the app and page rendering finish.
    styles: [
      ...React.Children.toArray(initialProps.styles),
      sheets.getStyleElement(),
      sheets2.getStyleElement(),
    ],
  };
};
