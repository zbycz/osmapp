import React from 'react';
import Document, { Html, Head, Main, NextScript } from 'next/document';
import { ServerStyleSheets } from '@material-ui/core/styles';
import { ServerStyleSheet } from 'styled-components';

// This stinks so much!! https://github.com/facebook/react/issues/12014#issuecomment-434534770
const AsyncStyle = ({ href }) => (
  <script
    // eslint-disable-next-line react/no-danger
    dangerouslySetInnerHTML={{
      __html: `</script><link rel="preload" href="${href}" as="style" onload="this.onload=null;this.rel='stylesheet'"/><script>`,
    }}
  />
);

export default class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <meta charSet="utf-8" />
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
          />
          <AsyncStyle href="https://api.mapbox.com/mapbox-gl-js/v1.6.1/mapbox-gl.css" />
          <link rel="shortcut icon" href="/logo_64.png" />
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
      </Html>
    );
  }
}

MyDocument.getInitialProps = async (ctx) => {
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
      enhanceApp: (App) => (props) =>
        sheets.collect(sheets2.collectStyles(<App {...props} />)), // eslint-disable-line react/jsx-props-no-spreading
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
