import React from 'react';
import Head from 'next/head';
import { getUtfStrikethrough } from '../utils';
import { Feature } from '../services/types';
import { useFeatureContext } from '../components/utils/FeatureContext';
import { getFullOsmappLink } from '../services/helpers';
import { getLabel } from './featureLabel';
import {
  PROJECT_DECRIPTION,
  PROJECT_NAME,
  PROJECT_OG_IMAGE,
  PROJECT_SERP_DESCRIPTION,
  PROJECT_URL,
} from '../services/project';
import { t } from '../services/intl';

const OpenGraphTags = ({ title, url, image }) => (
  <>
    <meta property="og:type" content="website" />
    <meta property="og:url" content={url} />
    <meta property="og:title" content={title} />
    <meta property="og:image" content={image} />
    <meta property="twitter:card" content="summary_large_image" />
    <meta property="og:description" content={t(PROJECT_DECRIPTION)} />
    <meta property="description" content={t(PROJECT_SERP_DESCRIPTION)} />
  </>
);

const getTitleLabel = (feature: Feature) => {
  const label = getLabel(feature);
  return feature.deleted ? getUtfStrikethrough(label) : label;
};

export const TitleAndMetaTags = () => {
  const { feature } = useFeatureContext();

  if (!feature) {
    return (
      <Head>
        <title>{PROJECT_NAME}</title>
        <OpenGraphTags
          title={PROJECT_NAME}
          url={PROJECT_URL}
          image={PROJECT_OG_IMAGE}
        />
      </Head>
    );
  }

  const osmappLink = getFullOsmappLink(feature);
  const titleLabel = getTitleLabel(feature);
  const title = `${titleLabel} · ${PROJECT_NAME}`;

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
