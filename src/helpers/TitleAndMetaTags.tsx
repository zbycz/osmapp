import React from 'react';
import Head from 'next/head';
import { getUtfStrikethrough } from '../utils';
import { Feature } from '../services/types';
import { useFeatureContext } from '../components/utils/FeatureContext';
import { getFullOsmappLink } from '../services/helpers';
import { getLabel } from './featureLabel';

export const OpenGraphTags = ({
  title = 'OsmAPP',
  url = 'https://osmapp.org',
  image = 'https://osmapp.org/screens/karlstejn2.png',
}) => (
  <>
    <meta property="og:type" content="website" />
    <meta property="og:url" content={url} />
    <meta property="og:title" content={title} />
    <meta property="og:description" content="A universal OpenStreetMap app" />
    <meta property="og:image" content={image} />
    <meta property="twitter:card" content="summary_large_image" />
    <meta property="description" content="An open source project which offers a free open world maps from the OpenStreetMap database. Vector maps, search, poi details, photos, editing and more." />
  </>
);

const getTitle = (feature: Feature) => {
  const label = getLabel(feature);
  return feature.error === 'deleted' ? getUtfStrikethrough(label) : label;
};

export const TitleAndMetaTags = () => {
  const { feature } = useFeatureContext();
  if (!feature) {
    return (
      <Head>
        <title>OsmAPP – browse OpenStreetMap online</title>
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
