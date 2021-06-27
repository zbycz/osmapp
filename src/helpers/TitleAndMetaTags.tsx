import React from 'react';
import Head from 'next/head';
import { getNameOrFallback, getUtfStrikethrough } from '../utils';
import { Feature } from '../services/types';
import { useFeatureContext } from '../components/utils/FeatureContext';
import { getFullOsmappLink } from '../services/helpers';

export const OpenGraphTags = ({
  title = 'OsmAPP',
  url = 'https://osmapp.org',
  image = 'https://osmapp.org/_next/image?url=%2Fosmapp-screenshot.png&w=256&q=75',
}) => (
  <>
    <meta property="og:type" content="website" />
    <meta property="og:url" content={url} />
    <meta property="og:title" content={title} />
    <meta property="og:description" content="A universal OpenStreetMap app" />
    <meta property="og:image" content={image} />
  </>
);

const getTitle = (feature: Feature) => {
  const deleted = feature.error === 'deleted';
  const nameOrFallback = getNameOrFallback(feature);
  return deleted ? getUtfStrikethrough(nameOrFallback) : nameOrFallback;
};

export const TitleAndMetaTags = () => {
  const { feature } = useFeatureContext();
  if (!feature) {
    return (
      <Head>
        <title>OsmAPP</title>
        <OpenGraphTags />
      </Head>
    );
  }

  const osmappLink = getFullOsmappLink(feature);
  const title = `${getTitle(feature)} · OsmAPP`;
  return (
    <Head>
      <title>{title}</title>
      <OpenGraphTags
        title={title}
        url={osmappLink}
        image={feature.ssrFeatureImage?.thumb}
      />
    </Head>
  );
};
