import React from 'react';
import Document, {
  DocumentInitialProps,
  DocumentProps,
  Head,
  Html,
  Main,
  NextScript,
} from 'next/document';
import type { DocumentContext } from 'next/dist/shared/lib/utils';
import {
  DocumentHeadTags,
  documentGetInitialProps,
  DocumentHeadTagsProps,
} from '@mui/material-nextjs/v13-pagesRouter';
import { getServerIntl } from '../src/services/intlServer';
import { InjectIntl, setIntl } from '../src/services/intl';
import { FaviconsOsmapp } from '../src/helpers/FaviconsOsmapp';
import { PROJECT_ID, setProjectForSSR } from '../src/services/project';
import { FaviconsOpenClimbing } from '../src/helpers/FaviconsOpenClimbing';

type Props = DocumentInitialProps &
  DocumentProps &
  DocumentHeadTagsProps & {
    serverIntl: Awaited<ReturnType<typeof getServerIntl>>;
    asPath: string;
  };

export default class MyDocument extends Document<Props> {
  render() {
    const isOpenClimbing = PROJECT_ID === 'openclimbing';
    const { serverIntl, asPath, emotionStyleTags } = this.props;

    return (
      <Html lang={serverIntl.lang}>
        <Head>
          <meta charSet="utf-8" />
          <DocumentHeadTags emotionStyleTags={emotionStyleTags} />
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
          {/* only for bots - we dont need to change this after SSR: */}
          {Object.keys(serverIntl.languages).map((lang) => (
            <link
              key={lang}
              rel="alternate"
              hrefLang={lang}
              href={`/${lang}${asPath}`}
            />
          ))}

          {isOpenClimbing ? <FaviconsOpenClimbing /> : <FaviconsOsmapp />}
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

type InitialProps = DocumentInitialProps &
  DocumentHeadTagsProps & {
    serverIntl: Awaited<ReturnType<typeof getServerIntl>>;
    asPath: string;
  };

MyDocument.getInitialProps = async (
  ctx: DocumentContext,
): Promise<InitialProps> => {
  // server intl is not available in App, only in this file (because we don't want to sent messages over and over again)
  const serverIntl = await getServerIntl(ctx);
  setIntl(serverIntl); // for ssr
  setProjectForSSR(ctx);

  const initialProps = await documentGetInitialProps(ctx);

  return {
    ...initialProps,
    serverIntl,
    asPath: ctx.asPath,
  };
};
