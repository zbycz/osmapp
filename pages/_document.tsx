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
  documentGetInitialProps,
  DocumentHeadTags,
  DocumentHeadTagsProps,
} from '@mui/material-nextjs/v13-pagesRouter';
import { getServerIntl } from '../src/services/intlServer';
import { InjectIntl, setIntl } from '../src/services/intl';
import { FaviconsOsmapp } from '../src/helpers/FaviconsOsmapp';
import { PROJECT_ID, setProjectForSSR } from '../src/services/project';
import { FaviconsOpenClimbing } from '../src/helpers/FaviconsOpenClimbing';
import styled from '@emotion/styled';
import { getUrlForLangLinks, LangLinks } from '../src/helpers/LangLinks';
import { OpenSearch } from '../src/helpers/OpenSearch';

const Body = styled.body`
  @media (prefers-color-scheme: light) {
    background-color: #f6f6f6;
  }
  @media (prefers-color-scheme: dark) {
    background-color: #303030;
  }
`;

type InitialProps = DocumentInitialProps &
  DocumentHeadTagsProps & {
    serverIntl: Awaited<ReturnType<typeof getServerIntl>>;
    urlForLangLinks: string | false;
  };

type Props = DocumentProps & InitialProps;

export default class MyDocument extends Document<Props> {
  render() {
    const isOpenClimbing = PROJECT_ID === 'openclimbing';
    const { serverIntl, urlForLangLinks, emotionStyleTags } = this.props;

    return (
      <Html lang={serverIntl.lang}>
        <Head>
          <meta charSet="utf-8" />
          <DocumentHeadTags emotionStyleTags={emotionStyleTags} />
          {isOpenClimbing ? (
            <link
              href="https://fonts.googleapis.com/css2?family=Piazzolla:ital,opsz,wght@0,8..30,900;1,8..30,900&family=Roboto:wght@300;400;500;700;900&display=swap"
              rel="stylesheet"
            />
          ) : (
            <link
              href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700;900&display=swap"
              rel="stylesheet"
            />
          )}

          <link rel="preconnect" href="https://api.maptiler.com" />
          <link rel="preconnect" href="https://a.mapillary.com" />
          <link rel="preconnect" href="https://images.mapillary.com" />
          <link rel="preconnect" href="https://commons.wikimedia.org" />
          <link rel="preconnect" href="https://www.wikidata.org" />
          <link rel="preconnect" href="https://en.wikipedia.org" />
          <LangLinks urlForLangLinks={urlForLangLinks} />

          {isOpenClimbing ? <FaviconsOpenClimbing /> : <FaviconsOsmapp />}
          <OpenSearch />
          {/* <style>{`body {background-color: #eb5757;}`/* for apple PWA translucent-black status bar *!/</style> */}
        </Head>
        <Body>
          <Main />
          <InjectIntl intl={serverIntl} />
          <NextScript />
        </Body>
      </Html>
    );
  }
}

MyDocument.getInitialProps = async (
  ctx: DocumentContext,
): Promise<InitialProps> => {
  // server intl is not available in App, only in this file (because we don't want to sent messages over and over again)
  const serverIntl = await getServerIntl(ctx);
  setIntl(serverIntl); // for ssr
  setProjectForSSR(ctx.req);

  const initialProps = await documentGetInitialProps(ctx);

  return {
    ...initialProps,
    serverIntl,
    urlForLangLinks: getUrlForLangLinks(ctx),
  };
};
