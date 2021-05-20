import React from 'react';
import Document, { Html, Head, Main, NextScript } from 'next/document';
import { ServerStyleSheets } from '@material-ui/core/styles';
import { ServerStyleSheet } from 'styled-components';
import { getServerIntl } from '../src/services/intlServer';
import { InjectIntl, setIntl } from '../src/services/intl';

// This stinks so much!! https://github.com/facebook/react/issues/12014#issuecomment-434534770
const AsyncStyle = ({ href }) => (
  <script
    // eslint-disable-next-line react/no-danger
    dangerouslySetInnerHTML={{
      __html: `</script><link rel="preload" href="${href}" as="style" onload="this.onload=null;this.rel='stylesheet'"/><script>`,
    }}
  />
);

const Favicons = () => (
  <>
    <link rel="shortcut icon" href="/logo/osmapp_192.png" sizes="192x192" />
    <link rel="shortcut icon" href="/logo/osmapp_256.png" sizes="256x256" />
    <link rel="shortcut icon" href="/logo/osmapp_64.png" />
    <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
    <link rel="apple-touch-icon" href="/logo/apple.png" />
    <link rel="apple-touch-icon" sizes="57x57" href="/logo/apple_57.png" />
    <link rel="apple-touch-icon" sizes="72x72" href="/logo/apple_72.png" />
    <link rel="apple-touch-icon" sizes="76x76" href="/logo/apple_76.png" />
    <link rel="apple-touch-icon" sizes="114x114" href="/logo/apple_114.png" />
    <link rel="apple-touch-icon" sizes="120x120" href="/logo/apple_120.png" />
    <link rel="apple-touch-icon" sizes="144x144" href="/logo/apple_144.png" />
    <link rel="apple-touch-icon" sizes="152x152" href="/logo/apple_152.png" />
    <link rel="apple-touch-icon" sizes="180x180" href="/logo/apple_180.png" />
  </>
);

export default class MyDocument extends Document {
  render() {
    const {serverIntl} = this.props as any;
    return (
      <Html lang={serverIntl.lang}>
        <Head>
          <meta charSet="utf-8" />
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
          />
          <AsyncStyle href="https://api.mapbox.com/mapbox-gl-js/v1.6.1/mapbox-gl.css" />
          <Favicons />
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
          <InjectIntl intl={serverIntl} />
          <NextScript />
        </body>
      </Html>
    );
  }
}

MyDocument.getInitialProps = async (ctx) => {
  const serverIntl = getServerIntl(ctx);
  setIntl(serverIntl); // for SSR

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
    serverIntl,
  };
};
