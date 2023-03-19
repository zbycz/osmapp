import React from 'react';
import Document, { Head, Html, Main, NextScript } from 'next/document';
import { ServerStyleSheets } from '@material-ui/core/styles';
import { ServerStyleSheet } from 'styled-components';
import { getServerIntl } from '../src/services/intlServer';
import { InjectIntl } from '../src/services/intl';
import { Favicons } from '../src/helpers/Favicons';

export default class MyDocument extends Document {
  render() {
    const { serverIntl, asPath } = this.props as any;
    return (
      <Html lang={serverIntl.lang}>
        <Head>
          <meta charSet="utf-8" />
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
          />
          <link rel="preconnect" href="https://api.maptiler.com" />
          <link rel="preconnect" href="https://a.mapillary.com" />
          <link rel="preconnect" href="https://images.mapillary.com" />
          <link rel="preconnect" href="https://commons.wikimedia.org" />
          <link rel="preconnect" href="https://www.wikidata.org" />
          <link rel="preconnect" href="https://en.wikipedia.org" />
          {Object.keys(serverIntl.languages).map((lang) => (
            <link
              key={lang}
              rel="alternate"
              hrefLang={lang}
              href={`${asPath}?lang=${lang}`}
            />
          ))}

          <Favicons />
          {/* <style>{`body {background-color: #eb5757;}`/* for apple PWA translucent-black status bar *!/</style> */}
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
  const serverIntl = await getServerIntl(ctx); // not available in App, only in this file

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
    asPath: ctx.asPath,
  };
};
